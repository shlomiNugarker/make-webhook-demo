import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shlomi & Maor | Web Development & Automation Services",
  description: "Expert web development and automation services. We build modern websites, seamless integrations, and full-stack solutions tailored to your business needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Script id="virtualspirits-chat" strategy="lazyOnload">
          {`
            var vsid = "si27736c382cb0a";
            (function() {
              var vsjs = document.createElement('script');
              vsjs.type = 'text/javascript';
              vsjs.async = true;
              vsjs.setAttribute('defer', 'defer');
              vsjs.src = 'https://www.virtualspirits.com/vsa/chat.js';
              var s = document.getElementsByTagName('script')[0];
              s.parentNode.insertBefore(vsjs, s);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
