import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/Frequencia.css";

function CadastroInsumos() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [insumos, setInsumos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cellStatus, setCellStatus] = useState<Record<string, 'editing' | 'saving' | 'saved' | 'error'>>({});

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const [novoNome, setNovoNome] = useState("");
  const [novaQtdConversao, setNovaQtdConversao] = useState("");
  const [novaUnidadeConversao, setNovaUnidadeConversao] = useState("");
  const [novoCustoConsiderado, setNovoCustoConsiderado] = useState("");
  const [novoNomeSimples, setNovoNomeSimples] = useState("");
  const [novoTipo, setNovoTipo] = useState("");
  const [novoFornecedor, setNovoFornecedor] = useState("");

  useEffect(() => {
    if (isAdmin === false) {
      navigate("/");
    } else if (isAdmin === true) {
      fetchInsumos();
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingRowId === null) return;
      const target = event.target as HTMLElement;
      
      if (target.closest('.modal-content')) return;

      const editingRow = document.getElementById(`row-${editingRowId}`);
      if (editingRow && editingRow.contains(target)) return;

      setEditingRowId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingRowId]);

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

  async function handleAddInsumo(e: React.FormEvent) {
    e.preventDefault();
    if (!novoNome.trim()) {
      alert("Preencha o nome do insumo.");
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

      const { error } = await supabase
        .from("cadastro_insumos")
        .insert([{
          nome: novoNome.trim(),
          ativo: true,
          quantidade_conversao: qtd,
          unidade_conversao: novaUnidadeConversao.trim(),
          custo_considerado: custoEmb,
          custo_considerado_unitario: custoUnit,
          nome_simples_unitario: novoNomeSimples.trim(),
          tipo: novoTipo.trim(),
          fornecedor_padrao: novoFornecedor.trim()
        }]);

      if (error) {
        throw error;
      }

      setNovoNome("");
      setNovaQtdConversao("");
      setNovaUnidadeConversao("");
      setNovoCustoConsiderado("");
      setNovoNomeSimples("");
      setNovoTipo("");
      setNovoFornecedor("");
      setIsModalOpen(false);

      fetchInsumos();
    } catch (err: any) {
      console.error("Erro ao adicionar:", err);
      alert(err.message || "Erro ao adicionar insumo");
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

  const handleLocalChange = (id: string, field: string, value: any) => {
    setInsumos((prev) =>
      prev.map((ins) => {
        if (ins.id !== id) return ins;
        
        const updatedIns = { ...ins, [field]: value };
        
        // Calcular automaticamente o custo unitário se alterar Qtd ou Custo da Embalagem
        if (field === "quantidade_conversao" || field === "custo_considerado") {
          const qtd = field === "quantidade_conversao" ? (value ? parseFloat(value) : null) : ins.quantidade_conversao;
          const custoEmb = field === "custo_considerado" ? (value ? parseFloat(value) : null) : ins.custo_considerado;
          
          if (qtd && custoEmb && qtd > 0) {
            updatedIns.custo_considerado_unitario = parseFloat((custoEmb / qtd).toFixed(2));
          } else {
            updatedIns.custo_considerado_unitario = null;
          }
        }
        
        return updatedIns;
      })
    );
  };

  async function handleUpdateField(id: string, field: string, value: any) {
    const key = `${id}-${field}`;
    try {
      setCellStatus((prev) => ({ ...prev, [key]: 'saving' }));
      
      let updatePayload: any = { [field]: value };
      
      if (field === "quantidade_conversao" || field === "custo_considerado") {
        const insumo = insumos.find(i => i.id === id);
        if (insumo) {
          const qtd = field === "quantidade_conversao" ? (value ? parseFloat(value) : null) : insumo.quantidade_conversao;
          const custoEmb = field === "custo_considerado" ? (value ? parseFloat(value) : null) : insumo.custo_considerado;
          
          if (qtd && custoEmb && qtd > 0) {
            updatePayload.custo_considerado_unitario = parseFloat((custoEmb / qtd).toFixed(2));
          } else {
            updatePayload.custo_considerado_unitario = null;
          }
        }
      }

      const { error } = await supabase
        .from("cadastro_insumos")
        .update(updatePayload)
        .eq("id", id);

      if (error) throw error;

      setCellStatus((prev) => ({ ...prev, [key]: 'saved' }));
      setTimeout(() => {
        setCellStatus((prev) => {
          if (prev[key] === 'saved') {
            const newState = { ...prev };
            delete newState[key];
            return newState;
          }
          return prev;
        });
      }, 2000);
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      setCellStatus((prev) => ({ ...prev, [key]: 'error' }));
      alert("Erro ao atualizar o campo.");
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

  const renderEditableInput = (
    insumo: any,
    field: string,
    type: string = "text",
    step?: string,
    extraStyles?: React.CSSProperties,
    options?: { label: string, value: string }[],
    forceReadOnly: boolean = false,
    prefix?: string
  ) => {
    if (editingRowId !== insumo.id || forceReadOnly) {
      let displayValue = insumo[field];
      if (prefix === "R$" && typeof displayValue === "number") {
        displayValue = displayValue.toFixed(2);
      }
      return (
        <div style={{ 
          padding: "4px", 
          border: "1px solid transparent", 
          minHeight: "30px", 
          boxSizing: "border-box",
          width: "100%", 
          display: "flex", 
          alignItems: "center", 
          ...extraStyles 
        }}>
          {prefix ? `${prefix} ` : ""}{displayValue !== null && displayValue !== undefined ? displayValue : ""}
        </div>
      );
    }

    const status = cellStatus[`${insumo.id}-${field}`];
    
    let bg = "transparent";
    let color = "inherit";
    
    if (status === 'editing') {
      bg = "rgba(0, 0, 0, 0.03)";
    } else if (status === 'saving') {
      bg = "#fff3cd";
      color = "#856404";
    } else if (status === 'saved') {
      bg = "#d4edda";
      color = "#155724";
    } else if (status === 'error') {
      bg = "#f8d7da";
      color = "#721c24";
    } else {
      bg = "#fff"; // White background to indicate it's an input
    }

    const handleFocus = () => {
      setCellStatus(prev => ({ ...prev, [`${insumo.id}-${field}`]: 'editing' }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleLocalChange(insumo.id, field, e.target.value);
    };

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val: any = e.target.value;
      if (type === "number") {
        val = val !== "" ? parseFloat(val) : null;
        if (val !== null && prefix === "R$") {
          val = parseFloat(val.toFixed(2));
          handleLocalChange(insumo.id, field, val); // update locally to rounded format
        }
      }
      handleUpdateField(insumo.id, field, val);
    };

    const commonProps = {
      value: (prefix === "R$" && typeof insumo[field] === "number" && status !== 'editing') ? insumo[field].toFixed(2) : (insumo[field] ?? ""),
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      style: {
        border: status === 'editing' ? "1px solid var(--primary-color)" : "1px solid #cbd5e1",
        background: bg,
        width: "100%",
        outline: "none",
        color: color,
        padding: "4px",
        minHeight: "30px",
        boxSizing: "border-box",
        paddingRight: status === 'saving' || status === 'saved' || status === 'error' ? "24px" : "4px",
        borderRadius: "4px",
        transition: "all 0.3s ease",
        ...extraStyles
      },
      title: "Clique para editar"
    };

    return (
      <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
        {prefix && (
          <span style={{ position: "absolute", left: "6px", color: "#64748b", zIndex: 1, pointerEvents: "none" }}>
            {prefix}
          </span>
        )}
        {options ? (
          <select {...commonProps}>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        ) : (
          <input
            type={type}
            step={step}
            {...commonProps}
            style={{ ...commonProps.style, paddingLeft: prefix ? "28px" : commonProps.style.paddingLeft }}
          />
        )}
        {status === 'saving' && (
          <Icons.BsArrowClockwise className="spin" style={{ position: "absolute", right: "6px", color: color, fontSize: "1rem" }} />
        )}
        {status === 'saved' && (
          <Icons.BsCheck style={{ position: "absolute", right: "6px", color: color, fontSize: "1.3rem" }} />
        )}
        {status === 'error' && (
          <Icons.BsX style={{ position: "absolute", right: "6px", color: color, fontSize: "1.3rem" }} />
        )}
      </div>
    );
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
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
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
                    <th style={{ textAlign: "center", width: "60px" }}>Ativo</th>
                    <th style={{ width: "350px", minWidth: "250px" }}>Nome</th>
                    <th>Nome Simples</th>
                    <th>Tipo</th>
                    <th>Fornecedor</th>
                    <th style={{ width: "90px" }}>Qtd Conv.</th>
                    <th style={{ width: "90px" }}>Embalagem</th>
                    <th style={{ width: "100px" }}>Custo Emb.</th>
                    <th style={{ width: "100px" }}>Custo Unit.</th>
                    <th style={{ width: "100px" }}>Custo Atual.</th>
                    <th style={{ textAlign: "center", width: "60px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {insumos.map((insumo, index) => (
                    <tr
                      id={`row-${insumo.id}`}
                      key={insumo.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragOver={handleDragOver}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => handleDrop(e, index)}
                      style={{
                        opacity: insumo.ativo ? 1 : 0.6,
                        transition: "all 0.2s",
                        cursor: "grab",
                        backgroundColor: dragOverItemIndex === index ? "rgba(0,0,0,0.05)" : "transparent",
                        borderTop: dragOverItemIndex === index && draggedItemIndex !== null && index < draggedItemIndex ? "2px solid var(--primary-color)" : "none",
                        borderBottom: dragOverItemIndex === index && draggedItemIndex !== null && index > draggedItemIndex ? "2px solid var(--primary-color)" : "none"
                      }}
                    >
                      <td style={{ textAlign: "center" }}>
                        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                          <input
                            type="checkbox"
                            disabled={editingRowId !== insumo.id}
                            checked={insumo.ativo || false}
                            onChange={(e) => {
                              handleLocalChange(insumo.id, "ativo", e.target.checked);
                              handleUpdateField(insumo.id, "ativo", e.target.checked);
                            }}
                            style={{ cursor: "pointer", width: "16px", height: "16px" }}
                          />
                          {cellStatus[`${insumo.id}-ativo`] === 'saving' && <Icons.BsArrowClockwise className="spin" style={{ position: "absolute", right: "-20px", color: "#856404", fontSize: "1rem" }} />}
                          {cellStatus[`${insumo.id}-ativo`] === 'saved' && <Icons.BsCheck style={{ position: "absolute", right: "-22px", color: "#155724", fontSize: "1.3rem" }} />}
                        </div>
                      </td>
                      <td>{renderEditableInput(insumo, "nome", "text", undefined, { fontWeight: 500 })}</td>
                      <td>{renderEditableInput(insumo, "nome_simples_unitario")}</td>
                      <td>
                        {renderEditableInput(insumo, "tipo", "text", undefined, undefined, [
                          { label: "Insumos", value: "Insumos" },
                          { label: "Matéria Prima", value: "Matéria Prima" },
                          { label: "Bebidas", value: "Bebidas" },
                          { label: "Material de Limpeza", value: "Material de Limpeza" },
                          { label: "Salgados", value: "Salgados" },
                          { label: "Outros", value: "Outros" }
                        ])}
                      </td>
                      <td>{renderEditableInput(insumo, "fornecedor_padrao")}</td>
                      <td>{renderEditableInput(insumo, "quantidade_conversao", "number", "0.0001")}</td>
                      <td>
                        {renderEditableInput(insumo, "unidade_conversao", "text", undefined, undefined, [
                          { label: "Selecione", value: "" },
                          { label: "Unidade", value: "Unidade" },
                          { label: "Pacote", value: "Pacote" },
                          { label: "Caixa", value: "Caixa" },
                          { label: "Saco", value: "Saco" },
                          { label: "Kg", value: "Kg" }
                        ])}
                      </td>
                      <td>{renderEditableInput(insumo, "custo_considerado", "number", "0.01", undefined, undefined, false, "R$")}</td>
                      <td>{renderEditableInput(insumo, "custo_considerado_unitario", "number", "0.0001", undefined, undefined, true, "R$")}</td>
                      <td>{renderEditableInput(insumo, "custo_atualizado", "number", "0.01", undefined, undefined, true, "R$")}</td>
                      <td style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center", height: "100%", padding: "12px 8px" }}>
                        <button
                          onClick={() => setEditingRowId(editingRowId === insumo.id ? null : insumo.id)}
                          className="delete-record-btn"
                          title={editingRowId === insumo.id ? "Fechar Edição" : "Editar Insumo"}
                          style={{ margin: 0, color: editingRowId === insumo.id ? "var(--primary-color)" : "inherit" }}
                        >
                          {editingRowId === insumo.id ? <Icons.BsCheckLg /> : <Icons.BsPencil />}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "680px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "var(--secondary-color)" }}>Cadastrar Novo Insumo</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <Icons.BsX />
              </button>
            </div>
            <form onSubmit={handleAddInsumo} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Custo da Embalagem</label>
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
