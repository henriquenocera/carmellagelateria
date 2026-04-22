import type { CardItem, ItemStatus } from '../types';
import { supabase } from '../lib/supabase';

const TABLE_NAME = 'cards';

type CardRow = {
  id: string;
  title: string;
  status: ItemStatus;
  production_date: string;
  entry_date: string | null;
  created_by: string;
  last_edited_by: string;
  position: number;
};

const toCard = (row: CardRow): CardItem => ({
  id: row.id,
  title: row.title,
  status: row.status,
  productionDate: row.production_date,
  entryDate: row.entry_date ?? '',
  createdBy: row.created_by,
  lastEditedBy: row.last_edited_by,
  position: row.position,
});

const toRow = (card: CardItem, index: number): CardRow => ({
  id: card.id,
  title: card.title,
  status: card.status,
  production_date: card.productionDate,
  entry_date: card.entryDate || null,
  created_by: card.createdBy,
  last_edited_by: card.lastEditedBy,
  position: index,
});

export async function fetchCards() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, title, status, production_date, entry_date, created_by, last_edited_by, position')
    .order('position', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(toCard);
}

export async function upsertCards(cards: CardItem[]) {
  const rows = cards.map((card, index) => toRow({ ...card, position: index }, index));
  const { error } = await supabase.from(TABLE_NAME).upsert(rows, { onConflict: 'id' });
  if (error) throw error;
}
