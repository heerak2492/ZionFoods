"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Briefs from "./BriefsList";
import ChatAssistant from "./ChatAssistant";
import type { Brief, BriefContent } from "@/types";
import GenericMarkdownRenderer, {
  ContentBlock,
} from "./markdownApporach/GenericMarkdownRenderer";
import axios from "axios";
import Loader1 from "../molecules/Loader";
import ErrorDisplay1 from "../molecules/ErrorDisplay";
import NoData1 from "../molecules/NoData";
import CenteredWrapper from "../molecules/CenteredWrapper";
import OverlayLoader from "../molecules/OverlayLoader";
import FloatingActionBar from "../molecules/FloatingActionBar";
import { Zap } from "lucide-react";
import { CALL_CENTER_ASSISTANT, MFE_URLS } from "@/lib/constants";
import ResizablePanels from "../molecules/ResizablePanels";
import OverlayNodata from "../molecules/OverlayNoData";
// import { io, Socket } from "socket.io-client"; // Leave for prod

// DEMO MOCK FUNCTION
export const triggerMockBriefSummaryUpdate = (
  briefId: string,
  callback: (payload: any) => void
) => {
  setTimeout(() => {
    callback({
      briefId,
      title: "Action Summary",
      newSummary: `### Action: Node Processing Time Updated

Node processing time for Brief **${briefId}** successfully reduced by 1 hour.  
- Change applied at: ${new Date().toLocaleString()}

_This is a mock WSS update!_`,
    });
  }, 800);
};

export default function Dashboard() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  const [briefContent, setBriefContent] = useState<BriefContent | null>(null);
  const [shortAndLongContent, setShortAndLongContent] = useState<{
    longContents: ContentBlock[];
  } | null>(null);
  const [briefsLoading, setBriefsLoading] = useState(true);
  const [briefsError, setBriefsError] = useState("");
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState("");
  const [chatContent, setChatContent] = useState("");

  // ---- MOCK: Handle brief summary updates (mimic WSS)
  const handleMockSummaryUpdate = useCallback(
    (payload: any) => {
      setShortAndLongContent((prev) => {
        const newBlock: ContentBlock = {
          tag: "action_summary",
          title: payload.title || "Action Summary",
          content: payload.newSummary,
        };
        return {
          longContents: [...(prev?.longContents || []), newBlock],
        };
      });
    },
    []
  );

  // Listen for the window event (acts as local WSS)
  useEffect(() => {
    const handler = (event: any) => {
      if (
        event.detail &&
        event.detail.type === "BRIEF_SUMMARY_MOCK_UPDATE" &&
        event.detail.payload?.briefId === selectedBrief?.id
      ) {
        handleMockSummaryUpdate(event.detail.payload);
      }
    };
    window.addEventListener("mock-wss-update", handler);
    return () => window.removeEventListener("mock-wss-update", handler);
  }, [selectedBrief?.id, handleMockSummaryUpdate]);

  // --- PRODUCTION: Uncomment to use real WSS when ready
  // const socketRef = useRef<Socket | null>(null);
  // useEffect(() => {
  //   if (!socketRef.current) {
  //     socketRef.current = io("http://localhost:4000"); // Your backend WSS endpoint
  //   }
  //   return () => {
  //     socketRef.current?.disconnect();
  //     socketRef.current = null;
  //   };
  // }, []);
  // useEffect(() => {
  //   if (!selectedBrief?.id || !socketRef.current) return;
  //   const handleSummaryUpdate = (payload: any) => {
  //     if (payload.briefId === selectedBrief.id) {
  //       setShortAndLongContent((prev) => {
  //         const newBlock: ContentBlock = {
  //           tag: "action_summary",
  //           title: payload.title || "Action Summary",
  //           content: payload.newSummary,
  //         };
  //         return {
  //           longContents: [...(prev?.longContents || []), newBlock],
  //         };
  //       });
  //     }
  //   };
  //   socketRef.current.on("briefSummaryUpdate", handleSummaryUpdate);
  //   return () => {
  //     socketRef.current?.off("briefSummaryUpdate", handleSummaryUpdate);
  //   };
  // }, [selectedBrief?.id]);

  useEffect(() => {
    const fetchBriefs = async () => {
      setBriefsLoading(true);
      setBriefsError("");
      try {
        const response = await axios.get(
          "https://eanl-azure-genai-assistant-app.azurewebsites.net/briefs/?ui_version=v2"
        );
        setBriefs(response.data);
      } catch (err: any) {
        setBriefsError(err.message || "Failed to fetch briefs");
      } finally {
        setBriefsLoading(false);
      }
    };

    fetchBriefs();
  }, []);

  useEffect(() => {
    if (briefs.length > 0 && !selectedBrief) {
      setSelectedBrief(briefs[0]);
    }

    const fetchBriefContent = async () => {
      setContentLoading(true);
      setContentError("");
      if (selectedBrief?.id) {
        try {
          const response = await axios.get(
            `https://eanl-azure-genai-assistant-app.azurewebsites.net/briefs/${selectedBrief?.id}`
          );
          setBriefContent(response.data);
          setShortAndLongContent({
            longContents: response.data.brief_content.longContents,
          });
        } catch (err: any) {
          setContentError(err.message || "Failed to fetch brief content");
        } finally {
          setContentLoading(false);
        }
      }
    };

    if (!briefsLoading && briefs.length && selectedBrief?.id) {
      fetchBriefContent();
      const storedConversationId = localStorage.getItem(
        `conversationId_${selectedBrief?.id}`
      );
      const actionContent = localStorage.getItem(storedConversationId || "");
      setChatContent(actionContent || "");
    }
  }, [briefs, selectedBrief]);

  const handleBriefClick = (brief: Brief) => {
    setSelectedBrief(brief);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      <>
        <OverlayLoader show={briefsLoading} />
        <OverlayNodata
          show={(Boolean(briefsError) || briefs.length === 0) && !briefsLoading}
        />
        {briefsError ? (
          <CenteredWrapper>
            <ErrorDisplay1 message={briefsError} />
          </CenteredWrapper>
        ) : briefs.length === 0 && !briefsLoading ? (
          <CenteredWrapper>
            <NoData1 label="briefs" />
          </CenteredWrapper>
        ) : (
          <div className="basis-full md:basis-1/3 min-w-0 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            <Briefs
              briefs={briefs}
              selectedBrief={selectedBrief}
              onBriefClick={handleBriefClick}
            />
          </div>
        )}

        {
          contentLoading ? (
            <CenteredWrapper>
              <Loader1 />
            </CenteredWrapper>
          ) : (
            <div className="basis-full md:basis-1/2 min-w-0 p-4 flex-1 overflow-y-auto overflow-x-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
              <GenericMarkdownRenderer
                briefShortTitle={selectedBrief?.brief_short_title || ""}
                longContents={shortAndLongContent?.longContents || []}
                chatContent={chatContent}
                briefId={selectedBrief?.id}
              />
            </div>
          )
        }

        <div className="basis-full md:basis-1/3 min-w-0 p-4 overflow-y-hidden mb-4 space-y-4 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
          <ChatAssistant
            brief={selectedBrief}
            instruction={briefContent?.assistant_instruction || ""}
            setChatContent={setChatContent}
            triggerMockSummaryUpdate={triggerMockBriefSummaryUpdate}
          />
        </div>
        <button
          className="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full bg-inherit backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          aria-label="Action"
          onClick={() => {
            window.location.href = MFE_URLS[CALL_CENTER_ASSISTANT];
          }}
        >
          <Zap />
        </button>
      </>
    </div>
  );
}
