import React, { useState, useRef } from "react";
import "../css/ChecklistForm.css";
import ChecklistItem from "./ChecklistItem.jsx";
import { ListId } from '../id.ts';

function ChecklistFechamentoForm({ handleSubmit }) {
  const [geladeira, setGeladeira] = useState("");
  const [brownie, setBrownie] = useState("");
  const [panos, setPanos] = useState("");
  const [user, setUser] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});
  const idInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [check, setCheck] = useState(false);

  const unidadeText = "Alto da XV";

  const weekday = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  console.log(weekday)

  const steps = [
    {
      title: `1ª Pré Fechamento - 
      Horários: (18:00 ~ 18:45)`,
      items: [
        { id: "1", title: "Limpar espátulas", subtitle1: "Lavar com água e sabão", subtitle2: "" },
        { id: "2", title: "Limpar cubas", subtitle1: "Sempre pegar um pano limpo", subtitle2: "" },
        { id: "3", title: "Limpar todos os utensílios do café", subtitle1: "Limpar com água e sabão", subtitle2: "" },
        { id: "4", title: "Limpar bancada dos salgados", subtitle1: "", subtitle2: "" },
        { id: "5", title: "Limpar máquina de café (simples)", subtitle1: "", subtitle2: "" },
        { id: "6", title: "Conferir trello (estoque)", subtitle1: "Revisar Trello e garantir que o estoque real bate com o estoque do trello", subtitle2: "Atualizar o trello com as entradas e saídas do dia seguinte" },
        { id: "7", title: "Foto das frutas", subtitle1: "Enviar uma foto das frutas na loja no grupo do whatsapp da loja", subtitle2: "" }
      ]
    },
    {
      title: `2ª Pré Fechamento - Horários: (18:45 ~ 19:00)`,
      items: [
        { id: "8", title: "Fechar janela da sala dos funcionários", subtitle1: "", subtitle2: "" },
        { id: "9", title: "Fechar porta do salão dos clientes", subtitle1: "Caso tenha clientes sentados, aguardar", subtitle2: "" },
        { id: "11", title: "Colocar para carregar tablet e máquininha POS", subtitle1: "", subtitle2: "" },
        { id: "12", title: "Limpar mesas e cadeiras do salão dos clientes", subtitle1: "", subtitle2: "" },
      ]
    },
    {
      title: "3ª Fechamento (19:00)",
      items: [
        { id: "133", title: "Recolher mesas e cadeiras externas", subtitle1: "", subtitle2: "" },
        { id: "13", title: "Fechar as portas de enrolar", subtitle1: "", subtitle2: "" },
        { id: "14", title: "Guardar cubas da vitrine no freezer", subtitle1: "", subtitle2: "" },
        { id: "15", title: "Desligar a vitrine", subtitle1: "Utilizar o controlador", subtitle2: "" },
        { id: "16", title: "Desligar a máquina de café e moedor", subtitle1: "", subtitle2: "" },
        //{ id: "17", title: "Desligar tela do tablet", subtitle1: "", subtitle2: "" },
        { id: "18", title: "Retirar todos os lixos", subtitle1: "Lixos internos, externos, banheiro e salão dos clientes", subtitle2: "" },
        { id: "19", title: "(DOMINGO) - Hoje não passa caminhão do lixo, não colocar os lixos para fora", subtitle1: "", subtitle2: "", weekday: 0 },
        { id: "20", title: "Fechar caixa no PDV", subtitle1: "", subtitle2: "" },
        { id: "21", title: "Esvaziar água do balde das espátulas", subtitle1: "", subtitle2: "" },
        { id: "22", title: "Fechar pote de casquinhas", subtitle1: "", subtitle2: "" },


      ]
    },
    {
      title: "4ª Inventário",
      items: [

      ]
    },
    {
      title: "4ª Finalização e Limpeza",
      items: [
        { id: "23", title: "Secar pia", subtitle1: "", subtitle2: "" },
        { id: "24", title: "Descartar panos", subtitle1: "Descartar no balde de panos", subtitle2: "Apenas descartas os panos secos, se tiver molhado deixar no varal de um dia para outro" },
        { id: "25", title: "Conferir geladeira", subtitle1: "Garantir que não sobrou nenuma cuba ou quebra lá dentro", subtitle2: "" },
        { id: "26", title: "Conferir freezer, geladeira e friobar", subtitle1: "Garantir que estão bem fechados", subtitle2: "" },
        { id: "27", title: "Varrer o chão", subtitle1: "Salão dos clientes e parte interna da loja", subtitle2: "" },
        { id: "28", title: "Passar um mope no chão", subtitle1: "Salão dos clientes e parte interna da loja", subtitle2: "" },
        { id: "29", title: "Esvaziar mope", subtitle1: "Não deixar ele cheio a noite inteira", subtitle2: "" },
        { id: "30", title: "Desligar todas as luzes", subtitle1: "", subtitle2: "" },
        { id: "31", title: "Desligar a luz do freezer", subtitle1: "", subtitle2: "" },
        { id: "32", title: "Desligar computador", subtitle1: "", subtitle2: "" }
      ]
    }
  ];

  // Initialize checkedItems state with all items set to false
  React.useEffect(() => {
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

      <form onSubmit={event => handleSubmit(event, geladeira, brownie, panos, user, check)} className="fechamentoAltoxv" id="checklistClose">
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
            <div className="inventoryFlexbox">
              <label className="inventoryLabel" htmlFor="">Quantidade de <b>Massas</b></label>
              <input onChange={(event) => setGeladeira(event.target.value)} className="inventoryInput" required type="number" name="geladeira" min="0" id="91" />
            </div>
            <div className="inventoryFlexbox">
              <label className="inventoryLabel" htmlFor="">Quantidade de <b>Brownies:</b></label>
              <input onChange={(event) => setBrownie(event.target.value)} className="inventoryInput" required type="number" name="brownie" min="0" id="94" />
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
      </form>
    </>
  );
}

export default ChecklistFechamentoForm;
