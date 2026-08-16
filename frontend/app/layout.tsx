import type { Metadata } from 'next';

import './globals.css';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: {
    default: 'MarketFlow AI',
    template: '%s — MarketFlow',
  },
  description: 'Agentic marketing-ops assistant for SMB campaign planning, analytics, and optimization.',
  keywords: ['marketing automation', 'campaign planning', 'analytics', 'content strategy'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-bg text-text antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
