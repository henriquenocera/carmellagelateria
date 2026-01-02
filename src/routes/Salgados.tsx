import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import "../css/Salgados.css";
import supabase from "../supabase-client";

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

  // saving state per item: 'idle' | 'saving' | 'saved' | 'error'
  const [saveStatus, setSaveStatus] = useState<Record<string, string>>({});
  const saveDebounceRef = useRef<Record<string, any>>({});

  // Unit / loja identifier - adjust or make selectable if needed
  const UNIT = process.env.REACT_APP_UNIT || "altoxv";

  const setItemStatus = (key: string, status: string) => {
    setSaveStatus((s) => ({ ...s, [key]: status }));
  };

  // load existing inventory from Supabase for this UNIT on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('salgados_inventory')
          .select('collection,item_name,quantity')
          .eq('unit', UNIT);
        if (error) throw error;
        if (!mounted) return;
        const sandwichUpdates: Record<string, number> = {};
        const quicheUpdates: Record<string, number> = {};
        (data || []).forEach((r: any) => {
          const c = r.collection;
          const name = r.item_name;
          const qty = Number(r.quantity) || 0;
          if (c === 'sandwich' && SANDWICHES.includes(name)) sandwichUpdates[name] = qty;
          if (c === 'quiche' && QUICHES.includes(name)) quicheUpdates[name] = qty;
        });
        if (Object.keys(sandwichUpdates).length) setSandwichInventory((p) => ({ ...p, ...sandwichUpdates }));
        if (Object.keys(quicheUpdates).length) setQuicheInventory((p) => ({ ...p, ...quicheUpdates }));
        // mark loaded items as idle
        const loadedStatus: Record<string, string> = {};
        Object.keys(sandwichUpdates).forEach((n) => (loadedStatus[`sandwich:${n}`] = 'idle'));
        Object.keys(quicheUpdates).forEach((n) => (loadedStatus[`quiche:${n}`] = 'idle'));
        setSaveStatus((s) => ({ ...s, ...loadedStatus }));
      } catch (err) {
        console.error('Error loading inventory', err);
      }
    };
    load();
    return () => { mounted = false };
  }, [UNIT]);

  const saveInventoryToSupabase = async (collection: string, name: string, quantity: number) => {
    const key = `${collection}:${name}`;
    try {
      setItemStatus(key, 'saving');
      // upsert by unit+collection+item_name (create this unique constraint in Supabase)
      const { data, error } = await supabase
        .from('salgados_inventory')
        .upsert({ unit: UNIT, collection, item_name: name, quantity, updated_at: new Date().toISOString() }, { onConflict: ['unit', 'collection', 'item_name'] });
      if (error) throw error;
      setItemStatus(key, 'saved');
      // clear saved status after a short delay
      setTimeout(() => setItemStatus(key, 'idle'), 1500);
      return data;
    } catch (err) {
      console.error('Supabase save error', err);
      setItemStatus(key, 'error');
    }
  };

  const setInventory = (collection: 'sandwich' | 'quiche', name: string, value: number) => {
    const v = Math.max(0, Math.min(999, Math.floor(Number(value) || 0)));
    if (collection === 'sandwich') setSandwichInventory((p) => ({ ...p, [name]: v }));
    else setQuicheInventory((p) => ({ ...p, [name]: v }));
    // debounce saves for manual input
    const key = `${collection}:${name}`;
    if (saveDebounceRef.current[key]) clearTimeout(saveDebounceRef.current[key]);
    saveDebounceRef.current[key] = setTimeout(() => {
      saveInventoryToSupabase(collection, name, v);
      delete saveDebounceRef.current[key];
    }, 700);
  };

  const incr = (collection: 'sandwich' | 'quiche', name: string) => {
    if (collection === 'sandwich') {
      setSandwichInventory((p) => {
        const val = Math.min(999, p[name] + 1);
        saveInventoryToSupabase(collection, name, val);
        return { ...p, [name]: val };
      });
    } else {
      setQuicheInventory((p) => {
        const val = Math.min(999, p[name] + 1);
        saveInventoryToSupabase(collection, name, val);
        return { ...p, [name]: val };
      });
    }
  };

  const decr = (collection: 'sandwich' | 'quiche', name: string) => {
    if (collection === 'sandwich') {
      setSandwichInventory((p) => {
        const val = Math.max(0, p[name] - 1);
        saveInventoryToSupabase(collection, name, val);
        return { ...p, [name]: val };
      });
    } else {
      setQuicheInventory((p) => {
        const val = Math.max(0, p[name] - 1);
        saveInventoryToSupabase(collection, name, val);
        return { ...p, [name]: val };
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sandwich inventory:", sandwichInventory);
    console.log("Quiche inventory:", quicheInventory);
    alert("Inventário salvo (veja DevTools para detalhes).");
  };

  return (
    <div className="container salgados-page">
      <h2>Relatório de Salgados</h2>

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
                <span className={`save-status ${saveStatus[`sandwich:${name}`] || 'idle'}`} aria-hidden="true">{saveStatus[`sandwich:${name}`] === 'saving' ? '…' : saveStatus[`sandwich:${name}`] === 'saved' ? '✓' : saveStatus[`sandwich:${name}`] === 'error' ? '!' : ''}</span>
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
                <span className={`save-status ${saveStatus[`quiche:${name}`] || 'idle'}`} aria-hidden="true">{saveStatus[`quiche:${name}`] === 'saving' ? '…' : saveStatus[`quiche:${name}`] === 'saved' ? '✓' : saveStatus[`quiche:${name}`] === 'error' ? '!' : ''}</span>
              </div>
            </div>
          ))}
        </section>

      </form>
    </div>
  );
}

export default Salgados;
