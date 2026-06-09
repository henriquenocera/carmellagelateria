import React, { useState, useMemo } from "react";
import "../css/Home.css";
import { Helmet } from "react-helmet";
import { manualData } from "../data/manualData";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter products based on search query and active category
  const filteredCategories = useMemo(() => {
    return manualData.map(category => {
      if (activeCategory !== "all" && category.id !== activeCategory) {
        return null;
      }
      
      const filteredProducts = category.products.map(product => {
        const filteredPortions = product.portions.filter(portion => {
          // The title of the card is portion.size
          return portion.size.toLowerCase().includes(searchQuery.toLowerCase());
        });

        if (filteredPortions.length === 0) return null;

        return { ...product, portions: filteredPortions };
      }).filter(Boolean);

      if (filteredProducts.length === 0) return null;

      return { ...category, products: filteredProducts };
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
            {manualData.map(cat => (
              <button 
                key={cat.id}
                className={`tab-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.icon} {cat.title}
              </button>
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
              {activeCategory === "all" ? "Filtrar" : manualData.find(c => c.id === activeCategory)?.title || "Filtrar"} <span>▼</span>
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
                  {manualData.map(cat => (
                    <button 
                      key={cat.id}
                      className={`tab-btn full-width ${activeCategory === cat.id ? "active" : ""}`}
                      onClick={() => { setActiveCategory(cat.id); setFilterOpen(false); }}
                    >
                      {cat.icon} {cat.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="products-container">
            {filteredCategories.length === 0 ? (
              <div className="no-results">
                Nenhum produto encontrado para "{searchQuery}"
              </div>
            ) : (
              filteredCategories.map(category => (
                <div key={category.id} className="category-section">
                  <h2 className="category-heading">{category.icon} {category.title}</h2>
                  <div className="products-grid">
                    {category.products.flatMap(product => 
                      product.portions.map((portion, idx) => {
                        const cardId = `${product.id}-${idx}`;
                        const steps = portion.steps || product.steps || [];
                        const container = portion.container || product.container;
                        
                        return (
                          <div 
                            key={cardId} 
                            className="product-card" 
                            onClick={() => setSelectedProduct({ portion, product, steps, container })}
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
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
