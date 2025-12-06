'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Import all page components
import UvodPage from './uvod';
import PionyrseOddilyPage from './pionyrske-oddily';
import KalendarAkciPage from './kalendar-akci';
import HajenkabelaPage from './hajenka-bela';
import PronajemHajenkybePage from './pronajem-hajenky-bela';
import TaborovePrihlaskyPage from './taborove-prihlasky';
import ClankyPage from './clanky';
import FotkyZAkciPage from './fotky-z-akci';

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
      return <HajenkabelaPage />;
    case 'pronajem-hajenky-bela':
      return <PronajemHajenkybePage />;
    case 'taborove-prihlasky':
      return <TaborovePrihlaskyPage />;
    case 'clanky':
      return <ClankyPage />;
    case 'fotky-z-akci':
      return <FotkyZAkciPage />;
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