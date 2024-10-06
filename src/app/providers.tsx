'use client';
import { PopupProvider } from './context/popup-context';

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PopupProvider>{children}</PopupProvider>;
}
