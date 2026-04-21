import React, { useEffect, useMemo, useState } from "react";
import "../css/Home.css";
import { Helmet } from "react-helmet";
import { FaExternalLinkAlt } from "react-icons/fa";

type ServiceInfo = {
  id: string;
  name: string;
  login: string;
  passwordHint: string;
  link?: string;
};
type ApiResponse = {
  rows: ServiceInfo[];
  error?: string;
};

const API_URL = process.env.REACT_APP_SHEETS_API_URL || "";

const emptyRow: ServiceInfo = {
  id: "",
  name: "",
  login: "",
  passwordHint: "",
  link: "",
};

function Informacoes() {
  const [rows, setRows] = useState<ServiceInfo[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ServiceInfo>>({});
  const [newRow, setNewRow] = useState<ServiceInfo>(emptyRow);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const hasApiConfigured = useMemo(() => Boolean(API_URL), []);

  const loadRows = async () => {
    if (!hasApiConfigured) {
      setIsLoading(false);
      setError("Configure REACT_APP_SHEETS_API_URL no .env para carregar dados.");
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      const response = await fetch(API_URL);
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error || "Falha ao carregar dados.");
      }

      setRows(data.rows || []);
      setDrafts({});
    } catch (err) {
      console.error("Erro ao carregar dados da planilha!:", err);
      setError("Erro ao carregar dados da planilha.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, []);

  const updateDraft = (id: string, field: keyof ServiceInfo, value: string) => {
    const sourceRow = drafts[id] || rows.find((row) => row.id === id);
    if (!sourceRow) return;

    setDrafts((prev) => ({
      ...prev,
      [id]: { ...sourceRow, [field]: value },
    }));
  };

  const saveRow = async (id: string) => {
    const row = drafts[id];
    if (!row || !hasApiConfigured) return;

    try {
      setIsSaving(true);
      setStatusMessage("");
      setError("");

      const body = new URLSearchParams({
        action: "update",
        payload: JSON.stringify({ row }),
      });

      const response = await fetch(API_URL, {
        method: "POST",
        body,
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Falha ao salvar linha.");
      }

      setStatusMessage("Dados salvos na planilha.");
      await loadRows();
    } catch (err) {
      console.error("Erro ao salvar linha:", err);
      setError("Erro ao salvar alterações na planilha.");
    } finally {
      setIsSaving(false);
    }
  };

  const addRow = async () => {
    if (!hasApiConfigured) return;
    if (!newRow.login.trim()) {
      setError("Preencha ao menos Serviço e Login para adicionar.");
      return;
    }

    try {
      setIsSaving(true);
      setStatusMessage("");
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        body: new URLSearchParams({
          action: "create",
          payload: JSON.stringify({ row: newRow }),
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Falha ao adicionar linha.");
      }

      setNewRow(emptyRow);
      setStatusMessage("Linha adicionada na planilha.");
      await loadRows();
    } catch (err) {
      console.error("Erro ao adicionar linha:", err);
      setError("Erro ao adicionar linha na planilha.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRow = async (id: string) => {
    if (!hasApiConfigured) return;

    try {
      setIsSaving(true);
      setStatusMessage("");
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        body: new URLSearchParams({
          action: "delete",
          payload: JSON.stringify({ id }),
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Falha ao remover linha.");
      }

      setStatusMessage("Linha removida da planilha.");
      await loadRows();
    } catch (err) {
      console.error("Erro ao remover linha:", err);
      setError("Erro ao remover linha da planilha.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Informações</title>
      </Helmet>

      <div className="home">
        <div className="container">
          <h2>Logins e Acessos Importantes (Google Sheets)</h2>

          {!hasApiConfigured && (
            <p style={{ color: "#8a5b2d" }}>
              Defina <code>REACT_APP_SHEETS_API_URL</code> no arquivo{" "}
              <code>.env</code> com a URL do seu Apps Script publicado.
            </p>
          )}

          {isLoading && <p>Carregando dados da planilha...</p>}
          {error && <p style={{ color: "#b30000" }}>{error}</p>}
          {statusMessage && <p style={{ color: "#2d7a2d" }}>{statusMessage}</p>}

          <table className="vales-table">
            <thead>
              <tr>
            {/*     <th>Serviço</th> */}
                <th>Login</th>
                <th>Senha</th>
                <th>Link</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((service) => {
                const current = drafts[service.id] || service;

                return (
                  <tr key={service.id}>
{/*                     <td>
                 <input
                        value={current.name}
                        onChange={(e) => updateDraft(service.id, "name", e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </td> */}
                    <td>
                      <input
                        value={current.login}
                        onChange={(e) => updateDraft(service.id, "login", e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td>
                      <input
                        value={current.passwordHint}
                        onChange={(e) =>
                          updateDraft(service.id, "passwordHint", e.target.value)
                        }
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        value={current.link || ""}
                        onChange={(e) => updateDraft(service.id, "link", e.target.value)}
                        placeholder="https://..."
                        style={{ width: "100%" }}
                      />
                      {(current.link || "").trim() ? (
                        <a
                          href={current.link}
                          target="_blank"
                          rel="noreferrer"
                          title={`Abrir ${current.name}`}
                          style={{ color: "#5a432c", marginLeft: "8px" }}
                        >
                          <FaExternalLinkAlt />
                        </a>
                      ) : null}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        onClick={() => saveRow(service.id)}
                        disabled={!drafts[service.id] || isSaving}
                      >
                        Salvar
                      </button>{" "}
                      <button
                        type="button"
                        onClick={() => deleteRow(service.id)}
                        disabled={isSaving}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}

              <tr>
{/*                 <td>
                   <input
                    value={newRow.name}
                    onChange={(e) => setNewRow((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Novo serviço"
                    style={{ width: "100%" }}
                  /> 
                </td> */}
                <td>
                  <input
                    value={newRow.login}
                    onChange={(e) => setNewRow((prev) => ({ ...prev, login: e.target.value }))}
                    placeholder="Novo login"
                    style={{ width: "100%" }}
                  />
                </td>
                <td>
                  <input
                    value={newRow.passwordHint}
                    onChange={(e) =>
                      setNewRow((prev) => ({ ...prev, passwordHint: e.target.value }))
                    }
                    placeholder="Dica de senha"
                    style={{ width: "100%" }}
                  />
                </td>
                <td>
                  <input
                    value={newRow.link || ""}
                    onChange={(e) => setNewRow((prev) => ({ ...prev, link: e.target.value }))}
                    placeholder="https://..."
                    style={{ width: "100%" }}
                  />
                </td>
                <td>
                  <button type="button" onClick={addRow} disabled={isSaving}>
                    Adicionar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Informacoes;
