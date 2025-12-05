'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import DonationForm from '@/components/DonationForm';

export function ClientProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        {mounted && (
          <>
            <ThemeToggle />
            <LanguageToggle />
            <DonationForm />
          </>
        )}
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
