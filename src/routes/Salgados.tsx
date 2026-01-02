import React, { useState } from "react";
import Select from "react-select";
import "../css/Salgados.css";

const BOXES_PER_ROW = 12; // number of small check boxes per item (adjust as needed)

const SANDWICHES = ["Parma", "Carne", "Frango", "Pernil", "Mortadela"];
const QUICHES = ["Lorraine", "Alho Poro", "Caprese"];

function Salgados() {
  // per-item inventory counts
  const createInventory = (items: string[]) => {
    const obj: Record<string, number> = {};
    items.forEach((name) => (obj[name] = 0));
    return obj;
  };

  const [sandwichInventory, setSandwichInventory] = useState<Record<string, number>>(createInventory(SANDWICHES));
  const [quicheInventory, setQuicheInventory] = useState<Record<string, number>>(createInventory(QUICHES));

  const setInventory = (collection: 'sandwich' | 'quiche', name: string, value: number) => {
    const v = Math.max(0, Math.min(999, Math.floor(Number(value) || 0)));
    if (collection === 'sandwich') setSandwichInventory((p) => ({ ...p, [name]: v }));
    else setQuicheInventory((p) => ({ ...p, [name]: v }));
  };

  const incr = (collection: 'sandwich' | 'quiche', name: string) => {
    if (collection === 'sandwich') setSandwichInventory((p) => ({ ...p, [name]: Math.min(999, p[name] + 1) }));
    else setQuicheInventory((p) => ({ ...p, [name]: Math.min(999, p[name] + 1) }));
  };

  const decr = (collection: 'sandwich' | 'quiche', name: string) => {
    if (collection === 'sandwich') setSandwichInventory((p) => ({ ...p, [name]: Math.max(0, p[name] - 1) }));
    else setQuicheInventory((p) => ({ ...p, [name]: Math.max(0, p[name] - 1) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sandwich inventory:", sandwichInventory);
    console.log("Quiche inventory:", quicheInventory);
    alert("Inventário salvo (veja DevTools para detalhes).");
  };

  return (
    <div className="container salgados-page">
      <h2>Manual da Loja</h2>
      <h3 className="title">Produtos</h3>

      <form className="grid-form" onSubmit={handleSubmit}>
        <section className="section">
          <h3 className="section-title">Sanduíches</h3>
          {SANDWICHES.map((name) => (
            <div className="item-row" key={name}>
              <div className="item-label">{name}</div>
              <div className="inventory" role="group" aria-label={`${name} estoque`}>
                <button type="button" className="qty-btn" aria-label={`Diminuir ${name}`} onClick={() => decr('sandwich', name)}>−</button>
                <input className="qty-input" type="number" min={0} max={999} value={sandwichInventory[name] ?? 0} onChange={(e) => setInventory('sandwich', name, Number(e.target.value))} aria-label={`${name} quantidade`} />
                <button type="button" className="qty-btn" aria-label={`Aumentar ${name}`} onClick={() => incr('sandwich', name)}>+</button>
              </div>
            </div>
          ))}
        </section>

        <section className="section">
          <h3 className="section-title">Quiche</h3>
          {QUICHES.map((name) => (
            <div className="item-row" key={name}>
              <div className="item-label">{name}</div>
              <div className="inventory" role="group" aria-label={`${name} estoque`}>
                <button type="button" className="qty-btn" aria-label={`Diminuir ${name}`} onClick={() => decr('quiche', name)}>−</button>
                <input className="qty-input" type="number" min={0} max={999} value={quicheInventory[name] ?? 0} onChange={(e) => setInventory('quiche', name, Number(e.target.value))} aria-label={`${name} quantidade`} />
                <button type="button" className="qty-btn" aria-label={`Aumentar ${name}`} onClick={() => incr('quiche', name)}>+</button>
              </div>
            </div>
          ))}
        </section>

        <div className="form-actions">
          <button type="submit" className="produto-btn">Salvar seleções</button>
        </div>
      </form>
    </div>
  );
}

export default Salgados;
