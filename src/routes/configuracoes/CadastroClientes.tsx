import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../../services/supabase-client";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../../css/Frequencia.css";
import ClienteFormModal from "../../components/ClienteFormModal.tsx";

function CadastroClientes() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<any>(null);

  useEffect(() => {
    if (isAdmin === false) {
      navigate("/");
    } else if (isAdmin === true) {
      fetchClientes();
    }
  }, [isAdmin, navigate]);

  async function fetchClientes() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clientes_food_service")
        .select("*")
        .order("nome", { ascending: true });

      if (error) throw error;
      setClientes(data || []);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
      alert("Erro ao buscar clientes. Verifique se a tabela 'clientes_food_service' está correta.");
    } finally {
      setLoading(false);
    }
  }

  const openModal = (cliente?: any) => {
    setEditingCliente(cliente || null);
    setIsModalOpen(true);
  };

  async function handleToggleAtivo(id: string, currentAtivo: boolean) {
    try {
      setLoading(true);
      const { error } = await supabase.from("clientes_food_service").update({ ativo: !currentAtivo }).eq("id", id);
      if (error) throw error;
      fetchClientes();
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      alert("Erro ao alterar o status do cliente.");
      setLoading(false);
    }
  }

  async function handleDeleteCliente(id: string) {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("clientes_food_service").delete().eq("id", id);
      if (error) throw error;
      fetchClientes();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar cliente");
      setLoading(false);
    }
  }

  const getStatusColor = (statusVal: string) => {
    switch (statusVal) {
      case "Lead": return "#3b82f6";
      case "Em Contato": return "#f59e0b";
      case "Negócio Fechado": return "#10b981";
      case "Perdido": return "#ef4444";
      default: return "#94a3b8";
    }
  };

  return (
    <>
      <Helmet>
        <title>Clientes Food Service</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="frequencia-title-group">
            <h1>Clientes Food Service</h1>
            <p>Gerencie os clientes da empresa, informações de contato e localização.</p>
          </div>
          <button className="primary-btn" onClick={() => openModal()}>
            <Icons.BsPlusLg style={{ marginRight: "8px" }} />
            Novo Cliente
          </button>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : clientes.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Nenhum cliente registrado.</p>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "1100px" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center", width: "60px" }}>Ativo</th>
                    <th style={{ width: "200px" }}>Nome</th>
                    <th style={{ width: "150px" }}>Tipo / Contato</th>
                    <th style={{ width: "200px" }}>Endereço / CEP</th>
                    <th style={{ textAlign: "center", width: "120px" }}>Status</th>
                    <th style={{ textAlign: "center", width: "80px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c) => (
                    <tr key={c.id} style={{ opacity: c.ativo ? 1 : 0.6 }}>
                      <td
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleToggleAtivo(c.id, c.ativo)}
                        title={c.ativo ? "Desativar cliente" : "Ativar cliente"}
                      >
                        {c.ativo ? (
                          <Icons.BsCheckCircleFill style={{ color: "#22c55e", fontSize: "1.5rem" }} />
                        ) : (
                          <Icons.BsXCircleFill style={{ color: "#94a3b8", fontSize: "1.5rem" }} />
                        )}
                      </td>
                      <td style={{ fontWeight: 500 }}>{c.nome}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{c.tipo || "-"}</div>
                        {c.nome_contato && <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}><Icons.BsPerson /> {c.nome_contato}</div>}
                        {c.telefone && <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}><Icons.BsTelephone /> {c.telefone}</div>}
                      </td>
                      <td>
                        {c.endereco || "-"}
                        {c.cep && <span style={{ display: "block", fontSize: "0.85rem", color: "#666" }}>CEP: {c.cep}</span>}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ 
                          padding: "4px 8px", 
                          borderRadius: "12px", 
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          backgroundColor: `${getStatusColor(c.status || "Lead")}20`,
                          color: getStatusColor(c.status || "Lead")
                        }}>
                          {c.status || "Lead"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center", height: "100%", padding: "12px 8px" }}>
                        <button
                          onClick={() => openModal(c)}
                          className="delete-record-btn"
                          title="Editar Cliente"
                          style={{ margin: 0, color: "var(--primary-color)" }}
                        >
                          <Icons.BsPencil />
                        </button>
                        <button
                          onClick={() => handleDeleteCliente(c.id)}
                          className="delete-record-btn"
                          title="Excluir Cliente"
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

      <ClienteFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cliente={editingCliente}
        onSuccess={fetchClientes}
      />
    </>
  );
}

export default CadastroClientes;
