import type { CardItem } from '../types';
import './Card.css';

interface CardProps {
  card: CardItem;
  onClick?: (card: CardItem) => void;
  movedCardId?: string | null;
  moveDirection?: 'left' | 'right' | null;
}

const getDiffDays = (date1: string, date2: string) => {
  if (!date1 || !date2) return null;
  const d1 = new Date(`${date1}T00:00:00`);
  const d2 = new Date(`${date2}T00:00:00`);
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return null;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const formatDate = (date: string) => {
  if (!date) return '-';
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('pt-BR').format(parsed);
};

export function Card({ card, onClick, movedCardId, moveDirection }: CardProps) {
  const isMoved = card.id === movedCardId;
  const slideClass = isMoved ? (moveDirection === 'right' ? 'slide-from-left' : 'slide-from-right') : '';

  const calculateDaysInFreezer = () => {
    if (card.status !== 'freezer-estoque') return null;
    const prodDate = new Date(`${card.productionDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - prodDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 10 ? diffDays : null;
  };

  const daysOld = calculateDaysInFreezer();
  
  const getBadgeClass = (days: number) => {
    if (days > 20) return 'age-red';
    if (days >= 15) return 'age-yellow';
    if (days >= 10) return 'age-green';
    return '';
  };
  
  return (
    <div
      className={`card ${isMoved ? 'is-moved' : ''} ${slideClass}`}
      onClick={() => onClick?.(card)}
    >
      <div className="card-header">
        <span className="card-title">{card.title}</span>
        {daysOld !== null && (
          <div className={`card-age-badge ${getBadgeClass(daysOld)}`} title={`${daysOld} dias desde a produção`}>
            {daysOld}d
          </div>
        )}
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
        
        {card.status === 'cubas-saidas-vitrine' && (
          <>
            <div className="card-meta-item" style={{ marginTop: '4px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '4px' }}>
              <span className="card-meta-label">Tempo de freezer</span>
              <span className="card-meta-value">{getDiffDays(card.productionDate, card.entryDate) ?? '-'} dias</span>
            </div>
            <div className="card-meta-item">
              <span className="card-meta-label">Tempo de vitrine</span>
              <span className="card-meta-value">{getDiffDays(card.entryDate, card.exitDate || '') ?? '-'} dias</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
