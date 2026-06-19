import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../../services/supabase-client";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../../css/Frequencia.css";

interface Voucher {
  id: number;
  created_at: string;
  voucher_id: string;
  active: boolean;
  date_consumed: string | null;
  store_consumed: string | null;
  person_consumed: string | null;
  value: string;
}

function CadastroVouchers() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [novoVoucherId, setNovoVoucherId] = useState("");
  const [novoValor, setNovoValor] = useState("");
  const [novoAtivo, setNovoAtivo] = useState(true);

  // Edit states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ voucher_id: string; value: string; active: boolean }>({
    voucher_id: "",
    value: "",
    active: true
  });

  useEffect(() => {
    if (isAdmin === false) {
      navigate("/");
    } else if (isAdmin === true) {
      fetchVouchers();
    }
  }, [isAdmin, navigate]);

  async function fetchVouchers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Vouchers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVouchers(data || []);
    } catch (err) {
      console.error("Erro ao buscar vouchers:", err);
      alert("Erro ao buscar vouchers");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddVoucher(e: React.FormEvent) {
    e.preventDefault();
    if (!novoVoucherId.trim() || !novoValor.trim()) {
      alert("Preencha o identificador do voucher e o valor.");
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from("Vouchers")
        .insert([
          { 
            voucher_id: novoVoucherId.trim(), 
            value: novoValor.trim(),
            active: novoAtivo
          }
        ]);

      if (error) throw error;

      setNovoVoucherId("");
      setNovoValor("");
      setNovoAtivo(true);
      fetchVouchers();
    } catch (err: any) {
      console.error("Erro ao adicionar voucher:", err);
      alert(err.message || "Erro ao adicionar voucher");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteVoucher(id: number) {
    if (!window.confirm("Deseja realmente excluir este voucher?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("Vouchers").delete().eq("id", id);
      if (error) throw error;
      fetchVouchers();
    } catch (err) {
      console.error("Erro ao deletar voucher:", err);
      alert("Erro ao deletar voucher");
      setLoading(false);
    }
  }

  async function toggleActive(id: number, currentStatus: boolean) {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("Vouchers")
        .update({ active: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      fetchVouchers();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar status do voucher");
      setLoading(false);
    }
  }

  const startEditing = (voucher: Voucher) => {
    setEditingId(voucher.id);
    setEditData({
      voucher_id: voucher.voucher_id,
      value: voucher.value,
      active: voucher.active,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = async (id: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("Vouchers")
        .update({
          voucher_id: editData.voucher_id.trim(),
          value: editData.value.trim(),
          active: editData.active
        })
        .eq("id", id);
        
      if (error) throw error;
      
      setEditingId(null);
      fetchVouchers();
    } catch (err: any) {
      console.error("Erro ao salvar edição:", err);
      alert(err.message || "Erro ao salvar edição");
      setLoading(false);
    }
  };

  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isAdmin === false) {
    return null;
  }

  const renderTable = (filteredVouchers: Voucher[]) => {
    if (filteredVouchers.length === 0) {
      return <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px dashed #cbd5e1", marginBottom: "30px" }}>Nenhum voucher encontrado nesta categoria.</p>;
    }
    return (
      <div className="freq-table-wrapper" style={{ overflowX: "auto", marginBottom: "30px" }}>
        <table className="freq-table">
          <thead>
            <tr>
              <th>Data de Criação</th>
              <th>Voucher (Identificador)</th>
              <th>Valor / Produto</th>
              <th>Status</th>
              <th>Data Consumo</th>
              <th>Loja</th>
              <th>Atendente</th>
              <th style={{ textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredVouchers.map((voucher) => (
              <tr key={voucher.id}>
                {editingId === voucher.id ? (
                  <>
                    <td style={{ fontSize: "0.9rem" }}>{formatDisplayDate(voucher.created_at)}</td>
                    <td>
                      <input
                        type="text"
                        value={editData.voucher_id}
                        onChange={(e) => setEditData({...editData, voucher_id: e.target.value})}
                        style={{ width: "100%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editData.value}
                        onChange={(e) => setEditData({...editData, value: e.target.value})}
                        style={{ width: "100%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={editData.active}
                        onChange={(e) => setEditData({...editData, active: e.target.checked})}
                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                      />
                    </td>
                    <td style={{ fontSize: "0.9rem" }}>{formatDisplayDate(voucher.date_consumed)}</td>
                    <td>{voucher.store_consumed || "-"}</td>
                    <td>{voucher.person_consumed || "-"}</td>
                    <td style={{ textAlign: "center", display: "flex", gap: "8px", justifyContent: "center", alignItems: "center", minHeight: "42px" }}>
                      <button onClick={() => saveEditing(voucher.id)} title="Salvar" style={{ background: "transparent", border: "none", color: "#10b981", cursor: "pointer", fontSize: "1.4rem", padding: 0 }}>
                        <Icons.BsCheckCircleFill />
                      </button>
                      <button onClick={cancelEditing} title="Cancelar" style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.4rem", padding: 0 }}>
                        <Icons.BsXCircleFill />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ fontSize: "0.9rem" }}>{formatDisplayDate(voucher.created_at)}</td>
                    <td style={{ fontWeight: 600 }}>{voucher.voucher_id}</td>
                    <td>{voucher.value}</td>
                    <td>
                      <span 
                        onClick={() => toggleActive(voucher.id, voucher.active)}
                        style={{ 
                          padding: "4px 8px", 
                          borderRadius: "12px", 
                          fontSize: "0.85rem", 
                          fontWeight: "bold",
                          cursor: "pointer",
                          backgroundColor: voucher.active ? "#d1fae5" : "#fee2e2",
                          color: voucher.active ? "#065f46" : "#991b1b"
                        }}
                        title="Clique para alterar o status"
                      >
                        {voucher.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.9rem" }}>{formatDisplayDate(voucher.date_consumed)}</td>
                    <td>{voucher.store_consumed || "-"}</td>
                    <td>{voucher.person_consumed || "-"}</td>
                    <td style={{ textAlign: "center", display: "flex", gap: "8px", justifyContent: "center", alignItems: "center", minHeight: "42px" }}>
                      <button
                        onClick={() => startEditing(voucher)}
                        title="Editar Voucher"
                        style={{ background: "transparent", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "1.2rem", padding: 0 }}
                      >
                        <Icons.BsPencilSquare />
                      </button>
                      <button
                        onClick={() => handleDeleteVoucher(voucher.id)}
                        className="delete-record-btn"
                        title="Excluir Voucher"
                        style={{ margin: "0" }}
                      >
                        <Icons.BsTrash />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Cadastro de Voucher</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Cadastro de Voucher</h1>
            <p>Gerencie os vouchers da loja.</p>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ marginTop: "20px", maxWidth: "1200px", width: "100%" }}>
          <div className="feriado-form-card" style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#f9fafb", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
            <h4 style={{ marginBottom: "12px", color: "var(--secondary-color)" }}>Cadastrar Novo Voucher</h4>
            <form onSubmit={handleAddVoucher} style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div className="form-group" style={{ marginBottom: 0, flex: "2", minWidth: "200px" }}>
                <label style={{ fontSize: "1.2rem" }}>Nome / Identificador do Voucher</label>
                <input
                  type="text"
                  required
                  className="frequencia-select"
                  placeholder="Ex: João Silva ou VCH-123"
                  value={novoVoucherId}
                  onChange={(e) => setNovoVoucherId(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: "2", minWidth: "200px" }}>
                <label style={{ fontSize: "1.2rem" }}>Valor / Produto</label>
                <input
                  type="text"
                  required
                  className="frequencia-select"
                  placeholder="Ex: Um Gelato Médio"
                  value={novoValor}
                  onChange={(e) => setNovoValor(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: "0.5", minWidth: "100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <label style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Ativo?</label>
                <input
                  type="checkbox"
                  style={{ width: "24px", height: "24px", cursor: "pointer" }}
                  checked={novoAtivo}
                  onChange={(e) => setNovoAtivo(e.target.checked)}
                />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="submit" disabled={saving} className="primary-btn" style={{ padding: "10px 16px" }}>
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : vouchers.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Nenhum voucher registrado.</p>
          ) : (
            <>
              <h4 style={{ marginTop: "20px", marginBottom: "12px", color: "var(--secondary-color)", fontSize: "1.2rem", fontWeight: "600" }}>Vouchers Ativos</h4>
              {renderTable(vouchers.filter(v => v.active))}

              <h4 style={{ marginTop: "20px", marginBottom: "12px", color: "var(--secondary-color)", fontSize: "1.2rem", fontWeight: "600" }}>Vouchers Inativos</h4>
              {renderTable(vouchers.filter(v => !v.active))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CadastroVouchers;
