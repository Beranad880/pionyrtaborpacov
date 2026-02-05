'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Import all page components
import UvodPage from './uvod';
import PionyrseOddilyPage from './pionyrske-oddily';
import KalendarAkciPage from './kalendar-akci';
import HajenkabelaPage from './hajenka-bela';
import TaborovePrihlaskyPage from './taborove-prihlasky';
import ClankyPage from './clanky';
import FotkyZAkciPage from './fotky-z-akci';
import MestoPacovPage from './mesto-pacov';

function PagesContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  switch (page) {
    case 'uvod':
      return <UvodPage />;
    case 'pionyrske-oddily':
      return <PionyrseOddilyPage />;
    case 'kalendar-akci':
      return <KalendarAkciPage />;
    case 'hajenka-bela':
    case 'pronajem-hajenky-bela':
      return <HajenkabelaPage />;
    case 'taborove-prihlasky':
      return <TaborovePrihlaskyPage />;
    case 'clanky':
      return <ClankyPage />;
    case 'fotky-z-akci':
      return <FotkyZAkciPage />;
    case 'mestopacov':
      return <MestoPacovPage />;
    default:
      return <UvodPage />;
  }
}

export default function PagesRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PagesContent />
    </Suspense>
  );
}