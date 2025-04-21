import React, { useState, useRef, useEffect } from "react";

import "../css/ChecklistForm.css";
import ChecklistItem from "./ChecklistItem";
import { ListId } from '../id.ts';
import ContadorNotasMoedas from "./ContadorNotasMoedas.jsx";

function ChecklistAberturaForm({ handleSubmit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [check, setCheck] = useState(false);
  const [user, setUser] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});
  const idInputRef = useRef(null);

  const unidadeText = "Ahu";

  const steps = [
    {
      title: "1ª Prioridade",
      items: [
        { id: "1", title: "Limpar Vitrine", subtitle1: "Interior e exterior com pano úmido e vidros com álcool líquido" },
        { id: "2", title: "Ligar Vitrine", subtitle1: "", subtitle2: "" },
        { id: "4", title: "Ligar Máquina de Café", subtitle1: "", subtitle2: "" },
        { id: "5", title: "Ligar Moedor de Café", subtitle1: "", subtitle2: "" },
        { id: "6", title: "Acender Todas as Luzes", subtitle1: "", subtitle2: "" }
      ]
    },
    {
      title: "Contagem e Caixa",
      items: [
        { id: "7", title: "Realizar a Contagem de Notas do Malote", subtitle1: "Enviar no grupo do whats a contagem de notas e moedas", subtitle2: "Pode tirar uma foto do contador abaixo" },
        { id: "8", title: "Abrir Caixa", subtitle1: "Abrir o caixa com o valor real do malote", subtitle2: "Usuário: 5 | Senha: 2849" },
        { id: "10", title: "Conferir Máquina de Cartão POS", subtitle1: "Conferir se está com bateria e funcionando", subtitle2: "" },
        { id: "11", title: "Conferir Tablet", subtitle1: "Conferir se está com bateria", subtitle2: "" }
      ]
    },
    {
      title: "Preparação da Loja",
      items: [
        { id: "14", title: "Trocar Papel Toalha dos Morangos", subtitle1: "", subtitle2: "" },
        { id: "15", title: "Atualizar Relatório dos Salgados", subtitle1: "", subtitle2: "" },
        { id: "16", title: "Varrer Chão", subtitle1: "", subtitle2: "" },
        { id: "17", title: "Passar Mop no Chão", subtitle1: "", subtitle2: "" },
        { id: "18", title: "Colocar Saco de Lixo nos Banheiro", subtitle1: "", subtitle2: "" },
        { id: "180", title: "Repor Papel Higiênico nos Banheiros", subtitle1: "", subtitle2: "" }
      ]
    },
    {
      title: "Finalização",
      items: [
        { id: "19", title: "Colocar os Sacos de Lixo Internos", subtitle1: "", subtitle2: "" },
        { id: "20", title: "Limpar Bancadas da Loja", subtitle1: "", subtitle2: "" },
        { id: "21", title: "Limpar Mesas e Cadeiras do Salão", subtitle1: "", subtitle2: "" },
        { id: "22", title: "Repor Insumos", subtitle1: "", subtitle2: "" },
        { id: "23", title: "Abastecer Vitrine (-4ºC)", subtitle1: "", subtitle2: "" },
        { id: "24", title: "Abrir Portas de Enrolar", subtitle1: "", subtitle2: "" },
        { id: "241", title: "Abrir Janela do Salão dos Clientes", subtitle1: "", subtitle2: "" },
        { id: "242", title: "Colocar Sacos de Lixo Externos", subtitle1: "", subtitle2: "" },
        { id: "27", title: "Limpar Pátio", subtitle1: "Recolher lixo e passar uma vassoura", subtitle2: "" },
        { id: "243", title: "Colocar Saco Pet", subtitle1: "", subtitle2: "" },
        { id: "244", title: "Colocar Mesas Externas", subtitle1: "", subtitle2: "" },
        { id: "26", title: "Trancar Porta de Entrada dos Funcionários", subtitle1: "Porta de metal do corredor", subtitle2: "" },
        { id: "29", title: "Conferir Quebras", subtitle1: "Se tiver alguma quebra que pode entrar hoje, já deixe separado", subtitle2: "" }
      ]
    }
  ];

  // Initialize checkedItems state with all items set to false
  useEffect(() => {
    const initialCheckedState = {};
    steps.forEach(step => {
      step.items.forEach(item => {
        initialCheckedState[item.id] = false;
      });
    });
    setCheckedItems(initialCheckedState);
  }, []);

  const handleCheckboxChange = (id) => {
    setCheckedItems(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  function checkValidity() {
    // Check if all steps are completed using the checkedItems state
    const allStepsCompleted = steps.every(step => {
      return step.items.every(item => checkedItems[item.id]);
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

  function checkId(e) {
    console.log("Check ID");
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

  const validateCurrentStep = () => {
    const currentStepItems = steps[currentStep - 1].items;
    const allChecked = currentStepItems.every(item => checkedItems[item.id]);
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

      <form action="https://script.google.com/macros/s/AKfycbwhOUYDudL2B7Damz10m485blQxTRIldG5z_Y734oySrPeZPa5oJQVNR3yO6t1828Hm-w/exec" method="POST" onSubmit={event => handleSubmit(event, user)} className="aberturaAltoxv" id="checklistOpen">
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

        {steps[currentStep - 1].items.map((item) => (
          <ChecklistItem
            key={item.id}
            id={item.id}
            title={item.title}
            subtitle1={item.subtitle1}
            subtitle2={item.subtitle2}
            checked={checkedItems[item.id]}
            onChange={() => handleCheckboxChange(item.id)}
          />
        ))}

        {currentStep === 2 && <ContadorNotasMoedas />}

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
