import React from "react";
import "../css/Home.css";
import { Helmet } from "react-helmet";
import { FaExternalLinkAlt } from "react-icons/fa";

type ServiceInfo = {
  id: number;
  name: string;
  login: string;
  passwordHint: string;
  link?: string;
};

const services: ServiceInfo[] = [
  {
    id: 1,
    name: "Supabase",
    login: "conta principal",
    passwordHint: "Mesma senha do e-mail administrativo (não salvar a senha completa aqui).",
    link: ""
  },
  {
    id: 2,
    name: "Painel do Site / Hospedagem",
    login: "usuário do painel",
    passwordHint: "Senha padrão da TI / responsável. Guardar somente a dica aqui.",
    link: ""
  },
  {
    id: 3,
    name: "E-mail Corporativo",
    login: "formato: nome@carmellagelateria.com.br",
    passwordHint: "Senha pessoal do colaborador (não registrar aqui).",
    link: ""
  },
  {
    id: 4,
    name: "Redes Sociais",
    login: "@carmellagelateria",
    passwordHint: "Senha gerenciada pela equipe de marketing.",
    link: ""
  },
  {
    id: 5,
    name: "Sistema de PDV",
    login: "Usuário de gerente / loja",
    passwordHint: "Senha definida pelo responsável da unidade.",
    link: ""
  },
];

function Informacoes() {
  return (
    <>
      <Helmet>
        <title>Informações</title>
      </Helmet>
      <div className="home">
        <div className="container">
          <h2>Logins e Acessos Importantes</h2>
   

          <table className="vales-table">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Login</th>
                <th>Senha</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.login}</td>
                  <td>{service.passwordHint}</td>
                  <td style={{ textAlign: "center" }}>
                    {service.link ? (
                      <a
                        href={service.link}
                        target="_blank"
                        rel="noreferrer"
                        title={`Abrir ${service.name}`}
                        style={{ color: "#5a432c" }}
                      >
                        <FaExternalLinkAlt />
                      </a>
                    ) : (
                      <span style={{ opacity: 0.3 }}>
                        <FaExternalLinkAlt />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Informacoes;
