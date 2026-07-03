import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type { CardItem } from '../types';
import './Card.css';

interface CardProps {
  card: CardItem;
  onClick?: (card: CardItem) => void;
  movedCardId?: string | null;
  moveDirection?: 'left' | 'right' | null;
  isConflict?: boolean;
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

export function Card({ card, onClick, movedCardId, moveDirection, isConflict }: CardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isMoved = card.id === movedCardId;
  const slideClass = isMoved ? (moveDirection === 'right' ? 'slide-from-left' : 'slide-from-right') : '';

  const calculateDaysInFreezer = () => {
    if (card.status !== 'freezer-estoque') return null;
    const prodDate = new Date(`${card.productionDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - prodDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : null;
  };

  const calculateDaysInVitrine = () => {
    if (card.status !== 'vitrine-atual') return null;
    if (!card.entryDate) return null;
    const entryDate = new Date(`${card.entryDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - entryDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 7 ? diffDays : null; // O usuário pediu 'a mais de 7 dias', vamos exibir a partir do dia 7
  };

  const daysOld = calculateDaysInFreezer();

  const getEntryBadge = () => {
    if (card.status === 'vitrine-atual' && card.entryDate) {
      const entryDateObj = new Date(`${card.entryDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (entryDateObj.getTime() === today.getTime()) {
        return { text: 'Hoje', class: 'entry-today' };
      }
      if (entryDateObj.getTime() === yesterday.getTime()) {
        return { text: 'Ontem', class: 'entry-yesterday' };
      }
    }

    if (card.status === 'freezer-estoque' && card.entryDate) {
      return { text: 'Voltou da vitrine', class: 'returned-from-vitrine', isIcon: true };
    }

    return null;
  };

  const entryBadge = getEntryBadge();

  const getBadgeClass = (days: number) => {
    if (days > 30) return 'age-red';
    if (days >= 15) return 'age-yellow';
    return 'age-green';
  };

  const getVitrineBadgeClass = (days: number) => {
    if (days >= 21) return 'age-red';
    if (days >= 14) return 'age-yellow';
    return 'age-green';
  };

  const vitrineDaysOld = calculateDaysInVitrine();

  return (
    <div
      className={`card ${isMoved ? 'is-moved' : ''} ${slideClass} ${isConflict ? 'is-conflict' : ''} ${card.count && card.count > 1 ? 'is-grouped' : ''}`}
      style={{ zIndex: showTooltip ? 100 : 1 }}
      onClick={() => onClick?.(card)}
    >
      {isConflict && (
        <div className="card-conflict-badge">
          ⚠️ Sabor ativo na Vitrine!
        </div>
      )}
      <div className="card-badges">
        {card.count && card.count > 1 && (
          <div className="card-group-badge" title={`${card.count} cartões agrupados`}>
            {card.count}x
          </div>
        )}
        {daysOld !== null && (
          <div className={`card-age-badge ${getBadgeClass(daysOld)}`} title={`${daysOld} dias desde a produção`}>
            {daysOld}d
          </div>
        )}
        {vitrineDaysOld !== null && (
          <div className={`card-age-badge ${getVitrineBadgeClass(vitrineDaysOld)}`} title={`${vitrineDaysOld} dias na vitrine`}>
            {vitrineDaysOld}d (vitrine)
          </div>
        )}
        {entryBadge && (
          <div
            className={`card-entry-badge ${entryBadge.class} ${entryBadge.isIcon ? 'is-icon' : ''}`}
            onClick={(e) => {
              if (entryBadge.isIcon) {
                e.stopPropagation();
                setShowTooltip(!showTooltip);
              }
            }}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {entryBadge.isIcon ? (
              <>
                <AlertCircle size={14} />
                {showTooltip && <div className="card-tooltip">Voltou da vitrine</div>}
              </>
            ) : (
              entryBadge.text
            )}
          </div>
        )}
      </div>

      <div className="card-header">
        <span className="card-title">{card.title}</span>
      </div>

      <div className="card-meta-list">
        <div className="card-meta-item">
          <span className="card-meta-label">
            {card.status === 'quebras' ? 'Data de criação' : 'Data de produção'}
          </span>
          <span className="card-meta-value">{formatDate(card.productionDate)}</span>
        </div>
        {card.status !== 'quebras' && (
          <div className="card-meta-item">
            <span className="card-meta-label">Data de entrada</span>
            <span className="card-meta-value">{formatDate(card.entryDate)}</span>
          </div>
        )}
        {card.exitDate && (
          <div className="card-meta-item">
            <span className="card-meta-label">Data de saída</span>
            <span className="card-meta-value">{formatDate(card.exitDate)}</span>
          </div>
        )}

        {(card.status === 'cubas-saidas-vitrine' || card.status === 'excluidos') && (
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
