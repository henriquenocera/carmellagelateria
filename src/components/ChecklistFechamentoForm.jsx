import React from "react";
import "./ChecklistFechamentoForm.css";

function ChecklistFechamentoForm({ handleSubmit }) {
  return (
    <>
      <form onSubmit={handleSubmit} className="fechamentoAltoxv" id="altoxvClose">
        <div className="sectionTitle">
          <p>1ª Prioridade (Fator Tempo)</p>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1"
            type="checkbox"
            name="1"
          />
          <label className="cbx" htmlFor="1">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Titulo do Input</span>
          </label>
          <span className="subtitle">Sub Titulo do Input</span>
        </div>
        <div className="checkbox-wrapper">
          <label className="label" htmlFor="">Quantidade de massas congeladas no <b>Freezer:</b></label>
          <input className="inputNumber" required type="number" name="freezer" min="0" id="12" />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </>
  );
}

export default ChecklistFechamentoForm;
