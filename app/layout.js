import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import "../lib/suppress-extension-errors";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mini ERP System",
  description: "Professional Multi-tenant ERP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}
