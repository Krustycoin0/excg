
import { MetaMaskProvider } from '@/context/MetaMaskContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MetaMaskProvider>
      <body>{children}</body>
    </MetaMaskProvider>
  );
}