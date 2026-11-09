'use client';

import React from 'react';
import { Skiper9 } from '@/registry/skiper-ui/skiper9';

export default function Preloader() {
  return (
    <Skiper9
      columns={5}
      words={[
        'STEP THROUGH THE GATE.',
        'WELCOME TO MY WORLD.',
      ]}
      interval={2100}
    />
  );
}

export { Skiper9 };
