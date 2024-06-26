import "@/styles/global.css";
import type { Metadata } from 'next'
import { inter } from "@/styles/fonts";
import Header from "@/components/header";
import Footer from "@/components/footer";


export const metadata: Metadata = {
  applicationName: 'Simurgh Airlines',
  title: { default: 'Simurgh Airlines', template: '%s - Simurgh Airlines' },
  description: 'Flight tickets management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
