"use client"

import Image from "next/image"
import Link from "next/link"
import Logo from "@/components/logo"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Info, ShieldCheck } from "lucide-react"

export default function SiteFooter() {
  const LICENSE_NUMBER = "10125018000307"
  const ISSUED_ON = "11-09-2025"
  const VALID_UPTO = "10-09-2028"
  const PLACE = "East Godavari Dist (Rajahmundry)"
  const KIND_OF_BUSINESS = "Food Services - Food Vending Establishment"
  const CATEGORY = "State License"

  const REGISTERED_OFFICE = `ZION FOODS
3-1301, D.S.R NAGAR, HUKUMPETA,
RAJAHMUNDRY, East Godavari Dist (Rajahmundry),
Andhra Pradesh - 533107`

  const AUTHORIZED_PREMISES = `3-1301, D.S.R NAGAR, HUKUMPETA,
RAJAHMUNDRY, Rajahmundry Rural, East Godavari Dist (Rajahmundry),
Andhra Pradesh - 533107`

  const PERSON_IN_CHARGE = {
    name: "KALA CRYSOLITE NALLI",
    qualification: "GRADUATE",
    mobile: "8328260091",
    email: "crysolitekala@gmail.com",
    address: "3-1301 DSR NAGAR HUKUMPETA, RAJAMANDRY RURAL, EAST GODAVARI, Andhra Pradesh, 533107",
    idType: "Aadhar Card",
    idNo: "452891021914",
  }

  const PRODUCT_CATEGORIES = [
    "104 - Fruits and vegetables, seaweeds, and nuts and seeds",
    "206 - Cereals and cereal products; roots/tubers, pulses, legumes and palm pith (excl. bakery 7.0)",
    "312 - Salts, spices, soups, sauces, salads and protein products",
    "416 - Prepared Foods",
    "518 - Indian Sweets and Indian Snacks & Savouries products",
  ]

  return (
    <footer className="bg-orange-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Brand and contact */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <Logo white />
              <h2 className="text-2xl font-bold">ZION FOODS</h2>
            </div>
            <p className="text-orange-100/90">
              Authentic homemade pickles and vadiyalu crafted with care in Andhra Pradesh.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                FSSAI Licensed
              </Badge>
              <Badge className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                License No: {LICENSE_NUMBER}
              </Badge>
            </div>

            <div className="mt-6 text-sm text-orange-100/90 space-y-1">
              <p className="font-semibold">Contact</p>
              <p>WhatsApp: +91 83282 60091</p>
              <p>Email: {PERSON_IN_CHARGE.email}</p>
            </div>
          </div>

          {/* License summary */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-semibold mb-3">FSSAI License Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-orange-100/80 min-w-[120px]">License No:</span>
                <span className="font-semibold">{LICENSE_NUMBER}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-100/80 min-w-[120px]">Kind of Business:</span>
                <span>{KIND_OF_BUSINESS}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-100/80 min-w-[120px]">Category:</span>
                <span>{CATEGORY}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-100/80 min-w-[120px]">Issued On:</span>
                <span>{ISSUED_ON} (New License)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-100/80 min-w-[120px]">Valid Upto:</span>
                <span>{VALID_UPTO}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-100/80 min-w-[120px]">Place:</span>
                <span>{PLACE}</span>
              </div>
              <div className="pt-2">
                <Link
                  href="https://foscos.fssai.gov.in"
                  target="_blank"
                  className="text-orange-200 underline underline-offset-4 hover:text-white"
                >
                  Verify on FoSCoS portal
                </Link>
              </div>
            </div>
          </div>

          {/* Barcode / QR */}
          {/* <div className="lg:col-span-4">
            <h3 className="text-lg font-semibold mb-3">Scan / Verify</h3>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="bg-white rounded-md p-3 text-center">
                <Image
                  src="/images/fssai-barcode.jpg"
                  alt={`FSSAI License Barcode: ${LICENSE_NUMBER}`}
                  width={300}
                  height={120}
                  className="mx-auto h-auto w-full object-contain"
                />
                <p className="mt-2 text-xs text-gray-700">Barcode: {LICENSE_NUMBER}</p>
              </div>
              <div className="bg-white rounded-md p-3 text-center">
                <Image
                  src="/images/fssai-qr.jpg"
                  alt="QR code to verify on FoSCoS"
                  width={180}
                  height={180}
                  className="mx-auto h-auto w-full object-contain"
                />
                <p className="mt-2 text-xs text-gray-700">Scan to verify</p>
              </div>
            </div>

            <div className="mt-3 text-xs text-orange-100/80">
              To download the Food Safety Connect App, visit FoSCoS or your app store.
            </div>
          </div> */}
        </div>

        {/* Essential details from the document */}
        <div className="mt-10">
          <Accordion type="multiple" className="bg-orange-900/40 rounded-lg border border-orange-700/50">
            <AccordionItem value="registered-office" className="px-4">
              <AccordionTrigger className="text-white">Registered Office Address</AccordionTrigger>
              <AccordionContent className="text-orange-100 whitespace-pre-line">{REGISTERED_OFFICE}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="authorized-premises" className="px-4">
              <AccordionTrigger className="text-white">Authorized Premises</AccordionTrigger>
              <AccordionContent className="text-orange-100 whitespace-pre-line">{AUTHORIZED_PREMISES}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="person-in-charge" className="px-4">
              <AccordionTrigger className="text-white">Person in Charge / Responsible</AccordionTrigger>
              <AccordionContent className="text-orange-100">
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{PERSON_IN_CHARGE.name}</p>
                  <p>Qualification: {PERSON_IN_CHARGE.qualification}</p>
                  <p>Mobile: +91 {PERSON_IN_CHARGE.mobile}</p>
                  <p>Email: {PERSON_IN_CHARGE.email}</p>
                  <p>
                    Photo ID: {PERSON_IN_CHARGE.idType} ({PERSON_IN_CHARGE.idNo})
                  </p>
                  <p>Address: {PERSON_IN_CHARGE.address}</p>
                  <p className="mt-2 text-xs text-orange-200/80">
                    Note: Any change in above details shall be immediately communicated to authorities via FoSCoS.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="product-categories" className="px-4">
              <AccordionTrigger className="text-white">Approved Food Product Categories</AccordionTrigger>
              <AccordionContent className="text-orange-100">
                <ul className="list-disc pl-5 space-y-1">
                  {PRODUCT_CATEGORIES.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="notes" className="px-4">
              <AccordionTrigger className="text-white">Important Notes</AccordionTrigger>
              <AccordionContent className="text-orange-100 text-sm">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 text-orange-300 flex-shrink-0" />
                  <div className="space-y-1">
                    <p>
                      This license is granted under FSS Act, 2006 and is subject to compliance with its provisions and
                      conditions of license.
                    </p>
                    <p>Renewal can be filed up to 180 days before expiry. Instant renewal is permitted by FSSAI.</p>
                    <p>This is a computer-generated license; no physical signature/stamp required.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-orange-700/50 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-orange-100/80">© {new Date().getFullYear()} ZION FOODS. All rights reserved.</p>
          <p className="text-xs text-orange-200/80">
            FSSAI License: {LICENSE_NUMBER} • Issued: {ISSUED_ON} • Valid Upto: {VALID_UPTO}
          </p>
        </div>
      </div>
    </footer>
  )
}
