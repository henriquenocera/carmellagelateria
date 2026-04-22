import type { CardItem, ColumnData } from '../types';

export const COLUMNS: ColumnData[] = [
  { id: 'freezer-estoque', title: 'Freezer Estoque', maxCapacity: 18 },
  { id: 'vitrine-atual', title: 'Vitrine Atual', maxCapacity: 16 },
  { id: 'cubas-saidas-vitrine', title: 'Cubas Saídas da Vitrine' },
];

export const INITIAL_CARDS: CardItem[] = [
  // Freezer Estoque
  { id: 'f50db9bb-0cdf-4618-929d-5262f0e48019', title: 'Teste', status: 'freezer-estoque', productionDate: '2026-04-09', entryDate: '2026-04-10', createdBy: 'A definir', lastEditedBy: 'A definir', position: 0 },

];
