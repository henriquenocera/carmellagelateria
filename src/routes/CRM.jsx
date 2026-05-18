import React, { useState, useEffect } from "react";
import supabase from "../supabase-client";
import "../css/CRM.css";
import { BsPlus, BsSearch, BsPencil, BsTrash, BsChatDots, BsPhone, BsEnvelope } from "react-icons/bs";
import { Helmet } from "react-helmet";

const CRM = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Lead",
    source: "",
    notes: ""
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchInteractions = async (leadId) => {
    const { data, error } = await supabase
      .from("lead_interactions")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) {
      setInteractions([]);
    } else {
      setInteractions(data || []);
    }
  };

  const handleOpenHistory = (lead) => {
    setSelectedLead(lead);
    fetchInteractions(lead.id);
  };

  const handleAddInteraction = async () => {
    if (!newNote.trim()) return;
    const { data, error } = await supabase
      .from("lead_interactions")
      .insert([{ lead_id: selectedLead.id, note: newNote }])
      .select();

    if (!error && data) {
      setInteractions([data[0], ...interactions]);
    } else {
      // Mock for demo if table missing
      setInteractions([{ id: Date.now(), note: newNote, created_at: new Date().toISOString() }, ...interactions]);
    }
    setNewNote("");
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching leads:", error);
        // Fallback to mock data if table doesn't exist
        setLeads([
          { id: 1, name: "João Silva", email: "joao@example.com", phone: "(11) 98888-7777", status: "Lead", created_at: new Date().toISOString() },
          { id: 2, name: "Maria Oliveira", email: "maria@example.com", phone: "(11) 96666-5555", status: "Prospect", created_at: new Date().toISOString() },
          { id: 3, name: "Tech Solutions", email: "contato@tech.com", phone: "(41) 3333-2222", status: "Customer", created_at: new Date().toISOString() },
        ]);
      } else {
        setLeads(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("leads")
        .insert([newLead])
        .select();

      if (error) {
        alert("Erro ao adicionar lead. Verifique se a tabela 'leads' existe no Supabase.");
        // Add to local state anyway for demo if error
        setLeads([{ ...newLead, id: Date.now(), created_at: new Date().toISOString() }, ...leads]);
      } else {
        setLeads([data[0], ...leads]);
      }
      setShowModal(false);
      setNewLead({ name: "", email: "", phone: "", status: "Lead", source: "", notes: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este lead?")) {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) {
        console.error("Error deleting lead:", error);
        setLeads(leads.filter(l => l.id !== id));
      } else {
        setLeads(leads.filter(l => l.id !== id));
      }
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "Lead": return "status-lead";
      case "Prospect": return "status-prospect";
      case "Customer": return "status-customer";
      case "Lost": return "status-lost";
      default: return "";
    }
  };

  return (
    <div className="crm-page">
      <Helmet>
        <title>CRM | Carmella Gelateria</title>
      </Helmet>

      <div className="crm-header">
        <h1>CRM - Gestão de Leads</h1>
        <button className="crm-add-btn" onClick={() => setShowModal(true)}>
          <BsPlus size={24} /> Novo Lead
        </button>
      </div>

      <div className="crm-stats">
        <div className="crm-stat-card">
          <span className="label">Total de Leads</span>
          <span className="value">{leads.length}</span>
        </div>
        <div className="crm-stat-card">
          <span className="label">Prospectos</span>
          <span className="value">{leads.filter(l => l.status === "Prospect").length}</span>
        </div>
        <div className="crm-stat-card">
          <span className="label">Clientes</span>
          <span className="value">{leads.filter(l => l.status === "Customer").length}</span>
        </div>
      </div>

      <div className="crm-content">
        <div className="crm-search-container">
          <div className="crm-search-wrapper">
            <BsSearch className="crm-search-icon" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              className="crm-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contato</th>
                <th>Status</th>
                <th>Data de Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>Carregando...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>Nenhum lead encontrado.</td></tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id}>
                    <td>
                      <div style={{ fontWeight: "700", color: "#2c3e50", fontSize: "1.9rem" }}>{lead.name}</div>
                      <div style={{ fontSize: "1.1rem", color: "#7f8c8d", marginTop: "0.3rem" }}>{lead.source || "Fonte não informada"}</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "0.8rem", color: "#2d3436" }}>
                          <BsEnvelope color="#7c4dff" size={18} /> {lead.email}
                        </span>
                        <span style={{ fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "0.8rem", color: "#2d3436" }}>
                          <BsPhone color="#00b894" size={18} /> {lead.phone}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "1.7rem", color: "#7f8c8d", fontWeight: "600" }}>
                      {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn" title="Editar"><BsPencil /></button>
                        <button className="action-btn" title="Histórico de Contato" onClick={() => handleOpenHistory(lead)}><BsChatDots /></button>
                        <button className="action-btn" title="Excluir" onClick={() => deleteLead(lead.id)}><BsTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Cadastrar Novo Lead</h2>
            <form onSubmit={handleAddLead}>
              <div className="form-group">
                <label>Nome Completo / Empresa</label>
                <input
                  type="text"
                  required
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Status Inicial</label>
                  <select
                    value={newLead.status}
                    onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                  >
                    <option value="Lead">Lead</option>
                    <option value="Prospect">Prospecto</option>
                    <option value="Customer">Cliente</option>
                    <option value="Lost">Perdido</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fonte / Origem</label>
                  <input
                    type="text"
                    placeholder="Ex: Instagram, Indicação"
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Observações Iniciais</label>
                <textarea
                  rows="3"
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* interaction History Modal (Simplified) */}
      {selectedLead && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "600px" }}>
            <h2>Histórico: {selectedLead.name}</h2>
            <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "1.5rem", padding: "1rem", background: "#f8f9fa", borderRadius: "8px" }}>
              {interactions.length === 0 ? (
                <p style={{ textAlign: "center", color: "#7f8c8d" }}>Nenhuma interação registrada.</p>
              ) : (
                interactions.map(inter => (
                  <div key={inter.id} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#3498db", fontWeight: "600" }}>
                      <span>{new Date(inter.created_at).toLocaleString("pt-BR")}</span>
                    </div>
                    <p style={{ margin: "0.3rem 0", fontSize: "0.9rem" }}>{inter.note}</p>
                  </div>
                ))
              )}
            </div>
            <div className="form-group">
              <label>Nova Anotação</label>
              <textarea
                rows="2"
                placeholder="Ex: Liguei e combinamos de visitar..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              ></textarea>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => setSelectedLead(null)}>Fechar</button>
              <button type="button" className="btn-save" onClick={handleAddInteraction}>Adicionar Nota</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;
