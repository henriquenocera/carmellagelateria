import React, { useState } from "react";
import "../css/Home.css";
import { Helmet } from "react-helmet";

function Home() {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [showCopiedAnim, setShowCopiedAnim] = useState(false);

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
https://sabores.carmellagelateria.com.br

Qualquer dúvida, fico à disposição!
`
    },
    {
      id: 3,
      title: "Glúten",
      text: `Olá! 🍦
      
A grande maioria dos nossos sabores não contém glúten, apesar de termos alguns sabores como Oreo, Lemon Pie, entre outros que tem glúten na receita.

Porém, nenhum de nossos Gelatos são livres de glúten devido a contaminação cruzada, tanto na produção quanto na loja.
Em caso de doença celíaca, nós infelizmente não recomendamos o consumo dos nossos Gelatos.`
    },
    {
      id: 4,
      title: "Diets (zero açúcar)",
      text: `Olá! 🍦

Nós possuímos alguns sabores diets, porém não conseguimos garantir a sua disponibilidade sempre.
Você consegue acompanhar os sabores atuais de cada loja pelo nosso site
https://sabores.carmellagelateria.com.br

Qualquer dúvida, fico à disposição!`
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
      title: "Delivery",
      text: `Olá! 🍦
      
      Nós Trabalhamos com delivery somente via Ifood, segue o link de nossas lojas
      
      Loja Ifood Alto XV:
      https://www.ifood.com.br/delivery/curitiba-pr/olga-cafe--carmella-gelateria---alto-xv-alto-da-rua-xv/02625ea1-bc47-4f29-9d84-ab9e275206e6

      Loja Ifood Ahu:
      https://www.ifood.com.br/delivery/curitiba-pr/olga-cafe--carmella-gelateria---ahu-ahu/b8f4806a-7fd6-4df5-a739-65fc17356556
      `
    },
    {
      id: 7,
      title: "Primeiro Contato - Food Service",
      text: `Olá! 🍦
      
Somos da Carmella Gelateria, deixamos recentemente algumas amostras de nosso Gelato ai no restaurante de vocês, chegaram a experimentar ?

Eu vou encaminhar o nosso catálogo de preços do Food Service, caso tenham alguma dúvida, ficamos a disposição.
obs: temos 20% de desconto para os 3 primeiros pedidos para novos clientes.
      `
    }
  ];

  const quickLinks = [
    {
      id: 1,
      title: "Site de Sabores do Dia",
      link: "https://sabores.carmellagelateria.com.br",
      emoji: "🔗"
    },
    {
      id: 2,
      title: "Ifood - Loja Alto XV",
      link: "https://www.ifood.com.br/delivery/curitiba-pr/olga-cafe--carmella-gelateria---alto-xv-alto-da-rua-xv/02625ea1-bc47-4f29-9d84-ab9e275206e6",
      emoji: "🔗"
    },
    {
      id: 3,
      title: "Ifood - Loja Ahú",
      link: "https://www.ifood.com.br/delivery/curitiba-pr/olga-cafe--carmella-gelateria---ahu-ahu/b8f4806a-7fd6-4df5-a739-65fc17356556",
      emoji: "🔗"
    },
    {
      id: 4,
      title: "Ifood - Portal",
      link: "https://portal.ifood.com.br/",
      emoji: "🔗"
    },
    {
      id: 5,
      title: "Ifood - Gestor de Pedidos",
      link: "https://gestordepedidos.ifood.com.br/",
      emoji: "🔗"
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
      setModalData({ text });
      setShowCopiedAnim(true);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar texto:", err);
    }
  };

  const closeModal = () => {
    setModalData(null);
    setShowCopiedAnim(false);
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
          <div className="table-container">
            <table className="predefined-texts-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th style={{ width: "200px", textAlign: "center" }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {predefinedTexts.map((item, index) => (
                  <tr key={item.id}>
                    <td className="table-title">{item.title}</td>
                    <td>
                      <button
                        type="button"
                        className="table-copy-btn"
                        onClick={() => handleCopy(item.text, index)}
                      >
                        {copiedIndex === index ? "✓ Copiado!" : "Copiar Texto"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ marginTop: "2rem" }}>Links Rápidos</h2>
          <div className="table-container">
            <table className="predefined-texts-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th style={{ width: "200px", textAlign: "center" }}>Link</th>
                </tr>
              </thead>
              <tbody>
                {quickLinks.map((item) => (
                  <tr key={item.id}>
                    <td className="table-title">{item.title}</td>
                    <td>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "1.5rem", textDecoration: "none", display: "flex", justifyContent: "center" }}
                      >
                        {item.emoji}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalData && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h3 style={{ color: "#5a432c", marginTop: 0 }}>Texto Copiado!</h3>
            <div className="modal-text">{modalData.text}</div>
            {showCopiedAnim && (
              <div className="copied-animation">
                ✓ Texto copiado com sucesso!
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
