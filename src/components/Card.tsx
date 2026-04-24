import type { CardItem } from '../types';
import './Card.css';

interface CardProps {
  card: CardItem;
  onClick?: (card: CardItem) => void;
  movedCardId?: string;
}

const formatDate = (date: string) => {
  if (!date) return '-';
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('pt-BR').format(parsed);
};

export function Card({ card, onClick, movedCardId }: CardProps) {
  const isMoved = card.id === movedCardId;
  
  return (
    <div
      className={`card ${isMoved ? 'is-moved' : ''}`}
      onClick={() => onClick?.(card)}
    >
      <div className="card-header">
        <span className="card-title">{card.title}</span>
      </div>

      <div className="card-meta-list">
        <div className="card-meta-item">
          <span className="card-meta-label">Data de produção</span>
          <span className="card-meta-value">{formatDate(card.productionDate)}</span>
        </div>
        <div className="card-meta-item">
          <span className="card-meta-label">Data de entrada</span>
          <span className="card-meta-value">{formatDate(card.entryDate)}</span>
        </div>
        {card.exitDate && (
          <div className="card-meta-item">
            <span className="card-meta-label">Data de saída</span>
            <span className="card-meta-value">{formatDate(card.exitDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
