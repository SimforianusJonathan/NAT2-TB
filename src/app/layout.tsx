import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import AppShell from "../components/AppShell";

export const metadata: Metadata = {
  title: { default: "NAT2-TB · Precision Monitor", template: "%s · NAT2-TB" },
  description:
    "A local research prototype for pharmacogenomics-guided, risk-adaptive TB monitoring. Synthetic data. Not for clinical use.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
