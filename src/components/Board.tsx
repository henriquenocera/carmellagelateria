import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Archive, Plus, Trash2, Clock, ArrowDownAz } from 'lucide-react';

import { Column } from './Column';
import type { CardItem, ItemStatus } from '../types';
import { fetchCards, upsertCards } from '../services/cards';
import { useAuth } from '../contexts/AuthContext';
import { GELATO_FLAVORS } from '../constants/flavors';
import { AUTHORIZED_EMAILS_TO_DELETE, COLUMNS } from '../constants/config';
import { supabase } from '../lib/supabase';
import './Board.css';

export function Board() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingProductionDate, setEditingProductionDate] = useState('');
  const [editingExitDate, setEditingExitDate] = useState<string | null>(null);
  const [movedCardId, setMovedCardId] = useState<string | null>(null);
  const [moveDirection, setMoveDirection] = useState<'left' | 'right' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [creatingInStatus, setCreatingInStatus] = useState<ItemStatus>('freezer-estoque');

  const [syncError, setSyncError] = useState<string | null>(null);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [quebraConfirmData, setQuebraConfirmData] = useState<{
    card: CardItem;
    nextCards: CardItem[];
    direction: 'left' | 'right';
  } | null>(null);
  const [profiles, setProfiles] = useState<{ [email: string]: string }>({});
  const latestCardsRef = useRef<CardItem[]>([]);
  const { user } = useAuth();
  const isAuthorized = !!(user?.email && AUTHORIZED_EMAILS_TO_DELETE.includes(user.email));

  const editingCard = editingCardId ? cards.find((c) => c.id === editingCardId) : null;
  const vitrineCol = COLUMNS.find(c => c.id === 'vitrine-atual');
  const vitrineCount = cards.filter(c => c.status === 'vitrine-atual').length;
  const isVitrineInvalid = vitrineCol && vitrineCount !== vitrineCol.maxCapacity;

  const vitrineFlavorsList = cards.filter(c => c.status === 'vitrine-atual').map(c => c.title);
  const quebrasFlavorsWithConflict = Array.from(new Set(
    cards.filter(c => c.status === 'quebras' && vitrineFlavorsList.includes(c.title)).map(c => c.title)
  ));

  const getToday = () => new Date().toISOString().slice(0, 10);

  const getStatusName = (status: ItemStatus) => {
    const col = COLUMNS.find(c => c.id === status);
    return col ? col.title : status;
  };

  const getUserDisplayName = (email: string | null | undefined) => {
    if (!email) return 'A definir';
    const cleanEmail = email.trim().toLowerCase();
    if (profiles[cleanEmail]) {
      return profiles[cleanEmail];
    }
    return email.split('@')[0];
  };

  useEffect(() => {
    const handleBoardAction = (e: any) => {
      const action = e.detail;
      if (action === 'add-card') handleCreateNewCard('freezer-estoque');
      if (action === 'clear-history') handleClearExcluidos();
      if (action === 'clear-archive') handleClearSaidas();
      if (action === 'open-logs') setIsLogsOpen(true);
    };

    window.addEventListener('board-action', handleBoardAction);
    return () => window.removeEventListener('board-action', handleBoardAction);
  }, [cards, user]); // Dependencies ensure we use latest state/user in handlers

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

    const loadProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('email, name');
        if (error) {
          console.warn('Tabela profiles nao encontrada:', error.message);
          return;
        }
        if (data) {
          const profileMap: { [email: string]: string } = {};
          data.forEach((p: any) => {
            if (p.email) {
              profileMap[p.email.toLowerCase().trim()] = p.name;
            }
          });
          setProfiles(profileMap);
        }
      } catch (error) {
        console.error('Erro ao carregar perfis:', error);
      }
    };

    void loadCards();
    void loadProfiles();
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
        const entryDate = targetStatus === 'quebras' ? '' : (targetStatus === 'vitrine-atual' && sourceStatus !== 'vitrine-atual' ? getToday() : c.entryDate);
        const exitDate = targetStatus === 'cubas-saidas-vitrine' && sourceStatus === 'vitrine-atual' ? getToday() : c.exitDate;
        return {
          ...c,
          status: targetStatus,
          entryDate: entryDate,
          exitDate: exitDate,
          lastEditedBy: user?.email || c.lastEditedBy,
          updatedAt: new Date().toISOString(),
          history: [
            ...(c.history || []),
            {
              timestamp: new Date().toISOString(),
              user: user?.email || 'Sistema',
              action: `${getStatusName(sourceStatus)} → ${getStatusName(targetStatus)}`,
            },
          ],
        };
      }
      return c;
    });

    const statusOrder = ['quebras', 'freezer-estoque', 'vitrine-atual', 'cubas-saidas-vitrine'];
    const sourceIndex = statusOrder.indexOf(card.status);
    const targetIndex = statusOrder.indexOf(targetStatus);
    const direction = targetIndex > sourceIndex ? 'right' : 'left';

    if (targetStatus === 'cubas-saidas-vitrine' && card.status === 'vitrine-atual') {
      setQuebraConfirmData({
        card,
        nextCards,
        direction: direction || 'right'
      });
      return;
    }

    setCards(nextCards);
    setMovedCardId(card.id);
    setMoveDirection(direction);

    // Reset highlight after a short period (matching animation duration)
    setTimeout(() => {
      setMovedCardId(null);
      setMoveDirection(null);
    }, 8000);
    await persistCards(nextCards);
  };

  const handleCreateNewCard = (status: ItemStatus = 'freezer-estoque') => {
    setIsCreating(true);
    setCreatingInStatus(status);
    setEditingTitle('');
    setEditingProductionDate(getToday());
    setEditingCardId('new'); // Usamos um ID temporário para indicar criação
  };

  const handleCardClick = (card: CardItem) => {
    if ((card.status === 'cubas-saidas-vitrine' || card.status === 'excluidos') && !isAuthorized) return;

    setEditingCardId(card.id);
    setEditingTitle(card.title);
    setEditingProductionDate(card.productionDate);
    setEditingExitDate(card.exitDate || null);
  };

  const handleCloseModal = () => {
    setEditingCardId(null);
    setIsCreating(false);
    setEditingTitle('');
    setEditingProductionDate('');
    setEditingExitDate(null);
  };

  const handleSaveModal = async () => {
    if (!editingCardId || isSaving) return;

    if (!editingTitle || !GELATO_FLAVORS.includes(editingTitle)) {
      alert('Por favor, selecione um sabor válido da lista.');
      return;
    }

    setIsSaving(true);
    try {
      if (isCreating) {
        const newCard: CardItem = {
          id: crypto.randomUUID(),
          title: editingTitle.trim() || 'Novo Sabor',
          status: creatingInStatus,
          productionDate: editingProductionDate || getToday(),
          entryDate: '',
          exitDate: '',
          createdBy: user?.email || 'A definir',
          createdAt: new Date().toISOString(),
          lastEditedBy: user?.email || 'A definir',
          updatedAt: new Date().toISOString(),
          position: cards.length,
          history: [
            {
              timestamp: new Date().toISOString(),
              user: user?.email || 'A definir',
              action: creatingInStatus === 'quebras' ? 'Criado em Quebras' : 'Criado no Estoque',
            },
          ],
        };
        const nextCards = [...cards, newCard];
        setCards(nextCards);
        setMovedCardId(newCard.id);
        await persistCards(nextCards);

        // Reset highlight and priority sort after 8 seconds
        setTimeout(() => {
          setMovedCardId(null);
        }, 8000);
      } else {
        const currentCard = cards.find(c => c.id === editingCardId);
        const hasExitDateChanged = editingExitDate !== (currentCard?.exitDate || null);

        const nextCards = cards.map((c) => {
          if (c.id === editingCardId) {
            const history = [...(c.history || [])];
            if (hasExitDateChanged) {
              history.push({
                timestamp: new Date().toISOString(),
                user: user?.email || 'Sistema',
                action: editingExitDate ? `Data de saída alterada para ${editingExitDate}` : 'Data de saída removida',
              });
            }

            return {
              ...c,
              title: editingTitle,
              productionDate: editingProductionDate,
              exitDate: editingExitDate || '',
              lastEditedBy: user?.email || c.lastEditedBy,
              updatedAt: new Date().toISOString(),
              history
            };
          }
          return c;
        });
        setCards(nextCards);
        await persistCards(nextCards);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Ocorreu um erro ao salvar o cartão.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchiveCard = async () => {
    if (!editingCardId) return;
    const card = cards.find(c => c.id === editingCardId);
    if (!card) return;

    const confirmArchive = window.confirm('Tem certeza que deseja arquivar este cartão?');
    if (!confirmArchive) return;

    const nextCards = cards.map(c =>
      c.id === editingCardId
        ? {
          ...c,
          status: 'cubas-saidas-vitrine' as ItemStatus,
          updatedAt: new Date().toISOString(),
          history: [
            ...(c.history || []),
            {
              timestamp: new Date().toISOString(),
              user: user?.email || 'Sistema',
              action: `${getStatusName(c.status)} → ${getStatusName('cubas-saidas-vitrine')} (Arq)`,
            }
          ]
        }
        : c
    );

    setCards(nextCards);
    handleCloseModal();
    await persistCards(nextCards);
  };

  const handleMoveToHistory = async () => {
    if (!editingCardId) return;
    const confirmDelete = window.confirm('Deseja excluir este cartão? Ele será movido para o histórico.');
    if (!confirmDelete) return;

    const nextCards = cards.map(c =>
      c.id === editingCardId
        ? {
          ...c,
          status: 'excluidos' as ItemStatus,
          updatedAt: new Date().toISOString(),
          history: [
            ...(c.history || []),
            {
              timestamp: new Date().toISOString(),
              user: user?.email || 'Sistema',
              action: `${getStatusName(c.status)} → ${getStatusName('excluidos')} (Exc)`,
            }
          ]
        }
        : c
    );

    setCards(nextCards);
    handleCloseModal();
    await persistCards(nextCards);
  };

  const handleDeletePermanent = async () => {
    if (!editingCardId) return;
    const confirmDelete = window.confirm('Tem certeza que deseja DELETAR PERMANENTEMENTE este cartão? Esta ação não pode ser desfeita.');
    if (!confirmDelete) return;

    const idToDelete = editingCardId;

    try {
      // Atualiza o estado local primeiro para evitar que outros processos o re-salvem
      setCards(prev => prev.filter(c => c.id !== idToDelete));
      handleCloseModal();

      // Deleta diretamente do banco de dados e retorna o dado deletado para confirmação
      const { data, error } = await supabase
        .from('cards')
        .delete()
        .eq('id', idToDelete)
        .select();

      console.log('Tentativa de delete concluída. Dados retornados:', data);

      if (error) {
        console.error('Erro ao deletar no Supabase:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('Nenhum dado foi deletado. Verifique se o ID existe ou se há restrições de RLS.');
      }
    } catch (error) {
      console.error('Erro ao deletar cartão:', error);
      alert('Ocorreu um erro ao deletar permanentemente. Por favor, recarregue a página.');
      // Recarrega os cards em caso de erro para manter sincronia
      const dbCards = await fetchCards();
      setCards(dbCards);
    }
  };

  const handleConsumeQuebra = async (card: CardItem) => {
    const confirmConsume = window.confirm(`Deseja marcar "${card.title}" como Quebra Consumida? Ele será removido definitivamente.`);
    if (!confirmConsume) return;

    try {
      setCards(prev => prev.filter(c => c.id !== card.id));
      handleCloseModal();

      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', card.id);

      if (error) {
        console.error('Erro ao excluir quebra no Supabase:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao consumir quebra:', error);
      alert('Ocorreu um erro ao excluir a quebra consumida.');
      const dbCards = await fetchCards();
      setCards(dbCards);
    }
  };

  const handleConfirmQuebraDialog = async (shouldCreateQuebra: boolean) => {
    if (!quebraConfirmData) return;
    const { card, nextCards, direction } = quebraConfirmData;
    let finalCards = nextCards;

    if (shouldCreateQuebra) {
      const newQuebraCard: CardItem = {
        id: crypto.randomUUID(),
        title: card.title,
        status: 'quebras',
        productionDate: getToday(),
        entryDate: '',
        exitDate: '',
        createdBy: user?.email || 'Sistema',
        lastEditedBy: user?.email || 'Sistema',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        position: cards.length,
        history: [
          {
            timestamp: new Date().toISOString(),
            user: user?.email || 'Sistema',
            action: 'Criado em Quebras (Auto via Saída da Vitrine)',
          }
        ]
      };
      finalCards = [...nextCards, newQuebraCard];
    }

    setCards(finalCards);
    setMovedCardId(card.id);
    setMoveDirection(direction);

    // Reset highlight after a short period (matching animation duration)
    setTimeout(() => {
      setMovedCardId(null);
      setMoveDirection(null);
    }, 8000);

    setQuebraConfirmData(null);
    await persistCards(finalCards);
  };

  const globalLogs = cards.flatMap(card =>
    (card.history || []).map(h => ({
      ...h,
      cardTitle: card.title,
      card: card
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleClearSaidas = async () => {
    const confirmMove = window.confirm('Deseja mover todos os itens do Arquivo para o Histórico de Excluídos?');
    if (!confirmMove) return;

    try {
      const nextCards = cards.map(c =>
        c.status === 'cubas-saidas-vitrine'
          ? {
            ...c,
            status: 'excluidos' as ItemStatus,
            updatedAt: new Date().toISOString(),
            history: [
              ...(c.history || []),
              {
                timestamp: new Date().toISOString(),
                user: user?.email || 'Sistema',
                action: `${getStatusName('cubas-saidas-vitrine')} → ${getStatusName('excluidos')} (Massa)`,
              }
            ]
          }
          : c
      );

      setCards(nextCards);
      await persistCards(nextCards);
    } catch (error) {
      console.error('Erro ao mover arquivo:', error);
      alert('Não foi possível mover os itens.');
    }
  };

  const handleClearExcluidos = async () => {
    const confirmDelete = window.confirm('Tem certeza que deseja apagar PERMANENTEMENTE TODO o Histórico de Excluídos?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from('cards').delete().eq('status', 'excluidos');
      if (error) throw error;
      setCards(prev => prev.filter(c => c.status !== 'excluidos'));
    } catch (error) {
      console.error('Erro ao limpar excluídos:', error);
      alert('Não foi possível limpar o histórico.');
    }
  };

  return (
    <div className="board-container" style={{ flexDirection: 'column' }}>
      {isVitrineInvalid && (
        <div className="capacity-warning" style={{
          background: '#fff7ed',
          border: '1px solid #ffedd5',
          color: '#c2410c',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          A Vitrine Atual está com <strong>{vitrineCount}</strong> de <strong>{vitrineCol.maxCapacity}</strong> cubas.
        </div>
      )}

      {quebrasFlavorsWithConflict.length > 0 && (
        <div className="conflict-warning" style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 2px 4px rgba(239,68,68,0.02)'
        }}>
          <span style={{ fontSize: '16px' }}>🚨</span>
          <span>
            Atenção: Os seguintes sabores ativos na <strong>Vitrine</strong> possuem registros de <strong>Quebra</strong>: <strong>{quebrasFlavorsWithConflict.join(', ')}</strong>.
          </span>
        </div>
      )}

      {isLoading && <p>Carregando cards...</p>}
      {syncError && <p className="sync-error">{syncError}</p>}
      {!isLoading && cards.length === 0 && <p className="empty-message" style={{ textAlign: 'center', margin: '20px 0', fontSize: '1.1rem', color: '#64748b' }}>Nenhum item cadastrado ainda</p>}
      <div className="board">
        {COLUMNS
          .filter(col => col.id !== 'excluidos' || (user?.email && AUTHORIZED_EMAILS_TO_DELETE.includes(user.email)))
          .map((col) => {
            const vitrineFlavors = new Set(cards.filter(c => c.status === 'vitrine-atual').map(c => c.title));
            let columnCards = cards.filter((c) => c.status === col.id);

            // Ordenar Freezer e Vitrine por data de produção (mais velho primeiro)
            // MAS mantém o cartão recém-mexido (movedCardId) no topo temporariamente
            if (col.id === 'quebras') {
              columnCards = [...columnCards].sort((a, b) => {
                if (a.id === movedCardId) return -1;
                if (b.id === movedCardId) return 1;

                const aInVitrine = vitrineFlavors.has(a.title);
                const bInVitrine = vitrineFlavors.has(b.title);

                if (aInVitrine && !bInVitrine) return -1;
                if (!aInVitrine && bInVitrine) return 1;

                return new Date(a.productionDate).getTime() - new Date(b.productionDate).getTime();
              });
            }
            if (col.id === 'freezer-estoque') {
              columnCards = [...columnCards].sort((a, b) => {
                if (a.id === movedCardId) return -1;
                if (b.id === movedCardId) return 1;
                return new Date(a.productionDate).getTime() - new Date(b.productionDate).getTime();
              });
            }
            if (col.id === 'vitrine-atual') {
              columnCards = [...columnCards].sort((a, b) => {
                if (a.id === movedCardId) return -1;
                if (b.id === movedCardId) return 1;
                return new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime();
              });
            }

            // Ordenar Histórico Excluídos por data de saída (mais recente primeiro)
            if (col.id === 'excluidos') {
              columnCards = [...columnCards].sort((a, b) => {
                const dateA = a.exitDate ? new Date(a.exitDate).getTime() : 0;
                const dateB = b.exitDate ? new Date(b.exitDate).getTime() : 0;
                return dateB - dateA;
              });
            }

            const getColumnAction = () => {
              if (col.id === 'quebras') {
                return (
                  <button
                    onClick={() => handleCreateNewCard('quebras')}
                    className="icon-button"
                    title="Registrar Quebra"
                    style={{ background: '#ef4444', color: '#fff', padding: '4px 8px', fontSize: '11px', borderRadius: '6px' }}
                  >
                    <Plus size={14} style={{ marginRight: '4px' }} /> Novo
                  </button>
                );
              }
              if (col.id === 'freezer-estoque') {
                return (
                  <button
                    onClick={() => handleCreateNewCard('freezer-estoque')}
                    className="icon-button"
                    title="Novo Cartão"
                    style={{ background: '#e07a5f', color: '#fff', padding: '4px 8px', fontSize: '11px', borderRadius: '6px' }}
                  >
                    <Plus size={14} style={{ marginRight: '4px' }} /> Novo
                  </button>
                );
              }
              if (col.id === 'cubas-saidas-vitrine' && user?.email && AUTHORIZED_EMAILS_TO_DELETE.includes(user.email)) {
                return (
                  <button
                    onClick={handleClearSaidas}
                    className="icon-button"
                    title="Limpar Arquivo"
                    style={{ background: '#f8fafc', color: '#64748b', padding: '4px 8px', fontSize: '11px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  >
                    <Trash2 size={14} style={{ marginRight: '4px' }} /> Limpar
                  </button>
                );
              }
              if (col.id === 'excluidos' && user?.email && AUTHORIZED_EMAILS_TO_DELETE.includes(user.email)) {
                return (
                  <button
                    onClick={handleClearExcluidos}
                    className="icon-button"
                    title="Limpar Histórico"
                    style={{ background: '#fef2f2', color: '#ef4444', padding: '4px 8px', fontSize: '11px', border: '1px solid #fecaca', borderRadius: '6px' }}
                  >
                    <Trash2 size={14} style={{ marginRight: '4px' }} /> Excluir
                  </button>
                );
              }
              return null;
            };

            const getSortIndicator = () => {
              if (col.id === 'quebras') {
                if (columnCards.some(c => c.id === movedCardId)) {
                  return (
                    <>
                      <Clock size={12} style={{ color: '#e07a5f' }} />
                      <span style={{ color: '#e07a5f', fontWeight: '600' }}>Organizando novo item...</span>
                    </>
                  );
                }
                return (
                  <>
                    <ArrowDownAz size={12} />
                    <span>Mais antigos no topo</span>
                  </>
                );
              } else if (col.id === 'freezer-estoque') {
                if (columnCards.some(c => c.id === movedCardId)) {
                  return (
                    <>
                      <Clock size={12} style={{ color: '#e07a5f' }} />
                      <span style={{ color: '#e07a5f', fontWeight: '600' }}>Organizando novo item...</span>
                    </>
                  );
                }
                return (
                  <>
                    <ArrowDownAz size={12} />
                    <span>Mais antigos no topo</span>
                  </>
                );
              } else if (col.id === 'vitrine-atual') {
                if (columnCards.some(c => c.id === movedCardId)) {
                  return (
                    <>
                      <Clock size={12} style={{ color: '#e07a5f' }} />
                      <span style={{ color: '#e07a5f', fontWeight: '600' }}>Organizando novo item...</span>
                    </>
                  );
                }
                return (
                  <>
                    <ArrowDownAz size={12} />
                    <span>Mais novos no topo</span>
                  </>
                );
              }
              return null;
            };

            return (
              <Column
                key={col.id}
                column={col}
                cards={columnCards}
                onCardClick={handleCardClick}
                movedCardId={movedCardId}
                moveDirection={moveDirection}
                action={getColumnAction()}
                sortIndicator={getSortIndicator()}
                groupByDate={col.id === 'cubas-saidas-vitrine' || col.id === 'excluidos'}
                vitrineFlavors={vitrineFlavors}
              />
            );
          })}
      </div>

      {isLogsOpen && (
        <div className="modal-backdrop" onClick={() => setIsLogsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            width: '90%',
            maxWidth: '1000px',
            height: '85vh',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Logs de Atividades</h3>
              <button onClick={() => setIsLogsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1, borderBottom: '1px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px 24px', color: '#64748b', fontWeight: '600', width: '140px' }}>Hora</th>
                    <th style={{ textAlign: 'left', padding: '12px 24px', color: '#64748b', fontWeight: '600', width: '120px' }}>Usuário</th>
                    <th style={{ textAlign: 'left', padding: '12px 24px', color: '#64748b', fontWeight: '600', minWidth: '180px' }}>Ação</th>
                    <th style={{ textAlign: 'left', padding: '12px 24px', color: '#64748b', fontWeight: '600', minWidth: '160px' }}>Cartão</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const groups: { [key: string]: typeof globalLogs } = {};
                    const sortedLogs = [...globalLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                    sortedLogs.slice(0, 100).forEach(log => {
                      const date = new Date(log.timestamp).toLocaleDateString('pt-BR');
                      const today = new Date().toLocaleDateString('pt-BR');
                      const key = date === today ? 'Hoje' : date;
                      if (!groups[key]) groups[key] = [];
                      groups[key].push(log);
                    });

                    return Object.entries(groups).map(([date, logs]) => (
                      <React.Fragment key={date}>
                        <tr style={{ background: '#f8fafc' }}>
                          <td colSpan={4} style={{ padding: '12px 24px', fontWeight: '800', color: '#1e293b', fontSize: '12px', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {date === 'Hoje' ? '📅 Hoje' : date}
                          </td>
                        </tr>
                        {logs.map((log, idx) => (
                          <tr key={`${date}-${idx}`} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} className="log-row">
                            <td style={{ padding: '12px 24px', color: '#334155', whiteSpace: 'nowrap' }}>
                              <span style={{ fontWeight: '600', color: '#1e293b' }}>
                                {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </td>
                            <td style={{ padding: '12px 24px', color: '#64748b' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '600', color: '#475569' }}>
                                  {getUserDisplayName(log.user).charAt(0).toUpperCase()}
                                </div>
                                {getUserDisplayName(log.user)}
                              </div>
                            </td>
                            <td style={{ padding: '12px 24px', color: '#334155' }}>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: log.action.includes('Criado') ? '#f0fdf4' : log.action.includes('Movido') ? '#eff6ff' : '#f8fafc',
                                color: log.action.includes('Criado') ? '#166534' : log.action.includes('Movido') ? '#1e40af' : '#475569',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                {log.action}
                              </span>
                            </td>
                            <td style={{ padding: '12px 24px', fontWeight: '600', color: '#0f172a' }}>
                              <button
                                onClick={() => {
                                  handleCardClick(log.card);
                                  setIsLogsOpen(false);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  color: 'var(--primary-color, #A07553)',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                  fontSize: '13px',
                                  textAlign: 'left'
                                }}
                              >
                                {log.cardTitle}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', textAlign: 'right' }}>
              <button onClick={() => setIsLogsOpen(false)} className="modal-btn modal-btn-secondary">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {editingCardId && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>{isCreating ? 'Novo Cartão' : 'Editar Cartão'}</h3>
              {!isCreating && (
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>
                    Criado por: <strong>{getUserDisplayName(editingCard?.createdBy)}</strong>
                  </span>
                  {editingCard?.createdAt && (
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {new Date(editingCard.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              )}
            </div>
            <label className="modal-label" htmlFor="card-title-input">
              Titulo
            </label>
            <select
              id="card-title-input"
              className="modal-input"
              value={editingTitle}
              onChange={(event) => setEditingTitle(event.target.value)}
              disabled={!isCreating && !isAuthorized}
            >
              <option value="" disabled>Selecione um sabor</option>
              {GELATO_FLAVORS.map(flavor => (
                <option key={flavor} value={flavor}>{flavor}</option>
              ))}
            </select>

            <div className="modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label className="modal-label" htmlFor="card-production-date-input">
                  {((isCreating && creatingInStatus === 'quebras') || (!isCreating && editingCard?.status === 'quebras')) ? 'Data de criação' : 'Data de produção'}
                </label>
                <input
                  id="card-production-date-input"
                  className="modal-input"
                  type="date"
                  value={editingProductionDate}
                  onChange={(event) => setEditingProductionDate(event.target.value)}
                  disabled={!isCreating && !isAuthorized}
                />
              </div>

              {(user?.email && AUTHORIZED_EMAILS_TO_DELETE.includes(user.email)) && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="modal-label" htmlFor="card-exit-date-input" style={{ margin: 0 }}>
                      Data de Saída (Adm)
                    </label>
                    {editingExitDate && (
                      <button
                        onClick={() => setEditingExitDate(null)}
                        style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                      >
                        Limpar Data
                      </button>
                    )}
                  </div>
                  <input
                    id="card-exit-date-input"
                    className="modal-input"
                    type="date"
                    value={editingExitDate || ''}
                    onChange={(event) => setEditingExitDate(event.target.value)}
                    style={{ borderColor: '#fecaca' }}
                  />
                </div>
              )}
            </div>



            {!isCreating && (
              <div className="modal-history-container">
                <span className="modal-readonly-label" style={{ display: 'block', marginBottom: '8px' }}>Histórico completo</span>
                <div className="modal-history-list">
                  {(editingCard?.history || []).slice().reverse().map((item, idx) => (
                    <div key={idx} className="modal-history-item">
                      <div className="modal-history-dot"></div>
                      <div className="modal-history-content">
                        <div className="modal-history-action">{item.action}</div>
                        <div className="modal-history-meta">
                          {new Date(item.timestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} • {getUserDisplayName(item.user)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <div>
                {(!isCreating && user?.email && AUTHORIZED_EMAILS_TO_DELETE.includes(user.email) && editingCard?.status !== 'excluidos') ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {editingCard?.status !== 'cubas-saidas-vitrine' && (
                      <button
                        type="button"
                        className="modal-btn"
                        style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={handleArchiveCard}
                      >
                        <Archive size={16} /> Arquivar
                      </button>
                    )}
                    <button
                      type="button"
                      className="modal-btn"
                      style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={handleMoveToHistory}
                    >
                      <Trash2 size={16} /> Excluir
                    </button>
                  </div>
                ) : <span />}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="modal-btn modal-btn-secondary" onClick={handleCloseModal}>
                  {(!isCreating && !isAuthorized) ? 'Fechar' : 'Cancelar'}
                </button>
                {(isCreating || isAuthorized) && (
                  <button type="button" className="modal-btn modal-btn-primary" onClick={handleSaveModal} disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </button>
                )}
              </div>
            </div>

            {!isCreating && (
              <div className="modal-movement-actions" style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                {editingCard?.status === 'quebras' && (
                  <button
                    type="button"
                    className="move-btn"
                    style={{ flex: 1, padding: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '4px', fontWeight: '600' }}
                    onClick={async () => { if (editingCard) await handleConsumeQuebra(editingCard); }}
                  >
                    Quebra Consumida <Trash2 size={16} style={{ marginLeft: '4px' }} />
                  </button>
                )}
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
                {editingCard?.status === 'cubas-saidas-vitrine' && (
                  <button
                    type="button"
                    className="move-btn"
                    style={{ flex: 1, padding: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    onClick={async () => { await handleMoveCard(editingCard, 'vitrine-atual'); handleCloseModal(); }}
                  >
                    <ArrowLeft size={16} /> Voltar para Vitrine
                  </button>
                )}
                {editingCard?.status === 'excluidos' && (
                  <button
                    type="button"
                    className="move-btn"
                    style={{ flex: 1, padding: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '4px' }}
                    onClick={handleDeletePermanent}
                  >
                    <Trash2 size={16} /> Deletar permanentemente
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {quebraConfirmData && (
        <div className="modal-backdrop" onClick={() => handleConfirmQuebraDialog(false)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚨</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b', fontWeight: 600 }}>Registro de Quebra</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              O sabor <strong>{quebraConfirmData.card.title}</strong> gerou quebra ao sair da vitrine?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                className="modal-btn modal-btn-secondary"
                style={{ flex: 1, padding: '10px', fontWeight: 600 }}
                onClick={() => handleConfirmQuebraDialog(false)}
              >
                Não
              </button>
              <button
                type="button"
                className="modal-btn"
                style={{ flex: 1, padding: '10px', fontWeight: 600, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => handleConfirmQuebraDialog(true)}
              >
                Sim, Gerou Quebra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
