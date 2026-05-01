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
  groupByDate?: boolean;
}

export function Column({ column, cards, onCardClick, movedCardId, moveDirection, action, sortIndicator, groupByDate }: ColumnProps) {
  const isVitrine = column.id === 'vitrine-atual';

  const renderContent = () => {
    if (!groupByDate) {
      return cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={onCardClick}
          movedCardId={movedCardId}
          moveDirection={moveDirection}
        />
      ));
    }

    const groups: { [key: string]: CardItem[] } = {};
    cards.forEach(card => {
      // Usamos a exitDate para o agrupamento, ou entryDate se for freezer
      const dateSource = card.exitDate || card.entryDate;
      const date = dateSource ? new Date(`${dateSource}T00:00:00`).toLocaleDateString('pt-BR') : 'Sem data';
      if (!groups[date]) groups[date] = [];
      groups[date].push(card);
    });

    return Object.entries(groups).map(([date, groupCards]) => (
      <div key={date} className="column-date-group">
        <div className="column-date-marker">
          <span>{date}</span>
        </div>
        {groupCards.map(card => (
          <Card
            key={card.id}
            card={card}
            onClick={onCardClick}
            movedCardId={movedCardId}
            moveDirection={moveDirection}
          />
        ))}
      </div>
    ));
  };

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
        {renderContent()}
      </div>
    </div>
  );
}
