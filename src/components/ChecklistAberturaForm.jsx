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
  const [moneyCounterData, setMoneyCounterData] = useState(null);
  const idInputRef = useRef(null);

  const unidadeText = "Alto da XV";

  const steps = [
    {
      title: "1ª - Equipamentos",
      items: [
        { id: "1", title: "Limpeza interna da vitrine", subtitle1: "Interior com um pano úmido" },
        { id: "2", title: "Limpeza externa da vitrine", subtitle1: "Vidros com álcool líquido", subtitle2: "" },
        { id: "3", title: "Ligar a Vitrine", subtitle1: "Utilizar o controlador", subtitle2: "" },
        { id: "300", title: "Ligar a Luz da Vitrine", subtitle1: "Utilizar o controlador", subtitle2: "", new: "2026-03-19" },
        { id: "4", title: "Ligar a máquina de café e o moedor", subtitle1: "Utilizar tomadas 220v 'tomadas vermelhas'", subtitle2: "Girar o controlador da máquina de café para a posição '1'" },
        { id: "5", title: "Acender Todas as Luzes", subtitle1: "", subtitle2: "" },
        { id: "6", title: "Ligar máquininha de cartão POS 'Máquininha da Rede'", subtitle1: "Se estiver sem bateria, colocar para carregar", subtitle2: "" },
        // { id: "7", title: "Ligar Tablet", subtitle1: "Se estiver sem bateria, colocar para carregar", subtitle2: "" },
        { id: "8", title: "Realizar a contagem de notas do malote", subtitle1: "Utilizar o contador de notas e moedas abaixo", subtitle2: "" },
        { id: "9", title: "Realizar a abertura do caixa", subtitle1: "Abrir o caixa com o valor real do malote", subtitle2: "Usuário: 6 | Senha: 2849" },
      ]
    },
    {
      title: "2ª - Organização",
      items: [
        { id: "10", title: "Trocar papel toalha dos morangos", subtitle1: "", subtitle2: "" },
        { id: "11", title: "Atualizar relatório dos salgados", subtitle1: "", subtitle2: "" },
        { id: "111", title: "Colocar as mesas e cadeiras externas", subtitle1: "", subtitle2: "" },
        { id: "12", title: "Colocar sacos de lixo interno", subtitle1: "Sacos de lixo de 20 Litros", subtitle2: "" },
        { id: "13", title: "Colocar sacos de lixo do salão dos clientes", subtitle1: "Sacos de lixo de 60 Litros", subtitle2: "" },
        { id: "104", title: "Colocar sacos de lixo em todas as lixeiras externas", subtitle1: "Sacos de lixo de 60 Litros", subtitle2: "" },
        { id: "14", title: "Colocar sacos de lixo no banheiro", subtitle1: "Sacos de lixo de 40 Litros", subtitle2: "" },
        { id: "15", title: "Repor papel higiênico no banheiro", subtitle1: "", subtitle2: "" },
        { id: "16", title: "Repor papel toalha no banheiro", subtitle1: "", subtitle2: "" },
        //{ id: "17", title: "Repor insumos necessários", subtitle1: "Retirar do estoque", subtitle2: "" },
      ]
    },
    {
      title: "3° - Limpeza",
      items: [
        { id: "18", title: "Limpar as bancadas da loja", subtitle1: "Pano e álcool líquido", subtitle2: "" },
        { id: "19", title: "Limpar as mesas e cadeiras do salão", subtitle1: "Pano e álcool líquido", subtitle2: "" },
        { id: "20", title: "Varrer o chão", subtitle1: "Salão dos clientes e parte interna da loja", subtitle2: "" },
        { id: "21", title: "Passar um mope no chão", subtitle1: "Salão dos clientes e parte interna da loja", subtitle2: "" },
        { id: "31", title: "Limpar Pátio externo da frente", subtitle1: "Recolher lixo e varrer", subtitle2: "" },
        { id: "32", title: "Limpar Pátio externo dos fundos", subtitle1: "Recolher lixo e varrer", subtitle2: "" },

      ]
    },
    {
      title: "4º - Abertura",
      items: [
        { id: "22", title: "Abastecer vitrine (-4ºC)", subtitle1: "", subtitle2: "" },
        { id: "23", title: "Abrir portas de enrolar", subtitle1: "", subtitle2: "" },
        { id: "24", title: "Abrir porta do salão dos clientes", subtitle1: "", subtitle2: "" },
        { id: "27", title: "Trancar porta de entrada dos funcionários", subtitle1: "Porta dos fundos", subtitle2: "" },
        // { id: "28", title: "Abrir loja do ifood", subtitle1: "Para abrir a loja basta entrar no app e deixar ele aberto durante o dia", subtitle2: "" },
        // { id: "29", title: "Conferir toppings do ifood", subtitle1: "Se algum topping tiver em falta, desligar do ifood", subtitle2: "" },
        { id: "30", title: "Conferir quebras", subtitle1: "Se tiver alguma quebra que pode entrar hoje, já deixe separado", subtitle2: "" },


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
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Check if all steps are completed using the checkedItems state
    const allStepsCompleted = steps.every(step => {
      // Only check items that should be visible today
      const visibleItems = step.items.filter(item => {
        if (!item.weekday) return true; // If no weekday specified, always check
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

  const validateCurrentStep = () => {
    const currentStepItems = steps[currentStep - 1].items;
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Only check items that should be visible today
    const visibleItems = currentStepItems.filter(item => {
      if (!item.weekday) return true; // If no weekday specified, always check
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
    handleSubmit(event, user, moneyCounterMessage);
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

      <form action="https://script.google.com/macros/s/AKfycbwhOUYDudL2B7Damz10m485blQxTRIldG5z_Y734oySrPeZPa5oJQVNR3yO6t1828Hm-w/exec" method="POST" onSubmit={handleFormSubmit} className="aberturaAltoxv" id="checklistOpen">
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
            weekday={item.weekday}
            newItemDate={item.new}
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
