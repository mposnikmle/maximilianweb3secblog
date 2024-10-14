import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";


export const metadata: Metadata = {
  title: "Maximilian's Web3 Security Research",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const header = (
    <header className="bg-silver border-b-2 border-black">
      <div className="flex justify-between pb-2">
        <Link href="/">
          <Image
            src="/images/blogLogoblue.png"
            alt="logo"
            width={75}
            height={50}
            className="ml-2 mt-1" />
        </Link>

        <Link href="/about">
          <Image
            src="/images/profile.jpg"
            alt="logo"
            width={75}
            height={50}
            className="mr-2 mt-1 rounded-full object-cover" />
        </Link>
      </div>
    </header>
  )

  const footer = (
    <footer className="fixed bottom-0 left-0 w-full bg-black text-white p-4">
      <div>
        <p className="text-right">Created by Maximilian</p>
      </div>
    </footer>

  )

  return (
    <html lang="en">
      <body>
        {header}
        {children}
        {footer}
      </body>
    </html>
  );
}
