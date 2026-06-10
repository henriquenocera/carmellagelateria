import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import * as Icons from 'react-icons/bs';
import { useAuth } from '../AuthProvider';
import supabase from '../services/supabase-client';
import '../css/Frequencia.css';

const ProdutosVale = () => {
  const { user, isAdmin } = useAuth();

  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  
  // Form state
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchProdutos();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos_vale')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setProdutos(data || []);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      alert('Erro ao buscar produtos do vale.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (produto: any = null) => {
    if (produto) {
      setEditId(produto.id);
      setNome(produto.nome);
      setValor(produto.valor.toString());
    } else {
      setEditId(null);
      setNome('');
      setValor('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !valor) {
      alert('Preencha o nome e o valor.');
      return;
    }

    setSubmitting(true);

    try {
      const valorNumerico = parseFloat(valor.replace(',', '.'));
      if (isNaN(valorNumerico)) {
        throw new Error("Valor inválido");
      }

      if (editId) {
        const { error } = await supabase
          .from('produtos_vale')
          .update({ nome: nome.trim(), valor: valorNumerico })
          .eq('id', editId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('produtos_vale')
          .insert([{ nome: nome.trim(), valor: valorNumerico }]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchProdutos();

    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      alert(err.message || 'Erro ao salvar o produto.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: "Deseja realmente excluir este produto?",
      onConfirm: async () => {
        setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} });
        try {
          setLoading(true);
          const { error } = await supabase
            .from('produtos_vale')
            .delete()
            .eq('id', id);

          if (error) throw error;
          fetchProdutos();
        } catch (err) {
          console.error('Erro ao excluir:', err);
          alert('Erro ao excluir o produto.');
          setLoading(false);
        }
      }
    });
  };

  if (!isAdmin && !loading) {
    return (
      <div className="frequencia-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Icons.BsShieldLock size={50} color="#dc2626" style={{ marginBottom: 20 }} />
          <h2>Acesso Negado</h2>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)' }}>Você não tem permissão de administrador para acessar esta página.</p>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginTop: 10 }}>Logado como: {user?.email}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Produtos Vale</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="frequencia-title-group">
            <h1>Produtos Vale</h1>
            <p>Gerencie os produtos disponíveis para os vales.</p>
          </div>
          <button className="primary-btn" onClick={() => openModal()}>
            <Icons.BsPlusLg style={{ marginRight: '8px' }} />
            Novo Produto
          </button>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : produtos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fff", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <Icons.BsBoxSeam style={{ fontSize: "3rem", color: "#94a3b8", marginBottom: "16px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "1.4rem" }}>Nenhum produto cadastrado para vale.</p>
            </div>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "600px" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Nome do Produto</th>
                    <th style={{ textAlign: "right", width: "150px" }}>Valor (R$)</th>
                    <th style={{ textAlign: "center", width: "120px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map(produto => (
                    <tr key={produto.id}>
                      <td style={{ fontWeight: 500 }}>{produto.nome}</td>
                      <td style={{ textAlign: "right", color: "var(--primary-color)", fontWeight: "bold" }}>
                        R$ {Number(produto.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                        <button
                          onClick={() => openModal(produto)}
                          className="delete-record-btn"
                          title="Editar Produto"
                          style={{ margin: 0, color: "#3b82f6" }}
                        >
                          <Icons.BsPencil />
                        </button>
                        <button
                          onClick={() => handleDelete(produto.id)}
                          className="delete-record-btn"
                          title="Excluir Produto"
                          style={{ margin: 0 }}
                        >
                          <Icons.BsTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "var(--secondary-color)" }}>
                {editId ? "Editar Produto do Vale" : "Cadastrar Novo Produto"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <Icons.BsX />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)" }}>Nome do Produto *</label>
                    <input
                      type="text"
                      required
                      className="frequencia-select"
                      placeholder="Ex: Pote 1L"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      style={{ background: "#fff" }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)" }}>Valor (R$) *</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <span style={{ position: "absolute", left: "12px", color: "var(--text-muted)", zIndex: 1, pointerEvents: "none", fontSize: "1.3rem" }}>R$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        className="frequencia-select"
                        placeholder="0,00"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        style={{ paddingLeft: "36px", background: "#fff" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: "8px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                  Cancelar
                </button>
                <button type="submit" disabled={submitting} className="primary-btn">
                  {submitting ? "Salvando..." : "Salvar Produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: "400px", textAlign: "center", padding: "30px" }}>
            <h3 style={{ fontSize: "1.8rem", color: "var(--secondary-color)", margin: "0 0 16px 0" }}>Atenção</h3>
            <p style={{ fontSize: "1.4rem", color: "var(--text-muted)", margin: "0 0 24px 0" }}>{confirmModal.message}</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button 
                onClick={() => setConfirmModal({ isOpen: false, message: "", onConfirm: () => {} })}
                style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#fff", color: "#475569", cursor: "pointer", fontSize: "1.3rem", fontWeight: "bold" }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmModal.onConfirm}
                style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "var(--primary-color)", color: "#fff", cursor: "pointer", fontSize: "1.3rem", fontWeight: "bold" }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProdutosVale;
