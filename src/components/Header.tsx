/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Logo } from './Logo';

export function Header() {
  return (
    <header className="bg-[#04243b] text-slate-100 border-b border-[#e4b35e]/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Logo and Premium Branding */}
          <Logo size="md" withText={true} />

        </div>
      </div>
    </header>
  );
}
