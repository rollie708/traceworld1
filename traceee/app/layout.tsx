import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "TraceWorld — Smart Contract Intelligence",
  description: "Decode. Trace. Understand. Inspect verified Ethereum smart contracts with evidence-led analysis.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="site-shell">
      <Header />
      {children}
    </div>
  );
}
