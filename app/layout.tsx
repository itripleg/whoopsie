import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationHeader from "@/components/NavigationHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Whoopsie",
  description: "Post all your mistakes for everyone to see.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>😅</text></svg>"
        />
        <script
          defer
          src="https://analytics.us.umami.is/script.js"
          data-website-id="8033d56b-e645-44f3-a344-007cbc3dba03"
        ></script>
      </head>
      <body className={inter.className}>
        <div className="flex w-full">
          <NavigationHeader />
        </div>
        <div className="bg-blue-500 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
