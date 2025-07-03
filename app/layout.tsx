import type { Metadata } from 'next';
import LayoutClient from './layout-client';

export const metadata: Metadata = {
  title: 'Finance Tracker',
  description: 'Track your personal finances',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutClient>{children}</LayoutClient>;
}