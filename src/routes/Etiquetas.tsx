import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Select from "react-select";
import { GELATO_FLAVORS } from "../Sabores.ts";
import "../css/Etiquetas.css";
import { jsPDF } from "jspdf";
import { BsPrinterFill, BsPlusLg, BsXLg } from "react-icons/bs";

const Etiquetas: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<{ flavor: string; date: string; id: string }[]>([]);
  const [currentFlavor, setCurrentFlavor] = useState<{ value: string; label: string } | null>(null);
  const [customName, setCustomName] = useState("");
  const [dataProducao, setDataProducao] = useState(new Date().toISOString().split('T')[0]);

  const flavorOptions = React.useMemo(() => 
    GELATO_FLAVORS.map(flavor => ({ value: flavor, label: flavor })),
  []);

  const addItem = () => {
    const flavorName = customName.trim() || (currentFlavor ? currentFlavor.label : "");
    if (!flavorName) return;

    const newItem = {
      flavor: flavorName,
      date: dataProducao,
      id: Math.random().toString(36).substr(2, 9)
    };

    setSelectedItems([...selectedItems, newItem]);
    setCustomName("");
    setCurrentFlavor(null);
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
      valDate.setDate(valDate.getDate() + 180);

      const formattedProd = prodDate.toLocaleDateString('pt-BR');
      const formattedVal = valDate.toLocaleDateString('pt-BR');
      
      // Code generation logic
      const prefix = item.flavor.substring(0, 3).toUpperCase();
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

      // We don't need a border since the page itself is the label size
      // but let's add a subtle one if desired or just content

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

      // 3. Peso and Tara
      const lineStartY = startY + rowHeight * 3.5;
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
                placeholder="Buscar sabor..."
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
