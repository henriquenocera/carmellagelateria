import React, { useRef, useState } from "react";
import "../css/Afericao.css";
import supabase from "../supabase-client";
import { ListId } from "../id.ts";

// Tabela no Supabase: "afericao_porcao"
// Colunas sugeridas:
// id (uuid) - default uuid_generate_v4()
// unit (text)
// employee_name (text)
// cup_number (integer)
// portion_label (text)
// weight_grams (numeric)
// created_at (timestamptz) - default now()

const UNIT = process.env.REACT_APP_UNIT || "ahu";

function Afericao() {
  const WEIGHT_LABELS = [
    "1 porção de 70g na espátula do sabor Baunilha",
    "1 copinho pequeno de 120g do sabor Baunilha",
    "1 copinho médio de 140g do sabor Baunilha",
  ];

  const [employeeName, setEmployeeName] = useState<string>("");
  const idInputRef = useRef<HTMLInputElement | null>(null);
  const [weights, setWeights] = useState<number[]>([0, 0, 0]); // 3 pesagens obrigatórias
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [idError, setIdError] = useState<string>("");

  const handleWeightChange = (index: number, value: string) => {
    const num = Number(value.replace(",", "."));
    setWeights((prev) => {
      const copy = [...prev];
      copy[index] = isNaN(num) ? 0 : Math.max(0, num);
      return copy;
    });
  };

  const addCupRow = () => {
    setWeights((prev) => [...prev, 0]);
  };

  const validWeights = weights.filter((w) => w > 0);
  const canSubmit = !submitting && employeeName.trim().length > 0 && validWeights.length >= 3;

  const handleCheckId = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIdError("");
    const raw = idInputRef.current?.value || "";
    const idValue = raw.trim();

    if (!idValue) {
      setEmployeeName("");
      setIdError("Digite seu ID.");
      return;
    }

    const match = ListId.find((item) => String(item.value) === idValue);
    if (match) {
      setEmployeeName(match.nome);
    } else {
      setEmployeeName("");
      setIdError("ID não encontrado. Verifique e tente novamente.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage("");
    setErrorMessage("");
    setEmployeeName("")


    if (!canSubmit) {
      setErrorMessage("Informe o responsável e registre 3 pesos válidos.");
      return;
    }

    setSubmitting(true);
    try {
      const nowIso = new Date().toISOString();
      const rows = weights
        .map((w, idx) => ({
          unit: UNIT,
          employee_name: employeeName.trim(),
          cup_number: idx + 1,
          portion_label: WEIGHT_LABELS[idx] || null,
          weight_grams: w,
          created_at: nowIso,
        }))
        .filter((r) => r.weight_grams > 0);

      const { error } = await supabase.from("afericao_porcao").insert(rows);
      if (error) {
        console.error("Erro ao salvar aferição", error);
        setErrorMessage("Erro ao salvar a aferição. Tente novamente.");
      } else {
        setSubmitMessage("Aferição salva com sucesso!");
        // opcional: limpar somente pesos, manter nome
        setWeights([0, 0, 0]);
        if (idInputRef.current) {
          idInputRef.current.value = "";
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="afericao-page container">
      <h2>Controle de Aferição de Mão</h2>


      <form className="afericao-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <label htmlFor="userId">Seu ID</label>
          <div className="id-input-group">
            <input
              id="userId"
              type="password"
              placeholder="Digite seu ID"
              className="user-id-input"
              pattern="[0-9]*"
              inputMode="numeric"
              min="0"
              max="9999"
              ref={idInputRef}
            />
            <button
              type="button"
              className="btn-secondary confirm-id-btn"
              onClick={handleCheckId}
            >
              Confirmar ID
            </button>
          </div>
          {idError && <div className="form-error small">{idError}</div>}
        </div>

        <div className="field-row readonly-field">
          <label>Responsável</label>
          <span>{employeeName || "—"}</span>
        </div>

        <div className="field-row readonly-field">
          <label>Unidade</label>
          <span>{UNIT.toUpperCase()}</span>
        </div>

        <div className="cups-section">
          <h3>Pesagem</h3>
          {weights.map((w, idx) => (
            <div key={idx} className="cup-row">
              <div className="cup-label">{WEIGHT_LABELS[idx] || `Copo ${idx + 1}`}</div>
              <input
                type="number"
                min={0}
                step={1}
                value={w || ""}
                onChange={(e) => handleWeightChange(idx, e.target.value)}
                placeholder="Peso em gramas"
                aria-label={`Peso do copo ${idx + 1}`}
                className="cup-weight-input"
              />
              <span className="unit-label">g</span>
            </div>
          ))}
{/* 
          <button
            type="button"
            className="btn-secondary add-cup-btn"
            onClick={addCupRow}
          >
            + Adicionar outro copo
          </button> */}
        </div>

        <div className="form-footer">
          {errorMessage && <div className="form-error">{errorMessage}</div>}
          {submitMessage && <div className="form-success">{submitMessage}</div>}

          <button type="submit" className="btn-primary" disabled={!canSubmit}>
            {submitting ? "Enviando..." : "Salvar Aferição"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Afericao;
