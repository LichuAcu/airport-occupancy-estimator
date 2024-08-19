import "./globals.css";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Airport Occupancy Estimator",
  description: "Estimate airport occupancy levels",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto p-4 pb-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
