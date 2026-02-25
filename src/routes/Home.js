import React, { useState } from "react";
import "../css/Home.css";
import { Helmet } from "react-helmet";

const manualData = [
  {
    id: "medidas",
    title: "Gelatos",
    icon: "🍦",
    products: [
      {
        id: 1,
        name: "Porção Espátula",
        portions: [
          {
            size: "Porção padrão da espátula",
            grams: 70,
            description: "porção padrão",
            // container: '- Copo pequeno 80ml - Casquinha Pequena',
            //finishedImage: "/images/manual/pequeno.png",
            //preparationMedia: { type: "video", url: "/images/manual/servir-sorvete.mp4" },
            //steps: [
            //  "Pegar o copo pequeno e encher até o topo (~90gr), depois completar com mais meia porção (~30gr)",
            //  "Preencher a casquina pequena com sorvete (~30gr), depois pegar 1 porção e meia (~90gr) e completar por cima",

            //],
          },
          
        ],
      },
      {
        id: 2,
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
              "Pegar o copo pequeno e encher até o topo (~90gr), depois completar com mais meia porção (~30gr)",
              "Preencher a casquina pequena com sorvete (~30gr), depois pegar 1 porção e meia (~90gr) e completar por cima",

            ],
          },
          {
            size: "Médio",
            grams: 140,
            description: "até 2 sabores",
            container: "- Copo pequeno 80ml - Cascão Grande",
            finishedImage: "/images/manual/copo-medio.jpg",
            preparationMedia: { type: "video", url: "/images/manual/servir-sorvete.mp4" },
            steps: [
              "Pegar o copo pequeno e preencher com 2 porções padrão de 70gr cada, uma de cada lado do potinho para manter os sabores um ao lado do outro",
              "Pegar o cascão e preencher com 2 porções padrão de 70gr cada, um por baixo e outra por cima",
            
            ],
          },
          {
            size: "Grande",
            grams: 210,
            description: "até 3 sabores",
            container: "- Copo grande 120ml - Cascão Grande",
            finishedImage: "/images/manual/copo-grande.jpg",
            preparationMedia: { type: "video", url: "/images/manual/servir-sorvete.mp4" },

            steps: [
              "Pegar o copo grande e preencher com 3 porções padrão de 70gr cada, uma de cada lado do potinho divido em 3",
              "Pegar o cascão e preencher com 3 porções padrão de 70gr cada, um por baixo e as outras 2 por cima lado a lado",

          
            ],
          },
          {
            size: "Pote 480ml",
            grams: 400,
            description: "até 2 sabores",
            container: "Pote 480ml",
            finishedImage: "/images/manual/copo-grande.jpg",
            steps: [
              "Pegar o pote de 480ml e servir uma porção de cada lado",
              "Entregar ao cliente dentro da Sacola"

            ],
          },
          {
            size: "Sorvete do Dog",
            description: "Sorvete de Banana e Beterraba",
            container: "Copo de 100ml descartável",
            finishedImage: "/images/manual/copo-grande.jpg",
            steps: [
              "Descongelar o balde de 1hr a 2hr",
              "Porcionar uma bolinha com o boleador mecânico",
              "Cobrir com um filme plástico cada porção",
              "Guardar as porções no Freezer",

            ],
          },
        ],
      },
      
    ],
  },
  {
    id: "waffle",
    title: "Waffle & Brownie",
    icon: "🧇",
    products: [
      {
        id: 3,
        name: "Waffle",
        portions: [
          { 
            size: "Waffle de Lìege", 
            description: "Waffle belga",
            container: "Prato de cerâmica (comer no local) - Embalagem de papel (para levar)"
          },

        ],
        steps: [
          "4mins a 180ºC no forninho",
          "Montagem dos toppings conforme manual impresso na loja",
        ],
      },
      {
        id: 4,
        name: "Brownie",
        portions: [
          { 
            size: "Brownie", 
            description: "Brownie de Chocolate",
            container: "Prato de cerâmica (comer no local) - Embalagem de alumínio (para levar)"
          },

        ],
        steps: [
          "Desenformar da embalagem de alumínio em um prato de cerâmica",
          "Aquecer por 45 segundos no microondas",
          "Servir com uma colher",
          "Caso tenha uma bola de sorvete para acompanhar, servir a bola de sorvete com o boleador em cima do brownie",
        ],
      },
    ],
  },
  {
    id: "sanduiche",
    title: "Sanduíches e Quiches",
    icon: "🥖",
    products: [
      {
        id: 5,
        name: "Sanduíches Baguete",
        portions: [
          { 
            size: "Sanduíche", 
            description: "Sanduíches congelados",
            container: "Prato de cerâmica (comer no local) - Embalagem de papel (para levar)"
          },

        ],
        steps: [
          "Abrir o sanduíche da embalagem plástica e colocar sob uma folha de papel manteiga",
          "Aquecer por 1min e 30seg à 2min no microondas",
          "Aquecer por 3min na Air Fryer a 180º",
          "Cortar o sanduíche ao meio",
          "Retirar o sanduíche do papel manteiga e empratar no prato de cerâmica ou na embalagem de papel",
        ],
      },
      {
        id: 6,
        name: "Quiches",
        portions: [
          { 
            size: "Quiches", 
            description: "Quiche Congelado",
            container: "Prato de cerâmica (comer no local) - Embalagem de alumínio (para levar)"
          },

        ],
        steps: [
          "Abrir o quiche da embalagem plástica e colocar sob uma folha de papel manteiga",
          "Aquecer por 1min e 30seg no microondas",
          "Aquecer por 3min na Air Fryer a 180º",
          "Retirar o quiche do papel manteiga e empratar no prato de cerâmica ou na embalagem de papel",
        ],
      },
    ],
  },
  {
    id: "cafe",
    title: "Cafés",
    icon: "☕",
    products: [
      {
        id: 7,
        name: "Cafés",
        portions: [
          {
            size: "Espresso Simples",
            description: "30ml de espresso",
            container: '- Copo de papel pequeno 110ml - Copo de vidro pequeno',
            // finishedImage: "/images/manual/pequeno.png",
            // preparationMedia: { type: "video", url: "/images/manual/servir-sorvete.mp4" },
            steps: [
              "Extrair 30ml de espresso por 20~30seg",

            ],
          },
          {
            size: "Espresso Duplo",
            description: "60ml de espresso",
            container: '- Copo de papel pequeno 110ml - Copo de vidro pequeno',
            // finishedImage: "/images/manual/copo-medio.jpg",
            // preparationMedia: { type: "video", url: "/images/manual/servir-sorvete.mp4" },
            steps: [
              "Pegar o copo pequeno e preencher com 2 porções padrão de 70gr cada, uma de cada lado do potinho para manter os sabores um ao lado do outro",
              "Pegar o cascão e preencher com 2 porções padrão de 70gr cada, um por baixo e outra por cima",
            
            ],
          },
          {
            size: "Grande",
            grams: 210,
            description: "até 3 sabores",
            container: "- Copo grande 120ml - Cascão Grande",
            finishedImage: "/images/manual/copo-grande.jpg",
            preparationMedia: { type: "video", url: "/images/manual/servir-sorvete.mp4" },

            steps: [
              "Pegar o copo grande e preencher com 3 porções padrão de 70gr cada, uma de cada lado do potinho divido em 3",
              "Pegar o cascão e preencher com 3 porções padrão de 70gr cada, um por baixo e as outras 2 por cima lado a lado",

          
            ],
          },
          {
            size: "Pote 480ml",
            grams: 400,
            description: "até 2 sabores",
            container: "Pote 480ml",
            finishedImage: "/images/manual/copo-grande.jpg",
            steps: [
              "Pegar o pote de 480ml e servir uma porção de cada lado",
              "Entregar ao cliente dentro da Sacola"

            ],
          },
          {
            size: "Sorvete do Dog",
            description: "Sorvete de Banana e Beterraba",
            container: "Copo de 100ml descartável",
            finishedImage: "/images/manual/copo-grande.jpg",
            steps: [
              "Descongelar o balde de 1hr a 2hr",
              "Porcionar uma bolinha com o boleador mecânico",
              "Cobrir com um filme plástico cada porção",
              "Guardar as porções no Freezer",

            ],
          },
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

    if (expandedProduct === key) {
      // Fechando o produto atual
      setExpandedProduct(null);
      setExpandedPortion(null);
      return;
    }

    // Abrindo um novo produto
    setExpandedProduct(key);

    // Para categorias com apenas 1 item (ex.: Waffle, Brownie, Sanduíches, Quiches),
    // já abre automaticamente a única porção.
    const category = manualData.find((c) => c.id === categoryId);
    const product = category?.products.find((p) => p.id === productId);

    if (product && product.portions.length === 1) {
      const size = product.portions[0].size;
      setExpandedPortion(`${categoryId}-${productId}-${size}`);
    } else {
      setExpandedPortion(null);
    }
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
                const isFlatCategory = false;
                const isExpanded = expandedProduct === key;

                const renderPortions = () => (
                  <div className="manual-product-body">
                    <div className="manual-portion-section">
                      {isFlatCategory && (
                        <h3 className="manual-product-flat-title">
                          {product.name}
                        </h3>
                      )}
                      <div className="manual-portions-list">
                        {product.portions.map((p) => {
                          const portionKey = `${category.id}-${product.id}-${p.size}`;
                          const hasContent =
                            p.steps?.length ||
                            product.steps?.length ||
                            p.finishedImage ||
                            product.finishedImage ||
                            p.preparationMedia ||
                            product.preparationMedia;
                          const isPortionExpanded =
                            expandedPortion === portionKey;
                          const steps = p.steps || product.steps || [];

                          return (
                            <div
                              key={p.size}
                              className="manual-portion-wrapper"
                            >
                              <button
                                type="button"
                                className={`manual-portion-card ${
                                  hasContent ? "clickable" : ""
                                } ${isPortionExpanded ? "expanded" : ""}`}
                                onClick={() =>
                                  hasContent &&
                                  togglePortion(category.id, product.id, p.size)
                                }
                                disabled={!hasContent}
                              >
                                <span className="manual-portion-main">
                                  <span className="manual-portion-name">
                                    {p.size}
                                  </span>
                                  {p.grams ? (
                                    <span className="manual-portion-meta">
                                      {p.grams}gr · {p.description || "-"}
                                    </span>
                                  ) : (
                                    <span className="manual-portion-meta">
                                      {p.description || "-"}
                                    </span>
                                  )}
                                </span>
                                {hasContent && (
                                  <span
                                    className="manual-portion-arrow"
                                    aria-hidden="true"
                                  >
                                    {isPortionExpanded ? "▲" : "▼"}
                                  </span>
                                )}
                              </button>
                              {isPortionExpanded &&
                                (steps.length > 0 ||
                                  p.finishedImage ||
                                  product.finishedImage ||
                                  p.preparationMedia ||
                                  product.preparationMedia) && (
                                  <div className="manual-portion-instructions">
                                    {(p.finishedImage ||
                                      product.finishedImage) && (
                                      <div className="manual-media-section">
                                        <h4>Produto final</h4>
                                        <img
                                          src={
                                            p.finishedImage ||
                                            product.finishedImage
                                          }
                                          alt={`${p.size} - produto final`}
                                          className="manual-finished-image"
                                        />
                                      </div>
                                    )}
                                    {(p.container || product.container) &&
                                      (() => {
                                        const raw =
                                          p.container || product.container;
                                        const items = Array.isArray(raw)
                                          ? raw
                                          : String(raw)
                                              .split(/\s*-\s*/)
                                              .map((s) => s.trim())
                                              .filter(Boolean);
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
                                    {(p.preparationMedia ||
                                      product.preparationMedia) && (
                                      <div className="manual-media-section">
                                        <h4>Preparação</h4>
                                        {(p.preparationMedia ||
                                        product.preparationMedia
                                      ).type === "video" ? (
                                          <video
                                            className="manual-prep-media"
                                            controls
                                            playsInline
                                            muted
                                            loop
                                            src={
                                              (p.preparationMedia ||
                                                product.preparationMedia).url
                                            }
                                          >
                                            Seu navegador não suporta vídeo.
                                          </video>
                                        ) : (
                                          <img
                                            src={
                                              (p.preparationMedia ||
                                                product.preparationMedia).url
                                            }
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
                );

                return (
                  <div
                    key={product.id}
                    className={`manual-product ${
                      isExpanded ? "expanded" : ""
                    }`}
                  >
                    {!isFlatCategory && (
                      <button
                        type="button"
                        className="manual-product-header"
                        onClick={() => toggleProduct(category.id, product.id)}
                      >
                        <span className="manual-product-name">
                          {product.name}
                        </span>
                        <span className="manual-product-arrow">
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </button>
                    )}

                    {isExpanded && renderPortions()}
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
