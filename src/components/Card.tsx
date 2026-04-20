import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, CheckCircle2 } from 'lucide-react';
import type { CardItem } from '../types';
import './Card.css';

interface CardProps {
  card: CardItem;
}

export function Card({ card }: CardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const isVitrine = card.status === 'vitrine-atual';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`card ${isDragging ? 'is-dragging' : ''} ${isVitrine ? 'is-vitrine' : ''}`}
    >
      <div className="card-header">
        {isVitrine && <CheckCircle2 className="icon-check" size={16} />}
        <span className="card-title">{card.title}</span>
      </div>
      
      <div className={`card-footer ${isVitrine ? 'bg-green' : ''}`}>
        <Clock size={12} className="icon-clock" />
        <span className="card-date">
          {isVitrine && card.endedAt 
            ? `${card.startedAt} - ${card.endedAt}`
            : `Começou: ${card.startedAt}`
          }
        </span>
      </div>
    </div>
  );
}
