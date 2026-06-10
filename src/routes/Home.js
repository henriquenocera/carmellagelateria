import React, { useState, useMemo } from "react";
import "../css/Home.css";
import { Helmet } from "react-helmet";
import { manualData } from "../data/manualData";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const allSubCategories = useMemo(() => {
    return manualData.flatMap(major => major.categories || []);
  }, []);

  // Filter products based on search query and active category
  const filteredData = useMemo(() => {
    return manualData.map(major => {
      const filteredCategories = (major.categories || []).map(category => {
        if (activeCategory !== "all" && category.id !== activeCategory) {
          return null;
        }
        
        const filteredProducts = (category.products || []).map(product => {
          const filteredPortions = (product.portions || []).filter(portion => {
            return portion.size.toLowerCase().includes(searchQuery.toLowerCase());
          });

          if (filteredPortions.length === 0) return null;

          return { ...product, portions: filteredPortions };
        }).filter(Boolean);

        if (filteredProducts.length === 0) return null;

        return { ...category, products: filteredProducts };
      }).filter(Boolean);

      if (filteredCategories.length === 0) return null;

      return { ...major, categories: filteredCategories };
    }).filter(Boolean);
  }, [searchQuery, activeCategory]);

  return (
    <>
      <Helmet>
        <title>Manual - Carmella Gelateria</title>
      </Helmet>
      
      <div className="manual-dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="dashboard-main">
          <div className="category-tabs desktop-tabs">
            <button 
              className={`tab-btn ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              Todos
            </button>
            {manualData.map(major => (
              <div key={major.id} className="desktop-filter-group">
                <span className="major-category-tag filter-tag">{major.icon} {major.title}</span>
                {major.categories.map(cat => (
                  <button 
                    key={cat.id}
                    className={`tab-btn ${activeCategory === cat.id ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.icon} {cat.title}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="category-tabs mobile-tabs">
            <button 
              className={`tab-btn ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              Todos
            </button>
            <button 
              className={`tab-btn ${activeCategory !== "all" ? "active" : ""}`}
              onClick={() => setFilterOpen(true)}
            >
              {activeCategory === "all" ? "Filtrar" : allSubCategories.find(c => c.id === activeCategory)?.title || "Filtrar"} <span>▼</span>
            </button>
          </div>

          {filterOpen && (
            <div className="modal-overlay" onClick={() => setFilterOpen(false)}>
              <div className="modal-content filter-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setFilterOpen(false)}>✕</button>
                <div className="modal-header">
                  <h2>Filtrar</h2>
                </div>
                <div className="modal-body filter-list">
                  <button 
                    className={`tab-btn full-width ${activeCategory === "all" ? "active" : ""}`}
                    onClick={() => { setActiveCategory("all"); setFilterOpen(false); }}
                  >
                    Todos
                  </button>
                  {manualData.map(major => (
                    <div key={major.id} className="modal-filter-group">
                      <span className="major-category-tag filter-tag">{major.icon} {major.title}</span>
                      {major.categories.map(cat => (
                        <button 
                          key={cat.id}
                          className={`tab-btn full-width ${activeCategory === cat.id ? "active" : ""}`}
                          onClick={() => { setActiveCategory(cat.id); setFilterOpen(false); }}
                        >
                          {cat.icon} {cat.title}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="products-container">
            {filteredData.length === 0 ? (
              <div className="no-results">
                Nenhum produto encontrado para "{searchQuery}"
              </div>
            ) : (
              filteredData.flatMap(major => (
                major.categories.map(category => (
                  <div key={category.id} className="category-section">
                    <div className="category-header-wrapper">
                      <span className="major-category-tag">{major.icon} {major.title}</span>
                      <h2 className="category-heading">{category.icon} {category.title}</h2>
                    </div>
                    <div className="products-grid">
                      {category.products.flatMap(product => 
                        product.portions.map((portion, idx) => {
                          const cardId = `${product.id}-${idx}`;
                          const steps = portion.steps || product.steps || [];
                          const container = portion.container || product.container;
                          const finishedImage = portion.finishedImage || product.finishedImage;
                          const preparationMedia = portion.preparationMedia || product.preparationMedia;
                          
                          return (
                            <div 
                              key={cardId} 
                              className="product-card" 
                              onClick={() => setSelectedProduct({ portion, product, steps, container, finishedImage, preparationMedia })}
                            >
                              <div className="product-card-header">
                                <div className="card-header-titles">
                                  <h3>{portion.size}</h3>
                                  {(portion.grams || portion.description) && (
                                    <span className="portion-meta">
                                      {portion.grams && `${portion.grams}g`}
                                      {portion.grams && portion.description && ' • '}
                                      {portion.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                ))
              ))
            )}
          </div>
        </div>

        {/* Modal for Product Details */}
        {selectedProduct && (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedProduct(null)}>✕</button>
              
              <div className="modal-header">
                <h2>{selectedProduct.portion.size}</h2>
                {(selectedProduct.portion.grams || selectedProduct.portion.description) && (
                  <p className="modal-meta">
                    {selectedProduct.portion.grams && `${selectedProduct.portion.grams}g`}
                    {selectedProduct.portion.grams && selectedProduct.portion.description && ' • '}
                    {selectedProduct.portion.description}
                  </p>
                )}
              </div>
              
              <div className="modal-body">
                {selectedProduct.preparationMedia && (
                  <div className="instruction-section">
                    <h5>Preparo (Vídeo/Imagem)</h5>
                    {selectedProduct.preparationMedia.type === 'video' ? (
                      <video 
                        src={selectedProduct.preparationMedia.url} 
                        controls 
                        className="modal-media-video"
                        autoPlay
                        muted
                        loop
                      />
                    ) : (
                      <img 
                        src={selectedProduct.preparationMedia.url} 
                        alt="Preparo" 
                        className="modal-media-image" 
                      />
                    )}
                  </div>
                )}

                {selectedProduct.container && (
                  <div className="instruction-section">
                    <h5>Recipiente</h5>
                    <p>{selectedProduct.container}</p>
                  </div>
                )}
                
                {selectedProduct.steps.length > 0 && (
                  <div className="instruction-section">
                    <h5>Preparo</h5>
                    <ul className="step-list">
                      {selectedProduct.steps.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProduct.finishedImage && (
                  <div className="instruction-section">
                    <h5>Resultado Esperado</h5>
                    <img 
                      src={selectedProduct.finishedImage} 
                      alt="Resultado final" 
                      className="modal-media-image" 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
