import type { CardItem, ItemStatus } from '../types';
import { supabase } from '../lib/supabase';

const TABLE_NAME = 'cards';

type CardRow = {
  id: string;
  title: string;
  status: ItemStatus;
  production_date: string;
  entry_date: string | null;
  exit_date: string | null;
  created_by: string;
  created_at: string;
  last_edited_by: string;
  updated_at: string;
  position: number;
  history: HistoryItem[];
};

const toCard = (row: CardRow): CardItem => ({
  id: row.id,
  title: row.title,
  status: row.status,
  productionDate: row.production_date,
  entryDate: row.entry_date ?? '',
  exitDate: row.exit_date ?? undefined,
  createdBy: row.created_by,
  createdAt: row.created_at,
  lastEditedBy: row.last_edited_by,
  updatedAt: row.updated_at,
  position: row.position,
  history: row.history || [],
});

const toRow = (card: CardItem, index: number): CardRow => ({
  id: card.id,
  title: card.title,
  status: card.status,
  production_date: card.productionDate,
  entry_date: card.entryDate || null,
  exit_date: card.exitDate || null,
  created_by: card.createdBy,
  created_at: card.createdAt,
  last_edited_by: card.lastEditedBy,
  updated_at: card.updatedAt,
  position: index,
  history: card.history || [],
});

export async function fetchCards() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, title, status, production_date, entry_date, exit_date, created_by, created_at, last_edited_by, updated_at, position, history')
    .order('position', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(toCard);
}

export async function upsertCards(cards: CardItem[]) {
  const rows = cards.map((card, index) => toRow({ ...card, position: index }, index));
  const { error } = await supabase.from(TABLE_NAME).upsert(rows, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteCard(id: string) {
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
  if (error) throw error;
}

export async function clearSaidasCards() {
  const { error } = await supabase.from(TABLE_NAME).delete().eq('status', 'cubas-saidas-vitrine');
  if (error) throw error;
}
