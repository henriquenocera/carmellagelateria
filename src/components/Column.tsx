import { MoreHorizontal, ArrowRightLeft } from 'lucide-react';
import type { CardItem, ColumnData } from '../types';
import { Card } from './Card';
import './Column.css';

interface ColumnProps {
  column: ColumnData;
  cards: CardItem[];
  onCardClick: (card: CardItem) => void;
}

export function Column({ column, cards, onCardClick }: ColumnProps) {
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

      <div className="column-content">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}
