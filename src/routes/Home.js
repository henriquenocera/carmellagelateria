import React, { useState } from "react";
import "../css/Home.css";
import { Helmet } from "react-helmet";

function Home() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const predefinedTexts = [
    {
      id: 1,
      title: "Horários e Endereços",
      text: `📍 Rua Colombo,183 - Ahú
📍 Rua Sete de Abril, 934 - Alto da XV
🕐 Todos os dias | 12:00 as 19:00`
    },
    {
      id: 2,
      title: "Sabores do Dia",
      text: `Olá! 🍦

Nós trabalhamos atualmente com quase 60 sabores, de forma rotativa, então estamos sempre trocando os sabores da vitrine, mas você pode acompanhar os sabores em tempo real pelo nosso site.
sabores.carmellagelateria.com.br

Qualquer dúvida, fico à disposição!
`
    },
    {
      id: 3,
      title: "Glúten",
      text: `A grande maioria dos nossos sabores não contém glúten, apesar de termos alguns sabores como Oreo, Lemon Pie, entre outros que tem glúten na receita.

Porém, nenhum de nossos Gelatos são livres de glúten devido a contaminação cruzada, tanto na produção quanto na loja. Caso você seja celíaca nós NÃO recomendamos o consumo.`
    },
    {
      id: 4,
      title: "Diets (zero açúcar)",
      text: `Olá! 🍦

Nós possuímos alguns sabores diets, porém não conseguimos garantir a sua disponibilidade sempre.
Você consegue acompanhar os sabores atuais de cada loja pelo nosso site
sabores.carmellagelateria.com.br

Fico à disposição!`
    },
    {
      id: 5,
      title: "Pedidos Food Service",
      text: `Olá! 🍦

Passando para saber se você gostaria de fazer um pedido para essa semana.
Pedidos até as 16:00 entregamos até Quinta feira.

Fico à disposição!`
    },
    {
      id: 6,
      title: "",
      text: ""
    }
  ];

  const handleCopy = async (text, index) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar texto:", err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Início</title>
      </Helmet>
      <div className="home">
        <img className="logo" src="/logo.svg" alt="" />
        <div className="container">
          <h2>Textos Pré Prontos e Formatados</h2>
          <div className="text-quotes-grid">
            {predefinedTexts.map((item, index) => (
              <div key={item.id} className="text-quote-card">
                <h3 className="text-quote-title">{item.title}</h3>
                <p className="text-quote-text">{item.text}</p>
                <button
                  type="button"
                  className="text-quote-copy-btn"
                  onClick={() => handleCopy(item.text, index)}
                >
                  {copiedIndex === index ? "✓ Copiado!" : "Copiar texto"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
