
"use client";
import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;
window.Buffer = window.Buffer || Buffer;
import { useEffect } from "react";
import { MetaMaskProvider } from "@/context/MetaMaskContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inizializza il provider MetaMask
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("chainChanged", () => window.location.reload());
      window.ethereum.on("accountsChanged", () => window.location.reload());
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <MetaMaskProvider>
          {children}
        </MetaMaskProvider>
      </body>
    </html>
  );
}