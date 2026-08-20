import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Invoforge - Stellar Payment Dashboard',
  description: 'Modern payment dashboard for Stellar blockchain. Connect your wallet, send XLM payments, and track transactions in real-time.',
  keywords: ['Stellar', 'XLM', 'blockchain', 'payment', 'wallet', 'crypto', 'testnet'],
  authors: [{ name: 'Invoforge' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f0f1a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}