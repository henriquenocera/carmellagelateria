import React, { useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import { senhasData } from "../config/senhas.js";
import "../css/Senhas.css";

type SenhaItem = {
  id: number;
  nome: string;
  login: string;
  senha: string;
};

const Senhas: React.FC = () => {
  const [visible, setVisible] = useState<{ [key: number]: boolean }>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered: SenhaItem[] = (senhasData as SenhaItem[]).filter(
    (item) =>
      item.nome.toLowerCase().includes(search.toLowerCase()) ||
      item.login.toLowerCase().includes(search.toLowerCase())
  );

  const toggleVisibility = (id: number) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // fallback para navegadores antigos
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    }
  };

  return (
    <>
      <Helmet>
        <title>Senhas - Carmella Gelateria</title>
      </Helmet>

      <div className="home" style={{ alignItems: "flex-start" }}>
        <div className="container">
          <div className="home-calendar-card senhas-card">
            {/* Header */}
            <div className="home-calendar-top-bar" style={{ marginBottom: "1.2rem" }}>
              <div className="home-calendar-title-group">
                <h2>
                  <Icons.BsShieldLock color="var(--primary-color)" />
                  Senhas
                </h2>
                <p>Gerencie logins e senhas da loja. Clique em copiar para salvar no Ctrl+C.</p>
              </div>
            </div>

            {/* Busca */}
            <div className="senhas-search-wrap">
              <Icons.BsSearch className="senhas-search-icon" />
              <input
                type="text"
                placeholder="Buscar por nome ou login..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="senhas-search-input"
              />
              {search && (
                <button className="senhas-clear-btn" onClick={() => setSearch("")} title="Limpar">
                  <Icons.BsXLg />
                </button>
              )}
            </div>



            {/* Toast copiado */}
            {copied && (
              <div className="senhas-toast">
                <Icons.BsCheckCircleFill />
                Copiado para a área de transferência!
              </div>
            )}

            {/* Tabela */}
            <div className="senhas-table-wrap">
              <table className="senhas-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Login</th>
                    <th>Senha</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="senhas-empty">
                        Nenhum resultado encontrado.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => {
                      const isVisible = !!visible[item.id];
                      return (
                        <tr key={item.id}>
                          <td className="senhas-nome">
                            <span className="senhas-nome-icon">
                              <Icons.BsKeyFill />
                            </span>
                            {item.nome}
                          </td>

                          {/* Login */}
                          <td>
                            <div className="senhas-cell">
                              <span className="senhas-value" title={item.login}>
                                {item.login}
                              </span>
                              <button
                                className="senhas-copy-btn"
                                onClick={() => copyToClipboard(item.login, `${item.id}-login`)}
                                title="Copiar login"
                                aria-label="Copiar login"
                              >
                                {copied === `${item.id}-login` ? (
                                  <Icons.BsCheckLg color="#16a34a" />
                                ) : (
                                  <Icons.BsCopy />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Senha */}
                          <td>
                            <div className="senhas-cell">
                              <span className="senhas-value senha" title={isVisible ? item.senha : "••••••••"}>
                                {isVisible ? item.senha : "••••••••"}
                              </span>
                              <button
                                className="senhas-icon-btn"
                                onClick={() => toggleVisibility(item.id)}
                                title={isVisible ? "Ocultar senha" : "Mostrar senha"}
                                aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
                              >
                                {isVisible ? <Icons.BsEyeSlash /> : <Icons.BsEye />}
                              </button>
                              <button
                                className="senhas-copy-btn"
                                onClick={() => copyToClipboard(item.senha, `${item.id}-senha`)}
                                title="Copiar senha"
                                aria-label="Copiar senha"
                              >
                                {copied === `${item.id}-senha` ? (
                                  <Icons.BsCheckLg color="#16a34a" />
                                ) : (
                                  <Icons.BsCopy />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="senhas-footer">
              <Icons.BsShieldCheck /> {filtered.length} senha(s) cadastrada(s)
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Senhas;
