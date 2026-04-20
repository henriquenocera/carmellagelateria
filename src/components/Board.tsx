import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { Column } from './Column';
import { Card } from './Card';
import type { CardItem, ItemStatus } from '../types';
import { COLUMNS, INITIAL_CARDS } from '../data/mockData';
import './Board.css';

export function Board() {
  const [cards, setCards] = useState<CardItem[]>(INITIAL_CARDS);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeCard = activeId ? cards.find(c => c.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Card';
    const isOverTask = over.data.current?.type === 'Card';

    if (!isActiveTask) return;

    // Dropping a Card over another Card
    if (isActiveTask && isOverTask) {
      setCards((cards) => {
        const activeIndex = cards.findIndex((c) => c.id === activeId);
        const overIndex = cards.findIndex((c) => c.id === overId);

        if (cards[activeIndex].status !== cards[overIndex].status) {
          const newCards = [...cards];
          newCards[activeIndex].status = cards[overIndex].status;
          return arrayMove(newCards, activeIndex, overIndex);
        }

        return arrayMove(cards, activeIndex, overIndex);
      });
    }

    // Dropping a Card over a Column
    const isOverColumn = over.data.current?.type !== 'Card';
    if (isActiveTask && isOverColumn) {
      setCards((cards) => {
        const activeIndex = cards.findIndex((c) => c.id === activeId);
        const newCards = [...cards];
        newCards[activeIndex].status = overId as ItemStatus;
        
        // Custom logic when moving to Vitrine Atual
        if (newCards[activeIndex].status === 'vitrine-atual' && cards[activeIndex].status !== 'vitrine-atual') {
          newCards[activeIndex].endedAt = 'Agora'; // Can be customized
        } else if (newCards[activeIndex].status !== 'vitrine-atual') {
          newCards[activeIndex].endedAt = undefined;
        }

        return arrayMove(newCards, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = () => {
    setActiveId(null);
  };

  const handleAddCard = (columnId: string) => {
    const newCard: CardItem = {
      id: Date.now().toString(),
      title: 'Novo Sabor',
      status: columnId as ItemStatus,
      startedAt: 'Hoje',
    };
    setCards([...cards, newCard]);
  };

  return (
    <div className="board-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              cards={cards.filter((c) => c.status === col.id)}
              onAddCard={handleAddCard}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? <Card card={activeCard} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
