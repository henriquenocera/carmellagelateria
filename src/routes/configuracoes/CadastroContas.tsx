import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../../services/supabase-client";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../../css/Frequencia.css";

function CadastroContas() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  // Form states
  const [ativo, setAtivo] = useState(true);
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [contaCorrente, setContaCorrente] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [saldoInicial, setSaldoInicial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (isAdmin === false) {
      navigate("/");
    } else if (isAdmin === true) {
      fetchContas();
    }
  }, [isAdmin, navigate]);

  async function fetchContas() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contas")
        .select("*")
        .order("banco", { ascending: true });

      if (error) throw error;
      setContas(data || []);
    } catch (err) {
      console.error("Erro ao buscar contas:", err);
    } finally {
      setLoading(false);
    }
  }

  const openModal = (conta = null) => {
    if (conta) {
      setEditingId(conta.id);
      setAtivo(conta.ativo ?? true);
      setBanco(conta.banco || "");
      setAgencia(conta.agencia || "");
      setContaCorrente(conta.conta_corrente || "");
      setDataInicial(conta.data_inicial || "");
      setSaldoInicial(conta.saldo_inicial !== null ? String(conta.saldo_inicial) : "");
      setCnpj(conta.cnpj || "");
      setDescricao(conta.descricao || "");
    } else {
      setEditingId(null);
      setAtivo(true);
      setBanco("");
      setAgencia("");
      setContaCorrente("");
      setDataInicial("");
      setSaldoInicial("");
      setCnpj("");
      setDescricao("");
    }
    setIsModalOpen(true);
  };

  async function handleToggleAtivo(id, currentAtivo) {
    try {
      setLoading(true);
      const { error } = await supabase.from("contas").update({ ativo: !currentAtivo }).eq("id", id);
      if (error) throw error;
      fetchContas();
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      alert("Erro ao alterar o status da conta.");
      setLoading(false);
    }
  }

  async function handleSaveConta(e) {
    e.preventDefault();
    if (!banco.trim()) {
      alert("Preencha o nome do Banco.");
      return;
    }

    const payload = {
      ativo,
      banco: banco.trim(),
      agencia: agencia.trim(),
      conta_corrente: contaCorrente.trim(),
      data_inicial: dataInicial ? dataInicial : null,
      saldo_inicial: saldoInicial ? parseFloat(saldoInicial) : 0,
      cnpj: cnpj.trim(),
      descricao: descricao.trim(),
    };

    try {
      setSaving(true);
      
      if (editingId) {
        const { error } = await supabase
          .from("contas")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("contas")
          .insert([payload]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchContas();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert(err.message || "Erro ao salvar conta");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConta(id) {
    if (!window.confirm("Deseja realmente excluir esta conta bancária?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("contas").delete().eq("id", id);
      if (error) throw error;
      fetchContas();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar conta");
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Cadastro de Contas</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="frequencia-title-group">
            <h1>Cadastro de Contas</h1>
            <p>Gerencie as contas bancárias da empresa, incluindo saldo inicial e dados gerais.</p>
          </div>
          <button className="primary-btn" onClick={() => openModal()}>
            <Icons.BsPlusLg style={{ marginRight: "8px" }} />
            Nova Conta
          </button>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : contas.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Nenhuma conta bancária registrada.</p>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "1100px" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center", width: "60px" }}>Ativa</th>
                    <th style={{ width: "200px" }}>Banco</th>
                    <th style={{ width: "150px" }}>Agência</th>
                    <th style={{ width: "150px" }}>Conta</th>
                    <th style={{ width: "150px" }}>CNPJ</th>
                    <th style={{ width: "120px" }}>Data Inic.</th>
                    <th style={{ width: "120px", textAlign: "right" }}>Saldo Inic.</th>
                    <th style={{ textAlign: "center", width: "80px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contas.map((c) => (
                    <tr key={c.id} style={{ opacity: c.ativo ? 1 : 0.6 }}>
                      <td
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleToggleAtivo(c.id, c.ativo)}
                        title={c.ativo ? "Desativar conta" : "Ativar conta"}
                      >
                        {c.ativo ? (
                          <Icons.BsCheckCircleFill style={{ color: "#22c55e", fontSize: "1.5rem" }} />
                        ) : (
                          <Icons.BsXCircleFill style={{ color: "#94a3b8", fontSize: "1.5rem" }} />
                        )}
                      </td>
                      <td style={{ fontWeight: 500 }}>{c.banco}</td>
                      <td>{c.agencia || "-"}</td>
                      <td>{c.conta_corrente || "-"}</td>
                      <td>{c.cnpj || "-"}</td>
                      <td>{c.data_inicial ? new Date(c.data_inicial).toLocaleDateString("pt-BR", {timeZone:"UTC"}) : "-"}</td>
                      <td style={{ textAlign: "right" }}>
                        {c.saldo_inicial != null 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.saldo_inicial) 
                          : "-"}
                      </td>
                      <td style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center", height: "100%", padding: "12px 8px" }}>
                        <button
                          onClick={() => openModal(c)}
                          className="delete-record-btn"
                          title="Editar Conta"
                          style={{ margin: 0, color: "var(--primary-color)" }}
                        >
                          <Icons.BsPencil />
                        </button>
                        <button
                          onClick={() => handleDeleteConta(c.id)}
                          className="delete-record-btn"
                          title="Excluir Conta"
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
          <div className="modal-content" style={{ maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "var(--secondary-color)" }}>
                {editingId ? "Editar Conta" : "Cadastrar Nova Conta"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <Icons.BsX />
              </button>
            </div>
            <form onSubmit={handleSaveConta} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div style={{ display: "flex", gap: "16px" }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Banco *</label>
                  <input
                    type="text"
                    required
                    className="frequencia-select"
                    placeholder="Ex: Itaú, Nubank, Bradesco"
                    value={banco}
                    onChange={(e) => setBanco(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>CNPJ da Conta</label>
                  <input
                    type="text"
                    className="frequencia-select"
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Agência</label>
                  <input
                    type="text"
                    className="frequencia-select"
                    placeholder="Ex: 0001"
                    value={agencia}
                    onChange={(e) => setAgencia(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Conta Corrente / PIX</label>
                  <input
                    type="text"
                    className="frequencia-select"
                    placeholder="Ex: 12345-6"
                    value={contaCorrente}
                    onChange={(e) => setContaCorrente(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Data Inicial do Saldo</label>
                  <input
                    type="date"
                    className="frequencia-select"
                    value={dataInicial}
                    onChange={(e) => setDataInicial(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Saldo Inicial (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="frequencia-select"
                    placeholder="Ex: 1500.50"
                    value={saldoInicial}
                    onChange={(e) => setSaldoInicial(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Descrição</label>
                <textarea
                  className="frequencia-select"
                  style={{ minHeight: "80px", resize: "vertical" }}
                  placeholder="Informações adicionais sobre esta conta..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px", marginTop: "12px" }}>
                <input
                  type="checkbox"
                  id="contaAtiva"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer", margin: 0 }}
                />
                <label htmlFor="contaAtiva" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)", cursor: "pointer", margin: 0 }}>
                  Conta Ativa
                </label>
              </div>

              <div className="modal-actions" style={{ marginTop: "12px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)} disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="primary-btn">
                  {saving ? "Salvando..." : "Salvar Conta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CadastroContas;
