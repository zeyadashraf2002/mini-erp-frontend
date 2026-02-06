import { Inter } from "next/font/google";
import "./globals.css";
import "../lib/suppress-extension-errors";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mini ERP System",
  description: "Professional Multi-tenant ERP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
