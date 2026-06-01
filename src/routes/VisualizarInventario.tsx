import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Icons from 'react-icons/bs';
import { useAuth } from '../components/AuthProvider.tsx';
import supabase from '../supabase-client';
import '../css/NovoInventario.css'; // Reutilizamos os estilos

const VisualizarInventario = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const queryUnidade = searchParams.get('unidade') || 'Loja Ahú';
  const queryCreatedAt = searchParams.get('created_at');
  
  const [dataInventario, setDataInventario] = useState('');
  const [responsavel, setResponsavel] = useState('Sistema');
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const getUnidadeConfig = (unidadeName) => {
    switch(unidadeName) {
      case 'Loja Ahú': return { key: 'ahu', dbName: 'Loja Ahú' };
      case 'Loja Alto XV': return { key: 'altoxv', dbName: 'Loja Alto XV' };
      case 'Fábrica': return { key: 'fabrica', dbName: 'Fábrica' };
      case 'Estoque MH': return { key: 'mh', dbName: 'Estoque MH' };
      default: return { key: 'ahu', dbName: 'Loja Ahú' };
    }
  };

  const { dbName } = getUnidadeConfig(queryUnidade);

  useEffect(() => {
    if (!queryCreatedAt) {
      setErrorMsg('Data do inventário não fornecida.');
      setLoading(false);
      return;
    }
    fetchInventario();
  }, [queryUnidade, queryCreatedAt]);

  const fetchInventario = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      // 1. Buscar os registros deste inventário
      const { data: registros, error: regError } = await supabase
        .from('inventario_insumos')
        .select('*')
        .eq('unidade', dbName)
        .eq('created_at', queryCreatedAt);

      if (regError) throw regError;
      if (!registros || registros.length === 0) {
        setErrorMsg('Nenhum registro encontrado para este inventário.');
        setLoading(false);
        return;
      }

      // Configurar dados gerais usando o primeiro registro
      const firstRow = registros[0];
      
      // Ajustar dataInventario
      if (firstRow.data_inventario) {
        // Se for um timestamp, cortamos para data, senão usamos direto
        setDataInventario(firstRow.data_inventario.split('T')[0]);
      } else {
        setDataInventario(firstRow.created_at.split('T')[0]);
      }

      // Se o ID do usuário que salvou for igual ao usuário atual, exibimos o email dele
      if (firstRow.user_id && user && firstRow.user_id === user.id) {
        setResponsavel(user.email);
      } else {
        setResponsavel(firstRow.user_id ? 'Usuário Autenticado' : 'Sistema');
      }

      // 2. Buscar o cadastro de insumos para cruzar as informações (nome, tipo, etc)
      const { data: insumosData, error: insError } = await supabase
        .from('cadastro_insumos')
        .select('*');

      if (insError) throw insError;

      // 3. Mesclar os dados e ordenar
      const mergedData = registros.map(reg => {
        const insumo = insumosData.find(i => i.id === reg.insumo_id) || {};
        return {
          id: reg.insumo_id,
          nome: insumo.nome || 'Insumo Desconhecido',
          tipo: insumo.tipo || '-',
          unidade_conversao: insumo.unidade_conversao || '-',
          ordem: insumo.ordem || 9999,
          quantidade_salva: reg.quantidade
        };
      });

      // Ordenar respeitando a coluna 'ordem' do banco
      mergedData.sort((a, b) => a.ordem - b.ordem);

      setItens(mergedData);

    } catch (err) {
      console.error('Erro ao carregar inventário:', err);
      setErrorMsg('Erro ao buscar as informações do inventário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Visualizar Inventário | {queryUnidade}</title>
      </Helmet>

      <div className="novo-inv-container">
        
        <div className="novo-inv-header">
          <div className="novo-inv-header-titles">
            <h1>Contagem de Estoque</h1>
            <p>Unidade: <strong>{queryUnidade}</strong></p>
          </div>
        </div>

        {errorMsg && (
          <div className="novo-inv-alert-error">
            {errorMsg}
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
              value={responsavel} 
              readOnly 
              style={{ backgroundColor: '#f9fafb', cursor: 'default' }}
            />
          </div>
        </div>

        {loading ? (
          <p style={{textAlign: 'center', padding: '40px'}}>Carregando inventário...</p>
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
                  {itens.length === 0 && !errorMsg && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', color: '#888' }}>
                        Nenhum insumo encontrado.
                      </td>
                    </tr>
                  )}
                  {itens.filter(i => i.tipo !== 'Bebidas').map((item, index) => (
                    <tr key={`non-bebidas-${index}`}>
                      <td className="align-left">
                        {item.nome}
                      </td>
                      <td className="align-center text-blue">{item.tipo}</td>
                      <td className="align-center">
                        <input 
                          type="text" 
                          className="novo-inv-qty-input"
                          value={item.quantidade_salva}
                          readOnly
                          style={{ backgroundColor: '#f9fafb', cursor: 'default' }}
                        />
                      </td>
                    </tr>
                  ))}

                  {itens.some(i => i.tipo === 'Bebidas') && (
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
                      {itens.filter(i => i.tipo === 'Bebidas').map((item, index) => (
                        <tr key={`bebidas-${index}`}>
                          <td className="align-left">
                            {item.nome}
                          </td>
                          <td className="align-center text-blue">{item.tipo}</td>
                          <td className="align-center">
                            <input 
                              type="text" 
                              className="novo-inv-qty-input"
                              value={item.quantidade_salva}
                              readOnly
                              style={{ backgroundColor: '#f9fafb', cursor: 'default' }}
                            />
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
            style={{ padding: '12px 30px' }}
          >
            <Icons.BsArrowLeft style={{marginRight: '8px', verticalAlign: 'middle'}}/>
            Voltar
          </button>
        </div>

      </div>
    </>
  );
};

export default VisualizarInventario;
