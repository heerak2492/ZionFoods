"use client";

import React, { useCallback } from "react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ChevronLeft, RefreshCcw } from "lucide-react";
import { Brief } from "@/types";
import Loader1 from "../molecules/Loader";
import NoData1 from "../molecules/NoData";
import MarkdownRendererChatAssistant from "./markdownApporach/MarkdownRendererChatAssistant";
import { Typography } from "@mui/material";
import TIcon from "../atoms/TIcon";
import { useBriefAssistant } from "../context/BreifAssistantContext";
import { separateMarkdownContent } from "../../lib/utility";
import ToolTipProvider from "../molecules/ToolTipProvider";

// New prop for mock/demo WSS
interface ChatAssistantProps {
  brief: Brief | null;
  instruction: string;
  setChatContent: (value: string) => void;
  triggerMockSummaryUpdate?: (briefId: string, callback: (payload: any) => void) => void;
}

const ChatAssistant = ({
  brief,
  instruction,
  setChatContent,
  triggerMockSummaryUpdate,
}: ChatAssistantProps) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [conversationID, setConversationID] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const {
    setBriefAssistantId,
    setInstruction,
    setConversationId,
    resetContext,
  } = useBriefAssistant();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (brief && messages.length > 0) {
      localStorage.setItem(`chatHistory_${brief.id}`, JSON.stringify(messages));
    }
  }, [messages, brief]);

  useEffect(() => {
    if (brief && conversationID) {
      localStorage.setItem(`conversationId_${brief.id}`, conversationID);
    }
  }, [conversationID, brief]);

  useEffect(() => {
    if (!brief?.id) return;
    const storedChat = localStorage.getItem(`chatHistory_${brief.id}`);
    const storedConversationId = localStorage.getItem(
      `conversationId_${brief.id}`
    );
    if (storedChat) {
      setMessages(JSON.parse(storedChat));
    } else {
      setMessages([
        {
          role: "assistant",
          content:
            "Welcome! Ask me anything about the brief and I'll provide insights.",
        },
      ]);
    }

    if (storedConversationId) {
      setConversationID(storedConversationId);
    } else {
      setConversationID("");
    }

    setPrompt("");
    setError("");
    resetContext();
  }, [brief]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    let timeout = undefined;
    if (messages.length > 1) {
      timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
    return () => clearTimeout(timeout);
  }, [messages, loading]);

  // PATCH: handleSubmit detects "apply changes"/related prompt and triggers mock event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !brief) return;

    const lowerPrompt = prompt.trim().toLowerCase();
    const isApplyChanges =
      ["apply changes", "go ahead", "ok", "yes proceed", "yes, proceed"].some(
        (kw) => lowerPrompt.includes(kw)
      );

    if (isApplyChanges && brief.id) {
      setMessages((msgs) => [
        ...msgs,
        { role: "system", content: "Applying changes..." },
      ]);
      setLoading(true);

      setTimeout(() => {
        // Fire a window event (simulates WSS update)
        window.dispatchEvent(
          new CustomEvent("mock-wss-update", {
            detail: {
              type: "BRIEF_SUMMARY_MOCK_UPDATE",
              payload: {
                briefId: brief.id,
                title: "Action Summary",
                newSummary: `### Action: Node Processing Time Updated

Node processing time for Brief **${brief.id}** successfully reduced by 1 hour.  
- Change applied at: ${new Date().toLocaleString()}

_This is a mock WSS update!_`,
              },
            },
          })
        );
        // Show assistant message in chat
        setMessages((msgs) => [
          ...msgs,
          {
            role: "assistant",
            content:
              "Node processing time successfully reduced by 1 hour. Please check the Action Summary below.",
          },
        ]);
        setLoading(false);
        setPrompt("");
      }, 800);

      return;
    }

    // ---- Original API POST for other prompts (unchanged) ----
    setConversationId(conversationID);
    setBriefAssistantId(brief?.assistant_id);
    setInstruction(instruction);

    const userMessage = { role: "user", content: prompt };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);
    setError("");

    const requestBody = {
      contexts: [
        {
          context: {
            asstId: brief?.assistant_id || "",
            briefContent: instruction,
            originator: "plt-brief",
          },
          source: "brief",
        },
      ],
      conversation_id: conversationID || "",
      question: prompt,
      stream: false,
    };

    try {
      const response = await axios.post(
        "https://eanl-azure-genai-assistant-app.azurewebsites.net/agent/callback",
        requestBody
      );
      const assistantAnswers = response.data.answers;
      const newConversationId = response.data.conversation_id;

      if (!conversationID || conversationID !== newConversationId) {
        setConversationID(newConversationId);
      }

      const assistantMessages = assistantAnswers.map((answer: any) => ({
        role: "assistant",
        content: answer.content,
      }));

      setMessages([...updatedMessages, ...assistantMessages]);
    } catch (err: any) {
      setError("Something went wrong while fetching insights.");
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong while fetching insights.",
        },
      ]);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const handleApplyChanges = async () => {
    // You can keep this as is, or just call handleSubmit with a mock prompt.
  };

  const renderMessages = useCallback(
    (messagesParam: string) => (
      <MarkdownRendererChatAssistant
        content={messagesParam}
        handleApplyChanges={handleApplyChanges}
      />
    ),
    [messages]
  );

  return (
    <div
      className={`transition-all duration-500 ease-in-out bg-black ${
        expanded
          ? "fixed inset-0 z-50 p-6 flex justify-center items-center"
          : "relative h-full"
      }`}
    >
      <div
        className={`flex flex-col w-full ${
          expanded
            ? "max-w-4xl h-[90vh] bg-gray-950 rounded-2xl p-6 shadow-lg"
            : "h-full"
        }`}
      >
        {brief && (
          <div className="flex items-center justify-between mb-4">
            <Typography
              gutterBottom
              style={{
                fontWeight: 600,
                fontSize: "23px",
                marginBottom: "22px",
              }}
            >
              Chat Assistant
            </Typography>
            <div className="flex items-center gap-2 mb-5">
              <ToolTipProvider
                children={
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setExpanded((prev) => !prev)}
                    className={`transition-transform duration-300 ${
                      expanded ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                }
                name={expanded ? "collapse" : "expand"}
              />
              <ToolTipProvider
                children={
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    <RefreshCcw className="h-5 w-5" />
                  </Button>
                }
                name="refresh the assistant"
              />
            </div>
          </div>
        )}

        <div
          className={`overflow-y-auto overflow-x-auto mb-4 space-y-4 scrollbar-thin transition-all duration-500 ease-in-out ${
            expanded ? "flex-1 max-h-[65vh]" : ""
          }`}
        >
          {!brief ? (
            <div className="w-full p-4 flex items-center justify-center h-full">
              <NoData1 label="chat assistant" />
            </div>
          ) : (
            messages.map((message, index) => {
              const isAssistant = message.role === "assistant";
              const isLastUserMessage =
                !isAssistant && index === messages.length - 1 && loading;

              return (
                <div key={index} className="space-y-2">
                  <div
                    className={`w-full flex flex-col items-${
                      isAssistant ? "start" : "end"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isAssistant ? (
                        <TIcon />
                      ) : (
                        <div className="w-5 h-5 rounded-full overflow-hidden">
                          <img
                            src={
                              "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
                            }
                            alt={isAssistant ? "Assistant Icon" : "User Icon"}
                            className="w-full h-full object-cover bg-white dark:bg-gray-800 p-1"
                          />
                        </div>
                      )}
                      <span className="text-xs text-gray-300">
                        {isAssistant ? "OMS Fulfillment Agent" : "You"}
                      </span>
                    </div>

                    <div
                      className={`relative rounded-2xl p-4 shadow-md border transition-all duration-500 ease-in-out ${
                        expanded ? "max-w-[95%]" : "w-full max-w-[80%]"
                      } ${
                        isAssistant
                          ? "bg-gray-800 text-white border-gray-700 self-start overflow-y-auto overflow-x-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent hover:scrollbar-thumb-gray-500"
                          : "bg-gray-700 text-white border-gray-600 self-end overflow-y-auto overflow-x-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent hover:scrollbar-thumb-gray-500"
                      }`}
                    >
                      {renderMessages(message.content)}
                    </div>
                  </div>

                  {isLastUserMessage && (
                    <div className="flex justify-start ml-16">
                      <div className="bg-white/10 rounded-xl p-2">
                        <Loader1 />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {brief && (
          <form onSubmit={handleSubmit} className="mt-auto space-y-3">
            <p className="text-xs text-gray-400 px-1">
              Responses may be inaccurate or incomplete. Users should verify the
              accuracy of the generated content.
            </p>

            {error && (
              <div className="text-sm text-red-400 bg-red-900/40 border border-red-600 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Input
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask your query here..."
                className="flex-1 bg-gray-800 border-gray-700"
                disabled={loading}
              />

              <ToolTipProvider
                children={
                  <Button
                    type="submit"
                    variant="outline"
                    size="icon"
                    disabled={loading}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                }
                name="send"
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatAssistant;
