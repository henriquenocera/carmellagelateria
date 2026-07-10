import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../../services/supabase-client";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import ConfirmModal from "../../components/ConfirmModal";
import "../../css/Frequencia.css";

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
  const [novoUnidadeConsumo, setNovoUnidadeConsumo] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [habilitarConversaoEstoque, setHabilitarConversaoEstoque] = useState(false);
  const [novoEstoqueNome, setNovoEstoqueNome] = useState("");
  const [novoEstoqueUnidade, setNovoEstoqueUnidade] = useState("");
  const [novoEstoqueQuantidade, setNovoEstoqueQuantidade] = useState("");
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [estoqueConversaoInfoModalOpen, setEstoqueConversaoInfoModalOpen] = useState(false);
  const [conversaoInfoModalOpen, setConversaoInfoModalOpen] = useState(false);
  const [nomeSimplesInfoModalOpen, setNomeSimplesInfoModalOpen] = useState(false);
  const [custoManualInfoModalOpen, setCustoManualInfoModalOpen] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, message: string, onConfirm: () => void, isAlert?: boolean, confirmText?: string }>({ isOpen: false, message: "", onConfirm: () => { } });
  const [habilitarConversao, setHabilitarConversao] = useState(false);

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
      setNovoUnidadeConsumo(insumo.unidade_consumo || "");
      setAtivo(insumo.ativo ?? true);
      setNovoEstoqueNome(insumo.estoque_nome || "");
      setNovoEstoqueUnidade(insumo.estoque_unidade || "");
      setNovoEstoqueQuantidade(insumo.estoque_quantidade !== null && insumo.estoque_quantidade !== undefined ? insumo.estoque_quantidade.toString() : "");
      setHabilitarConversaoEstoque(!!(insumo.estoque_nome || insumo.estoque_unidade || (insumo.estoque_quantidade !== null && insumo.estoque_quantidade !== undefined && insumo.estoque_quantidade !== 1)));

      const temConversao = (
        insumo.unidade_conversao &&
        insumo.unidade_consumo &&
        (insumo.unidade_conversao.trim().toLowerCase() !== insumo.unidade_consumo.trim().toLowerCase() ||
          (insumo.quantidade_conversao !== null && insumo.quantidade_conversao !== 1))
      );
      setHabilitarConversao(!!temConversao);
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
      setNovoUnidadeConsumo("");
      setAtivo(true);
      setHabilitarConversao(false);
      setNovoEstoqueNome("");
      setNovoEstoqueUnidade("");
      setNovoEstoqueQuantidade("");
      setHabilitarConversaoEstoque(false);
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

      const qtd = habilitarConversao
        ? (novaQtdConversao ? parseFloat(novaQtdConversao) : null)
        : 1;
      const custoEmb = novoCustoConsiderado ? parseFloat(novoCustoConsiderado) : null;
      let custoUnit = null;
      if (qtd && custoEmb && qtd > 0) {
        custoUnit = parseFloat((custoEmb / qtd).toFixed(2));
      }

      const estoqueQtd = habilitarConversaoEstoque
        ? (novoEstoqueQuantidade ? parseFloat(novoEstoqueQuantidade) : null)
        : null;

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
        inventario_especial: novoInventarioEspecial,
        unidade_consumo: habilitarConversao ? novoUnidadeConsumo.trim() : novaUnidadeConversao.trim(),
        estoque_nome: habilitarConversaoEstoque ? novoEstoqueNome.trim() : null,
        estoque_unidade: habilitarConversaoEstoque ? novoEstoqueUnidade.trim() : null,
        estoque_quantidade: estoqueQtd
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

  function handleDeleteInsumo(id: string) {
    setConfirmModal({
      isOpen: true,
      message: "Deseja realmente excluir este insumo?",
      confirmText: "Confirmar",
      isAlert: false,
      onConfirm: () => processDelete(id)
    });
  }

  async function processDelete(id: string) {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    try {
      setLoading(true);

      const [entradas, movimentacoes, inventario] = await Promise.all([
        supabase.from("entradas_mercadoria").select("insumo_id").eq("insumo_id", id).limit(1),
        supabase.from("movimentacoes_estoque").select("insumo_id").eq("insumo_id", id).limit(1),
        supabase.from("inventario_insumos").select("insumo_id").eq("insumo_id", id).limit(1)
      ]);

      const temHistorico =
        (entradas.data && entradas.data.length > 0) ||
        (movimentacoes.data && movimentacoes.data.length > 0) ||
        (inventario.data && inventario.data.length > 0);

      if (temHistorico) {
        setConfirmModal({
          isOpen: true,
          message: "Atenção: Este insumo já possui histórico de entrada ou movimentação de estoque. Para evitar a perda de dados, ele não será excluído, mas sim INATIVADO.",
          confirmText: "Ok, entendi",
          isAlert: true,
          onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        });
        const { error: updateError } = await supabase.from("cadastro_insumos").update({ ativo: false }).eq("id", id);
        if (updateError) throw updateError;
      } else {
        const { error } = await supabase.from("cadastro_insumos").delete().eq("id", id);
        if (error) throw error;
      }

      fetchInsumos();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      setConfirmModal({
        isOpen: true,
        message: "Erro ao processar a exclusão do insumo.",
        confirmText: "Ok",
        isAlert: true,
        onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false }))
      });
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
          {!loading && insumos.length > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "16px" }}>
              <div style={{ position: "relative", width: "300px" }}>
                <Icons.BsSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Buscar insumo..."
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  style={{ width: "100%", padding: "10px 10px 10px 36px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : insumos.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Nenhum insumo registrado.</p>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "1300px" }}>
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}></th>
                    <th style={{ textAlign: "center", width: "60px" }}>Ativo</th>
                    <th style={{ width: "350px", minWidth: "250px" }}>Nome</th>
                    <th>Nome Simples</th>
                    <th>Tipo</th>
                    <th>Fornecedor</th>
                    <th style={{ width: "90px" }}>Qtd Compra</th>
                    <th style={{ width: "90px" }}>Unid. Compra</th>
                    <th style={{ width: "90px" }}>Unid. Conversão</th>
                    <th style={{ textAlign: "center", width: "60px" }}>Inv. Esp.</th>
                    <th style={{ width: "90px", textAlign: "center" }}>Desperd. (%)</th>
                    <th style={{ width: "100px" }}>Custo Emb.</th>
                    <th style={{ width: "100px" }}>Custo Unit.</th>
                    <th style={{ textAlign: "center", width: "80px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {insumos
                    .filter((insumo) => {
                      if (!filtroTexto) return true;
                      const term = filtroTexto.toLowerCase();
                      return (
                        insumo.nome?.toLowerCase().includes(term) ||
                        insumo.nome_simples_unitario?.toLowerCase().includes(term) ||
                        insumo.fornecedor_padrao?.toLowerCase().includes(term) ||
                        insumo.tipo?.toLowerCase().includes(term)
                      );
                    })
                    .map((insumo) => {
                      const originalIndex = insumos.findIndex((i) => i.id === insumo.id);
                      const isDragged = originalIndex === draggedItemIndex;
                      const isDragOver = originalIndex === dragOverItemIndex;
                      return (
                        <tr
                          key={insumo.id}
                          onClick={() => openModal(insumo)}
                          draggable={!filtroTexto}
                          onDragStart={() => !filtroTexto && handleDragStart(originalIndex)}
                          onDragEnter={(e) => !filtroTexto && handleDragEnter(e, originalIndex)}
                          onDragOver={handleDragOver}
                          onDragEnd={handleDragEnd}
                          onDrop={(e) => !filtroTexto && handleDrop(e, originalIndex)}
                          style={{
                            opacity: insumo.ativo ? (isDragged ? 0.5 : 1) : 0.6,
                            borderTop: isDragOver && draggedItemIndex !== null && draggedItemIndex > originalIndex ? "2px solid var(--primary-color)" : "",
                            borderBottom: isDragOver && draggedItemIndex !== null && draggedItemIndex < originalIndex ? "2px solid var(--primary-color)" : "",
                            cursor: "pointer"
                          }}
                        >
                          <td
                            style={{ textAlign: "center", cursor: "grab", color: "#cbd5e1" }}
                            title="Arraste para reordenar"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Icons.BsGripVertical />
                          </td>
                          <td
                            style={{ textAlign: "center", cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAtivo(insumo.id, insumo.ativo);
                            }}
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
                          <td>{insumo.unidade_consumo || "-"}</td>
                          <td style={{ textAlign: "center" }}>
                            {insumo.inventario_especial ? (
                              <Icons.BsCheckCircleFill style={{ color: "#22c55e", fontSize: "1.2rem" }} />
                            ) : (
                              "-"
                            )}
                          </td>
                          <td style={{ textAlign: "center" }}>{insumo.fator_desperdicio}%</td>
                          <td>{insumo.custo_considerado !== null && insumo.custo_considerado !== undefined ? `R$ ${insumo.custo_considerado.toFixed(2)}` : "-"}</td>
                          <td>{insumo.custo_considerado_unitario !== null && insumo.custo_considerado_unitario !== undefined ? `R$ ${insumo.custo_considerado_unitario.toFixed(2)}` : "-"}</td>
                          <td
                            style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center", height: "100%", padding: "12px 8px" }}
                            onClick={(e) => e.stopPropagation()}
                          >
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

      {infoModalOpen && (
        <div className="modal-overlay" onClick={() => setInfoModalOpen(false)} style={{ zIndex: 1100, backdropFilter: "blur(4px)" }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "340px", textAlign: "center", padding: "32px 24px", borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
            <h3 style={{ margin: "0 0 12px 0", color: "var(--secondary-color)", fontSize: "1.8rem", fontWeight: 700 }}>Inventário Especial</h3>
            <p style={{ fontSize: "1.3rem", color: "#64748b", lineHeight: "1.6", margin: "0 0 28px 0" }}>
              Ao marcar esse campo, o insumo passa a ser controlado no estoque em <strong>porcentagem (%)</strong> de volume em vez de unidades fixas.
            </p>
            <button
              onClick={() => setInfoModalOpen(false)}
              style={{ width: "100%", padding: "14px", backgroundColor: "var(--primary-color)", color: "white", border: "none", borderRadius: "10px", fontSize: "1.1rem", fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s ease" }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {estoqueConversaoInfoModalOpen && (
        <div className="modal-overlay" onClick={() => setEstoqueConversaoInfoModalOpen(false)} style={{ zIndex: 1100, backdropFilter: "blur(4px)" }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px", textAlign: "left", padding: "32px 24px", borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--secondary-color)", fontSize: "1.8rem", fontWeight: 700, textAlign: "center" }}>Conversão de Estoque</h3>
            <p style={{ fontSize: "1.3rem", color: "#475569", lineHeight: "1.6", margin: "0 0 16px 0" }}>
              A conversão de estoque permite que você gerencie um insumo com um nome ou unidade diferente de como ele foi comprado, e defina uma quantidade de conversão caso a unidade de estoque seja diferente da unidade de compra.
            </p>
            <button
              onClick={() => setEstoqueConversaoInfoModalOpen(false)}
              style={{ width: "100%", padding: "14px", backgroundColor: "var(--primary-color)", color: "white", border: "none", borderRadius: "10px", fontSize: "1.1rem", fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s ease" }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {conversaoInfoModalOpen && (
        <div className="modal-overlay" onClick={() => setConversaoInfoModalOpen(false)} style={{ zIndex: 1100, backdropFilter: "blur(4px)" }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px", textAlign: "left", padding: "32px 24px", borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--secondary-color)", fontSize: "1.8rem", fontWeight: 700, textAlign: "center" }}>Conversão de Unidades</h3>
            <p style={{ fontSize: "1.3rem", color: "#475569", lineHeight: "1.6", margin: "0 0 16px 0" }}>
              Utilize a conversão de unidade quando você compra um insumo em uma embalagem (ex: Caixa, Pacote, Saco) mas precisa calcular o valor em outra unidade (ex: Unidade, Kg, g, L).
            </p>
            <p style={{ fontSize: "1.3rem", color: "#475569", lineHeight: "1.6", margin: "0 0 8px 0" }}>
              <strong>Exemplo prático:</strong>
            </p>
            <p style={{ fontSize: "1.3rem", color: "#475569", lineHeight: "1.6", margin: "0 0 16px 0", paddingLeft: "12px", borderLeft: "3px solid var(--primary-color)" }}>
              Se você compra uma <strong>Caixa</strong> de Leite que contém <strong>12un</strong>:<br />
              • <strong>Unidade de Compra:</strong> Caixa<br />
              • <strong>Qtd. por Embalagem:</strong> 12<br />
              • <strong>Unidade de Conversão:</strong> un
            </p>
            <div style={{
              margin: "0 0 24px 0",
              padding: "12px 16px",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderLeft: "4px solid #3b82f6",
              borderRadius: "8px",
              fontSize: "1.2rem",
              color: "#1e40af",
              lineHeight: "1.5"
            }}>
              <strong style={{ display: "block", marginBottom: "4px", color: "#1e3a8a" }}>💡 Exemplo de Custo:</strong>
              Ao realizar a compra de 1 caixa de leite com 12 unidades por R$ 60,00, o sistema vai calcular cada un do leite a R$ 5,00.
            </div>
            <button
              onClick={() => setConversaoInfoModalOpen(false)}
              style={{ width: "100%", padding: "14px", backgroundColor: "var(--primary-color)", color: "white", border: "none", borderRadius: "10px", fontSize: "1.1rem", fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s ease" }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {nomeSimplesInfoModalOpen && (
        <div className="modal-overlay" onClick={() => setNomeSimplesInfoModalOpen(false)} style={{ zIndex: 1100, backdropFilter: "blur(4px)" }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px", textAlign: "left", padding: "32px 24px", borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--secondary-color)", fontSize: "1.8rem", fontWeight: 700, textAlign: "center" }}>Nome Simples e Unitário</h3>
            <p style={{ fontSize: "1.3rem", color: "#475569", lineHeight: "1.6", margin: "0 0 16px 0" }}>
              É o nome simplificado e no singular do insumo. Ele é utilizado para exibição em fichas técnicas e receitas, tornando a visualização mais limpa e organizada.
            </p>
            <div style={{
              margin: "0 0 24px 0",
              padding: "12px 16px",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderLeft: "4px solid #3b82f6",
              borderRadius: "8px",
              fontSize: "1.2rem",
              color: "#1e40af",
              lineHeight: "1.5"
            }}>
              <strong style={{ display: "block", marginBottom: "4px", color: "#1e3a8a" }}>💡 Exemplo:</strong>
              Em vez de usar <strong>"Leite Integral UHT - 1L"</strong> na receita, o sistema exibirá apenas <strong>"Leite"</strong>.
            </div>
            <button
              onClick={() => setNomeSimplesInfoModalOpen(false)}
              style={{ width: "100%", padding: "14px", backgroundColor: "var(--primary-color)", color: "white", border: "none", borderRadius: "10px", fontSize: "1.1rem", fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s ease" }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {custoManualInfoModalOpen && (
        <div className="modal-overlay" onClick={() => setCustoManualInfoModalOpen(false)} style={{ zIndex: 1100, backdropFilter: "blur(4px)" }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px", textAlign: "left", padding: "32px 24px", borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "var(--secondary-color)", fontSize: "1.8rem", fontWeight: 700, textAlign: "center" }}>Custo Considerado Manual</h3>
            <p style={{ fontSize: "1.3rem", color: "#475569", lineHeight: "1.6", margin: "0 0 16px 0" }}>
              Permite que você defina manualmente um valor de custo fixo para a embalagem/insumo.
            </p>
            <p style={{ fontSize: "1.3rem", color: "#475569", lineHeight: "1.6", margin: "0 0 16px 0" }}>
              Quando este campo é preenchido, o valor inserido aqui poderá ser usado nos cálculos de custos das fichas técnicas e receitas, e irá servir de comparativo com o custo dinâmico das compras.
            </p>
            <div style={{
              margin: "0 0 24px 0",
              padding: "12px 16px",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderLeft: "4px solid #3b82f6",
              borderRadius: "8px",
              fontSize: "1.2rem",
              color: "#1e40af",
              lineHeight: "1.5"
            }}>
              <strong style={{ display: "block", marginBottom: "4px", color: "#1e3a8a" }}>💡 Utilidade:</strong>
              Ideal para quando o preço de compra oscila muito.
            </div>
            <button
              onClick={() => setCustoManualInfoModalOpen(false)}
              style={{ width: "100%", padding: "14px", backgroundColor: "var(--primary-color)", color: "white", border: "none", borderRadius: "10px", fontSize: "1.1rem", fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s ease" }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "680px", minHeight: "80vh", maxHeight: "90vh", overflowY: "auto", paddingBottom: "100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "var(--secondary-color)" }}>
                {editingId ? "Editar Insumo" : "Cadastrar Novo Insumo"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <Icons.BsX />
              </button>
            </div>
            <form onSubmit={handleSaveInsumo} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsBoxSeam /> Dados do Insumo
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
                        <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", margin: 0 }}>Nome do Insumo *</label>
                      </div>
                      <input
                        type="text"
                        required
                        className="frequencia-select"
                        placeholder="Ex: Leite Integral UHT -  1L"
                        value={novoNome}
                        onChange={(e) => setNovoNome(e.target.value)}
                        style={{ textAlign: "center", width: "100%", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "16px" }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
                        <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", margin: 0 }}>Tipo</label>
                      </div>
                      <Select
                        isClearable
                        menuPosition="fixed"
                        menuPortalTarget={document.body}
                        placeholder="Selecione um tipo"
                        options={[
                          { value: 'Insumos', label: 'Insumos' },
                          { value: 'Matéria Prima', label: 'Matéria Prima' },
                          { value: 'Bebidas', label: 'Bebidas' },
                          { value: 'Material de Limpeza', label: 'Material de Limpeza' },
                          { value: 'Salgados', label: 'Salgados' },
                          { value: 'Outros', label: 'Outros' }
                        ]}
                        value={novoTipo ? { value: novoTipo, label: novoTipo } : null}
                        onChange={(selectedOption) => setNovoTipo(selectedOption?.value || "")}
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: '1.2rem',
                            minHeight: '42px',
                            borderRadius: '8px',
                            borderColor: '#cbd5e1',
                            backgroundColor: '#fff',
                            textAlign: 'center'
                          }),
                          singleValue: (base) => ({
                            ...base,
                            textAlign: 'center'
                          }),
                          menu: (base) => ({
                            ...base,
                            fontSize: '1.2rem',
                            zIndex: 9999
                          }),
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999
                          })
                        }}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
                        <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", margin: 0 }}>Fornecedor Padrão</label>
                      </div>
                      <input
                        type="text"
                        className="frequencia-select"
                        placeholder="Nome do fornecedor"
                        value={novoFornecedor}
                        onChange={(e) => setNovoFornecedor(e.target.value)}
                        style={{ textAlign: "center", width: "100%", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "16px" }}>
                    <div className="form-group" style={{ flex: "0 0 calc(50% - 8px)", maxWidth: "calc(50% - 8px)", marginBottom: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
                        <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", margin: 0 }}>
                          Custo Considerado Manual
                        </label>
                        <button
                          type="button"
                          onClick={() => setCustoManualInfoModalOpen(true)}
                          style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "inline-flex", alignItems: "center", padding: 0 }}
                          title="O que é o Custo Considerado Manual?"
                        >
                          <Icons.BsQuestionCircle size={15} />
                        </button>
                      </div>
                      <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                        <span style={{ position: "absolute", left: "12px", color: "var(--text-muted)", zIndex: 1, pointerEvents: "none", fontSize: "1.1rem" }}>R$</span>
                        <input
                          type="number"
                          step="0.01"
                          className="frequencia-select"
                          placeholder="0,00"
                          value={novoCustoConsiderado}
                          onChange={(e) => setNovoCustoConsiderado(e.target.value)}
                          style={{ paddingLeft: "36px", textAlign: "center", width: "100%", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsCart3 /> Compras
                </h3>

                {/* Toggle switch for enabling/disabling unit conversion */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <label className="switch" style={{ position: "relative", display: "inline-block", width: "40px", height: "22px", margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={habilitarConversao}
                      onChange={(e) => {
                        setHabilitarConversao(e.target.checked);
                      }}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: habilitarConversao ? "var(--primary-color, #3b82f6)" : "#cbd5e1",
                      transition: "0.3s",
                      borderRadius: "22px"
                    }}>
                      <span style={{
                        position: "absolute",
                        content: '""',
                        height: "16px",
                        width: "16px",
                        left: "3px",
                        bottom: "3px",
                        backgroundColor: "white",
                        transition: "0.3s",
                        borderRadius: "50%",
                        transform: habilitarConversao ? "translateX(18px)" : "translateX(0)"
                      }} />
                    </span>
                  </label>
                  <span
                    style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", cursor: "pointer" }}
                    onClick={() => {
                      setHabilitarConversao(!habilitarConversao);
                    }}
                  >
                    Habilitar conversão de Unidade
                  </span>
                  <button
                    type="button"
                    onClick={() => setConversaoInfoModalOpen(true)}
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
                    title="O que é a conversão de unidade?"
                  >
                    <Icons.BsQuestionCircle size={18} />
                  </button>
                </div>

                {!habilitarConversao ? (
                  <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
                    <div className="form-group" style={{ flex: "0 0 calc(50% - 8px)", maxWidth: "calc(50% - 8px)", marginBottom: 0 }}>
                      <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center", display: "block", marginBottom: "8px" }}>Unidade de Compra</label>
                      <CreatableSelect
                        isClearable
                        menuPosition="fixed"
                        menuPortalTarget={document.body}
                        placeholder="Ex: Unidade"
                        options={[
                          { value: 'Unidade', label: 'Unidade' },
                          { value: 'Pacote', label: 'Pacote' },
                          { value: 'Pote', label: 'Pote' },
                          { value: 'Caixa', label: 'Caixa' },
                          { value: 'Saco', label: 'Saco' },
                          { value: 'Balde', label: 'Balde' },
                          { value: 'Litro', label: 'Litro' },
                          { value: 'Kg', label: 'Kg' }
                        ]}
                        value={novaUnidadeConversao ? { value: novaUnidadeConversao, label: novaUnidadeConversao } : null}
                        onChange={(selectedOption) => {
                          const val = selectedOption?.value || "";
                          setNovaUnidadeConversao(val);
                          setNovoUnidadeConsumo(val);
                        }}
                        formatCreateLabel={(inputValue) => `Criar "${inputValue}"`}
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: '1.2rem',
                            minHeight: '42px',
                            borderRadius: '8px',
                            borderColor: '#cbd5e1',
                            backgroundColor: '#fff',
                            textAlign: 'center'
                          }),
                          singleValue: (base) => ({
                            ...base,
                            textAlign: 'center'
                          }),
                          menu: (base) => ({
                            ...base,
                            fontSize: '1.2rem',
                            zIndex: 9999
                          }),
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999
                          })
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center", display: "block", marginBottom: "8px" }}>Unidade de Compra</label>
                        <CreatableSelect
                          isClearable
                          menuPosition="fixed"
                          menuPortalTarget={document.body}
                          placeholder="Ex: Unidade"
                          options={[
                            { value: 'Unidade', label: 'Unidade' },
                            { value: 'Pacote', label: 'Pacote' },
                            { value: 'Caixa', label: 'Caixa' },
                            { value: 'Saco', label: 'Saco' },
                            { value: 'Balde', label: 'Balde' },
                            { value: 'Litro', label: 'Litro' },
                            { value: 'Kg', label: 'Kg' }
                          ]}
                          value={novaUnidadeConversao ? { value: novaUnidadeConversao, label: novaUnidadeConversao } : null}
                          onChange={(selectedOption) => setNovaUnidadeConversao(selectedOption?.value || "")}
                          formatCreateLabel={(inputValue) => `Criar "${inputValue}"`}
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: '1.2rem',
                              minHeight: '42px',
                              borderRadius: '8px',
                              borderColor: '#cbd5e1',
                              backgroundColor: '#fff',
                              textAlign: 'center'
                            }),
                            singleValue: (base) => ({
                              ...base,
                              textAlign: 'center'
                            }),
                            menu: (base) => ({
                              ...base,
                              fontSize: '1.2rem',
                              zIndex: 9999
                            }),
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999
                            })
                          }}
                        />
                      </div>

                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center", display: "block", marginBottom: "8px" }}>
                          Qtd. por {novaUnidadeConversao || "Embalagem"} ({novoUnidadeConsumo || "Conversão"})
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          className="frequencia-select"
                          placeholder="Ex: 5"
                          value={novaQtdConversao}
                          onChange={(e) => setNovaQtdConversao(e.target.value)}
                          style={{ textAlign: "center", width: "100%", boxSizing: "border-box", height: "42px" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
                      <div className="form-group" style={{ flex: "0 0 calc(50% - 8px)", maxWidth: "calc(50% - 8px)", marginBottom: 0 }}>
                        <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center", display: "block", marginBottom: "8px" }}>Unidade de Conversão</label>
                        <CreatableSelect
                          isClearable
                          menuPosition="fixed"
                          menuPortalTarget={document.body}
                          placeholder="Ex: Kg"
                          options={[
                            { value: 'Unidade', label: 'Unidade' },
                            { value: 'Kg', label: 'Kg' },
                            { value: 'g', label: 'g' },
                            { value: 'L', label: 'L' },
                            { value: 'ml', label: 'ml' }
                          ]}
                          value={novoUnidadeConsumo ? { value: novoUnidadeConsumo, label: novoUnidadeConsumo } : null}
                          onChange={(selectedOption) => setNovoUnidadeConsumo(selectedOption?.value || "")}
                          formatCreateLabel={(inputValue) => `Criar "${inputValue}"`}
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: '1.2rem',
                              minHeight: '42px',
                              borderRadius: '8px',
                              borderColor: '#cbd5e1',
                              backgroundColor: '#fff',
                              textAlign: 'center'
                            }),
                            singleValue: (base) => ({
                              ...base,
                              textAlign: 'center'
                            }),
                            menu: (base) => ({
                              ...base,
                              fontSize: '1.2rem',
                              zIndex: 9999
                            }),
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999
                            })
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px 16px", borderRadius: "8px", marginTop: "16px", color: "#1e40af", fontSize: "1.1rem" }}>
                      <Icons.BsInfoCircleFill style={{ flexShrink: 0, fontSize: "1.2rem" }} />
                      <div>
                        <span><strong>Relação de Transformação:</strong> 1 {novaUnidadeConversao || "[Unidade de Compra]"} equivale a {novaQtdConversao || "[Quantidade]"} {novoUnidadeConsumo || "[Unidade de Conversão]"}.</span>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px 16px", borderRadius: "8px", marginTop: "8px", color: "#1e40af", fontSize: "1.1rem" }}>
                      <Icons.BsInfoCircleFill style={{ flexShrink: 0, fontSize: "1.2rem" }} />
                      <div>
                        <span>O valor será calculado por <strong>"{novoUnidadeConsumo || "Unidade de Conversão"}"</strong>.</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsBoxSeam /> Estoque
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <label className="switch" style={{ position: "relative", display: "inline-block", width: "40px", height: "22px", margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={habilitarConversaoEstoque}
                      onChange={(e) => setHabilitarConversaoEstoque(e.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: habilitarConversaoEstoque ? "var(--primary-color, #3b82f6)" : "#cbd5e1",
                      transition: "0.3s",
                      borderRadius: "22px"
                    }}>
                      <span style={{
                        position: "absolute",
                        content: '""',
                        height: "16px",
                        width: "16px",
                        left: "3px",
                        bottom: "3px",
                        backgroundColor: "white",
                        transition: "0.3s",
                        borderRadius: "50%",
                        transform: habilitarConversaoEstoque ? "translateX(18px)" : "translateX(0)"
                      }} />
                    </span>
                  </label>
                  <span
                    style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", cursor: "pointer" }}
                    onClick={() => setHabilitarConversaoEstoque(!habilitarConversaoEstoque)}
                  >
                    Habilitar conversão de estoque
                  </span>
                  <button
                    type="button"
                    onClick={() => setEstoqueConversaoInfoModalOpen(true)}
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
                    title="O que é a conversão de estoque?"
                  >
                    <Icons.BsQuestionCircle size={18} />
                  </button>
                </div>

                {habilitarConversaoEstoque && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "16px" }}>
                    <div className="form-group" style={{ width: "100%", marginBottom: 0 }}>
                      <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center", display: "block", marginBottom: "8px" }}>
                        Nome no Estoque
                      </label>
                      <input
                        type="text"
                        className="frequencia-select"
                        placeholder="Ex: Leite"
                        value={novoEstoqueNome}
                        onChange={(e) => setNovoEstoqueNome(e.target.value)}
                        style={{ textAlign: "center", width: "100%", boxSizing: "border-box", height: "42px" }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center", display: "block", marginBottom: "8px" }}>
                          Unidade de Estoque
                        </label>
                        <CreatableSelect
                          isClearable
                          menuPosition="fixed"
                          menuPortalTarget={document.body}
                          placeholder="Ex: L"
                          options={[
                              { value: 'Unidade', label: 'Unidade' },
                              { value: 'Kg', label: 'Kg' },
                              { value: 'g', label: 'g' },
                              { value: 'L', label: 'L' },
                              { value: 'ml', label: 'ml' }
                          ]}
                          value={novoEstoqueUnidade ? { value: novoEstoqueUnidade, label: novoEstoqueUnidade } : null}
                          onChange={(selectedOption) => setNovoEstoqueUnidade(selectedOption?.value || "")}
                          formatCreateLabel={(inputValue) => `Criar "${inputValue}"`}
                          styles={{
                            control: (base) => ({ ...base, fontSize: '1.2rem', minHeight: '42px', borderRadius: '8px', borderColor: '#cbd5e1', backgroundColor: '#fff', textAlign: 'center' }),
                            singleValue: (base) => ({ ...base, textAlign: 'center' }),
                            menu: (base) => ({ ...base, fontSize: '1.2rem', zIndex: 9999 }),
                            menuPortal: (base) => ({ ...base, zIndex: 9999 })
                          }}
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center", display: "block", marginBottom: "8px" }}>
                          Qtd de Conversão
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          className="frequencia-select"
                          placeholder="Ex: 1"
                          value={novoEstoqueQuantidade}
                          onChange={(e) => setNovoEstoqueQuantidade(e.target.value)}
                          style={{ textAlign: "center", width: "100%", boxSizing: "border-box", height: "42px" }}
                        />
                      </div>
                    </div>
                    <div style={{
                      marginTop: "4px",
                      padding: "12px 16px",
                      backgroundColor: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      borderRadius: "8px",
                      fontSize: "1.2rem",
                      color: "#1e40af",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <Icons.BsInfoCircle style={{ flexShrink: 0 }} />
                      <span>
                        Você irá movimentar esse item no seu estoque como <strong>"{novoEstoqueNome || novoNome || "Nome do Insumo"}"</strong>
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px" }}>
                  <input
                    type="checkbox"
                    id="inventarioEspecial"
                    checked={novoInventarioEspecial}
                    onChange={(e) => setNovoInventarioEspecial(e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer", margin: 0 }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label htmlFor="inventarioEspecial" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--secondary-color)", cursor: "pointer", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Inventário Especial (Controlar estoque por %)
                    </label>
                    <button
                      type="button"
                      onClick={() => setInfoModalOpen(true)}
                      style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
                      title="O que é isso?"
                    >
                      <Icons.BsQuestionCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsLayers /> Consumo/Produção
                </h3>

                <div style={{ display: "flex", gap: "16px" }}>
                    <div className="form-group" style={{ flex: "0 0 calc(50% - 8px)", maxWidth: "calc(50% - 8px)", marginBottom: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
                        <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", margin: 0 }}>Nome Simples e Unitário</label>
                        <button
                          type="button"
                          onClick={() => setNomeSimplesInfoModalOpen(true)}
                          style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "inline-flex", alignItems: "center", padding: 0 }}
                          title="O que é o Nome Simples e Unitário?"
                        >
                          <Icons.BsQuestionCircle size={15} />
                        </button>
                      </div>
                      <input
                        type="text"
                        className="frequencia-select"
                        placeholder="Ex: Leite"
                        value={novoNomeSimples}
                        onChange={(e) => setNovoNomeSimples(e.target.value)}
                        style={{ textAlign: "center", width: "100%", boxSizing: "border-box" }}
                      />
                    </div>

                  <div className="form-group" style={{ flex: "0 0 calc(50% - 8px)", maxWidth: "calc(50% - 8px)", marginBottom: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
                      <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", margin: 0 }}>Fator de Desperdício (%)</label>
                    </div>
                    <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                      <input
                        type="number"
                        step="0.01"
                        className="frequencia-select"
                        placeholder="0"
                        value={novoFatorDesperdicio}
                        onChange={(e) => setNovoFatorDesperdicio(e.target.value)}
                        style={{ paddingRight: "36px", textAlign: "center", width: "100%", boxSizing: "border-box" }}
                      />
                      <span style={{ position: "absolute", right: "12px", color: "var(--text-muted)", zIndex: 1, pointerEvents: "none", fontSize: "1.1rem" }}>%</span>
                    </div>
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

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        confirmText={confirmModal.confirmText}
        isAlert={confirmModal.isAlert}
      />
    </>
  );
}

export default CadastroInsumos;
