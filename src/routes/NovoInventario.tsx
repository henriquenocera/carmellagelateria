import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Icons from 'react-icons/bs';
import { useAuth } from '../components/AuthProvider.tsx';
import supabase from '../supabase-client';
import { STORE_CONFIG } from '../config/store.js';
import '../css/NovoInventario.css';

const NovoInventario = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const queryUnidade = searchParams.get('unidade') || STORE_CONFIG.name;
  
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const exactTimestamp = now.toISOString();
  
  const [dataInventario] = useState(exactTimestamp.split('T')[0]);
  const [insumos, setInsumos] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const getUnidadeConfig = (unidadeName) => {
    switch(unidadeName) {
      case STORE_CONFIG.name: return { key: STORE_CONFIG.key, dbName: STORE_CONFIG.name };
      case 'Loja Alto XV': return { key: 'altoxv', dbName: 'Loja Alto XV' };
      case 'Fábrica': return { key: 'fabrica', dbName: 'Fábrica' };
      case 'Estoque MH': return { key: 'mh', dbName: 'Estoque MH' };
      default: return { key: STORE_CONFIG.key, dbName: STORE_CONFIG.name };
    }
  };

  const { key: configKey, dbName } = getUnidadeConfig(queryUnidade);

  useEffect(() => {
    fetchInsumosAtivos();
  }, [configKey]);

  const fetchInsumosAtivos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cadastro_insumos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;

      const ativosNaUnidade = (data || []).filter(item => {
        return item.config_estoque && 
               item.config_estoque[configKey] && 
               item.config_estoque[configKey].ativo === true;
      });

      setInsumos(ativosNaUnidade);
      
      const initialQtys = {};
      ativosNaUnidade.forEach(item => {
        initialQtys[item.id] = '';
      });

      const savedDraft = localStorage.getItem(`draft_inventario_${configKey}`);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setQuantidades({ ...initialQtys, ...parsed });
        } catch (e) {
          setQuantidades(initialQtys);
        }
      } else {
        setQuantidades(initialQtys);
      }

    } catch (err) {
      console.error('Erro ao carregar insumos:', err);
      setMessage({ type: 'error', text: 'Erro ao buscar lista de insumos. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = (id, value) => {
    setQuantidades(prev => {
      const newQtys = {
        ...prev,
        [id]: value
      };
      localStorage.setItem(`draft_inventario_${configKey}`, JSON.stringify(newQtys));
      return newQtys;
    });
  };

  const getPctStyles = (pct) => {
    if (pct === "") return { bg: "#ffffff", color: "#444444" };
    const num = Number(pct);
    if (num === 0) return { bg: "#4a3b32", color: "#fef08a" };
    if (num === 25) return { bg: "#fed7aa", color: "#9a3412" }; 
    if (num === 50) return { bg: "#fde68a", color: "#92400e" };
    if (num === 75) return { bg: "#bae6fd", color: "#0369a1" };
    if (num === 100) return { bg: "#dcfce7", color: "#166534" };
    return { bg: "#ffffff", color: "#444444" };
  };

  const getTagStyles = (tipo) => {
    switch (tipo) {
      case "Insumos": return { bg: "#e0f2fe", color: "#0284c7", border: "#bae6fd" };
      case "Matéria Prima": return { bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" };
      case "Bebidas": return { bg: "#f3e8ff", color: "#9333ea", border: "#e9d5ff" };
      case "Material de Limpeza": return { bg: "#ccfbf1", color: "#0d9488", border: "#99f6e4" };
      case "Salgados": return { bg: "#ffedd5", color: "#ea580c", border: "#fed7aa" };
      default: return { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" };
    }
  };

  const handleSave = async () => {
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const registros = [];
    
    for (const [insumo_id, qty] of Object.entries(quantidades)) {
      if (qty !== '') {
        registros.push({
          insumo_id: insumo_id,
          data_inventario: exactTimestamp,
          unidade: dbName,
          quantidade: Number(qty),
          user_id: user ? user.id : null
        });
      }
    }

    if (registros.length === 0) {
      setMessage({ type: 'error', text: 'Preencha pelo menos um insumo para salvar o inventário.' });
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('inventario_insumos')
        .upsert(registros, { onConflict: 'insumo_id,unidade,data_inventario' });

      if (error) throw error;

      localStorage.removeItem(`draft_inventario_${configKey}`);
      setMessage({ type: 'success', text: 'Inventário salvo com sucesso!' });
      
      setTimeout(() => {
        navigate('/inventario');
      }, 2000);

    } catch (err) {
      console.error('Erro ao salvar:', err);
      setMessage({ type: 'error', text: 'Ocorreu um erro ao salvar o inventário.' });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Novo Inventário | {queryUnidade}</title>
      </Helmet>

      <div className="novo-inv-container">
        
        <div className="novo-inv-header">
          <div className="novo-inv-header-titles">
            <h1>Contagem de Estoque</h1>
            <p>Unidade: <strong>{queryUnidade}</strong></p>
          </div>
          <button 
            className="novo-inv-btn-cancel"
            onClick={() => navigate('/inventario')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', margin: 0 }}
          >
            <Icons.BsArrowLeft /> Voltar
          </button>
        </div>

        {message.text && (
          <div className={message.type === 'success' ? 'novo-inv-alert-success' : 'novo-inv-alert-error'}>
            {message.text}
          </div>
        )}

        <div className="novo-inv-controls">
          <div className="novo-inv-input-group">
            <label>Data do Inventário</label>
            <input 
              type="date" 
              value={dataInventario} 
              readOnly 
            />
          </div>
          
          <div className="novo-inv-input-group">
            <label>Responsável</label>
            <input 
              type="text" 
              value={user ? user.email : 'Carregando...'} 
              readOnly 
            />
          </div>
        </div>

        {loading ? (
          <p style={{textAlign: 'center', padding: '40px'}}>Carregando insumos...</p>
        ) : (
          <div className="novo-inv-card">
            <div className="novo-inv-table-wrapper">
              <table className="novo-inv-table">
                <thead>
                  <tr>
                    <th className="align-left">INSUMO</th>
                    <th className="align-center">TIPO</th>
                    <th className="align-center">QUANTIDADE CONTADA</th>
                  </tr>
                </thead>
                <tbody>
                  {insumos.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', color: '#888' }}>
                        Nenhum insumo configurado como ativo para esta unidade.
                      </td>
                    </tr>
                  )}
                  {insumos.filter(i => !i.inventario_especial && i.tipo !== 'Bebidas' && i.tipo !== 'Salgados').map(insumo => (
                    <tr key={insumo.id}>
                      <td className="align-left">
                        {insumo.nome}
                      </td>
                      <td className="align-center">
                        <span style={{
                          padding: "6px 12px", 
                          backgroundColor: getTagStyles(insumo.tipo).bg, 
                          borderRadius: "6px", 
                          fontSize: "13px", 
                          fontWeight: 600,
                          color: getTagStyles(insumo.tipo).color,
                          border: `1px solid ${getTagStyles(insumo.tipo).border}`
                        }}>
                          {insumo.tipo || "-"}
                        </span>
                      </td>
                      <td className="align-center">
                        <input 
                          type="number" 
                          min="0"
                          step="0.01"
                          placeholder="Qtd"
                          className="novo-inv-qty-input"
                          value={quantidades[insumo.id]}
                          onChange={(e) => handleQtyChange(insumo.id, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}

                  {insumos.some(i => !i.inventario_especial && i.tipo === 'Salgados') && (
                    <>
                      <tr>
                        <td colSpan="3" style={{ backgroundColor: '#fff8f3', padding: '15px 20px', borderTop: '2px solid #efe5d9', borderBottom: '2px solid #efe5d9' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <strong style={{ color: '#8c6748', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Agrupamento: Salgados</strong>
                            <span style={{ color: '#d97706', fontSize: '13px', fontWeight: '500' }}>
                              ⚠️ Aviso: Realizar contagem de todo o estoque Freezer + Geladeira
                            </span>
                          </div>
                        </td>
                      </tr>
                      {insumos.filter(i => !i.inventario_especial && i.tipo === 'Salgados').map(insumo => (
                        <tr key={insumo.id}>
                          <td className="align-left">
                            {insumo.nome}
                          </td>
                          <td className="align-center">
                        <span style={{
                          padding: "6px 12px", 
                          backgroundColor: getTagStyles(insumo.tipo).bg, 
                          borderRadius: "6px", 
                          fontSize: "13px", 
                          fontWeight: 600,
                          color: getTagStyles(insumo.tipo).color,
                          border: `1px solid ${getTagStyles(insumo.tipo).border}`
                        }}>
                          {insumo.tipo || "-"}
                        </span>
                      </td>
                          <td className="align-center">
                            <input 
                              type="number" 
                              min="0"
                              step="0.01"
                              placeholder="Qtd"
                              className="novo-inv-qty-input"
                              value={quantidades[insumo.id]}
                              onChange={(e) => handleQtyChange(insumo.id, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </>
                  )}

                  {insumos.some(i => !i.inventario_especial && i.tipo === 'Bebidas') && (
                    <>
                      <tr>
                        <td colSpan="3" style={{ backgroundColor: '#fff8f3', padding: '15px 20px', borderTop: '2px solid #efe5d9', borderBottom: '2px solid #efe5d9' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <strong style={{ color: '#8c6748', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Agrupamento: Bebidas</strong>
                            <span style={{ color: '#d97706', fontSize: '13px', fontWeight: '500' }}>
                              ⚠️ Aviso: Realizar contagem do Estoque Fechado + Geladeira Coca
                            </span>
                          </div>
                        </td>
                      </tr>
                      {insumos.filter(i => !i.inventario_especial && i.tipo === 'Bebidas').map(insumo => (
                        <tr key={insumo.id}>
                          <td className="align-left">
                            {insumo.nome}
                          </td>
                          <td className="align-center">
                        <span style={{
                          padding: "6px 12px", 
                          backgroundColor: getTagStyles(insumo.tipo).bg, 
                          borderRadius: "6px", 
                          fontSize: "13px", 
                          fontWeight: 600,
                          color: getTagStyles(insumo.tipo).color,
                          border: `1px solid ${getTagStyles(insumo.tipo).border}`
                        }}>
                          {insumo.tipo || "-"}
                        </span>
                      </td>
                          <td className="align-center">
                            <input 
                              type="number" 
                              min="0"
                              step="0.01"
                              placeholder="Qtd"
                              className="novo-inv-qty-input"
                              value={quantidades[insumo.id]}
                              onChange={(e) => handleQtyChange(insumo.id, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </>
                  )}

                  {insumos.some(i => i.inventario_especial) && (
                    <>
                      <tr>
                        <td colSpan="3" style={{ backgroundColor: '#fff8f3', padding: '15px 20px', borderTop: '2px solid #efe5d9', borderBottom: '2px solid #efe5d9' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <strong style={{ color: '#8c6748', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Agrupamento: Itens abertos</strong>
                            <span style={{ color: '#d97706', fontSize: '13px', fontWeight: '500' }}>
                              ⚠️ Aviso: Informar a porcentagem visual de cada item.
                            </span>
                          </div>
                        </td>
                      </tr>
                      {insumos.filter(i => i.inventario_especial).map(insumo => (
                        <tr key={insumo.id}>
                          <td className="align-left">
                            {insumo.nome}
                          </td>
                          <td className="align-center">
                        <span style={{
                          padding: "6px 12px", 
                          backgroundColor: getTagStyles(insumo.tipo).bg, 
                          borderRadius: "6px", 
                          fontSize: "13px", 
                          fontWeight: 600,
                          color: getTagStyles(insumo.tipo).color,
                          border: `1px solid ${getTagStyles(insumo.tipo).border}`
                        }}>
                          {insumo.tipo || "-"}
                        </span>
                      </td>
                          <td className="align-center">
                            <select
                              className="novo-inv-qty-input"
                              value={quantidades[insumo.id]}
                              onChange={(e) => handleQtyChange(insumo.id, e.target.value)}
                              style={{ 
                                padding: "8px", 
                                borderRadius: "20px", 
                                border: "1px solid #d1d5db", 
                                minWidth: "120px", 
                                textAlign: "center",
                                backgroundColor: getPctStyles(quantidades[insumo.id]).bg,
                                color: getPctStyles(quantidades[insumo.id]).color,
                                fontWeight: "bold"
                              }}
                            >
                              <option value="">Sel.</option>
                              {[0, 25, 50, 75, 100].map(pct => (
                                <option key={pct} value={pct}>{pct}%</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="novo-inv-footer">
          <button 
            className="novo-inv-btn-cancel"
            onClick={() => navigate('/inventario')}
          >
            Cancelar
          </button>
          <button 
            className="novo-inv-btn-save"
            onClick={handleSave}
            disabled={submitting || loading || insumos.length === 0}
          >
            {submitting ? 'Salvando...' : 'Concluir Inventário'}
          </button>
        </div>

      </div>
    </>
  );
};

export default NovoInventario;
