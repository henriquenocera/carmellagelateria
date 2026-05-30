import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/Frequencia.css"; // Reuse the table styles

const STORES = [
  { id: "fabrica", name: "Fábrica", bgHeader: "#fff4e6" },
  { id: "mh", name: "Estoque MH", bgHeader: "#fce7e7" },
  { id: "ahu", name: "Loja Ahú", bgHeader: "#e6f5ea" },
  { id: "altoxv", name: "Loja Alto XV", bgHeader: "#efebff" },
];

function ConfiguracaoEstoque() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [insumos, setInsumos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cellStatus, setCellStatus] = useState<Record<string, 'editing' | 'saving' | 'saved' | 'error'>>({});

  useEffect(() => {
    if (isAdmin === false) {
      navigate("/");
    } else if (isAdmin === true) {
      fetchInsumos();
    }
  }, [isAdmin, navigate]);

  async function fetchInsumos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cadastro_insumos")
        .select("id, nome, ativo, config_estoque")
        .eq("ativo", true)
        .order("ordem", { ascending: true })
        .order("nome", { ascending: true });

      if (error) throw error;
      setInsumos(data || []);
    } catch (err) {
      console.error("Erro ao buscar insumos:", err);
      alert("Erro ao buscar insumos. Verifique se a coluna config_estoque foi criada no banco.");
    } finally {
      setLoading(false);
    }
  }

  const handleLocalChange = (id: string, storeId: string, field: string, value: any) => {
    setInsumos((prev) =>
      prev.map((ins) => {
        if (ins.id === id) {
          const newConfig = { ...(ins.config_estoque || {}) };
          if (!newConfig[storeId]) newConfig[storeId] = {};
          newConfig[storeId][field] = value;
          return { ...ins, config_estoque: newConfig };
        }
        return ins;
      })
    );
  };

  async function handleUpdateField(id: string, storeId: string, field: string, value: any) {
    const key = `${id}-${storeId}-${field}`;
    try {
      setCellStatus((prev) => ({ ...prev, [key]: 'saving' }));

      // Fetch the current config first to avoid overwriting other stores
      const { data: currentData, error: fetchError } = await supabase
        .from("cadastro_insumos")
        .select("config_estoque")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const currentConfig = currentData.config_estoque || {};
      if (!currentConfig[storeId]) currentConfig[storeId] = {};
      currentConfig[storeId][field] = value;

      const { error } = await supabase
        .from("cadastro_insumos")
        .update({ config_estoque: currentConfig })
        .eq("id", id);

      if (error) throw error;

      setCellStatus((prev) => ({ ...prev, [key]: 'saved' }));
      setTimeout(() => {
        setCellStatus((prev) => {
          if (prev[key] === 'saved') {
            const newState = { ...prev };
            delete newState[key];
            return newState;
          }
          return prev;
        });
      }, 2000);
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      setCellStatus((prev) => ({ ...prev, [key]: 'error' }));
      alert("Erro ao atualizar o campo.");
    }
  }

  const renderEditableInput = (insumo: any, storeId: string, field: string, type: string = "number") => {
    const status = cellStatus[`${insumo.id}-${storeId}-${field}`];
    
    let bg = "transparent";
    let color = "inherit";
    
    if (status === 'editing') {
      bg = "rgba(0, 0, 0, 0.03)";
    } else if (status === 'saving') {
      bg = "#fff3cd";
      color = "#856404";
    } else if (status === 'saved') {
      bg = "#d4edda";
      color = "#155724";
    } else if (status === 'error') {
      bg = "#f8d7da";
      color = "#721c24";
    }

    const handleFocus = () => {
      setCellStatus(prev => ({ ...prev, [`${insumo.id}-${storeId}-${field}`]: 'editing' }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleLocalChange(insumo.id, storeId, field, e.target.value);
    };

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val: any = e.target.value;
      if (type === "number") {
        val = val !== "" ? parseFloat(val) : null;
      }
      handleUpdateField(insumo.id, storeId, field, val);
    };

    const config = insumo.config_estoque?.[storeId] || {};
    const value = config[field] ?? "";

    return (
      <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={{
            border: status === 'editing' ? "1px solid var(--primary-color)" : "1px solid transparent",
            background: bg,
            width: "60px",
            textAlign: "center",
            outline: "none",
            color: color,
            padding: "4px",
            paddingRight: status === 'saving' || status === 'saved' || status === 'error' ? "20px" : "4px",
            borderRadius: "4px",
            transition: "all 0.3s ease",
          }}
          title="Clique para editar"
        />
        {status === 'saving' && (
          <Icons.BsArrowClockwise className="spin" style={{ position: "absolute", right: "2px", color: color, fontSize: "0.9rem" }} />
        )}
        {status === 'saved' && (
          <Icons.BsCheck style={{ position: "absolute", right: "2px", color: color, fontSize: "1.1rem" }} />
        )}
        {status === 'error' && (
          <Icons.BsX style={{ position: "absolute", right: "2px", color: color, fontSize: "1.1rem" }} />
        )}
      </div>
    );
  };

  const renderCheckbox = (insumo: any, storeId: string) => {
    const field = "ativo";
    const status = cellStatus[`${insumo.id}-${storeId}-${field}`];
    const config = insumo.config_estoque?.[storeId] || {};
    const isChecked = config[field] || false;
    
    return (
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => {
            handleLocalChange(insumo.id, storeId, field, e.target.checked);
            handleUpdateField(insumo.id, storeId, field, e.target.checked);
          }}
          style={{ cursor: "pointer", width: "18px", height: "18px" }}
        />
        {status === 'saving' && <Icons.BsArrowClockwise className="spin" style={{ position: "absolute", right: "-20px", color: "#856404", fontSize: "1rem" }} />}
        {status === 'saved' && <Icons.BsCheck style={{ position: "absolute", right: "-22px", color: "#155724", fontSize: "1.3rem" }} />}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Configuração de Estoque</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Configuração de Estoque</h1>
            <p>Defina quais insumos estão ativos em cada loja, bem como o estoque mínimo e desejado.</p>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ marginTop: "20px", maxWidth: "100%", margin: "20px auto", overflowX: "auto" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : insumos.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Nenhum insumo ativo registrado.</p>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "1500px" }}>
                <thead>
                  {/* First Header Row - Grouping */}
                  <tr>
                    <th rowSpan={2} style={{ width: "250px", textAlign: "left", paddingLeft: "16px", backgroundColor: "#f8fafc" }}>Insumo</th>
                    {STORES.map(store => (
                      <th colSpan={3} key={`header-${store.id}`} style={{ textAlign: "center", backgroundColor: store.bgHeader, borderBottom: "1px solid #e2e8f0" }}>
                        {store.name}
                      </th>
                    ))}
                  </tr>
                  {/* Second Header Row - Columns */}
                  <tr>
                    {STORES.map(store => (
                      <React.Fragment key={`sub-header-${store.id}`}>
                        <th style={{ textAlign: "center", width: "80px", backgroundColor: store.bgHeader }}>Ativo?</th>
                        <th style={{ textAlign: "center", width: "100px", backgroundColor: store.bgHeader }}>Estoque<br/>Mínimo</th>
                        <th style={{ textAlign: "center", width: "100px", backgroundColor: store.bgHeader }}>Estoque<br/>Desejado</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {insumos.map((insumo) => (
                    <tr key={insumo.id} style={{ transition: "background 0.2s" }}>
                      <td style={{ fontWeight: 500, paddingLeft: "16px" }}>{insumo.nome}</td>
                      
                      {STORES.map(store => {
                        const isActive = insumo.config_estoque?.[store.id]?.ativo;
                        // Light background color tint if not active to highlight it's disabled, but still editable
                        const cellStyle = isActive === false ? { opacity: 0.6 } : {};

                        return (
                          <React.Fragment key={`${insumo.id}-${store.id}`}>
                            <td style={{ textAlign: "center", borderLeft: "2px solid #f1f5f9" }}>
                              {renderCheckbox(insumo, store.id)}
                            </td>
                            <td style={{ textAlign: "center", ...cellStyle }}>
                              {renderEditableInput(insumo, store.id, "minimo", "number")}
                            </td>
                            <td style={{ textAlign: "center", ...cellStyle }}>
                              {renderEditableInput(insumo, store.id, "desejado", "number")}
                            </td>
                          </React.Fragment>
                        );
                      })}
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
}

export default ConfiguracaoEstoque;
