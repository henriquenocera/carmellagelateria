import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Icons from 'react-icons/bs';
import { useAuth } from '../components/AuthProvider.tsx';
import supabase from '../supabase-client';
import '../css/NovoInventario.css';

const NovoInventario = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const queryUnidade = searchParams.get('unidade') || 'Loja Ahú';
  
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
      case 'Loja Ahú': return { key: 'ahu', dbName: 'Loja Ahú' };
      case 'Loja Alto XV': return { key: 'altoxv', dbName: 'Loja Alto XV' };
      case 'Fábrica': return { key: 'fabrica', dbName: 'Fábrica' };
      case 'Estoque MH': return { key: 'mh', dbName: 'Estoque MH' };
      default: return { key: 'ahu', dbName: 'Loja Ahú' };
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
      setQuantidades(initialQtys);

    } catch (err) {
      console.error('Erro ao carregar insumos:', err);
      setMessage({ type: 'error', text: 'Erro ao buscar lista de insumos. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = (id, value) => {
    setQuantidades(prev => ({
      ...prev,
      [id]: value
    }));
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
        .insert(registros);

      if (error) throw error;

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
                    <th className="align-center">EMBALAGEM</th>
                    <th className="align-center">QUANTIDADE CONTADA</th>
                  </tr>
                </thead>
                <tbody>
                  {insumos.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: '#888' }}>
                        Nenhum insumo configurado como ativo para esta unidade.
                      </td>
                    </tr>
                  )}
                  {insumos.map(insumo => (
                    <tr key={insumo.id}>
                      <td className="align-left">
                        {insumo.nome}
                      </td>
                      <td className="align-center text-blue">{insumo.tipo}</td>
                      <td className="align-center text-blue">{insumo.unidade_conversao}</td>
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
