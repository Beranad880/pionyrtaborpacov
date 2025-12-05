'use client';

import { useEffect, useState } from 'react';

export default function DatabaseInitializer() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStatus, setInitStatus] = useState<string>('');

  const initializeDatabase = async () => {
    try {
      setIsInitializing(true);
      setInitStatus('Kontroluji databázi...');

      // Nejdříve zkontrolujeme stav
      const checkResponse = await fetch('/api/admin/init');
      const checkResult = await checkResponse.json();

      if (checkResult.success && !checkResult.data.isInitialized) {
        setInitStatus('Inicializuji databázi...');

        // Spustíme inicializaci
        const initResponse = await fetch('/api/admin/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'init' }),
        });

        const initResult = await initResponse.json();

        if (initResult.success) {
          setInitStatus('Databáze úspěšně inicializována!');
          console.log('✅ Database initialized successfully');
        } else {
          console.warn('Database initialization failed, but app will continue');
        }
      } else if (checkResult.success) {
        console.log('Database already initialized');
      } else {
        console.log('Database not available, using static content');
      }

      // Po 3 sekundách skryjeme status
      setTimeout(() => {
        setIsInitializing(false);
        setInitStatus('');
      }, 3000);

    } catch (error) {
      console.log('Database initialization skipped (probably not available)');
      setIsInitializing(false);
      setInitStatus('');
    }
  };

  useEffect(() => {
    initializeDatabase();
  }, []);

  // Neblokující inicializace - vrátíme null, aby se stránka mohla načíst
  if (!isInitializing || !initStatus) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg shadow-md">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm">{initStatus}</span>
      </div>
    </div>
  );
}