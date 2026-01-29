import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import AnimatedBackground from "@/components/animated-background"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ZION FOODS - Authentic Pickles & Vadiyalu",
  description:
    "Experience the rich, tangy taste of traditional pickles and the crispy delight of homemade vadiyalu from ZION FOODS.",
    icons: {
      icon: "/latestLogo.jpeg",
      shortcut: "/latestLogo.jpeg",
      apple: "/latestLogo.jpeg",
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
          <AnimatedBackground />
          <div className="relative z-10">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
