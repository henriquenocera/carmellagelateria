import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Select from "react-select";
import supabase from "../services/supabase-client";
import { GELATO_FLAVORS } from "../Sabores.ts";
import "../css/Etiquetas.css";
import { jsPDF } from "jspdf";
import { BsPrinterFill, BsPlusLg, BsXLg, BsShop } from "react-icons/bs";

const Etiquetas: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<{
    flavor: string;
    date: string;
    id: string;
    isFoodService?: boolean;
    clientName?: string;
  }[]>([]);
  const [currentFlavor, setCurrentFlavor] = useState<{ value: string; label: string } | null>(null);
  const [customName, setCustomName] = useState("");
  const [dataProducao, setDataProducao] = useState(new Date().toISOString().split('T')[0]);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [flavorOptions, setFlavorOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingFlavors, setLoadingFlavors] = useState<boolean>(true);

  // Food Service states
  const [isFoodService, setIsFoodService] = useState<boolean>(false);
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

  const addItem = () => {
    const flavorName = customName.trim() || (currentFlavor ? currentFlavor.label : "");
    if (!flavorName) return;

    const clientName = isFoodService
      ? (customClientName.trim() || (selectedClientOption ? selectedClientOption.label : ""))
      : "";

    if (isFoodService && !clientName) {
      alert("Por favor, selecione ou digite o nome do cliente para o Pedido Food Service.");
      return;
    }

    const count = Math.max(1, quantidade);
    const newItems = Array.from({ length: count }, () => ({
      flavor: flavorName,
      date: dataProducao,
      id: Math.random().toString(36).substr(2, 9),
      isFoodService: isFoodService,
      clientName: clientName
    }));

    setSelectedItems([...selectedItems, ...newItems]);
    setCustomName("");
    setCurrentFlavor(null);
    setQuantidade(1);
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape", // 80x50 is typically landscape
      unit: "mm",
      format: [80, 50]
    });

    const pageWidth = 80;
    const pageHeight = 50;

    // 1. Pre-calculate total counts for each flavor + date combination
    const totalCounts: Record<string, number> = {};
    selectedItems.forEach(item => {
      const key = `${item.flavor}_${item.date}`;
      totalCounts[key] = (totalCounts[key] || 0) + 1;
    });

    // 2. Track running counts as we generate pages
    const runningCounts: Record<string, number> = {};

    selectedItems.forEach((item, index) => {
      if (index > 0) {
        doc.addPage([80, 50], "landscape");
      }

      // Dates
      const prodDate = new Date(item.date + 'T12:00:00');
      const valDate = new Date(prodDate);
      valDate.setDate(valDate.getDate() + 90);

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
      doc.setTextColor(0, 0, 0);
      const flavorLines = doc.splitTextToSize(item.flavor.toUpperCase(), pageWidth - 10);
      doc.text(flavorLines, pageWidth / 2, 8, { align: "center" });

      // 2. Data Fields
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      
      const startY = 18;
      const rowHeight = 5;
      const labelColX = 5;
      const valueColX = pageWidth - 5;

      doc.text("Data de Produção", labelColX, startY);
      doc.text(formattedProd, valueColX, startY, { align: "right" });

      doc.text("Data de Validade", labelColX, startY + rowHeight);
      doc.text(formattedVal, valueColX, startY + rowHeight, { align: "right" });

      doc.text("Código:", labelColX, startY + rowHeight * 2);
      doc.text(fullCode, valueColX, startY + rowHeight * 2, { align: "right" });

      // 3. Peso e Tara OU Cliente
      const lineStartY = startY + rowHeight * 3.5;

      if (item.isFoodService && item.clientName) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Cliente:", labelColX, lineStartY);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        const clientLines = doc.splitTextToSize(item.clientName.toUpperCase(), pageWidth - 10);
        doc.text(clientLines, labelColX, lineStartY + 5);
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
    });

    doc.save(`etiquetas_carmella_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <>
      <Helmet>
        <title>Gerador de Etiquetas</title>
      </Helmet>
      <div className="etiquetas-container">
        <img className="logo-etiquetas" src="/logo.svg" alt="Carmella Logo" />
        <h1>Gerador de Etiquetas</h1>
        <p>Selecione os sabores ou digite nomes personalizados para gerar o PDF de impressão.</p>

        <div className="selection-section">
          <label
            className={`food-service-toggle-card ${isFoodService ? "active" : ""}`}
            htmlFor="foodServiceCheckbox"
          >
            <div className="toggle-card-content">
              <div className="toggle-icon-title">
                <BsShop className="food-service-icon" />
                <div>
                  <span className="food-service-title">Pedido Food Service</span>
                  <span className="food-service-subtitle">Exibe o nome do cliente na etiqueta (substitui peso e tara)</span>
                </div>
              </div>
              <div className="custom-switch">
                <input
                  type="checkbox"
                  id="foodServiceCheckbox"
                  checked={isFoodService}
                  onChange={(e) => {
                    setIsFoodService(e.target.checked);
                    if (!e.target.checked) {
                      setSelectedClientOption(null);
                      setCustomClientName("");
                    }
                  }}
                />
                <span className="switch-slider"></span>
              </div>
            </div>
          </label>

          {isFoodService && (
            <div className="client-input-container" style={{ marginBottom: "20px", background: "#fdfaf7", padding: "20px", borderRadius: "15px", border: "1px solid #f0e6dd", textAlign: "left" }}>
              <label style={{ display: "block", fontWeight: 700, color: "#5a432c", marginBottom: "12px", fontSize: "1.1rem" }}>
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
            <h3>Itens para Impressão ({selectedItems.length})</h3>
            <div className="selected-tags">
              {selectedItems.map((item) => (
                <div key={item.id} className="tag-complex">
                  <div className="tag-info">
                    <span className="tag-flavor">{item.flavor}</span>
                    <span className="tag-date">Produção: {item.date.split('-').reverse().join('/')}</span>
                    {item.isFoodService && item.clientName && (
                      <span className="tag-client" style={{ fontSize: "0.95rem", color: "#d97706", fontWeight: 700, marginTop: "4px" }}>
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
