'use client';

import React, { useState } from 'react';
import OpenInvitationCover from '@/components/OpenInvitationCover';
import WeddingInvitation from '@/components/WeddingInvitation';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-zinc-950 font-sans relative overflow-hidden">
      {!isOpen ? (
        /* Autoplay-safe opening entrance cover gate */
        <OpenInvitationCover onOpen={() => setIsOpen(true)} />
      ) : (
        /* Interactive vertical scroll invitation deck */
        <WeddingInvitation />
      )}
    </main>
  );
}
