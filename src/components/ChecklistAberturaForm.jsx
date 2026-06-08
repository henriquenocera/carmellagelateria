import React, { useState, useRef, useEffect } from "react";

import "../css/ChecklistForm.css";
import ChecklistItem from "./ChecklistItem";
import supabase from "../supabase-client";
import ContadorNotasMoedas from "./ContadorNotasMoedas.jsx";
import { checklistAberturaSteps as steps } from "../config/checklists.js";


function ChecklistAberturaForm({ handleSubmit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [check, setCheck] = useState(false);
  const [user, setUser] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});
  const [moneyCounterData, setMoneyCounterData] = useState(null);
  const [isCheckingId, setIsCheckingId] = useState(false);
  const idInputRef = useRef(null);


  // Initialize checkedItems and currentStep state from localStorage or default
  useEffect(() => {
    const savedItems = localStorage.getItem('check_abertura_items');
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

    const savedStep = localStorage.getItem('check_abertura_step');
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);

  // Save checkedItems to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(checkedItems).length > 0) {
      localStorage.setItem('check_abertura_items', JSON.stringify(checkedItems));
    }
  }, [checkedItems]);

  // Save currentStep to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('check_abertura_step', currentStep.toString());
  }, [currentStep]);

  const handleCheckboxChange = (id) => {
    setCheckedItems(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  function checkValidity() {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Check if all steps are completed using the checkedItems state
    const allStepsCompleted = steps.every(step => {
      const visibleItems = step.items.filter(item => {
        if (item.weekday === undefined || item.weekday === null) return true; // If no weekday specified, always check
        return item.weekday === today; // Only check if it's the right weekday
      });

      return visibleItems.every(item => checkedItems[item.id]);
    });

    return allStepsCompleted;
  }

  function openModal(e) {
    e.preventDefault();
    const isValid = checkValidity();
    console.log(isValid);

    if (isValid) {
      console.log("Open Modal");
      setIsModalOpen(true);
    } else {
      setIsModalErrorOpen(true);
    }
  }

  async function checkId(e) {
    console.log("Check ID");
    e.preventDefault();
    let idInput = idInputRef.current?.value;

    if (!idInput) return;

    setIsCheckingId(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("name")
      .eq("short_id", idInput)
      .single();
    
    setIsCheckingId(false);

    if (error || !data) {
      window.alert("ID não encontrado. Verifique e tente novamente.");
      setUser("");
    } else {
      setUser(data.name);
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

  const validateCurrentStep = () => {
    const currentStepItems = steps[currentStep - 1].items;
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

    const visibleItems = currentStepItems.filter(item => {
      if (item.weekday === undefined || item.weekday === null) return true; // If no weekday specified, always check
      return item.weekday === today; // Only check if it's the right weekday
    });

    const allChecked = visibleItems.every(item => checkedItems[item.id]);
    return allChecked;
  };

  const nextStep = (e) => {
    e.preventDefault(); // Prevent form submission
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
    e.preventDefault(); // Prevent form submission
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMoneyCounterChange = (data) => {
    setMoneyCounterData(data);
  };

  const formatMoneyCounterMessage = () => {
    if (!moneyCounterData) return "";

    const { total, denominacoes } = moneyCounterData;
    let message = "%0D%0A %0D%0A💰 Contagem de Cédulas e Moedas: %0D%0A";
    message += `Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%0D%0A%0D%0A`;

    message += "Cédulas:%0D%0A";
    message += `R$ 100,00: ${denominacoes.hundred}%0D%0A`;
    message += `R$ 50,00: ${denominacoes.fifty}%0D%0A`;
    message += `R$ 20,00: ${denominacoes.twenty}%0D%0A`;
    message += `R$ 10,00: ${denominacoes.ten}%0D%0A`;
    message += `R$ 5,00: ${denominacoes.five}%0D%0A`;
    message += `R$ 2,00: ${denominacoes.two}%0D%0A %0D%0A`;

    message += "Moedas:%0D%0A";
    message += `R$ 1,00: ${denominacoes.oneReal}%0D%0A`;
    message += `R$ 0,50: ${denominacoes.fiftyCents}%0D%0A`;
    message += `R$ 0,25: ${denominacoes.twentyFiveCents}%0D%0A`;
    message += `R$ 0,10: ${denominacoes.tenCents}%0D%0A`;
    message += `R$ 0,05: ${denominacoes.fiveCents}%0D%0A`;
    message += `R$ 0,01: ${denominacoes.oneCent}%0D%0A`;

    return message;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const moneyCounterMessage = formatMoneyCounterMessage();
    handleSubmit(event, user, moneyCounterMessage, moneyCounterData);

    // Limpa o progresso do local storage ao enviar o formulário
    localStorage.removeItem('check_abertura_items');
    localStorage.removeItem('check_abertura_step');
    localStorage.removeItem('contador_notas_moedas');
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
                    className="confirm-button"
                    disabled={isCheckingId}
                  >
                    {isCheckingId ? "Verificando..." : "Confirmar ID"}
                  </button>
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
                    form="checklistOpen"
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

      <form action="https://script.google.com/macros/s/AKfycbwhOUYDudL2B7Damz10m485blQxTRIldG5z_Y734oySrPeZPa5oJQVNR3yO6t1828Hm-w/exec" method="POST" onSubmit={handleFormSubmit} className="aberturaAltoxv" id="checklistOpen">
        {/* <button className="hidebtn" onClick={Checked}>Check</button> */}

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

        {steps[currentStep - 1].items.map((item) => (
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

        {currentStep === 1 && <ContadorNotasMoedas onTotalChange={handleMoneyCounterChange} />}

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
      </form>
    </>
  );
}

export default ChecklistAberturaForm;
