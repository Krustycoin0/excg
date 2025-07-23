// File: src/app/bridge/page.tsx
'use client';

import LiFiWidget from '@/components/LiFiWidget';
import { Providers } from '@/app/providers';

export default function BridgePage() {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 py-12">
        <LiFiWidget />
      </div>
    </Providers>
  );
}