import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'react-icons/bs';
import { useAuth } from '../components/AuthProvider.tsx';
import supabase from '../supabase-client';
import { STORE_CONFIG } from '../config/store.js';
import '../css/InventarioDashboard.css';

const Inventario = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(STORE_CONFIG.name);
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const tabs = [STORE_CONFIG.name];

  useEffect(() => {
    fetchInventories(activeTab);
  }, [activeTab]);

  const fetchInventories = async (tab) => {
    setLoading(true);
    // A busca agora usa exatamente o nome da aba como está salvo no banco
    let unidadeBusca = tab;

    try {
      const { data, error } = await supabase
        .from('inventario_insumos')
        .select('*, user:user_id (email)') // Assuming user_id can join to auth.users? Supabase blocks auth.users join by default unless a public profile table exists. We'll just fetch user_id.
        .eq('unidade', unidadeBusca)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by data_inventario
      const grouped = {};
      (data || []).forEach(item => {
        const batchId = item.created_at; // The exact millisecond they saved
        if (!grouped[batchId]) {
          grouped[batchId] = {
            data_inventario: item.data_inventario,
            created_at: item.created_at,
            insumos_count: 0,
            user_id: item.user_id
          };
        }
        grouped[batchId].insumos_count += 1;
      });

      // Converte objeto agrupado para array ordenado cronologicamente (crescente)
      const groupedArray = Object.values(grouped).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setInventories(groupedArray);

    } catch (err) {
      console.error('Erro ao buscar inventários:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (dateString.includes('T')) {
      const date = new Date(dateString);
      return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const maxRecent = 3;
  const recentInventories = inventories.slice(-maxRecent);
  const oldInventoriesCount = inventories.length - recentInventories.length;

  return (
    <>
      <Helmet>
        <title>Inventário de Insumos</title>
      </Helmet>
      
      <div className="inv-dashboard-container">
        <div className="inv-dashboard-header">
          <h1>Inventário de Insumos</h1>
          <p>Realize a contagem "cega" do estoque. Os valores salvos aqui servirão como marco inicial para os cálculos dinâmicos de estoque.</p>
        </div>

        <div className="inv-dashboard-controls">
          <div className="inv-tabs">
            {tabs.map(tab => (
              <button 
                key={tab} 
                className={`inv-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="inv-actions">
            <button 
              className="inv-btn-primary"
              onClick={() => navigate(`/inventario/novo?unidade=${activeTab}`)}
            >
              <Icons.BsPlus /> Novo Inventário
            </button>
          </div>
        </div>

        <div className="inv-cards-grid">
          {/* Card de Inventários Antigos */}
          {!loading && oldInventoriesCount > 0 && (
            <div className="inv-card inv-card-antigos" onClick={() => setShowModal(true)}>
              <div className="inv-antigos-icon">
                <Icons.BsArchiveFill />
              </div>
              <div className="inv-antigos-info">
                <h3>Inventários Antigos</h3>
                <p>Ver +{oldInventoriesCount} registros anteriores</p>
              </div>
            </div>
          )}

          {/* Cards de Histórico Recentes */}
          {!loading && recentInventories.map((inv) => (
            <div className="inv-card" key={inv.created_at}>
              <div className="inv-card-top">
                <div className="inv-date-icon">
                  <Icons.BsCalendarCheck />
                </div>
                <div className="inv-date-info">
                  <h4>Data do Inventário</h4>
                  <h2>{formatDate(inv.data_inventario)}</h2>
                </div>
              </div>
              
              <div className="inv-card-bottom">
                <div className="inv-stats">
                  <div className="inv-stat-item">
                    <Icons.BsBoxSeam /> {inv.insumos_count} insumos salvos
                  </div>
                  <div className="inv-stat-item">
                    <Icons.BsPerson /> Feito por Henrique
                  </div>
                  <div className="inv-stat-item">
                    <Icons.BsClock /> Em {formatDateTime(inv.created_at)}
                  </div>
                </div>
                
                <div 
                  className="inv-view-link"
                  onClick={() => navigate(`/inventario/visualizar?unidade=${encodeURIComponent(activeTab)}&created_at=${encodeURIComponent(inv.created_at)}`)}
                >
                  Visualizar <Icons.BsArrowRight />
                </div>
              </div>
            </div>
          ))}

          {/* Card de Novo Inventário (no final) */}
          <div 
            className="inv-card-dashed"
            onClick={() => navigate(`/inventario/novo?unidade=${activeTab}`)}
          >
            <Icons.BsPlusCircle />
            <span>Iniciar Novo Inventário</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="inv-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="inv-modal-content" onClick={e => e.stopPropagation()}>
            <div className="inv-modal-header">
              <div className="inv-modal-title">
                <Icons.BsArchiveFill style={{color: '#a37a57'}} /> 
                <h2>Inventários Antigos</h2>
              </div>
              <button className="inv-modal-close" onClick={() => setShowModal(false)}><Icons.BsX /></button>
            </div>
            
            <p className="inv-modal-subtitle">Selecione uma data anterior para visualizar a contagem de estoque.</p>
            
            <div className="inv-modal-list">
              {inventories.slice(0, oldInventoriesCount).reverse().map(inv => (
                <div 
                  key={inv.created_at} 
                  className="inv-modal-item"
                  onClick={() => navigate(`/inventario/visualizar?unidade=${encodeURIComponent(activeTab)}&created_at=${encodeURIComponent(inv.created_at)}`)}
                >
                  <div className="inv-modal-item-left">
                    <Icons.BsCalendarCheck style={{color: '#a37a57', fontSize: '18px'}} />
                    <strong>{formatDate(inv.data_inventario)}</strong>
                  </div>
                  <div className="inv-modal-item-right">
                    {inv.insumos_count} itens
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Inventario;
