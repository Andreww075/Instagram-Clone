import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import SessionWrapper from "@/components/session-wrapper";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Instagram-Clone",
  description: "Instagram clone coded with our little hands. (Nextjs and TailwindCss)",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </html>
    </SessionWrapper>
  );
}
