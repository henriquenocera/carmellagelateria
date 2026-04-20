export type ItemStatus = 'freezer-estoque' | 'freezer-uso' | 'vitrine-atual';

export interface CardItem {
  id: string;
  title: string;
  status: ItemStatus;
  startedAt: string;
  endedAt?: string;
}

export interface ColumnData {
  id: ItemStatus;
  title: string;
  maxCapacity?: number;
}
