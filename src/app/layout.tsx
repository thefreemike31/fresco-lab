import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fresco Lab",
  description:
    "Interactive explorations of Jacque Fresco, AI and a Resource-Based Economy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 text-[13px]">
        {children}
      </body>
    </html>
  );
}
