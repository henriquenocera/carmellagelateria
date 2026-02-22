import React, { useState } from "react";
import "../css/Home.css";
import { Helmet } from "react-helmet";

const manualData = [
  {
    id: "gelatos",
    title: "Gelatos",
    icon: "🍦",
    products: [
      {
        id: 1,
        name: "Gelatos",
        portions: [
          {
            size: "Pequeno",
            grams: 120,
            description: "1 Sabor",
            container: '- Copo pequeno 80ml - Casquinha Pequena',
            finishedImage: "/images/manual/pequeno.png",
            preparationMedia: { type: "video", url: "/images/manual/servir-sorvete.mp4" },
            steps: [
              "Pegar o copo pequeno (capacidade aprox. 200ml)",
              "Servir 2 bolas de sorvete (40g cada = 80g total)",
              "Dispor as bolas lado a lado ou em camada conforme o sabor",
              "Verificar se o sorvete está no nível correto — não ultrapassar a borda",
              "Oferecer calda e coberturas ao cliente (opcional)",
              "Entregar com colher descartável e guardanapo",
            ],
          },
          {
            size: "Médio",
            grams: 120,
            description: "3 bolas",
            container: "Copo médio (capacidade aprox. 300ml)",
            finishedImage: "/images/manual/copo-medio.jpg",
            preparationMedia: { type: "video", url: "/images/manual/servir-sorvete.mp4" },
            steps: [
              "Pegar o copo médio (capacidade aprox. 300ml)",
              "Servir 3 bolas de sorvete (40g cada = 120g total)",
              "Organizar as bolas de forma uniforme — evite amontoar",
              "Se dois sabores: 2 bolas de um + 1 do outro, ou em camadas",
              "Garantir que o sorvete não ultrapasse 2/3 da altura do copo",
              "Oferecer calda e coberturas ao cliente (opcional)",
              "Entregar com colher descartável e guardanapo",
            ],
          },
          {
            size: "Grande",
            grams: 160,
            description: "4 bolas",
            container: "Copo grande (capacidade aprox. 400ml)",
            finishedImage: "/images/manual/copo-grande.jpg",
            steps: [
              "Pegar o copo grande (capacidade aprox. 400ml)",
              "Servir 4 bolas de sorvete (40g cada = 160g total)",
              "Dispor as bolas em duas camadas ou em leque, conforme o sabor",
              "Para múltiplos sabores: distribuir de forma equilibrada",
              "O sorvete pode ocupar até 3/4 da altura do copo",
              "Oferecer calda e coberturas ao cliente (opcional)",
              "Entregar com colher descartável e guardanapo",
            ],
          },
          {
            size: "Pote 480ml",
            grams: 160,
            description: "4 bolas",
            container: "Copo grande (capacidade aprox. 400ml)",
            finishedImage: "/images/manual/copo-grande.jpg",
            steps: [
              "Pegar o copo grande (capacidade aprox. 400ml)",
              "Servir 4 bolas de sorvete (40g cada = 160g total)",
              "Dispor as bolas em duas camadas ou em leque, conforme o sabor",
              "Para múltiplos sabores: distribuir de forma equilibrada",
              "O sorvete pode ocupar até 3/4 da altura do copo",
              "Oferecer calda e coberturas ao cliente (opcional)",
              "Entregar com colher descartável e guardanapo",
            ],
          },
          {
            size: "Sorvete do Dog",
            grams: 160,
            description: "4 bolas",
            container: "Copo grande (capacidade aprox. 400ml)",
            finishedImage: "/images/manual/copo-grande.jpg",
            steps: [
              "Pegar o copo grande (capacidade aprox. 400ml)",
              "Servir 4 bolas de sorvete (40g cada = 160g total)",
              "Dispor as bolas em duas camadas ou em leque, conforme o sabor",
              "Para múltiplos sabores: distribuir de forma equilibrada",
              "O sorvete pode ocupar até 3/4 da altura do copo",
              "Oferecer calda e coberturas ao cliente (opcional)",
              "Entregar com colher descartável e guardanapo",
            ],
          },
        ],
      },
      
    ],
  },
  {
    id: "waffle",
    title: "Waffle",
    icon: "🫐",
    products: [
      {
        id: 3,
        name: "Açaí na Tigela",
        portions: [
          { size: "300g", grams: 300, description: "Tigela pequena", container: "Tigela pequena" },
          { size: "500g", grams: 500, description: "Tigela média", container: "Tigela média" },
          { size: "700g", grams: 700, description: "Tigela grande", container: "Tigela grande" },
        ],
        steps: [
          "Medir o açaí na balança conforme o tamanho",
          "Colocar na tigela e alisar a superfície",
          "Adicionar acompanhamentos conforme pedido (banana, leite em pó, granola)",
          "Servir com colher longa",
        ],
      },
    ],
  },
  {
    id: "milk-shake",
    title: "Milk Shake",
    icon: "🥤",
    products: [
      {
        id: 4,
        name: "Milk Shake Tradicional",
        finishedImage: "/images/manual/milkshake.jpg",
        portions: [
          { size: "300ml", grams: 300, description: "Copo pequeno", container: "Copo pequeno" },
          { size: "400ml", grams: 400, description: "Copo médio", container: "Copo médio" },
          { size: "500ml", grams: 500, description: "Copo grande", container: "Copo grande" },
        ],
        steps: [
          "Adicionar 2-3 bolas de sorvete na base do milk shake",
          "Despejar leite até a marca do tamanho",
          "Bater até ficar homogêneo",
          "Servir com canudo e finalizar com chantilly se pedido",
        ],
      },
    ],
  },
  {
    id: "outros",
    title: "Outros Produtos",
    icon: "📋",
    products: [
      {
        id: 5,
        name: "Sundae",
        finishedImage: "/images/manual/sundae.jpg",
        portions: [
          { size: "Pequeno", grams: 100, description: "1 bola + coberturas", container: "Copo ou caneca" },
          { size: "Grande", grams: 200, description: "2 bolas + coberturas", container: "Copo ou caneca" },
        ],
        steps: [
          "Colocar a base de sorvete no copo/caneca",
          "Adicionar calda (chocolate, morango ou caramelo)",
          "Incluir acompanhamentos: chantilly, cereja, amendoim",
          "Servir com colher e canudo",
        ],
      },
    ],
  },
];

