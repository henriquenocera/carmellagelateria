import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import * as Icons from "react-icons/bs";
import "../css/CadastroPessoas.css";
import supabase from "../supabase-client";

interface Profile {
  id: string;
  short_id: string | null;
  name: string;
  email: string;
  ativo?: boolean | null;
  data_registro?: string | null;
  feriadosAbertos?: number;
}

function Funcionarios() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  async function fetchFuncionarios() {
    try {
      setLoading(true);
      setError(null);
      const { data: profilesData, error: dbError } = await supabase
        .from("profiles")
        .select("*")
        .eq("controlar_frequencia", true)
        .order("name", { ascending: true });

      if (dbError) throw dbError;

      const { data: feriadosData, error: feriadosError } = await supabase
        .from("feriados_trabalhados")
        .select("employee_id, data_folga, pago_em_dobro");

      if (feriadosError) throw feriadosError;

      const feriadosAbertosCount = (feriadosData || []).reduce((acc: any, curr: any) => {
        if (!curr.data_folga && !curr.pago_em_dobro) {
          acc[curr.employee_id] = (acc[curr.employee_id] || 0) + 1;
        }
        return acc;
      }, {});

      const sorted = (profilesData || []).map((p: any) => ({
        ...p,
        feriadosAbertos: feriadosAbertosCount[p.id] || 0
      })).sort((a: any, b: any) => {
        const aActive = a.ativo !== false;
        const bActive = b.ativo !== false;
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;

        return (a.name || "").localeCompare(b.name || "");
      });

      setProfiles(sorted);
    } catch (err: any) {
      console.error("Erro ao buscar funcionários:", err);
      setError("Falha ao carregar a lista de funcionários.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Funcionários</title>
      </Helmet>

      <div className="cadastro-container">
        <div className="cadastro-header">
          <div className="cadastro-title-group">
            <h1>Funcionários</h1>
            <p>Lista de pessoas com controle de frequência ativo.</p>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">
              <Icons.BsArrowClockwise className="spin icon-lg" style={{ fontSize: "2rem" }} />
              <p>Carregando funcionários...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <Icons.BsExclamationTriangle style={{ fontSize: "2rem", color: "red" }} />
              <p>{error}</p>
              <button onClick={fetchFuncionarios} className="primary-btn" style={{ marginTop: 10 }}>Tentar Novamente</button>
            </div>
          ) : profiles.length === 0 ? (
            <div className="empty-state">
              <Icons.BsPeople style={{ fontSize: "2rem" }} />
              <p>Nenhum funcionário encontrado.</p>
            </div>
          ) : (
            <table className="pessoas-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Data Registro</th>
                  <th style={{ textAlign: "center" }}>Feriados em Aberto</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id} className={p.ativo === false ? "inactive-row" : ""}>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/cadastro-pessoas/${p.id}`} className="employee-link" style={{ textDecoration: 'none', color: 'var(--primary-color)' }}>
                        {p.name || "-"}
                      </Link>
                      {p.ativo === false && <span style={{ marginLeft: "8px", background: "#fee2e2", color: "#ef4444", fontSize: "11px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold" }}>Inativo</span>}
                    </td>
                    <td>{p.email || "-"}</td>
                    <td>{p.data_registro ? p.data_registro.split('-').reverse().join('/') : "-"}</td>
                    <td style={{ textAlign: "center", fontWeight: "bold", color: (p.feriadosAbertos || 0) > 0 ? "#ef4444" : "inherit" }}>
                      {p.feriadosAbertos || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Funcionarios;
