import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

import { Column } from './Column';
import type { CardItem, ItemStatus, ColumnData } from '../types';
import { fetchCards, upsertCards, deleteCard, clearSaidasCards } from '../services/cards';
import { useAuth } from '../contexts/AuthContext';
import { Trash2 } from 'lucide-react';
import './Board.css';

// ALtere este array com os e-mails dos usuários que podem excluir cartões
const AUTHORIZED_EMAILS_TO_DELETE = [
  'henocera@gmail.com',
  'seuemail@carmella.com.br'
];

export const COLUMNS: ColumnData[] = [
  { id: 'freezer-estoque', title: 'Freezer Estoque', maxCapacity: 18 },
  { id: 'vitrine-atual', title: 'Vitrine Atual', maxCapacity: 16 },
  { id: 'cubas-saidas-vitrine', title: 'Cubas Saídas da Vitrine' },
];

export function Board() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingProductionDate, setEditingProductionDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const latestCardsRef = useRef<CardItem[]>([]);
  const { user } = useAuth();

  const editingCard = editingCardId ? cards.find((c) => c.id === editingCardId) : null;

  const getToday = () => new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const loadCards = async () => {
      try {
        setIsLoading(true);
        const dbCards = await fetchCards();
        if (dbCards.length > 0) {
          setCards(dbCards);
        } else {
          setCards([]);
        }
        setSyncError(null);
      } catch (error) {
        console.error('Erro ao carregar cards do Supabase:', error);
        setSyncError('Nao foi possivel carregar do Supabase. Usando dados locais.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadCards();
  }, []);

  useEffect(() => {
    latestCardsRef.current = cards;
  }, [cards]);

  const persistCards = async (nextCards: CardItem[]) => {
    try {
      await upsertCards(nextCards);
      setSyncError(null);
    } catch (error) {
      console.error('Erro ao salvar cards no Supabase:', error);
      setSyncError('Falha ao sincronizar com Supabase.');
    }
  };

  const handleMoveCard = async (card: CardItem, targetStatus: ItemStatus) => {
    const nextCards = cards.map((c) => {
      if (c.id === card.id) {
        const sourceStatus = c.status;
        const entryDate = targetStatus === 'vitrine-atual' && sourceStatus !== 'vitrine-atual' ? getToday() : c.entryDate;
        const exitDate = targetStatus === 'cubas-saidas-vitrine' && sourceStatus === 'vitrine-atual' ? getToday() : c.exitDate;
        return {
          ...c,
          status: targetStatus,
          entryDate: entryDate,
          exitDate: exitDate,
          lastEditedBy: user?.email || c.lastEditedBy,
        };
      }
      return c;
    });

    setCards(nextCards);
    await persistCards(nextCards);
  };

  const handleCreateNewCard = async () => {
    const today = getToday();
    const newCard: CardItem = {
      id: crypto.randomUUID(),
      title: 'Novo Sabor',
      status: 'freezer-estoque',
      productionDate: today,
      entryDate: '',
      exitDate: '',
      createdBy: user?.email || 'A definir',
      lastEditedBy: user?.email || 'A definir',
      position: cards.length,
    };
    const nextCards = [...cards, newCard];
    setCards(nextCards);

    setEditingCardId(newCard.id);
    setEditingTitle(newCard.title);
    setEditingProductionDate(newCard.productionDate);

    await persistCards(nextCards);
  };

  const handleCardClick = (card: CardItem) => {
    if (card.status === 'cubas-saidas-vitrine') return;
    setEditingCardId(card.id);
    setEditingTitle(card.title);
    setEditingProductionDate(card.productionDate);
  };

  const handleCloseModal = () => {
    setEditingCardId(null);
    setEditingTitle('');
    setEditingProductionDate('');
  };

  const handleSaveModal = async () => {
    if (!editingCardId) return;

    const nextCards = cards.map((card) =>
      card.id === editingCardId
        ? {
          ...card,
          title: editingTitle.trim() || card.title,
          productionDate: editingProductionDate || card.productionDate,
          lastEditedBy: user?.email || card.lastEditedBy,
        }
        : card
    );
    setCards(nextCards);
    await persistCards(nextCards);

    handleCloseModal();
  };

  const handleDeleteCard = async () => {
    if (!editingCardId) return;
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita.');
    if (!confirmDelete) return;

    try {
      await deleteCard(editingCardId);
      setCards(cards.filter(c => c.id !== editingCardId));
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao excluir cartão:', error);
      alert('Não foi possível excluir o cartão.');
    }
  };

  const handleClearSaidas = async () => {
    const confirmDelete = window.confirm('Tem certeza que deseja apagar PERMANENTEMENTE TODAS as cubas "Saídas da Vitrine"?');
    if (!confirmDelete) return;

    try {
      await clearSaidasCards();
      setCards(cards.filter(c => c.status !== 'cubas-saidas-vitrine'));
    } catch (error) {
      console.error('Erro ao limpar saídas:', error);
      alert('Não foi possível limpar a lista de saídas.');
    }
  };

  return (
    <div className="board-container" style={{ flexDirection: 'column' }}>
      <div className="board-header" style={{ flexShrink: 0, marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button
          onClick={handleCreateNewCard}
          style={{ background: '#e07a5f', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}
        >
          <span style={{ fontSize: '20px', fontWeight: '400', lineHeight: 1 }}>+</span>
          Criar Novo Cartão
        </button>

        {(user?.email && AUTHORIZED_EMAILS_TO_DELETE.includes(user.email)) && (
          <button
            onClick={handleClearSaidas}
            className="clear-saidas-btn"
            style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', marginLeft: 'auto' }}
          >
            <Trash2 size={18} />
            Limpar Saídas da Vitrine
          </button>
        )}
      </div>

      {isLoading && <p>Carregando cards...</p>}
      {syncError && <p className="sync-error">{syncError}</p>}
      {!isLoading && cards.length === 0 && <p className="empty-message" style={{ textAlign: 'center', margin: '20px 0', fontSize: '1.1rem', color: '#64748b' }}>Nenhum item cadastrado ainda</p>}
      <div className="board">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            cards={cards.filter((c) => c.status === col.id)}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {editingCardId && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <h3>Editar cartao</h3>
            <label className="modal-label" htmlFor="card-title-input">
              Titulo
            </label>
            <input
              id="card-title-input"
              className="modal-input"
              type="text"
              value={editingTitle}
              onChange={(event) => setEditingTitle(event.target.value)}
            />

            <label className="modal-label" htmlFor="card-production-date-input">
              Data de producao
            </label>
            <input
              id="card-production-date-input"
              className="modal-input"
              type="date"
              value={editingProductionDate}
              onChange={(event) => setEditingProductionDate(event.target.value)}
            />

            <div className="modal-readonly-grid">
              <div className="modal-readonly-item">
                <span className="modal-readonly-label">Criado por</span>
                <span className="modal-readonly-value">{editingCard?.createdBy || 'A definir'}</span>
              </div>
              <div className="modal-readonly-item">
                <span className="modal-readonly-label">Ultima vez editado por</span>
                <span className="modal-readonly-value">{editingCard?.lastEditedBy || 'A definir'}</span>
              </div>
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <div>
                {(user?.email && AUTHORIZED_EMAILS_TO_DELETE.includes(user.email)) ? (
                  <button
                    type="button"
                    className="modal-btn"
                    style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={handleDeleteCard}
                  >
                    <Trash2 size={16} /> Excluir
                  </button>
                ) : <span />}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="modal-btn modal-btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="button" className="modal-btn modal-btn-primary" onClick={handleSaveModal}>
                  Salvar
                </button>
              </div>
            </div>

            <div className="modal-movement-actions" style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              {editingCard?.status === 'freezer-estoque' && (
                <button
                  type="button"
                  className="move-btn"
                  style={{ flex: 1, padding: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  onClick={async () => { await handleMoveCard(editingCard, 'vitrine-atual'); handleCloseModal(); }}
                >
                  Mover para Vitrine <ArrowRight size={16} />
                </button>
              )}
              {editingCard?.status === 'vitrine-atual' && (
                <>
                  <button
                    type="button"
                    className="move-btn"
                    style={{ flex: 1, padding: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    onClick={async () => { await handleMoveCard(editingCard, 'freezer-estoque'); handleCloseModal(); }}
                  >
                    <ArrowLeft size={16} /> Voltar para Freezer
                  </button>
                  <button
                    type="button"
                    className="move-btn"
                    style={{ flex: 1, padding: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    onClick={async () => { await handleMoveCard(editingCard, 'cubas-saidas-vitrine'); handleCloseModal(); }}
                  >
                    Mover para Saída <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
