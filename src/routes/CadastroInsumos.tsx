import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/Frequencia.css";

function CadastroInsumos() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [insumos, setInsumos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [novoNome, setNovoNome] = useState("");
  const [novaQtdConversao, setNovaQtdConversao] = useState("");
  const [novaUnidadeConversao, setNovaUnidadeConversao] = useState("");
  const [novoCustoConsiderado, setNovoCustoConsiderado] = useState("");
  const [novoNomeSimples, setNovoNomeSimples] = useState("");
  const [novoTipo, setNovoTipo] = useState("");
  const [novoFornecedor, setNovoFornecedor] = useState("");
  const [novoFatorDesperdicio, setNovoFatorDesperdicio] = useState("0");
  const [novoInventarioEspecial, setNovoInventarioEspecial] = useState(false);
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    if (isAdmin === false) {
      navigate("/");
    } else if (isAdmin === true) {
      fetchInsumos();
    }
  }, [isAdmin, navigate]);

  async function fetchInsumos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cadastro_insumos")
        .select("*")
        .order("ordem", { ascending: true })
        .order("nome", { ascending: true });

      if (error) throw error;
      setInsumos(data || []);
    } catch (err) {
      console.error("Erro ao buscar insumos:", err);
      alert("Erro ao buscar insumos. Verifique se as colunas no banco foram atualizadas.");
    } finally {
      setLoading(false);
    }
  }

  const openModal = (insumo?: any) => {
    if (insumo) {
      setEditingId(insumo.id);
      setNovoNome(insumo.nome);
      setNovoNomeSimples(insumo.nome_simples_unitario || "");
      setNovoTipo(insumo.tipo || "");
      setNovoFornecedor(insumo.fornecedor_padrao || "");
      setNovaQtdConversao(insumo.quantidade_conversao !== null ? insumo.quantidade_conversao.toString() : "");
      setNovaUnidadeConversao(insumo.unidade_conversao || "");
      setNovoCustoConsiderado(insumo.custo_considerado !== null ? insumo.custo_considerado.toString() : "");
      setNovoFatorDesperdicio(insumo.fator_desperdicio !== null ? insumo.fator_desperdicio.toString() : "0");
      setNovoInventarioEspecial(insumo.inventario_especial || false);
      setAtivo(insumo.ativo ?? true);
    } else {
      setEditingId(null);
      setNovoNome("");
      setNovoNomeSimples("");
      setNovoTipo("");
      setNovoFornecedor("");
      setNovaQtdConversao("");
      setNovaUnidadeConversao("");
      setNovoCustoConsiderado("");
      setNovoFatorDesperdicio("0");
      setNovoInventarioEspecial(false);
      setAtivo(true);
    }
    setIsModalOpen(true);
  };

  async function handleToggleAtivo(id: string, currentAtivo: boolean) {
    try {
      setLoading(true);
      const { error } = await supabase.from("cadastro_insumos").update({ ativo: !currentAtivo }).eq("id", id);
      if (error) throw error;
      fetchInsumos();
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      alert("Erro ao alterar o status do insumo.");
      setLoading(false);
    }
  }

  async function handleSaveInsumo(e: React.FormEvent) {
    e.preventDefault();
    if (!novoNome.trim()) {
      alert("Preencha o nome do insumo.");
      return;
    }

    const nomeFormatado = novoNome.trim();
    const nomeJaExiste = insumos.some(
      (ins) => ins.id !== editingId && ins.nome.toLowerCase() === nomeFormatado.toLowerCase()
    );

    if (nomeJaExiste) {
      alert("Já existe um insumo cadastrado com este nome!");
      return;
    }

    try {
      setSaving(true);
      
      const qtd = novaQtdConversao ? parseFloat(novaQtdConversao) : null;
      const custoEmb = novoCustoConsiderado ? parseFloat(novoCustoConsiderado) : null;
      let custoUnit = null;
      if (qtd && custoEmb && qtd > 0) {
        custoUnit = parseFloat((custoEmb / qtd).toFixed(2));
      }

      const payload = {
        nome: novoNome.trim(),
        ativo: ativo,
        quantidade_conversao: qtd,
        unidade_conversao: novaUnidadeConversao.trim(),
        custo_considerado: custoEmb,
        custo_considerado_unitario: custoUnit,
        nome_simples_unitario: novoNomeSimples.trim(),
        tipo: novoTipo.trim(),
        fornecedor_padrao: novoFornecedor.trim(),
        fator_desperdicio: parseFloat(novoFatorDesperdicio) || 0,
        inventario_especial: novoInventarioEspecial
      };

      if (editingId) {
        const { error } = await supabase
          .from("cadastro_insumos")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const maxOrdem = insumos.length > 0 ? Math.max(...insumos.map(i => i.ordem || 0)) : 0;
        const { error } = await supabase
          .from("cadastro_insumos")
          .insert([{ ...payload, ordem: maxOrdem + 1 }]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchInsumos();
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      alert(err.message || "Erro ao salvar insumo");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteInsumo(id: string) {
    if (!window.confirm("Deseja realmente excluir este insumo?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("cadastro_insumos").delete().eq("id", id);
      if (error) throw error;
      fetchInsumos();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar insumo");
      setLoading(false);
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (index !== dragOverItemIndex) {
      setDragOverItemIndex(index);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    const items = [...insumos];
    const draggedItem = items[draggedItemIndex];
    items.splice(draggedItemIndex, 1);
    items.splice(targetIndex, 0, draggedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      ordem: index
    }));
    
    setInsumos(updatedItems);
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);

    try {
      setSaving(true);
      const updates = updatedItems.map(item => 
        supabase.from("cadastro_insumos").update({ ordem: item.ordem }).eq("id", item.id)
      );
      await Promise.all(updates);
    } catch (err) {
      console.error("Erro ao reordenar:", err);
      alert("Erro ao salvar a nova ordem no banco de dados.");
      fetchInsumos();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Cadastro de Insumos</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="frequencia-title-group">
            <h1>Cadastro de Insumos</h1>
            <p>Gerencie os insumos da loja. Eles poderão ser utilizados em módulos de controle de estoque e receitas.</p>
          </div>
          <button className="primary-btn" onClick={() => openModal()}>
            <Icons.BsPlusLg style={{ marginRight: "8px" }} />
            Novo Insumo
          </button>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : insumos.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Nenhum insumo registrado.</p>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "1100px" }}>
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}></th>
                    <th style={{ textAlign: "center", width: "60px" }}>Ativo</th>
                    <th style={{ width: "350px", minWidth: "250px" }}>Nome</th>
                    <th>Nome Simples</th>
                    <th>Tipo</th>
                    <th>Fornecedor</th>
                    <th style={{ width: "90px" }}>Qtd Conv.</th>
                    <th style={{ width: "90px" }}>Embalagem</th>
                    <th style={{ width: "90px", textAlign: "center" }}>Desperd. (%)</th>
                    <th style={{ width: "100px" }}>Custo Emb.</th>
                    <th style={{ width: "100px" }}>Custo Unit.</th>
                    <th style={{ textAlign: "center", width: "60px" }}>Inv. Esp.</th>
                    <th style={{ textAlign: "center", width: "80px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {insumos.map((insumo, index) => {
                    const isDragged = index === draggedItemIndex;
                    const isDragOver = index === dragOverItemIndex;
                    return (
                      <tr
                        key={insumo.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, index)}
                        style={{
                          opacity: insumo.ativo ? (isDragged ? 0.5 : 1) : 0.6,
                          borderTop: isDragOver && draggedItemIndex !== null && draggedItemIndex > index ? "2px solid var(--primary-color)" : "",
                          borderBottom: isDragOver && draggedItemIndex !== null && draggedItemIndex < index ? "2px solid var(--primary-color)" : ""
                        }}
                      >
                        <td style={{ textAlign: "center", cursor: "grab", color: "#cbd5e1" }} title="Arraste para reordenar">
                          <Icons.BsGripVertical />
                        </td>
                        <td
                          style={{ textAlign: "center", cursor: "pointer" }}
                          onClick={() => handleToggleAtivo(insumo.id, insumo.ativo)}
                          title={insumo.ativo ? "Desativar insumo" : "Ativar insumo"}
                        >
                          {insumo.ativo ? (
                            <Icons.BsCheckCircleFill style={{ color: "#22c55e", fontSize: "1.5rem" }} />
                          ) : (
                            <Icons.BsXCircleFill style={{ color: "#94a3b8", fontSize: "1.5rem" }} />
                          )}
                        </td>
                        <td style={{ fontWeight: 500 }}>{insumo.nome}</td>
                        <td>{insumo.nome_simples_unitario || "-"}</td>
                        <td>{insumo.tipo || "-"}</td>
                        <td>{insumo.fornecedor_padrao || "-"}</td>
                        <td>{insumo.quantidade_conversao}</td>
                        <td>{insumo.unidade_conversao || "-"}</td>
                        <td style={{ textAlign: "center" }}>{insumo.fator_desperdicio}%</td>
                        <td>{insumo.custo_considerado !== null && insumo.custo_considerado !== undefined ? `R$ ${insumo.custo_considerado.toFixed(2)}` : "-"}</td>
                        <td>{insumo.custo_considerado_unitario !== null && insumo.custo_considerado_unitario !== undefined ? `R$ ${insumo.custo_considerado_unitario.toFixed(2)}` : "-"}</td>
                        <td style={{ textAlign: "center" }}>
                          {insumo.inventario_especial ? (
                            <Icons.BsCheckCircleFill style={{ color: "#22c55e", fontSize: "1.2rem" }} />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center", height: "100%", padding: "12px 8px" }}>
                          <button
                            onClick={() => openModal(insumo)}
                            className="delete-record-btn"
                            title="Editar Insumo"
                            style={{ margin: 0 }}
                          >
                            <Icons.BsPencil />
                          </button>
                          <button
                            onClick={() => handleDeleteInsumo(insumo.id)}
                            className="delete-record-btn"
                            title="Excluir Insumo"
                            style={{ margin: 0 }}
                          >
                            <Icons.BsTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "var(--secondary-color)" }}>
                {editingId ? "Editar Insumo" : "Cadastrar Novo Insumo"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <Icons.BsX />
              </button>
            </div>
            <form onSubmit={handleSaveInsumo} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Nome do Insumo *</label>
                <input
                  type="text"
                  required
                  className="frequencia-select"
                  placeholder="Ex: Leite Integral UHT -  1L"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Nome Simples e Unitário</label>
                <input
                  type="text"
                  className="frequencia-select"
                  placeholder="Ex: Leite"
                  value={novoNomeSimples}
                  onChange={(e) => setNovoNomeSimples(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Tipo</label>
                  <select
                    className="frequencia-select"
                    value={novoTipo}
                    onChange={(e) => setNovoTipo(e.target.value)}
                    style={{ background: "#fff", fontSize: "1.1rem" }}
                  >
                    <option value="">Selecione um tipo</option>
                    <option value="Insumos">Insumos</option>
                    <option value="Matéria Prima">Matéria Prima</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Material de Limpeza">Material de Limpeza</option>
                    <option value="Salgados">Salgados</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Fornecedor Padrão</label>
                  <input
                    type="text"
                    className="frequencia-select"
                    placeholder="Nome do fornecedor"
                    value={novoFornecedor}
                    onChange={(e) => setNovoFornecedor(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                <h5 style={{ marginBottom: "12px", color: "var(--secondary-color)", fontSize: "1.4rem" }}>Cálculo de Custo</h5>
                
                <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Embalagem</label>
                    <select
                      className="frequencia-select"
                      value={novaUnidadeConversao}
                      onChange={(e) => setNovaUnidadeConversao(e.target.value)}
                      style={{ background: "#fff", fontSize: "1.1rem" }}
                    >
                      <option value="">Selecione...</option>
                      <option value="Unidade">Unidade</option>
                      <option value="Pacote">Pacote</option>
                      <option value="Caixa">Caixa</option>
                      <option value="Saco">Saco</option>
                      <option value="Kg">Kg</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>
                      {`Qtd que vem ${novaUnidadeConversao ? `no(a) ${novaUnidadeConversao}` : "na Embalagem"}`}
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      className="frequencia-select"
                      placeholder="Ex: 1000"
                      value={novaQtdConversao}
                      onChange={(e) => setNovaQtdConversao(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Fator de Desperdício (%)</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="number"
                      step="0.01"
                      className="frequencia-select"
                      placeholder="0"
                      value={novoFatorDesperdicio}
                      onChange={(e) => setNovoFatorDesperdicio(e.target.value)}
                    />
                    <span style={{ position: "absolute", right: "12px", color: "var(--text-muted)", zIndex: 1, pointerEvents: "none", fontSize: "1.1rem" }}>%</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px", marginBottom: "20px", marginTop: "12px" }}>
                  <input
                    type="checkbox"
                    id="inventarioEspecial"
                    checked={novoInventarioEspecial}
                    onChange={(e) => setNovoInventarioEspecial(e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer", margin: 0 }}
                  />
                  <label htmlFor="inventarioEspecial" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--secondary-color)", cursor: "pointer", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Inventário Especial (Controlar estoque por % de volume)
                  </label>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>
                    {`Custo do(a) ${novaUnidadeConversao || "Embalagem"}`}
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: "12px", color: "var(--text-muted)", zIndex: 1, pointerEvents: "none", fontSize: "1.1rem" }}>R$</span>
                    <input
                      type="number"
                      step="0.01"
                      className="frequencia-select"
                      placeholder="0,00"
                      value={novoCustoConsiderado}
                      onChange={(e) => setNovoCustoConsiderado(e.target.value)}
                      style={{ paddingLeft: "36px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: "12px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)} disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="primary-btn">
                  {saving ? "Salvando..." : "Salvar Insumo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CadastroInsumos;
