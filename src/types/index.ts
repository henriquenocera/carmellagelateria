export type ItemStatus = 'freezer-estoque' | 'vitrine-atual' | 'cubas-saidas-vitrine';

export interface CardItem {
  id: string;
  title: string;
  status: ItemStatus;
  productionDate: string;
  entryDate: string;
  exitDate?: string;
  createdBy: string;
  lastEditedBy: string;
  position: number;
}

export interface ColumnData {
  id: ItemStatus;
  title: string;
  maxCapacity?: number;
}
