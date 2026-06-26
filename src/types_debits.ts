export interface ClientInfo {
  cnpj: string;
  name: string;
}

export interface DebtItem {
  id: string;
  category: string; // e.g. "DAS SIMPLES NACIONAL", "PIS", etc.
  period: string; // e.g. "01/2026" or "02/2026"
  principal: number;
  penalty: number; // multa
  interest: number; // juros
  total: number; // principal + penalty + juros
  status?: string; // e.g. "DEVEDOR", "EM ATRASO", "SUSPENSO"
}

export interface DebtCategory {
  id: string;
  categoryType: 'TRIBUTO' | 'PARCELAMENTO' | 'MULTAS';
  origin: 'FEDERAL' | 'ESTADUAL' | 'MUNICIPAL';
  documentType: 'DARF' | 'DAS' | 'DAE' | 'DAM';
  title: string;
  scope: 'ADMINISTRATIVO' | 'DIVIDA_ATIVA';
  code?: string;
}

