import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/shared/styles/globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Owl Learner - Admin",
  description:
    "Owl Learner is a multi vendor Learning management system platform built for students and creators to growth their carrer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers>
          <main className="max-w-[3000px]  mx-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
