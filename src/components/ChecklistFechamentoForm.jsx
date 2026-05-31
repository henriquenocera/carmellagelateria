import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ChecklistForm.css";
import ChecklistItem from "./ChecklistItem.jsx";
import { ListId } from '../id.ts';

function ChecklistFechamentoForm({ handleSubmit }) {
  const navigate = useNavigate();
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
  const [copiedItem6, setCopiedItem6] = useState(false);

  const unidadeText = "Escritório";

  const weekday = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  console.log(weekday)

  const steps = [
    {
      title: `1ª - Acessos`,
      items: [
        { id: "1", title: "Acessar na conta do Whatsapp Business da Carmella", subtitle1: "Deixar ela aberta durante todo o dia" },
        { id: "3", title: "Acessar na conta do Instagram da Carmella", subtitle1: "Deixar ela aberta durante todo o dia" },
        { id: "4", title: "Acessar o sistema de controle de estoque", subtitle1: "" },
        // { id: "5", title: "Acessar a conta do Trello", subtitle1: "" },
      ]
    },
    {
      title: `2ª - Financeiro`,
      items: [
        { id: "55", title: "Conciliação Bancária", subtitle1: "Todas as Contas" },
        { id: "6", title: "Conciliação de Vendas das Lojas", subtitle1: "Dinheiro / Cartão / Pix" },
        { id: "7", title: "Contas à Pagar e Receber", subtitle1: "" }
      ]
    },
    {
      title: `3ª Organização`,
      items: [
        { id: "8", title: "(Segunda Feira) - Verificar pedidos com clientes Food Service", subtitle1: "", subtitle2: "", weekday: 1 },
        { id: "9", title: "(Segunda Feira) - Realizar Inventário do Escritório", subtitle1: "", subtitle2: "", weekday: 1 },
        { id: "10", title: "(Segunda Feira) - Fazer Lista de Compras para Estoque do Escritório", subtitle1: "", subtitle2: "", weekday: 1 },
        { id: "11", title: "(Segunda Feira) - Realizar Inventário da Loja XV", subtitle1: "", subtitle2: "", weekday: 1 },
        { id: "12", title: "(Segunda Feira) - Realizar Inventário da Fábrica", subtitle1: "", subtitle2: "", weekday: 1 },
        { id: "13", title: "(Terça Feira) - Verificar Inventário da loja Ahu", subtitle1: "Fazer lançamentos de estoque", subtitle2: "Fazer separação do material", weekday: 2 },
        { id: "14", title: "(Terça Feira) - Verificar Inventário da loja Alto XV", subtitle1: "Fazer lançamentos de estoque", subtitle2: "Fazer separação do material", weekday: 2 },
        { id: "15", title: "Verificar Espelho Ponto das Atendentes", subtitle1: "Informar horas extras / faltantes do dia anterior", subtitle2: "" },
        { id: "20", title: "Ajustar relatório de Frequência", subtitle1: "Atrasos, faltas, atestados, etc", subtitle2: "" },

      ]
    },
    {
      title: "4ª - Após Loja Aberta (12:00) ",
      items: [
        { id: "16", title: "Enviar Fechamento de Caixa do dia Anterior", subtitle1: "", subtitle2: "" },
        { id: "17", title: "Verificar lojas do ifood", subtitle1: "Se estão abertas", subtitle2: "" },
        { id: "19", title: "Verificar cardápio do ifood", subtitle1: "Toppings", subtitle2: "Se tiver algo desligado, confirmar com a loja" },
        { id: "18", title: "Verificar Painel do Ifood", },
        { id: "21", title: "Verificar Foto da Vitrine", subtitle1: "Em Comparação ao Sistema de Estoque de Cubas" },



      ]
    },


  ];

  // Initialize checkedItems state with all items set to false or load from localStorage
  React.useEffect(() => {
    const savedCheckedState = localStorage.getItem("checklistEscritorio_checkedItems");
    const savedStep = localStorage.getItem("checklistEscritorio_currentStep");

    const initialCheckedState = {};
    steps.forEach(step => {
      step.items.forEach(item => {
        initialCheckedState[item.id] = false;
      });
    });

    if (savedCheckedState) {
      try {
        const parsed = JSON.parse(savedCheckedState);
        setCheckedItems({ ...initialCheckedState, ...parsed });
      } catch (e) {
        setCheckedItems(initialCheckedState);
      }
    } else {
      setCheckedItems(initialCheckedState);
    }

    if (savedStep) {
      const p = parseInt(savedStep, 10);
      if (!isNaN(p) && p >= 1 && p <= steps.length) {
        setCurrentStep(p);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (Object.keys(checkedItems).length > 0) {
      localStorage.setItem("checklistEscritorio_checkedItems", JSON.stringify(checkedItems));
    }
  }, [checkedItems]);

  React.useEffect(() => {
    localStorage.setItem("checklistEscritorio_currentStep", currentStep.toString());
  }, [currentStep]);

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

  const handleCopySampleForItem6 = async () => {
    const sampleText =
      `Olá! 🍦

Passando para saber se você gostaria de fazer um pedido para essa semana.
Pedidos feitos hoje garantimos à entrega até *Quinta feira*.

Fico à disposição!`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(sampleText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = sampleText;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedItem6(true);
      setTimeout(() => setCopiedItem6(false), 3000);
    } catch (err) {
      console.error("Erro ao copiar texto de exemplo:", err);
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
            <React.Fragment key={item.id}>
              <ChecklistItem
                id={item.id}
                title={item.title}
                subtitle1={item.subtitle1}
                subtitle2={item.subtitle2}
                checked={checkedItems[item.id]}
                onChange={() => handleCheckboxChange(item.id)}
                weekday={item.weekday}
              />
              {item.id === "20" && (
                <div className="copy-sample-wrapper">
                  <button
                    type="button"
                    className="copy-sample-button"
                    onClick={() => navigate("/frequencia")}
                  >
                    Relatório de Frequência
                  </button>
                </div>
              )}
              {item.id === "8" && (
                <div className="copy-sample-wrapper">
                  <button
                    type="button"
                    className="copy-sample-button"
                    onClick={handleCopySampleForItem6}
                  >
                    Copiar texto de exemplo
                  </button>
                  {copiedItem6 && (
                    <span className="copy-sample-hint">
                      Texto de exemplo copiado para a área de transferência.
                    </span>
                  )}
                </div>
              )}
              {item.id === "4" && (
                <div className="copy-sample-wrapper" style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="copy-sample-button"
                    onClick={() => window.open("https://estoqueahu.carmellagelateria.com.br", "_blank")}
                  >
                    Estoque Ahu
                  </button>
                  <button
                    type="button"
                    className="copy-sample-button"
                    onClick={() => window.open("https://estoquealtoxv.carmellagelateria.com.br", "_blank")}
                  >
                    Estoque XV
                  </button>
                </div>
              )}
              {item.id === "17" && (
                <div className="copy-sample-wrapper" style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="copy-sample-button"
                    onClick={() => window.open("https://www.ifood.com.br/delivery/curitiba-pr/olga-cafe--carmella-gelateria---ahu-ahu/b8f4806a-7fd6-4df5-a739-65fc17356556", "_blank")}
                  >
                    Loja Ifood Ahu
                  </button>
                  <button
                    type="button"
                    className="copy-sample-button"
                    onClick={() => window.open("https://www.ifood.com.br/delivery/curitiba-pr/olga-cafe--carmella-gelateria---alto-xv-alto-da-rua-xv/02625ea1-bc47-4f29-9d84-ab9e275206e6", "_blank")}
                  >
                    Loja Ifood Alto XV
                  </button>
                </div>
              )}
              {item.id === "18" && (
                <div className="copy-sample-wrapper" style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="copy-sample-button"
                    onClick={() => window.open("https://portal.ifood.com.br/login", "_blank")}
                  >
                    Portal Ifood
                  </button>

                </div>
              )}
            </React.Fragment>
          ))}

        {currentStep === 40 && (
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
