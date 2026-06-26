/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, FileText } from 'lucide-react';
import { NFeItemRow } from '../types';

interface StatsBannerProps {
  rows: NFeItemRow[];
}

export function StatsBanner({ rows }: StatsBannerProps) {
  const uniqueNfes = Array.from(new Set(rows.map(r => r.chNFe))).length;
  const totalItems = rows.length;
  
  const totalVal = rows.reduce((acc, curr) => acc + curr.vProd, 0);
  
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 max-w-3xl animate-fadeIn">
      
      {/* 1. Overall Files Volume */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:shadow-md hover:scale-[1.01] transition-all duration-300 border-l-4 border-l-slate-400">
        <div className="p-3 bg-slate-50 text-[#042838] rounded-xl border border-slate-200/60 shrink-0">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Documentos & Itens</p>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight font-sans mt-0.5">
            {uniqueNfes} {uniqueNfes === 1 ? 'XML' : 'XMLs'} <span className="text-xs text-slate-500 font-normal">({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
          </h3>
        </div>
      </div>

      {/* 2. Total Invoice Value */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:shadow-md hover:scale-[1.01] transition-all duration-300 border-l-4 border-l-[#042838]">
        <div className="p-3 bg-slate-50 text-[#042838] rounded-xl border border-slate-200/60 shrink-0">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Valor Total de Itens</p>
          <h3 className="text-lg font-bold text-[#042838] tracking-tight font-mono mt-0.5">
            {formatter.format(totalVal)}
          </h3>
        </div>
      </div>

    </div>
  );
}
