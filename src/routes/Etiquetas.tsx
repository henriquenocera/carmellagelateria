import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Select from "react-select";
import { Sabores } from "../Sabores.ts";
import "../css/Etiquetas.css";
import { jsPDF } from "jspdf";
import { BsPrinterFill, BsPlusLg, BsXLg } from "react-icons/bs";

const Etiquetas: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<{ flavor: string; date: string; id: string }[]>([]);
  const [currentFlavor, setCurrentFlavor] = useState<{ value: string; label: string } | null>(null);
  const [customName, setCustomName] = useState("");
  const [dataProducao, setDataProducao] = useState(new Date().toISOString().split('T')[0]);

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
      const code = item.flavor.substring(0, 3).toUpperCase();

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
      doc.text(code, valueColX, startY + rowHeight * 2, { align: "right" });

      // 3. Peso and Tara
      const lineStartY = startY + rowHeight * 3.5;
      const lineLength = 35;
      const lineX = pageWidth - 5 - lineLength;

      doc.text("Peso:", labelColX, lineStartY);
      doc.line(lineX, lineStartY + 1, valueColX, lineStartY + 1);

      doc.text("Tara:", labelColX, lineStartY + rowHeight * 1.5);
      doc.line(lineX, lineStartY + rowHeight * 1.5 + 1, valueColX, lineStartY + rowHeight * 1.5 + 1);
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
                options={Sabores}
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
                    <span className="tag-date">{item.date.split('-').reverse().join('/')}</span>
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
