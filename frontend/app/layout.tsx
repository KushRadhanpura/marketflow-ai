import type { Metadata } from 'next';

import './globals.css';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'MarketFlow AI',
  description: 'Agentic marketing-ops assistant for SMB campaign planning, analytics, and optimization.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
