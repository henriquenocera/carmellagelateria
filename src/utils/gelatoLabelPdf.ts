import { jsPDF } from "jspdf";

export type GelatoLabelPdfItem = {
  flavor: string;
  date: string;
  peso?: string;
  tara?: string;
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function registerMontserrat(doc: jsPDF) {
  const base = process.env.PUBLIC_URL || "";
  const responses = await Promise.all([
    fetch(`${base}/fonts/Montserrat-Regular.ttf`),
    fetch(`${base}/fonts/Montserrat-Bold.ttf`)
  ]);
  if (responses.some(response => !response.ok)) throw new Error("Não foi possível carregar a fonte Montserrat.");
  const [regularBuffer, boldBuffer] = await Promise.all(responses.map(response => response.arrayBuffer()));
  doc.addFileToVFS("Montserrat-Regular.ttf", arrayBufferToBase64(regularBuffer));
  doc.addFont("Montserrat-Regular.ttf", "Montserrat", "normal");
  doc.addFileToVFS("Montserrat-Bold.ttf", arrayBufferToBase64(boldBuffer));
  doc.addFont("Montserrat-Bold.ttf", "Montserrat", "bold");
}

export async function generateGelatoLabelsPdf(items: GelatoLabelPdfItem[]) {
  if (!items.length) return;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [60, 40] });
  let labelFont = "helvetica";
  try {
    await registerMontserrat(doc);
    labelFont = "Montserrat";
  } catch (error) {
    console.error("Erro ao carregar a fonte Montserrat:", error);
  }

  const pageWidth = 60;
  const totalCounts: Record<string, number> = {};
  items.forEach(item => {
    const key = `${item.flavor}_${item.date}`;
    totalCounts[key] = (totalCounts[key] || 0) + 1;
  });
  const runningCounts: Record<string, number> = {};

  items.forEach((item, index) => {
    if (index > 0) doc.addPage([60, 40], "landscape");
    const productionDate = item.date ? new Date(`${item.date}T12:00:00`) : null;
    const expiryDate = productionDate ? new Date(productionDate) : null;
    expiryDate?.setDate(expiryDate.getDate() + 90);
    const formattedProduction = productionDate?.toLocaleDateString("pt-BR") || "";
    const formattedExpiry = expiryDate?.toLocaleDateString("pt-BR") || "";

    const words = item.flavor.split(" ").filter(word => !["com", "de", "da", "do", "e", "o", "a"].includes(word.toLowerCase()));
    const prefix = words.length === 1 ? words[0].substring(0, 3).toUpperCase() : words.map(word => word[0]).join("").toUpperCase();
    const datePart = item.date ? item.date.split("-").reverse().join("").substring(0, 4) + item.date.split("-")[0].substring(2) : "";
    const countKey = `${item.flavor}_${item.date}`;
    runningCounts[countKey] = (runningCounts[countKey] || 0) + 1;
    let fullCode = datePart ? `${prefix}-${datePart}` : prefix;
    if (totalCounts[countKey] > 1) fullCode += `-${String(runningCounts[countKey]).padStart(2, "0")}`;

    doc.setFont(labelFont, "bold");
    doc.setFontSize(item.flavor.length > 22 ? 7.5 : 9);
    doc.setTextColor(0, 0, 0);
    const flavorLines = doc.splitTextToSize(item.flavor.toUpperCase(), pageWidth - 8);
    doc.text(flavorLines, pageWidth / 2, 7, { align: "center" });

    doc.setFont(labelFont, "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    const labelX = 4;
    const valueX = pageWidth - 4;
    let currentY = 15;
    doc.text("Data de Produção", labelX, currentY);
    if (formattedProduction) doc.text(formattedProduction, valueX, currentY, { align: "right" });
    currentY += 5;
    doc.text("Data de Validade", labelX, currentY);
    if (formattedExpiry) doc.text(formattedExpiry, valueX, currentY, { align: "right" });
    currentY += 5;
    doc.text("Código:", labelX, currentY);
    doc.text(fullCode, valueX, currentY, { align: "right" });
    currentY += 5;

    doc.setFontSize(8);
    const kgPadding = 4;
    const lineLength = 20;
    const lineX = pageWidth - 4 - lineLength - kgPadding;
    const lineEndX = pageWidth - 4 - kgPadding;
    const kgX = pageWidth - 4;
    const verticalGap = 6;
    doc.text("Peso:", labelX, currentY);
    doc.line(lineX, currentY + 1, lineEndX, currentY + 1);
    doc.text("kg", kgX, currentY, { align: "right" });
    const pesoText = (item.peso || "").trim().replace(/\s*kg$/i, "");
    if (pesoText) doc.text(pesoText, lineEndX, currentY - 0.5, { align: "right" });
    doc.text("Tara:", labelX, currentY + verticalGap);
    doc.line(lineX, currentY + verticalGap + 1, lineEndX, currentY + verticalGap + 1);
    doc.text("kg", kgX, currentY + verticalGap, { align: "right" });
    const taraText = (item.tara || "").trim().replace(/\s*kg$/i, "");
    if (taraText) doc.text(taraText, lineEndX, currentY + verticalGap - 0.5, { align: "right" });
  });

  doc.save(`etiquetas_gelato_${new Date().toISOString().split("T")[0]}.pdf`);
}
