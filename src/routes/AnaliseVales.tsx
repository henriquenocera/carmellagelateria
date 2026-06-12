import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import * as Icons from 'react-icons/bs';
import { useAuth } from '../AuthProvider';
import supabase from '../services/supabase-client';
import '../css/Frequencia.css';
import ConfirmModal from '../components/ConfirmModal';

const AnaliseVales = () => {
  const { user, isAdmin } = useAuth();

  const [vales, setVales] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedUnidade, setSelectedUnidade] = useState<string>("all");
  const [showAll, setShowAll] = useState<boolean>(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => { } });
  const [editId, setEditId] = useState<number | null>(null);

  // Form State
  const [formDate, setFormDate] = useState('');
  const [formNome, setFormNome] = useState('');
  const [formUnidade, setFormUnidade] = useState('');
  const [formItem, setFormItem] = useState('');
  const [formValor, setFormValor] = useState('');

  const unidadesList = ["Alto da XV", "Batel", "Ahu", "Fábrica"];

  const yearsList = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i);
  const monthsList = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  useEffect(() => {
    if (isAdmin) {
      fetchVales();
      fetchAuxData();
    } else {
      setLoading(false);
    }
  }, [isAdmin, month, year, showAll]);

  const fetchAuxData = async () => {
    try {
      const { data: prodData } = await supabase.from('produtos_vale').select('*').order('nome');
      if (prodData) setProdutos(prodData);

      const { data: profData } = await supabase.from('profiles').select('*').order('name');
      if (profData) setProfiles(profData);
    } catch (err) {
      console.error('Erro ao buscar dados auxiliares:', err);
    }
  };

  const fetchVales = async () => {
    try {
      setLoading(true);

      let allData: any[] = [];
      let from = 0;
      const step = 1000;
      let hasMore = true;

      while (hasMore) {
        let query = supabase.from('Vales').select('*').order('created_at', { ascending: false }).range(from, from + step - 1);

        if (!showAll) {
          const startDate = new Date(year, month - 1, 1, 0, 0, 0);
          const endDate = new Date(year, month, 0, 23, 59, 59, 999);
          query = query.gte('created_at', startDate.toISOString()).lte('created_at', endDate.toISOString());
        }

        const { data: vData, error: vError } = await query;
        if (vError) throw vError;

        if (vData && vData.length > 0) {
          allData = [...allData, ...vData];
          from += step;
          if (vData.length < step) hasMore = false;
        } else {
          hasMore = false;
        }
      }

      setVales(allData);
    } catch (err) {
      console.error('Erro ao buscar vales:', err);
      alert('Erro ao buscar análise de vales.');
    } finally {
      setLoading(false);
    }
  };

  const handleMonthNavigation = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (month === 1) {
        setMonth(12);
        setYear((prev) => prev - 1);
      } else {
        setMonth((prev) => prev - 1);
      }
    } else {
      if (month === 12) {
        setMonth(1);
        setYear((prev) => prev + 1);
      } else {
        setMonth((prev) => prev + 1);
      }
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  // --- CRUD LÓGICA ---

  const openModal = (vale: any = null) => {
    if (vale) {
      setEditId(vale.id);
      setFormNome(vale.Nome || '');
      setFormUnidade(vale.Unidade || '');
      setFormItem(vale.Item || '');
      setFormValor(vale.valor !== null ? vale.valor.toString() : '');

      if (vale.created_at) {
        const d = new Date(vale.created_at);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const h = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        setFormDate(`${y}-${m}-${day}T${h}:${min}`);
      } else {
        setFormDate('');
      }
    } else {
      setEditId(null);
      setFormNome('');
      setFormUnidade('');
      setFormItem('');
      setFormValor('');

      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      setFormDate(d.toISOString().slice(0, 16));
    }
    setIsModalOpen(true);
  };

  const handleItemChange = (selectedItemName: string, dateStr: string) => {
    setFormItem(selectedItemName);
    const prod = produtos.find(p => p.nome === selectedItemName);
    if (prod) {
      let finalValor = Number(prod.valor);

      if (selectedItemName.toUpperCase().includes('COMBO')) {
        const d = dateStr ? new Date(dateStr) : new Date();
        const dayOfWeek = d.getDay(); // 0 = Dom, 1 = Seg, 2 = Ter, 3 = Qua, 4 = Qui, 5 = Sex, 6 = Sab

        const isMonday = selectedItemName.toUpperCase().includes('SEGUNDA') && dayOfWeek === 1;
        const isTuesday = selectedItemName.toUpperCase().includes('TERÇA') && dayOfWeek === 2;
        const isWednesday = selectedItemName.toUpperCase().includes('QUARTA') && dayOfWeek === 3;
        const isThursday = selectedItemName.toUpperCase().includes('QUINTA') && dayOfWeek === 4;
        const isFriday = selectedItemName.toUpperCase().includes('SEXTA') && dayOfWeek === 5;

        if (isMonday || isTuesday || isWednesday || isThursday || isFriday) {
          finalValor = finalValor - 2;
        }
      }

      // Vales de consumo agora são negativos por padrão, então invertemos o sinal
      setFormValor((-Math.abs(finalValor)).toString());
    } else if (selectedItemName === "Crédito (Acréscimo)") {
      setFormValor(""); // Deixa vazio para o usuário preencher valor positivo
    }
  };

  const handleDateChange = (newDate: string) => {
    setFormDate(newDate);
    if (formItem) {
      handleItemChange(formItem, newDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome || !formUnidade || !formItem || !formValor || !formDate) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      const valorNumerico = parseFloat(formValor.replace(',', '.'));
      if (isNaN(valorNumerico)) throw new Error("Valor inválido");

      const dateObj = new Date(formDate);

      const payload = {
        Nome: formNome,
        Unidade: formUnidade,
        Item: formItem,
        valor: valorNumerico,
        created_at: dateObj.toISOString()
      };

      if (editId) {
        const { error } = await supabase.from('Vales').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('Vales').insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);

      // Mudar os filtros para a data do lançamento que acabou de ser salvo se precisar
      const insertedMonth = dateObj.getMonth() + 1;
      const insertedYear = dateObj.getFullYear();

      if (month !== insertedMonth || year !== insertedYear) {
        setMonth(insertedMonth);
        setYear(insertedYear);
      } else {
        fetchVales();
      }

    } catch (err: any) {
      console.error('Erro ao salvar vale:', err);
      alert(err.message || 'Erro ao salvar lançamento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      isOpen: true,
      message: "Tem certeza que deseja excluir este lançamento permanentemente?",
      onConfirm: async () => {
        setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } });
        try {
          setLoading(true);
          const { error } = await supabase.from('Vales').delete().eq('id', id);
          if (error) throw error;
          fetchVales();
        } catch (err) {
          console.error("Erro ao excluir", err);
          alert("Erro ao excluir o lançamento.");
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

  // Extract unique lists for filters based on what is in the DB
  const uniqueEmployees = Array.from(new Set([...profiles.map(p => p.name.split(" ")[0]), ...vales.map(v => v.Nome)])).filter(Boolean).sort();
  const uniqueUnidades = Array.from(new Set([...unidadesList, ...vales.map(v => v.Unidade)])).filter(Boolean).sort();

  // Apply frontend filters
  const filteredVales = vales.filter(v => {
    const matchEmp = selectedEmployee === "all" || v.Nome === selectedEmployee;
    const matchUni = selectedUnidade === "all" || v.Unidade === selectedUnidade;
    return matchEmp && matchUni;
  });

  const totalValue = filteredVales.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  return (
    <>
      <Helmet>
        <title>Análise de Vales</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Análise de Vales</h1>
            <p>Acompanhe e gerencie os vales lançados pelos funcionários.</p>
          </div>

          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", backgroundColor: "#fff", padding: "12px 24px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: "1.2rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Filtrado</span>
              <span style={{ fontSize: "2.4rem", color: totalValue >= 0 ? "#22c55e" : "#ef4444", fontWeight: 800 }}>
                {totalValue >= 0 ? '+ ' : '- '}R$ {Math.abs(totalValue).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <button className="primary-btn" onClick={() => openModal()} style={{ height: "fit-content", padding: "16px 24px", fontSize: "1.5rem" }}>
              <Icons.BsPlusLg style={{ marginRight: '8px' }} />
              Lançar Vale
            </button>
          </div>
        </div>

        <div className="frequencia-controls" style={{ flexWrap: "wrap", gap: "16px" }}>
          <div className="control-group">
            <button className="nav-btn" onClick={() => { setShowAll(false); handleMonthNavigation("prev"); }} title="Mês Anterior">
              <Icons.BsChevronLeft />
            </button>

            <select
              className="frequencia-select"
              value={month}
              onChange={(e) => { setShowAll(false); setMonth(Number(e.target.value)); }}
              disabled={showAll}
            >
              {monthsList.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              className="frequencia-select"
              value={year}
              onChange={(e) => { setShowAll(false); setYear(Number(e.target.value)); }}
              disabled={showAll}
            >
              {yearsList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button className="nav-btn" onClick={() => { setShowAll(false); handleMonthNavigation("next"); }} title="Próximo Mês">
              <Icons.BsChevronRight />
            </button>

            <button
              className="frequencia-select"
              onClick={() => setShowAll(!showAll)}
              style={{ background: showAll ? "var(--primary-color)" : "#fff", color: showAll ? "#fff" : "inherit", cursor: "pointer", marginLeft: "10px", fontWeight: showAll ? "bold" : "normal" }}
            >
              {showAll ? "Vendo Todos os Períodos" : "Ver Todos"}
            </button>
          </div>

          <div className="control-group" style={{ marginLeft: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsShop style={{ color: "var(--text-muted)", fontSize: "1.4rem" }} />
              <select
                className="frequencia-select"
                value={selectedUnidade}
                onChange={(e) => setSelectedUnidade(e.target.value)}
                style={{ width: "160px" }}
              >
                <option value="all">Todas Unidades</option>
                {uniqueUnidades.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "16px" }}>
              <Icons.BsPerson style={{ color: "var(--text-muted)", fontSize: "1.4rem" }} />
              <select
                className="frequencia-select"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                style={{ width: "200px" }}
              >
                <option value="all">Todos Funcionários</option>
                {uniqueEmployees.map(emp => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "3rem", color: "var(--primary-color)" }} />
            </div>
          ) : filteredVales.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#fff", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <Icons.BsReceipt style={{ fontSize: "4rem", color: "#94a3b8", marginBottom: "16px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "1.5rem", fontWeight: 500 }}>Nenhum vale encontrado para os filtros selecionados.</p>
            </div>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "900px" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", width: "180px" }}>Data do Lançamento</th>
                    <th style={{ textAlign: "left", width: "200px" }}>Funcionário</th>
                    <th style={{ textAlign: "left", width: "150px" }}>Unidade</th>
                    <th style={{ textAlign: "left" }}>Produto</th>
                    <th style={{ textAlign: "right", width: "130px" }}>Valor (R$)</th>
                    <th style={{ textAlign: "center", width: "100px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVales.map((vale) => (
                    <tr key={vale.id}>
                      <td style={{ color: "var(--text-muted)", fontSize: "1.3rem" }}>{formatDateTime(vale.created_at)}</td>
                      <td style={{ fontWeight: 600, color: "var(--secondary-color)" }}>{vale.Nome}</td>
                      <td>
                        <span style={{ backgroundColor: "#e2e8f0", color: "#475569", padding: "4px 8px", borderRadius: "4px", fontSize: "1.2rem", fontWeight: 600 }}>
                          {vale.Unidade}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{vale.Item}</td>
                      <td style={{ textAlign: "right", color: Number(vale.valor) > 0 ? "#22c55e" : "#ef4444", fontWeight: "bold", fontSize: "1.4rem" }}>
                        {Number(vale.valor) > 0 ? '+ ' : Number(vale.valor) < 0 ? '- ' : ''}R$ {Math.abs(Number(vale.valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                        <button
                          onClick={() => openModal(vale)}
                          className="delete-record-btn"
                          title="Editar Lançamento"
                          style={{ margin: 0, color: "#3b82f6" }}
                        >
                          <Icons.BsPencil />
                        </button>
                        <button
                          onClick={() => handleDelete(vale.id)}
                          className="delete-record-btn"
                          title="Excluir Lançamento"
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

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "var(--secondary-color)" }}>
                {editId ? "Editar Lançamento de Vale" : "Novo Lançamento de Vale"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <Icons.BsX />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)" }}>Data e Hora *</label>
                    <input
                      type="datetime-local"
                      required
                      className="frequencia-select"
                      value={formDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      style={{ background: "#fff", width: "100%" }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)" }}>Funcionário *</label>
                    <select
                      required
                      className="frequencia-select"
                      value={formNome}
                      onChange={(e) => setFormNome(e.target.value)}
                      style={{ background: "#fff", width: "100%" }}
                    >
                      <option value="" disabled>Selecione um funcionário</option>
                      {uniqueEmployees.map(emp => (
                        <option key={emp} value={emp}>{emp}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)" }}>Unidade *</label>
                    <select
                      required
                      className="frequencia-select"
                      value={formUnidade}
                      onChange={(e) => setFormUnidade(e.target.value)}
                      style={{ background: "#fff", width: "100%" }}
                    >
                      <option value="" disabled>Selecione uma unidade</option>
                      {uniqueUnidades.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)" }}>Produto *</label>
                    <select
                      required
                      className="frequencia-select"
                      value={formItem}
                      onChange={(e) => handleItemChange(e.target.value, formDate)}
                      style={{ background: "#fff", width: "100%" }}
                    >
                      <option value="" disabled>Selecione um produto</option>
                      <option value="Crédito (Acréscimo)">🌟 Crédito (Acréscimo Positivo)</option>
                      {produtos.map(p => (
                        <option key={p.id} value={p.nome}>{p.nome}</option>
                      ))}
                      {/* Caso seja um item antigo que não está mais na lista de produtos */}
                      {formItem && !produtos.find(p => p.nome === formItem) && formItem !== "Crédito (Acréscimo)" && (
                        <option value={formItem}>{formItem} (Antigo)</option>
                      )}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)" }}>
                      Valor (R$) *
                    </label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <span style={{ position: "absolute", left: "12px", color: "var(--text-muted)", zIndex: 1, pointerEvents: "none", fontSize: "1.3rem" }}>R$</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        className="frequencia-select"
                        placeholder="0,00"
                        value={formValor}
                        onChange={(e) => setFormValor(e.target.value)}
                        style={{ paddingLeft: "36px", background: "#fff", width: "100%" }}
                      />
                    </div>
                    <span style={{ fontSize: "1.1rem", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>Pode ser alterado manualmente se necessário.</span>
                  </div>

                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: "8px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                  Cancelar
                </button>
                <button type="submit" disabled={submitting} className="primary-btn">
                  {submitting ? "Salvando..." : "Salvar Lançamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } })}
        confirmText="Excluir"
      />
    </>
  );
};

export default AnaliseVales;
