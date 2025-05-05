import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ZION FOODS - Authentic Pickles & Vadiyalu",
  description:
    "Experience the rich, tangy taste of traditional pickles and the crispy delight of homemade vadiyalu from ZION FOODS.",
    icons: {
      icon: "/zionFoodLogo.jpg",
      shortcut: "/zionFoodLogo.jpg",
      apple: "/zionFoodLogo.jpg",
    },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
