import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import * as Icons from 'react-icons/bs';
import { useAuth } from '../AuthProvider';
import supabase from '../supabase-client';
import '../css/Frequencia.css';

const AnaliseVales = () => {
  const { user, isAdmin } = useAuth();
  
  const [vales, setVales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedUnidade, setSelectedUnidade] = useState<string>("all");

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
    } else {
      setLoading(false);
    }
  }, [isAdmin, month, year]);

  const fetchVales = async () => {
    try {
      setLoading(true);

      const startOfMonthStr = `${year}-${String(month).padStart(2, "0")}-01T00:00:00.000Z`;
      const endOfMonthDate = new Date(year, month, 0);
      const endOfMonthStr = `${year}-${String(month).padStart(2, "0")}-${String(endOfMonthDate.getDate()).padStart(2, "0")}T23:59:59.999Z`;

      const { data, error } = await supabase
        .from('Vales')
        .select('*')
        .gte('created_at', startOfMonthStr)
        .lte('created_at', endOfMonthStr)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVales(data || []);
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

  // Extract unique lists for filters
  const uniqueEmployees = Array.from(new Set(vales.map(v => v.Nome))).filter(Boolean).sort();
  const uniqueUnidades = Array.from(new Set(vales.map(v => v.Unidade))).filter(Boolean).sort();

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
            <p>Acompanhe os vales lançados pelos funcionários.</p>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", backgroundColor: "#fff", padding: "12px 24px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <span style={{ fontSize: "1.2rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Filtrado</span>
            <span style={{ fontSize: "2.4rem", color: "var(--primary-color)", fontWeight: 800 }}>
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="frequencia-controls" style={{ flexWrap: "wrap", gap: "16px" }}>
          <div className="control-group">
            <button className="nav-btn" onClick={() => handleMonthNavigation("prev")} title="Mês Anterior">
              <Icons.BsChevronLeft />
            </button>

            <select
              className="frequencia-select"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
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
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {yearsList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button className="nav-btn" onClick={() => handleMonthNavigation("next")} title="Próximo Mês">
              <Icons.BsChevronRight />
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
              <table className="freq-table" style={{ minWidth: "800px" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", width: "180px" }}>Data do Lançamento</th>
                    <th style={{ textAlign: "left", width: "200px" }}>Funcionário</th>
                    <th style={{ textAlign: "left", width: "150px" }}>Unidade</th>
                    <th style={{ textAlign: "left" }}>Produto</th>
                    <th style={{ textAlign: "right", width: "150px" }}>Valor (R$)</th>
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
                      <td style={{ textAlign: "right", color: "var(--primary-color)", fontWeight: "bold", fontSize: "1.4rem" }}>
                        R$ {Number(vale.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AnaliseVales;
