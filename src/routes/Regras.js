import React from "react";
import "../css/Home.css";
import { Helmet } from "react-helmet";

const rulesData = [
  {
    id: "geral",
    title: "Regras Gerais",
    icon: "📋",
    items: [
      "Respeitar horários de entrada e saída.",
      "Manter o uniforme limpo e em bom estado.",
      "Comunicar ausências ou atrasos com antecedência.",
    ],
  },
  {
    id: "atendimento",
    title: "Atendimento ao Cliente",
    icon: "🙂",
    items: [
      "Sempre cumprimentar o cliente com educação.",
      "Esclarecer dúvidas sobre produtos e sabores.",
      "Manter a área de atendimento limpa e organizada.",
    ],
  },
  {
    id: "higiene",
    title: "Higiene e Limpeza",
    icon: "✨",
    items: [
      "Lavar as mãos frequentemente durante o expediente.",
      "Manter equipamentos e bancadas limpos.",
      "Seguir as normas de higiene alimentar.",
    ],
  },
  {
    id: "produtos",
    title: "Produtos e Estoque",
    icon: "🍦",
    items: [
      "Seguir o manual de preparo de cada produto.",
      "Respeitar as porções e recipientes indicados.",
      "Comunicar quando produtos estiverem acabando.",
    ],
  },
];

function Regras() {
  return (
    <>
      <Helmet>
        <title>Regras da Loja - Carmella Gelateria</title>
      </Helmet>
      <div className="manual-page">
        <div className="manual-header">
          <h1>Regras da Loja</h1>
          <p>Normas e diretrizes para o funcionamento da loja</p>
        </div>

        <div className="manual-content">
          {rulesData.map((section) => (
            <section key={section.id} className="manual-category">
              <h2 className="manual-category-title">
                <span className="manual-category-icon">{section.icon}</span>
                {section.title}
              </h2>
              <ul className="regras-list">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

export default Regras;
