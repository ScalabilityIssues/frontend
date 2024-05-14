import "@/styles/global.css";
import type { Metadata } from 'next'
import { inter } from "@/styles/fonts";


export const metadata: Metadata = {
  title: 'Simurgh Airlines',
  description: 'Flight tickets management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
