'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-yellow-400/30 border-t-yellow-400 animate-spin mx-auto mb-4"></div>
        <p className="text-yellow-400 font-semibold">Loading calculator...</p>
      </div>
    </div>
  );
}

// Dynamic import with SSR disabled to avoid useTheme context issues
const CalculatorPage = dynamic(() => import('./Calculator'), {
  ssr: false,
  loading: LoadingFallback,
});

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CalculatorPage />
    </Suspense>
  );
}
