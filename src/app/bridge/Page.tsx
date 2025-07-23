// File: src/app/bridge/page.tsx
'use client';

import LiFiWidget from '@/components/LiFiWidget';
import { Providers } from '@/app/providers';
import Header from '@/components/Header';

export default function BridgePage() {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cross-Chain Swap
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Scambia asset tra Solana, Ethereum, Optimism e 20+ altre blockchain
              con la migliore liquidità e i costi più bassi
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
            <LiFiWidget />
          </div>
          
          <div className="mt-12 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Come funziona</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-5 rounded-lg">
                <div className="text-blue-600 text-2xl font-bold mb-2">1</div>
                <h3 className="font-medium mb-2">Seleziona Asset</h3>
                <p className="text-gray-600 text-sm">
                  Scegli i token che vuoi scambiare e la quantità
                </p>
              </div>
              <div className="bg-green-50 p-5 rounded-lg">
                <div className="text-green-600 text-2xl font-bold mb-2">2</div>
                <h3 className="font-medium mb-2">Conferma Swap</h3>
                <p className="text-gray-600 text-sm">
                  Esamina i dettagli della transazione e conferma
                </p>
              </div>
              <div className="bg-purple-50 p-5 rounded-lg">
                <div className="text-purple-600 text-2xl font-bold mb-2">3</div>
                <h3 className="font-medium mb-2">Ricevi Fondi</h3>
                <p className="text-gray-600 text-sm">
                  I tuoi asset appariranno nel wallet di destinazione
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>© 2023 Excg. Tutti i diritti riservati.</p>
          </div>
        </footer>
      </div>
    </Providers>
  );
}