function Home() {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [expandedPortion, setExpandedPortion] = useState(null);

  const toggleProduct = (categoryId, productId) => {
    const key = `${categoryId}-${productId}`;
    setExpandedProduct((prev) => (prev === key ? null : key));
    setExpandedPortion(null);
  };

  const togglePortion = (categoryId, productId, size) => {
    const key = `${categoryId}-${productId}-${size}`;
    setExpandedPortion((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <Helmet>
        <title>Manual de Produtos</title>
      </Helmet>
      <div className="manual-page">
        <div className="manual-header">
          <h1>Manual de Produtos</h1>
          <p>Consulte como montar cada produto</p>
        </div>

        <div className="manual-content">
          {manualData.map((category) => (
            <section key={category.id} className="manual-category">
              <h2 className="manual-category-title">
                <span className="manual-category-icon">{category.icon}</span>
                {category.title}
              </h2>

              {category.products.map((product) => {
                const key = `${category.id}-${product.id}`;
                const isExpanded = expandedProduct === key;

                return (
                  <div
                    key={product.id}
                    className={`manual-product ${isExpanded ? "expanded" : ""}`}
                  >
                    <button
                      type="button"
                      className="manual-product-header"
                      onClick={() => toggleProduct(category.id, product.id)}
                    >
                      <span className="manual-product-name">{product.name}</span>
                      <span className="manual-product-arrow">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="manual-product-body">
                        <div className="manual-portion-section">
                          <h3>Clique para ver instruções</h3>
                          <div className="manual-portions-list">
                            {product.portions.map((p) => {
                              const portionKey = `${category.id}-${product.id}-${p.size}`;
                              const hasContent = p.steps?.length || product.steps?.length || p.finishedImage || product.finishedImage || p.preparationMedia || product.preparationMedia;
                              const isPortionExpanded = expandedPortion === portionKey;
                              const steps = p.steps || product.steps || [];

                              return (
                                <div key={p.size} className="manual-portion-wrapper">
                                  <button
                                    type="button"
                                    className={`manual-portion-card ${hasContent ? "clickable" : ""} ${isPortionExpanded ? "expanded" : ""}`}
                                    onClick={() => hasContent && togglePortion(category.id, product.id, p.size)}
                                    disabled={!hasContent}
                                  >
                                    <span className="manual-portion-main">
                                      <span className="manual-portion-name">{p.size}</span>
                                      <span className="manual-portion-meta">{p.grams}g · {p.description || "-"}</span>
                                    </span>
                                    {hasContent && (
                                      <span className="manual-portion-arrow" aria-hidden="true">
                                        {isPortionExpanded ? "▲" : "▼"}
                                      </span>
                                    )}
                                  </button>
                                  {isPortionExpanded && (steps.length > 0 || p.finishedImage || product.finishedImage || p.preparationMedia || product.preparationMedia) && (
                                    <div className="manual-portion-instructions">
                                      {(p.finishedImage || product.finishedImage) && (
                                        <div className="manual-media-section">
                                          <h4>Produto final</h4>
                                          <img
                                            src={p.finishedImage || product.finishedImage}
                                            alt={`${p.size} - produto final`}
                                            className="manual-finished-image"
                                          />
                                        </div>
                                      )}
                                      {(p.container || product.container) && (() => {
                                        const raw = p.container || product.container;
                                        const items = Array.isArray(raw)
                                          ? raw
                                          : String(raw).split(/\s*-\s*/).map((s) => s.trim()).filter(Boolean);
                                        return (
                                          <div className="manual-media-section manual-container-section">
                                            <h4>Recipiente</h4>
                                            <ul className="manual-container-list">
                                              {items.map((item, i) => (
                                                <li key={i}>{item}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        );
                                      })()}
                                      {steps.length > 0 && (
                                        <>
                                          <h4>Como montar</h4>
                                          <ol className="manual-steps">
                                            {steps.map((step, i) => (
                                              <li key={i}>{step}</li>
                                            ))}
                                          </ol>
                                        </>
                                      )}
                                      {(p.preparationMedia || product.preparationMedia) && (
                                        <div className="manual-media-section">
                                          <h4>Preparação</h4>
                                          {(p.preparationMedia || product.preparationMedia).type === "video" ? (
                                            <video
                                              className="manual-prep-media"
                                              controls
                                              playsInline
                                              muted
                                              loop
                                              src={(p.preparationMedia || product.preparationMedia).url}
                                            >
                                              Seu navegador não suporta vídeo.
                                            </video>
                                          ) : (
                                            <img
                                              src={(p.preparationMedia || product.preparationMedia).url}
                                              alt="Preparação"
                                              className="manual-prep-image"
                                            />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
