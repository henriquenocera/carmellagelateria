import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MoreHorizontal, PlusSquare, ArrowRightLeft } from 'lucide-react';
import type { CardItem, ColumnData } from '../types';
import { Card } from './Card';
import './Column.css';

interface ColumnProps {
  column: ColumnData;
  cards: CardItem[];
  onAddCard: (columnId: string) => void;
}

export function Column({ column, cards, onAddCard }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const isVitrine = column.id === 'vitrine-atual';

  return (
    <div className={`column ${isVitrine ? 'column-vitrine' : ''}`}>
      <div className="column-header">
        <div className="column-title-area">
          <h2 className="column-title">{column.title}</h2>
          <div className="column-count">
            {cards.length} {column.maxCapacity ? `/ ${column.maxCapacity}` : ''}
          </div>
        </div>
        <div className="column-actions">
          <button className="icon-button"><ArrowRightLeft size={16} /></button>
          <button className="icon-button"><MoreHorizontal size={16} /></button>
        </div>
      </div>

      <div className="column-content" ref={setNodeRef}>
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      <div className="column-footer">
        <button className="add-card-btn" onClick={() => onAddCard(column.id)}>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <span style={{ fontSize: '20px', fontWeight: '300' }}>+</span>
            <span>Adicionar um cartão</span>
          </div>
          <PlusSquare size={16} />
        </button>
      </div>
    </div>
  );
}
