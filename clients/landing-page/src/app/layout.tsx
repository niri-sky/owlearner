import type { Metadata } from "next";

// custom files import
import "@/shared/styles/globals.css";
import "@/shared/styles/custom.css";
import Navbar from "@/shared/widgets/navbar";
import Footer from "@/shared/widgets/footer";
import NextUIProviders from "./nextui-providers";
import MobileNavbar from "@/shared/widgets/navbar/elements/mobile-nav";
import { Providers } from "./providers";

// metadata instances
export const metadata: Metadata = {
  title: "Owl Learner",
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
      <body className="font-dmsans bg-bgColor overflow-x-hidden min-h-screen">
        <Providers>
          <NextUIProviders>
            <Navbar />

            <MobileNavbar />

            <main>{children}</main>
            <Footer />
          </NextUIProviders>
        </Providers>
      </body>
    </html>
  );
}
