import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import html2canvas from "html2canvas";
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

  const [generatingVoucher, setGeneratingVoucher] = useState<Voucher | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

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

  const handleGenerateImage = (voucher: Voucher) => {
    setGeneratingVoucher(voucher);
  };

  useEffect(() => {
    if (generatingVoucher && ticketRef.current) {
      setTimeout(() => {
        if (ticketRef.current) {
          html2canvas(ticketRef.current, { backgroundColor: null, scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = imgData;
            link.download = `Voucher_${generatingVoucher.voucher_id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setGeneratingVoucher(null);
          }).catch(err => {
            console.error("Erro ao gerar imagem", err);
            alert("Erro ao gerar cupom.");
            setGeneratingVoucher(null);
          });
        }
      }, 500);
    }
  }, [generatingVoucher]);

  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>{date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
        <span style={{ fontSize: "0.95rem", color: "#64748b" }}>{date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    );
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
                    <td>{formatDisplayDate(voucher.created_at)}</td>
                    <td>
                      <input
                        type="text"
                        value={editData.voucher_id}
                        onChange={(e) => setEditData({ ...editData, voucher_id: e.target.value })}
                        style={{ width: "100%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editData.value}
                        onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                        style={{ width: "100%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={editData.active}
                        onChange={(e) => setEditData({ ...editData, active: e.target.checked })}
                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                      />
                    </td>
                    <td>{formatDisplayDate(voucher.date_consumed)}</td>
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
                    <td>{formatDisplayDate(voucher.created_at)}</td>
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
                    <td>{formatDisplayDate(voucher.date_consumed)}</td>
                    <td>{voucher.store_consumed || "-"}</td>
                    <td>{voucher.person_consumed || "-"}</td>
                    <td style={{ textAlign: "center", display: "flex", gap: "8px", justifyContent: "center", alignItems: "center", minHeight: "42px" }}>
                      <button
                        onClick={() => handleGenerateImage(voucher)}
                        title="Gerar Imagem do Cupom"
                        style={{ background: "transparent", border: "none", color: "#10b981", cursor: "pointer", fontSize: "1.2rem", padding: 0 }}
                      >
                        <Icons.BsImage />
                      </button>
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
              <h4 style={{ marginTop: "20px", marginBottom: "12px", color: "var(--secondary-color)", fontSize: "1.2rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                Vouchers Ativos <span style={{ backgroundColor: "#d1fae5", color: "#065f46", padding: "2px 8px", borderRadius: "12px", fontSize: "0.9rem" }}>{vouchers.filter(v => v.active).length}</span>
              </h4>
              {renderTable(vouchers.filter(v => v.active))}

              <h4 style={{ marginTop: "20px", marginBottom: "12px", color: "var(--secondary-color)", fontSize: "1.2rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                Vouchers Inativos <span style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "2px 8px", borderRadius: "12px", fontSize: "0.9rem" }}>{vouchers.filter(v => !v.active).length}</span>
              </h4>
              {renderTable(vouchers.filter(v => !v.active))}
            </>
          )}
        </div>
      </div>

      {generatingVoucher && (
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          <div ref={ticketRef} style={{
            padding: "40px",
            backgroundColor: "#eedbb5",
            boxSizing: "border-box",
            display: "inline-block",
            fontFamily: "'Inter', 'Roboto', sans-serif"
          }}>
            <div style={{
              display: "flex",
              width: "800px",
              height: "360px",
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15))"
            }}>

              <div style={{
                width: "20px",
                height: "100%",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='40'%3E%3Cpath d='M20 0v40H0v-10a10 10 0 0 1 0-20V0z' fill='%23eedbb5'/%3E%3C/svg%3E\")",
                backgroundRepeat: "repeat-y",
                backgroundPosition: "left top"
              }}></div>

              <div style={{
                flex: 1,
                backgroundColor: "#eedbb5",
                padding: "24px 4px",
                display: "flex",
                boxSizing: "border-box"
              }}>
                <div style={{
                  flex: 1,
                  backgroundColor: "#fffdf3",
                  borderRadius: "16px",
                  display: "flex",
                  border: "5px solid #dfc79b",
                  position: "relative"
                }}>

                  {/* Left Side */}
                  <div style={{
                    flex: "0 0 70%",
                    padding: "40px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative"
                  }}>
                    <img
                      src="/logo.svg"
                      alt="Carmella Gelateria"
                      style={{ height: "70px", marginBottom: "32px" }}
                    />
                    <p style={{ color: "#6a5c55", fontSize: "1.3rem", margin: "0 0 24px 0", maxWidth: "90%" }}>
                      Apresente este voucher no caixa e aproveite nossa autêntica experiência.
                    </p>
                    <div style={{
                      backgroundColor: "#2e1511",
                      padding: "16px 48px",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "2rem",
                      fontWeight: "900",
                      letterSpacing: "8px",
                      boxShadow: "0 4px 10px rgba(46, 21, 17, 0.3)",
                      fontFamily: "monospace"
                    }}>
                      {generatingVoucher.voucher_id}
                    </div>

                    {/* Decorative diamonds */}
                    <div style={{ position: "absolute", width: "16px", height: "16px", backgroundColor: "#f69d3c", transform: "rotate(45deg)", top: "40px", left: "60px" }}></div>
                    <div style={{ position: "absolute", width: "10px", height: "10px", backgroundColor: "#f69d3c", transform: "rotate(45deg)", top: "20px", left: "100px" }}></div>
                    <div style={{ position: "absolute", width: "14px", height: "14px", backgroundColor: "#f69d3c", transform: "rotate(45deg)", bottom: "40px", right: "60px" }}></div>
                    <div style={{ position: "absolute", width: "8px", height: "8px", backgroundColor: "#f69d3c", transform: "rotate(45deg)", bottom: "60px", right: "100px" }}></div>
                  </div>

                  {/* Dashed Separator */}
                  <div style={{
                    borderLeft: "2px dashed #dfc79b",
                    height: "100%",
                    position: "relative"
                  }}>
                    {/* Top Cutout */}
                    <div style={{
                      position: "absolute",
                      top: "-20px",
                      left: "-16px",
                      width: "28px",
                      height: "28px",
                      backgroundColor: "#eedbb5",
                      borderRadius: "50%",
                      zIndex: 1
                    }}></div>

                    {/* Bottom Cutout */}
                    <div style={{
                      position: "absolute",
                      bottom: "-20px",
                      left: "-16px",
                      width: "28px",
                      height: "28px",
                      backgroundColor: "#eedbb5",
                      borderRadius: "50%",
                      zIndex: 1
                    }}></div>
                  </div>

                  {/* Right Side */}
                  <div style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "24px",
                    position: "relative",
                    backgroundColor: "#fffdf3"
                  }}>
                    <h2 style={{
                      color: "#543831",
                      fontSize: "2.6rem",
                      margin: 0,
                      fontWeight: "900",
                      textAlign: "center",
                      lineHeight: "1.1",
                      zIndex: 2
                    }}>
                      {generatingVoucher.value}
                    </h2>

                    <div style={{
                      position: "absolute",
                      bottom: "30px",
                      right: "-20px",
                      transform: "rotate(-90deg)",
                      transformOrigin: "bottom right",
                      color: "#a49481",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      letterSpacing: "3px",
                      whiteSpace: "nowrap"
                    }}>
                      VÁLIDO SOMENTE NA LOJA FÍSICA
                    </div>
                  </div>

                </div>
              </div>

              <div style={{
                width: "20px",
                height: "100%",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='40'%3E%3Cpath d='M0 0v40h20v-10a10 10 0 0 0 0-20V0z' fill='%23eedbb5'/%3E%3C/svg%3E\")",
                backgroundRepeat: "repeat-y",
                backgroundPosition: "right top"
              }}></div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CadastroVouchers;
