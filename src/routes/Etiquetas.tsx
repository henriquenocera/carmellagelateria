import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Select from "react-select";
import supabase from "../services/supabase-client";
import { GELATO_FLAVORS } from "../Sabores.ts";
import "../css/Etiquetas.css";
import { jsPDF } from "jspdf";
import { BsPrinterFill, BsPlusLg, BsXLg, BsShop, BsSnow, BsSquareFill, BsGrid3X3 } from "react-icons/bs";

type LabelType = "gelato" | "foodService" | "brownie" | "waffle";

type LabelItem = {
  flavor: string;
  date: string;
  id: string;
  labelType: LabelType;
  clientName?: string;
};

type LabelTheme = {
  primary: string;
  primaryDark: string;
  soft: string;
  softHover: string;
  border: string;
  borderStrong: string;
  muted: string;
  accent: string;
  accentSoft: string;
};

const LABEL_THEMES: Record<LabelType, LabelTheme> = {
  gelato: {
    primary: "#c2410c",
    primaryDark: "#9a3412",
    soft: "#fff7ed",
    softHover: "#ffedd5",
    border: "#fed7aa",
    borderStrong: "#fdba74",
    muted: "#9a6b4f",
    accent: "#f97316",
    accentSoft: "#ffedd5"
  },
  foodService: {
    primary: "#7e22ce",
    primaryDark: "#581c87",
    soft: "#faf5ff",
    softHover: "#f3e8ff",
    border: "#e9d5ff",
    borderStrong: "#d8b4fe",
    muted: "#8b6f9e",
    accent: "#9333ea",
    accentSoft: "#f3e8ff"
  },
  brownie: {
    primary: "#5c3a21",
    primaryDark: "#3f2614",
    soft: "#fdf6f0",
    softHover: "#f7e8dc",
    border: "#e7d2c3",
    borderStrong: "#d3b29b",
    muted: "#8b6f5e",
    accent: "#8b4513",
    accentSoft: "#f3e1d3"
  },
  waffle: {
    primary: "#a16207",
    primaryDark: "#713f12",
    soft: "#fefce8",
    softHover: "#fef9c3",
    border: "#fde68a",
    borderStrong: "#facc15",
    muted: "#a17a3f",
    accent: "#eab308",
    accentSoft: "#fef9c3"
  }
};

