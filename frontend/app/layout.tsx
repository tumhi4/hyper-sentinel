import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HyperSentinel — Autonomous Perp DEX Risk Oracle',
  description: "Don't copy PnL. Copy risk-adjusted strategy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070b12] text-slate-100 min-h-screen antialiased font-mono">
        {children}
      </body>
    </html>
  );
}
