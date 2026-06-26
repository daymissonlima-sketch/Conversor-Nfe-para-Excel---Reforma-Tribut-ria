/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NFeItemRow {
  // Unique identification
  id: string; // chNFe + "_" + nItem
  
  // General NFe Header Info
  chNFe: string;       // Chave de acesso (44 digits)
  nNF: string;         // Número da Nota Fiscal
  serie: string;       // Série
  modelo: string;      // Modelo da Nota (55 ou 65)
  dhEmi: string;       // Data de Emissão (DD/MM/YYYY)
  emitCNPJ: string;    // CNPJ ou CPF do Emitente
  emitNome: string;    // Nome / Razão Social do Emitente
  destCNPJ: string;    // CNPJ ou CPF do Destinatário (Excluded in IBS/CBS)
  destNome: string;    // Nome / Razão Social do Destinatário (Excluded in IBS/CBS)
  
  // Item Specific Info
  nItem: string;       // Número do Item
  cProd: string;       // Código do Produto
  xProd: string;       // Descrição do Produto
  NCM: string;         // Código NCM
  CFOP: string;        // CFOP
  uCom: string;        // Unidade Comercial
  qCom: number;        // Quantidade Comercial
  vUnCom: number;      // Valor Unitário Comercial
  vProd: number;       // Valor Total do Item (vProd)
  
  // Standard Taxes (ICMS) - (Excluded in IBS/CBS)
  cstICMS: string;     // CST ou CSOSN do ICMS
  vBC_ICMS: number;    // Valor da BC do ICMS
  pICMS: number;       // Alíquota do ICMS (%)
  vICMS: number;       // Valor do ICMS
  vBCST?: number;      // BC do ICMS ST
  pICMSST?: number;    // Alíquota do ICMS ST (%)
  vICMSST?: number;    // Valor do ICMS ST

  // IPI
  cstIPI?: string;     // CST do IPI
  vBC_IPI?: number;    // BC do IPI
  pIPI?: number;       // Alíquota do IPI (%)
  vIPI?: number;       // Valor do IPI
  
  // PIS / COFINS (Standard)
  cstPIS: string;      // CST do PIS
  vBC_PIS: number;     // BC do PIS
  pPIS: number;        // Alíquota PIS (%)
  vPIS: number;        // Valor PIS
  cstCOFINS: string;   // CST do COFINS
  vBC_COFINS: number;  // BC do COFINS
  pCOFINS: number;     // Alíquota COFINS (%)
  vCOFINS: number;     // Valor COFINS

  // New Tax Reform Fields (IBS / CBS)
  cClassTrib: string;  // Classificação Tributária do IBS/CBS
  cstIBS: string;      // CST do IBS
  cstCBS: string;      // CST do CBS
  vBC_IBS: number;     // Valor da BC do IBS
  pIBS: number;        // Alíquota do IBS (%)
  vIBS: number;        // Valor do IBS
  vBC_CBS: number;     // Valor da BC do CBS
  pCBS: number;        // Alíquota do CBS (%)
  vCBS: number;        // Valor do CBS
  
  // Specific IBS UF and Mun fields
  pIBSUF?: number;     // Alíquota do IBS Estadual (%)
  vIBSUF?: number;     // Valor do IBS Estadual
  pIBSMun?: number;    // Alíquota do IBS Municipal (%)
  vIBSMun?: number;    // Valor do IBS Municipal
  
  // Additional / Fiscal Info - (Excluded in IBS/CBS)
  infAdic: string;     // Informações Complementares
  infAdFisco: string;  // Informações de Interesse do Fisco
}

export type ViewMode = 'padrao' | 'ibscbs';

export interface SortConfig {
  column: keyof NFeItemRow | null;
  direction: 'asc' | 'desc';
}

export interface GridFilters {
  search: string;
  nNF: string;
  emitNome: string;
  NCM: string;
  CFOP: string;
}
