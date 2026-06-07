import React, { useState, useRef } from "react";
import "../css/ChecklistForm.css";
import ChecklistItem from "./ChecklistItem.jsx";
import { ListId } from '../id.ts';
import { checklistFechamentoSteps as steps } from "../config/checklists.js";


function ChecklistFechamentoForm({ handleSubmit }) {
  const weekday = new Date().getDay();
  const [brownieBatches, setBrownieBatches] = useState([{ quantity: "", date: "" }]);

  const getFormattedBrownies = () => {
    const total = brownieBatches.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 0), 0);
    const details = brownieBatches
      .filter(b => b.quantity && b.date)
      .map(b => {
        const parts = b.date.split('-');
        const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : b.date;
        return `${b.quantity} (venc. ${formattedDate})`;
      })
      .join(", ");

    return `${total} [${details}]`;
  };
  const [panos, setPanos] = useState("");
  const [user, setUser] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});
  const idInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [check, setCheck] = useState(false);
  const [waffleBatches, setWaffleBatches] = useState([{ quantity: "", date: "" }]);

  const getFormattedWaffles = () => {
    const total = waffleBatches.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 0), 0);
    const details = waffleBatches
      .filter(b => b.quantity && b.date)
      .map(b => {
        const parts = b.date.split('-');
        const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : b.date;
        return `${b.quantity} (venc. ${formattedDate})`;
      })
      .join(", ");

    return `${total} [${details}]`;
  };


  // Initialize states from localStorage or default
  React.useEffect(() => {
    const savedItems = localStorage.getItem('check_fechamento_items');
    if (savedItems) {
      setCheckedItems(JSON.parse(savedItems));
    } else {
      const initialCheckedState = {};
      steps.forEach(step => {
        step.items.forEach(item => {
          initialCheckedState[item.id] = false;
        });
      });
      setCheckedItems(initialCheckedState);
    }

    const savedStep = localStorage.getItem('check_fechamento_step');
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }

    const savedWaffles = localStorage.getItem('check_fechamento_waffles');
    if (savedWaffles) {
      setWaffleBatches(JSON.parse(savedWaffles));
    }

    const savedBrownies = localStorage.getItem('check_fechamento_brownies');
    if (savedBrownies) {
      setBrownieBatches(JSON.parse(savedBrownies));
    }

    const savedPanos = localStorage.getItem('check_fechamento_panos');
    if (savedPanos) {
      setPanos(savedPanos);
    }
  }, []);

  // Save states to localStorage whenever they change
  React.useEffect(() => {
    if (Object.keys(checkedItems).length > 0) {
      localStorage.setItem('check_fechamento_items', JSON.stringify(checkedItems));
    }
  }, [checkedItems]);

  React.useEffect(() => {
    localStorage.setItem('check_fechamento_step', currentStep.toString());
  }, [currentStep]);

  React.useEffect(() => {
    localStorage.setItem('check_fechamento_waffles', JSON.stringify(waffleBatches));
  }, [waffleBatches]);

  React.useEffect(() => {
    localStorage.setItem('check_fechamento_brownies', JSON.stringify(brownieBatches));
  }, [brownieBatches]);

  React.useEffect(() => {
    localStorage.setItem('check_fechamento_panos', panos);
  }, [panos]);

  const handleCheckboxChange = (id) => {
    setCheckedItems(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const validateCurrentStep = () => {
    const currentStepItems = steps[currentStep - 1].items;
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Only check items that should be visible today
    const visibleItems = currentStepItems.filter(item => {
      if (item.weekday === undefined) return true; // If no weekday specified, always check
      return item.weekday === today; // Only check if it's the right weekday
    });


    const allChecked = visibleItems.every(item => checkedItems[item.id]);
    return allChecked;
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (currentStep < steps.length) {
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setIsModalErrorOpen(true);
      }
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  function openModal(e) {
    e.preventDefault();
    const isValid = validateCurrentStep();
    if (isValid) {
      setIsModalOpen(true);
    } else {
      setIsModalErrorOpen(true);
    }
  }

  function checkId(e) {
    e.preventDefault();
    let idInput = idInputRef.current.value;

    if (idInput == ListId[0].value) {
      setUser(ListId[0].nome);
    } else if (idInput == ListId[1].value) {
      setUser(ListId[1].nome);
    } else if (idInput == ListId[2].value) {
      setUser(ListId[2].nome);
    } else if (idInput == ListId[3].value) {
      setUser(ListId[3].nome);
    } else if (idInput == ListId[4].value) {
      setUser(ListId[4].nome);
    } else if (idInput == ListId[5].value) {
      setUser(ListId[5].nome);
    } else if (idInput == ListId[6].value) {
      setUser(ListId[6].nome);
    } else if (idInput == ListId[7].value) {
      setUser(ListId[7].nome);
    } else {
      setUser("");
    }
  }

  const Checked = (e) => {
    function setWithExpiry(key, value, ttl) {
      const now = new Date();
      const item = {
        value: value,
        expiry: now.getTime() + ttl,
      };
      localStorage.setItem(key, JSON.stringify(item));
    }
    setWithExpiry("check", true, 10000);
  }

  const handleFormSubmit = (event) => {
    handleSubmit(event, getFormattedWaffles(), getFormattedBrownies(), panos, user, check);

    // Limpa o progresso do local storage ao enviar
    localStorage.removeItem('check_fechamento_items');
    localStorage.removeItem('check_fechamento_step');
    localStorage.removeItem('check_fechamento_waffles');
    localStorage.removeItem('check_fechamento_brownies');
    localStorage.removeItem('check_fechamento_panos');
  };

  return (
    <>
      {isModalErrorOpen && (
        <div className="modal-overlay">
          <div className="modal-content-error">
            <h3 className="modalTitleError">Por favor, complete todos os itens do checklist antes de prosseguir</h3>
            <div className="modal-buttons">
              <button
                onClick={() => setIsModalErrorOpen(false)}
                className="close-button-error"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {user == "" ? (
              <>
                <h3 className="modalTitle">Por favor, digite seu ID</h3>
                <input
                  type="password"
                  placeholder="Seu ID"
                  className="userInput"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  min="0"
                  max="9999"
                  required
                  ref={idInputRef}
                />
                <div className="modal-buttons">
                  <button
                    onClick={(e) => checkId(e)}
                    className="confirm-button">Confirmar ID</button>
                  <button
                    onClick={() => { setIsModalOpen(false); setUser("") }}
                    className="close-button"
                  >
                    Voltar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modalTextContainer">
                  <p className="modalText">Ao Enviar o Checklist você confirma que realizou todas as tarefas descritas nele</p>
                </div>
                <h3 className="modalTitle">Responsável pelo Checklist:</h3>
                <h2 className="user">{user}</h2>
                <div className="modal-buttons">
                  <button
                    type="submit"
                    form="checklistClose"
                    className="confirm-button">Enviar Checklist</button>
                  <button
                    onClick={() => { setIsModalOpen(false); setUser("") }}
                    className="close-button"
                  >
                    Voltar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="fechamentoAltoxv" id="checklistClose">
        <button className="hidebtn" onClick={Checked}>Check</button>

        <div className="step-indicator">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step ${currentStep === index + 1 ? 'active' : ''} ${index + 1 < currentStep ? 'completed' : ''}`}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>

        <div className="sectionTitle">
          <p><strong>{steps[currentStep - 1].title}</strong></p>
        </div>

        {steps[currentStep - 1].items
          .filter((item) => item.weekday === undefined || item.weekday === weekday)
          .map((item) => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle1={item.subtitle1}
              subtitle2={item.subtitle2}
              checked={checkedItems[item.id]}
              onChange={() => handleCheckboxChange(item.id)}
              weekday={item.weekday}
              newItemDate={item.new}
              buttonLink={item.buttonLink}
              buttonText={item.buttonText}
            />
          ))}

        {currentStep === 4 && (
          <>
            <div style={{ marginBottom: "20px", border: "1px solid #a17550", borderRadius: "8px", padding: "15px", backgroundColor: "#fbf9f6", width: "100%", maxWidth: "500px" }}>
              <p style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#a17550", marginBottom: "15px", marginTop: "0" }}>Lotes de Waffles</p>

              {waffleBatches.map((batch, index) => (
                <div key={index} className="waffle-batch-row" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "15px", marginBottom: index < waffleBatches.length - 1 ? "15px" : "0", paddingBottom: index < waffleBatches.length - 1 ? "15px" : "0", borderBottom: index < waffleBatches.length - 1 ? "1px dashed #e2d5c5" : "none" }}>
                  <span style={{ fontSize: "1.4rem", fontWeight: "600", minWidth: "60px" }}>Lote {index + 1}:</span>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ fontSize: "1.4rem" }}>Qtd:</label>
                    <input
                      value={batch.quantity}
                      onChange={(e) => {
                        const newBatches = [...waffleBatches];
                        newBatches[index].quantity = e.target.value;
                        setWaffleBatches(newBatches);
                      }}
                      className="inventoryInput"
                      required
                      type="number"
                      min="0"
                      style={{ width: "80px", height: "36px", padding: "5px" }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ fontSize: "1.4rem" }}>Vencimento:</label>
                    <input
                      value={batch.date}
                      onChange={(e) => {
                        const newBatches = [...waffleBatches];
                        newBatches[index].date = e.target.value;
                        setWaffleBatches(newBatches);
                      }}
                      className="inventoryInput"
                      required
                      type="date"
                      style={{ width: "150px", height: "36px", padding: "5px" }}
                    />
                  </div>

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newBatches = waffleBatches.filter((_, i) => i !== index);
                        setWaffleBatches(newBatches);
                      }}
                      style={{
                        background: "#ff0f0f",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        transition: "all 0.2s"
                      }}
                    >
                      Remover Lote
                    </button>
                  )}
                </div>
              ))}

              {waffleBatches.length < 3 && (
                <button
                  type="button"
                  onClick={() => setWaffleBatches([...waffleBatches, { quantity: "", date: "" }])}
                  style={{
                    marginTop: "15px",
                    background: "transparent",
                    color: "#a17550",
                    border: "1.5px dashed #a17550",
                    padding: "8px 16px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    width: "100%",
                    transition: "all 0.2s",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#a17550"; e.currentTarget.style.color = "white"; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#a17550"; }}
                >
                  + Adicionar outro lote
                </button>
              )}
            </div>
            <div style={{ marginBottom: "20px", border: "1px solid #a17550", borderRadius: "8px", padding: "15px", backgroundColor: "#fbf9f6", width: "100%", maxWidth: "500px" }}>
              <p style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#a17550", marginBottom: "15px", marginTop: "0" }}>Lotes de Brownies</p>

              {brownieBatches.map((batch, index) => (
                <div key={index} className="brownie-batch-row" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "15px", marginBottom: index < brownieBatches.length - 1 ? "15px" : "0", paddingBottom: index < brownieBatches.length - 1 ? "15px" : "0", borderBottom: index < brownieBatches.length - 1 ? "1px dashed #e2d5c5" : "none" }}>
                  <span style={{ fontSize: "1.4rem", fontWeight: "600", minWidth: "60px" }}>Lote {index + 1}:</span>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ fontSize: "1.4rem" }}>Qtd:</label>
                    <input
                      value={batch.quantity}
                      onChange={(e) => {
                        const newBatches = [...brownieBatches];
                        newBatches[index].quantity = e.target.value;
                        setBrownieBatches(newBatches);
                      }}
                      className="inventoryInput"
                      required
                      type="number"
                      min="0"
                      style={{ width: "80px", height: "36px", padding: "5px" }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ fontSize: "1.4rem" }}>Vencimento:</label>
                    <input
                      value={batch.date}
                      onChange={(e) => {
                        const newBatches = [...brownieBatches];
                        newBatches[index].date = e.target.value;
                        setBrownieBatches(newBatches);
                      }}
                      className="inventoryInput"
                      required
                      type="date"
                      style={{ width: "150px", height: "36px", padding: "5px" }}
                    />
                  </div>

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newBatches = brownieBatches.filter((_, i) => i !== index);
                        setBrownieBatches(newBatches);
                      }}
                      style={{
                        background: "#ff0f0f",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        transition: "all 0.2s"
                      }}
                    >
                      Remover Lote
                    </button>
                  )}
                </div>
              ))}

              {brownieBatches.length < 3 && (
                <button
                  type="button"
                  onClick={() => setBrownieBatches([...brownieBatches, { quantity: "", date: "" }])}
                  style={{
                    marginTop: "15px",
                    background: "transparent",
                    color: "#a17550",
                    border: "1.5px dashed #a17550",
                    padding: "8px 16px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    width: "100%",
                    transition: "all 0.2s",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#a17550"; e.currentTarget.style.color = "white"; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#a17550"; }}
                >
                  + Adicionar outro lote
                </button>
              )}
            </div>
            <div className="inventoryFlexbox">
              <label className="inventoryLabel" htmlFor="">Quantidade de <b>Panos Limpos:</b></label>
              <input onChange={(event) => setPanos(event.target.value)} className="inventoryInput" required type="number" name="panos" min="0" id="95" />
            </div>
          </>
        )}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" className="nav-button prev" onClick={prevStep}>
              Voltar
            </button>
          )}
          {currentStep < steps.length ? (
            <button type="button" className="nav-button next" onClick={nextStep}>
              Próximo
            </button>
          ) : (
            <button onClick={openModal} className="submit" type="submit">
              Confirmar Checklist
            </button>
          )}
        </div>
      </form >
    </>
  );
}

export default ChecklistFechamentoForm;