const LABEL_TABS: { id: LabelType; label: string; icon: React.ElementType }[] = [
  { id: "gelato", label: "Gelato", icon: BsSnow },
  { id: "foodService", label: "Food Service", icon: BsShop },
  { id: "brownie", label: "Brownie", icon: BsSquareFill },
  { id: "waffle", label: "Waffle", icon: BsGrid3X3 }
];

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map(c => c + c).join("")
    : normalized;
  const int = parseInt(value, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

const Etiquetas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LabelType>("gelato");
  const [itemsByType, setItemsByType] = useState<Record<LabelType, LabelItem[]>>({
    gelato: [],
    foodService: [],
    brownie: [],
    waffle: []
  });
  const selectedItems = itemsByType[activeTab];
  const isFoodService = activeTab === "foodService";
  const isBrownie = activeTab === "brownie";
  const isWaffle = activeTab === "waffle";
  const isSimpleLabel = isBrownie || isWaffle;
  const labelTheme = LABEL_THEMES[activeTab];
  const activeTabLabel = LABEL_TABS.find(tab => tab.id === activeTab)?.label || "Gelato";
  const themeStyle = {
    "--label-primary": labelTheme.primary,
    "--label-primary-dark": labelTheme.primaryDark,
    "--label-soft": labelTheme.soft,
    "--label-soft-hover": labelTheme.softHover,
    "--label-border": labelTheme.border,
    "--label-border-strong": labelTheme.borderStrong,
    "--label-muted": labelTheme.muted,
    "--label-accent": labelTheme.accent,
    "--label-accent-soft": labelTheme.accentSoft
  } as React.CSSProperties & Record<string, string>;
  const [currentFlavor, setCurrentFlavor] = useState<{ value: string; label: string } | null>(null);
  const [customName, setCustomName] = useState("");
  const [dataProducao, setDataProducao] = useState(new Date().toISOString().split('T')[0]);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [flavorOptions, setFlavorOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingFlavors, setLoadingFlavors] = useState<boolean>(true);

  // Food Service states
  const [clientOptions, setClientOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedClientOption, setSelectedClientOption] = useState<{ value: string; label: string } | null>(null);
  const [customClientName, setCustomClientName] = useState<string>("");
  const [loadingClients, setLoadingClients] = useState<boolean>(false);

  useEffect(() => {
    async function fetchSabores() {
      try {
        setLoadingFlavors(true);
        const { data, error } = await supabase
          .from("cadastro_produtos")
          .select("id, nome, is_sabor, ativo")
          .eq("ativo", true)
          .order("nome", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const saboresDb = data.filter((p: any) => p.is_sabor);
          const listSource = saboresDb.length > 0 ? saboresDb : data;
          const list = listSource.map((p: any) => ({ value: p.nome, label: p.nome }));
          setFlavorOptions(list);
        } else {
          setFlavorOptions(GELATO_FLAVORS.map(f => ({ value: f, label: f })));
        }
      } catch (err) {
        console.error("Erro ao buscar sabores no cadastro de produtos:", err);
        setFlavorOptions(GELATO_FLAVORS.map(f => ({ value: f, label: f })));
      } finally {
        setLoadingFlavors(false);
      }
    }

    fetchSabores();
  }, []);

  useEffect(() => {
    if (isFoodService) {
      async function fetchClientes() {
        try {
          setLoadingClients(true);
          const { data, error } = await supabase
            .from("clientes_food_service")
            .select("id, nome, status")
            .ilike("status", "%Neg%cio Fechado%")
            .order("nome", { ascending: true });

          if (!error && data) {
            setClientOptions(data.map((c: any) => ({ value: c.nome, label: c.nome })));
          }
        } catch (err) {
          console.error("Erro ao buscar clientes food service:", err);
        } finally {
          setLoadingClients(false);
        }
      }
      fetchClientes();
    }
  }, [isFoodService]);

  const handleTabChange = (tab: LabelType) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setCurrentFlavor(null);
    setCustomName("");
    setSelectedClientOption(null);
    setCustomClientName("");
    setQuantidade(1);
  };

  const addItem = () => {
    const flavorName = isSimpleLabel
      ? (isBrownie ? "Brownie" : "Waffle")
      : customName.trim() || (currentFlavor ? currentFlavor.label : "");
    if (!flavorName) return;

    const clientName = isFoodService
      ? (customClientName.trim() || (selectedClientOption ? selectedClientOption.label : ""))
      : "";

    if (isFoodService && !clientName) {
      alert("Por favor, selecione ou digite o nome do cliente para o Pedido Food Service.");
      return;
    }

    const count = Math.max(1, quantidade);
    const newItems: LabelItem[] = Array.from({ length: count }, () => ({
      flavor: flavorName,
      date: dataProducao,
      id: Math.random().toString(36).substr(2, 9),
      labelType: activeTab,
      clientName: clientName
    }));

    setItemsByType(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], ...newItems]
    }));
    setCustomName("");
    setCurrentFlavor(null);
    setQuantidade(1);
  };

  const removeItem = (id: string) => {
    setItemsByType(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(item => item.id !== id)
    }));
  };

  const generatePDF = () => {
    const items = itemsByType[activeTab];
    if (items.length === 0) return;

    const doc = new jsPDF({
      orientation: "landscape", // 80x50 is typically landscape
      unit: "mm",
      format: [80, 50]
    });

    const pageWidth = 80;
    const [primaryR, primaryG, primaryB] = hexToRgb(labelTheme.primary);
    const [accentR, accentG, accentB] = hexToRgb(labelTheme.accent);

    // 1. Pre-calculate total counts for each flavor + date combination
    const totalCounts: Record<string, number> = {};
    items.forEach(item => {
      const key = `${item.flavor}_${item.date}`;
      totalCounts[key] = (totalCounts[key] || 0) + 1;
    });

    // 2. Track running counts as we generate pages
    const runningCounts: Record<string, number> = {};

    items.forEach((item, index) => {
      if (index > 0) {
        doc.addPage([80, 50], "landscape");
      }

      doc.setFillColor(primaryR, primaryG, primaryB);
      doc.rect(0, 0, pageWidth, 2, "F");

      const isBrownieItem = item.labelType === "brownie";
      const isWaffleItem = item.labelType === "waffle";
      const isSimpleItem = isBrownieItem || isWaffleItem;

      // Dates
      const prodDate = new Date(item.date + 'T12:00:00');
      const valDate = new Date(prodDate);
      const validadeDias = isBrownieItem ? 30 : isWaffleItem ? 7 : 90;
      valDate.setDate(valDate.getDate() + validadeDias);

      const formattedProd = prodDate.toLocaleDateString('pt-BR');
      const formattedVal = valDate.toLocaleDateString('pt-BR');
      
      // Code generation logic
      const words = item.flavor.split(' ').filter(w => 
        !['com', 'de', 'da', 'do', 'e', 'o', 'a'].includes(w.toLowerCase())
      );
      
      let prefix = '';
      if (words.length === 1) {
        prefix = words[0].substring(0, 3).toUpperCase();
      } else {
        prefix = words.map(w => w[0]).join('').toUpperCase();
      }

      const datePart = item.date.split('-').reverse().join('').substring(0, 4) + item.date.split('-')[0].substring(2); // DDMMYY
      
      const countKey = `${item.flavor}_${item.date}`;
      runningCounts[countKey] = (runningCounts[countKey] || 0) + 1;
      
      // Format: PREFIX-DATE
      let fullCode = `${prefix}-${datePart}`;
      
      // Only add counter if there's more than one of the same flavor+date in the list
      if (totalCounts[countKey] > 1) {
        const counter = String(runningCounts[countKey]).padStart(2, '0');
        fullCode += `-${counter}`;
      }

      // 1. Flavor Name (Top, Centered, Bold)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11); // Slightly smaller for 80mm
      doc.setTextColor(primaryR, primaryG, primaryB);
      const flavorLines = doc.splitTextToSize(item.flavor.toUpperCase(), pageWidth - 10);
      doc.text(flavorLines, pageWidth / 2, 8, { align: "center" });

      // 2. Datas e demais campos
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      
      const startY = isSimpleItem ? 22 : 18;
      const rowHeight = isSimpleItem ? 8 : 5;
      const labelColX = 5;
      const valueColX = pageWidth - 5;

      let currentY = startY;
      doc.text("Data de Produção", labelColX, currentY);
      doc.text(formattedProd, valueColX, currentY, { align: "right" });
      currentY += rowHeight;

      doc.text("Data de Validade", labelColX, currentY);
      doc.text(formattedVal, valueColX, currentY, { align: "right" });
      currentY += rowHeight;

      if (!isSimpleItem) {
        doc.text("Código:", labelColX, currentY);
        doc.text(fullCode, valueColX, currentY, { align: "right" });
        currentY += rowHeight * 1.5;

        // 3. Peso e Tara OU Cliente
        const lineStartY = currentY;

        if (item.labelType === "foodService" && item.clientName) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.text("Cliente:", labelColX, lineStartY);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(accentR, accentG, accentB);
          const clientLines = doc.splitTextToSize(item.clientName.toUpperCase(), pageWidth - 10);
          doc.text(clientLines, labelColX, lineStartY + 5);
          doc.setTextColor(0, 0, 0);
        } else {
          const kgPadding = 6;
          const lineLength = 30;
          const lineX = pageWidth - 5 - lineLength - kgPadding;
          const lineEndX = pageWidth - 5 - kgPadding;
          const kgX = pageWidth - 5;

          const verticalGap = 10; // Increased spacing between lines

          // Peso Row
          doc.text("Peso:", labelColX, lineStartY);
          doc.line(lineX, lineStartY + 1, lineEndX, lineStartY + 1);
          doc.text("kg", kgX, lineStartY, { align: "right" });

          // Tara Row
          doc.text("Tara:", labelColX, lineStartY + verticalGap);
          doc.line(lineX, lineStartY + verticalGap + 1, lineEndX, lineStartY + verticalGap + 1);
          doc.text("kg", kgX, lineStartY + verticalGap, { align: "right" });
        }
      }
    });

    doc.save(`etiquetas_${activeTab}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <>
      <Helmet>
        <title>Gerador de Etiquetas</title>
      </Helmet>
      <div className="etiquetas-container" style={themeStyle}>
        <img className="logo-etiquetas" src="/logo.svg" alt="Carmella Logo" />
        <h1>Gerador de Etiquetas</h1>
        <p>Escolha o tipo de etiqueta e selecione os sabores ou nomes personalizados.</p>

        <div className="label-tabs" role="tablist" aria-label="Tipo de etiqueta">
          {LABEL_TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`label-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <Icon className="label-tab-icon" />
                <span>{tab.label}</span>
                <span className="label-tab-count">{itemsByType[tab.id].length}</span>
              </button>
            );
          })}
        </div>

        <div className="selection-section">
          {isFoodService && (
            <div className="client-input-container" style={{ marginBottom: "20px", background: "var(--label-soft)", padding: "20px", borderRadius: "15px", border: "1px solid var(--label-border)", textAlign: "left" }}>
              <label style={{ display: "block", fontWeight: 700, color: "var(--label-primary)", marginBottom: "12px", fontSize: "1.1rem" }}>
                Cliente Food Service:
              </label>
              <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "240px" }}>
                  <Select
                    options={clientOptions}
                    value={selectedClientOption}
                    onChange={(option) => {
                      setSelectedClientOption(option as { value: string; label: string });
                      setCustomClientName("");
                    }}
                    placeholder={loadingClients ? "Carregando clientes..." : "Buscar cliente..."}
                    isLoading={loadingClients}
                    classNamePrefix="react-select"
                    isClearable
                  />
                </div>
                <div className="custom-or">ou</div>
                <div style={{ flex: 1, minWidth: "240px" }}>
                  <input
                    type="text"
                    className="custom-name-input"
                    value={customClientName}
                    onChange={(e) => {
                      setCustomClientName(e.target.value);
                      setSelectedClientOption(null);
                    }}
                    placeholder="Nome do cliente (texto livre)..."
                  />
                </div>
              </div>
            </div>
          )}

          <div className="input-group-container">
            {!isSimpleLabel && (
              <div className="flavor-input-part">
                <label>Sabor:</label>
                <Select
                  options={flavorOptions}
                  value={currentFlavor}
                  onChange={(option) => {
                    setCurrentFlavor(option as { value: string; label: string });
                    setCustomName("");
                  }}
                  placeholder={loadingFlavors ? "Carregando sabores..." : "Buscar sabor..."}
                  isLoading={loadingFlavors}
                  classNamePrefix="react-select"
                  isClearable
                />
                <div className="custom-or">ou</div>
                <input
                  type="text"
                  className="custom-name-input"
                  value={customName}
                  onChange={(e) => {
                    setCustomName(e.target.value);
                    setCurrentFlavor(null);
                  }}
                  placeholder="Nome personalizado..."
                />
              </div>
            )}

            <div className="date-input-part">
              <label>Data de Produção:</label>
              <input
                type="date"
                value={dataProducao}
                onChange={(e) => setDataProducao(e.target.value)}
                className="date-input"
              />
            </div>
            
            <div className="quantity-input-part" style={{ flex: "0 0 110px" }}>
              <label>Qtd:</label>
              <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value === "" ? "" as any : Math.max(1, parseInt(e.target.value) || 1))}
                className="date-input"
                style={{ textAlign: "center" }}
              />
            </div>
          </div>

          <button className="add-to-list-btn" onClick={addItem}>
            <BsPlusLg /> Adicionar à Lista
          </button>
        </div>

        {selectedItems.length > 0 && (
          <div className="selected-list">
            <h3>Itens para Impressão — {activeTabLabel} ({selectedItems.length})</h3>
            <div className="selected-tags">
              {selectedItems.map((item) => (
                <div key={item.id} className="tag-complex">
                  <div className="tag-info">
                    <span className="tag-flavor">{item.flavor}</span>
                    <span className="tag-date">Produção: {item.date.split('-').reverse().join('/')}</span>
                    {item.labelType === "foodService" && item.clientName && (
                      <span className="tag-client" style={{ fontSize: "0.95rem", color: "var(--label-accent)", fontWeight: 700, marginTop: "4px" }}>
                        Cliente: {item.clientName}
                      </span>
                    )}
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>
                    <BsXLg size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="generate-section">
          <button
            className="generate-btn"
            onClick={generatePDF}
            disabled={selectedItems.length === 0}
          >
            <BsPrinterFill /> Gerar PDF para Impressão
          </button>
        </div>
      </div>
    </>
  );
};

export default Etiquetas;
