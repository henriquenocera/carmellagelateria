export type ItemStatus = 'freezer-estoque' | 'vitrine-atual' | 'cubas-saidas-vitrine';

export interface HistoryItem {
  timestamp: string;
  user: string;
  action: string;
}

export interface CardItem {
  id: string;
  title: string;
  status: ItemStatus;
  productionDate: string;
  entryDate: string;
  exitDate?: string;
  createdBy: string;
  createdAt: string;
  lastEditedBy: string;
  updatedAt: string;
  position: number;
  history: HistoryItem[];
}

export interface ColumnData {
  id: ItemStatus;
  title: string;
  maxCapacity?: number;
}
