import React from 'react';
import type { CardItem, ColumnData } from '../types';
import { Card } from './Card';
import './Column.css';

interface ColumnProps {
  column: ColumnData;
  cards: CardItem[];
  onCardClick: (card: CardItem) => void;
  movedCardId?: string | null;
  moveDirection?: 'left' | 'right' | null;
  action?: React.ReactNode;
  sortIndicator?: React.ReactNode;
}

export function Column({ column, cards, onCardClick, movedCardId, moveDirection, action, sortIndicator }: ColumnProps) {
  const isVitrine = column.id === 'vitrine-atual';

  return (
    <div className={`column ${isVitrine ? 'column-vitrine' : ''}`}>
      <div className="column-header" style={{ paddingBottom: '8px' }}>
        <div className="column-title-area">
          <h2 className="column-title">{column.title}</h2>
          <div className="column-count">
            {cards.length} {column.maxCapacity ? `/ ${column.maxCapacity}` : ''}
          </div>
        </div>
        <div className="column-actions">
          {action}
        </div>
      </div>
      {sortIndicator && (
        <div style={{ padding: '0 16px 12px 16px', fontSize: '12px', color: '#a11d1dff', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {sortIndicator}
        </div>
      )}

      <div className="column-content">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={onCardClick}
            movedCardId={movedCardId}
            moveDirection={moveDirection}
          />
        ))}
      </div>
    </div>
  );
}
