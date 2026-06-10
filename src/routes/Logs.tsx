import React, { useEffect, useState } from "react";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import { Navigate } from "react-router-dom";
import moment from "moment";
import * as Icons from "react-icons/bs";
import "../css/Logs.css";

interface LogEntry {
  id: string;
  tabela_afetada: string;
  acao: "INSERT" | "UPDATE" | "DELETE";
  dados_antigos: any;
  dados_novos: any;
  usuario_id: string;
  data_hora: string;
  profiles?: {
    name: string;
    email: string;
  };
}

export default function Logs() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [employeesMap, setEmployeesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const PAGE_SIZE = 50;

  useEffect(() => {
    fetchLogs(0, false);
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await supabase.from("profiles").select("id, name");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach(d => { map[d.id] = d.name; });
        setEmployeesMap(map);
      }
    } catch (err) {
      console.error("Erro ao buscar funcionários", err);
    }
  };

  const fetchLogs = async (currentPage = 0, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Busca os logs e faz o join com a tabela profiles para pegar o nome/email do usuário
      const { data, error } = await supabase
        .from("audit_logs")
        .select(`
          *,
          profiles:usuario_id (
            name,
            email
          )
        `)
        .order("data_hora", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Erro ao buscar logs:", error);
      } else {
        if (data && data.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (append) {
          setLogs((prev) => [...prev, ...(data || [])]);
        } else {
          setLogs(data || []);
        }
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLogs(nextPage, true);
  };

  if (authLoading) return null;

  // Apenas admins podem ver a página de logs
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const getActionBadge = (action: string) => {
    const cls = `badge badge-${action.toLowerCase()}`;
    const labels: Record<string, string> = {
      INSERT: "Criação",
      UPDATE: "Edição",
      DELETE: "Exclusão",
    };
    return <span className={cls}>{labels[action] || action}</span>;
  };

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "?";
  };

  const formatKey = (key: string) => {
    const map: Record<string, string> = {
      employee_id: "Funcionário",
      date: "Data",
      status: "Status",
      observacao: "Observação",
      updated_at: "Atualizado em",
      created_at: "Criado em",
      name: "Nome",
      email: "E-mail",
      role: "Cargo",
      unidade: "Unidade",
      tipo: "Tipo",
      valor: "Valor",
      descricao: "Descrição"
    };
    return map[key] || key;
  };

  const formatValue = (key: string, val: any) => {
    if (val === null || val === undefined) return "Nulo";
    if (key === "employee_id" || key.endsWith("_id")) {
      return employeesMap[val] || val;
    }
    // Datas ISO (ex: 2026-05-26T22:07:43.899+00:00)
    if (typeof val === "string" && val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
      return moment(val).format("DD/MM/YYYY HH:mm");
    }
    // Datas curtas (ex: 2026-03-01)
    if (typeof val === "string" && val.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return moment(val).format("DD/MM/YYYY");
    }
    if (typeof val === "boolean") {
      return val ? "Sim" : "Não";
    }
    return String(val);
  };

  const formatFriendlyDiff = (data: any) => {
    if (!data) return "Sem dados";
    return (
      <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
        {Object.entries(data).map(([key, val]) => (
          <li key={key} style={{ marginBottom: "4px" }}>
            <strong style={{ color: "var(--secondary-color)" }}>{formatKey(key)}:</strong>{" "}
            <span style={{ color: "var(--text-dark)" }}>{formatValue(key, val)}</span>
          </li>
        ))}
      </ul>
    );
  };

  const getContextInfo = (data: any) => {
    if (!data) return null;
    const parts = [];
    if (data.employee_id && employeesMap[data.employee_id]) {
      parts.push(`Funcionário: ${employeesMap[data.employee_id]}`);
    }
    if (data.date) {
      parts.push(`Data: ${formatValue("date", data.date)}`);
    }
    if (data.name) {
      parts.push(`Nome: ${data.name}`);
    }
    
    if (parts.length > 0) {
      return (
        <div style={{ fontSize: "1.15rem", color: "var(--text-muted)", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px dashed var(--border-color)" }}>
          <Icons.BsInfoCircle style={{ verticalAlign: "middle", marginRight: "6px" }} />
          <strong>Referente a:</strong> {parts.join(" | ")}
        </div>
      );
    }
    return null;
  };

  const renderDataDiff = (oldData: any, newData: any, action: string) => {
    const targetData = newData || oldData;
    const context = getContextInfo(targetData);
    if (action === "INSERT") {
      return (
        <div className="log-data-diff">
          {context}
          <div style={{ marginBottom: "8px", fontWeight: 600, color: "#166534" }}>Dados Criados:</div>
          {formatFriendlyDiff(newData)}
        </div>
      );
    }
    if (action === "DELETE") {
      return (
        <div className="log-data-diff">
          {context}
          <div style={{ marginBottom: "8px", fontWeight: 600, color: "#991b1b" }}>Dados Apagados:</div>
          {formatFriendlyDiff(oldData)}
        </div>
      );
    }
    if (action === "UPDATE") {
      // Find differences
      const diff: any = {};
      if (oldData && newData) {
        Object.keys(newData).forEach(key => {
          if (oldData[key] !== newData[key]) {
            diff[key] = { old: oldData[key], new: newData[key] };
          }
        });
      }

      return (
        <div className="log-data-diff">
          {context}
          <div style={{ marginBottom: "8px", fontWeight: 600, color: "#1e40af" }}>Campos Alterados:</div>
          {Object.keys(diff).length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
              {Object.entries(diff).map(([key, changes]: any) => (
                <li key={key} style={{ marginBottom: "6px" }}>
                  <strong style={{ color: "var(--secondary-color)" }}>{formatKey(key)}:</strong>{" "}
                  <span style={{ color: "#ef4444", textDecoration: "line-through", marginRight: "6px" }}>
                    {formatValue(key, changes.old)}
                  </span>
                  <Icons.BsArrowRight style={{ verticalAlign: "middle", color: "var(--text-muted)", marginRight: "6px" }} />
                  <span style={{ color: "#10b981", fontWeight: 500 }}>
                    {formatValue(key, changes.new)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="log-data-empty">Nenhuma diferença detectada</div>
          )}
        </div>
      );
    }
    return <div className="log-data-empty">Sem dados</div>;
  };

  const filteredLogs = logs.filter((log) => {
    const s = search.toLowerCase();
    const userName = log.profiles?.name?.toLowerCase() || "";
    const userEmail = log.profiles?.email?.toLowerCase() || "";
    const table = log.tabela_afetada.toLowerCase();
    return (
      userName.includes(s) ||
      userEmail.includes(s) ||
      table.includes(s)
    );
  });

  return (
    <div className="logs-container">
      <div className="logs-header">
        <div className="logs-title-group">
          <h1>Logs de Auditoria</h1>
          <p>Acompanhe todas as interações e alterações no banco de dados do sistema.</p>
        </div>
      </div>

      <div className="logs-controls">
        <input
          type="text"
          className="logs-search"
          placeholder="Buscar por usuário, e-mail ou tabela..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="logs-table-wrapper">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Usuário</th>
              <th>Ação</th>
              <th>Tabela</th>
              <th>Detalhes da Alteração</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <div className="logs-loading">Carregando logs...</div>
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="logs-empty">Nenhum log encontrado.</div>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div className="log-date">
                      {moment(log.data_hora).format("DD/MM/YYYY")}
                    </div>
                    <div className="log-time">
                      {moment(log.data_hora).format("HH:mm:ss")}
                    </div>
                  </td>
                  <td>
                      <div className="log-user-info">
                        <div className="log-user-avatar">
                          {getUserInitials(log.profiles?.name, log.profiles?.email)}
                        </div>
                        <div className="log-user-details">
                          <span className="log-user-name">
                            {log.profiles?.name || "Usuário Desconhecido"}
                          </span>
                          <span className="log-user-email">
                            {log.profiles?.email || ""}
                          </span>
                        </div>
                      </div>
                  </td>
                  <td>{getActionBadge(log.acao)}</td>
                  <td>
                    <span className="log-table-name">{log.tabela_afetada}</span>
                  </td>
                  <td style={{ maxWidth: "300px" }}>
                    {renderDataDiff(log.dados_antigos, log.dados_novos, log.acao)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {hasMore && !loading && (
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button 
            className="logs-load-more-btn"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>Carregando...</>
            ) : (
              <>
                <Icons.BsArrowDown />
                Procurar logs mais antigos
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
