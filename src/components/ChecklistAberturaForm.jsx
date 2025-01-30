import React, { useState, useRef } from "react";

import "../css/ChecklistForm.css";
import ChecklistItem from "./ChecklistItem";
import { ListId } from '../id.ts';



function ChecklistAberturaForm({ handleSubmit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);

  const [user, setUser] = useState("");
  const idInputRef = useRef(null);

  const unidadeText = "Ahu";




  function openModal(e) {
    // Open Modal to ask for ID
    // const formElement = e.target;
    //const isValid = formElement.checkValidity();
    //console.log(formElement)
    // console.log(isValid)
    e.preventDefault()


    const formElement = e.currentTarget.parentNode;
    const isValid = formElement.checkValidity();
    console.log(isValid)

    if (isValid) {
      console.log("Open Modal")
      setIsModalOpen(true)
    } else {
      setIsModalErrorOpen(true)
    }


  }

  function checkId(e) {


    console.log("Check ID")
    e.preventDefault()
    let idInput = idInputRef.current.value;

    if (idInput == ListId[0].value) {
      setUser(ListId[0].nome)

    } else if (idInput == ListId[1].value) {
      setUser(ListId[1].nome)
    } else if (idInput == ListId[2].value) {
      setUser(ListId[2].nome)
    } else if (idInput == ListId[3].value) {
      setUser(ListId[3].nome)
    } else if (idInput == ListId[4].value) {
      setUser(ListId[4].nome)
    } else {
      setUser("")
    }

  }


  return (
    <>

      {/* Modal */}
      {isModalErrorOpen && (
        <div className="modal-overlay">
          <div className="modal-content-error">
            <h3 className="modalTitleError">Por favor, complete todos is itens do checklist antes de Enviar</h3>
            <div className="modal-buttons">
              <button
                onClick={() => setIsModalErrorOpen(false)}
                className="close-button-error"
              >
                Voltar
              </button>
            </div>
          </div >

        </div >
      )
      }
      {/* Modal */}
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
                    form="altoxvOpen"
                    className="confirm-button">Enviar Checklist</button>
                  <button
                    onClick={() => { setIsModalOpen(false); setUser("") }}
                    className="close-button"
                  >
                    Voltar
                  </button>
                </div>
              </>
            )
            }
          </div >
        </div >
      )
      }
      <form onSubmit={event => handleSubmit(event, user)} className="aberturaAltoxv" id="altoxvOpen">
        <div className="sectionTitle">
          <p><strong>1ª Prioridade</strong></p>
        </div>

        <ChecklistItem
          id="1"
          title="Limpar Vitrine"
          subtitle1="Interior e exterior com pano úmido e vidros com álcool líquido"
        />
        <ChecklistItem
          id="2"
          title="Ligar Vitrine"
          subtitle1=""
          subtitle2=""
        />
        {/*  <ChecklistItem
          id="3"
          title="Ligar Máquina de Waffle"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="4"
          title="Ligar Máquina de Café"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="5"
          title="Ligar Moedor de Café"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="6"
          title="Acender Todas as Luzes"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="7"
          title="Realizar a Contagem de Notas do Malote"
          subtitle1="Enviar no grupo do whats a contagem de notas e moedas"
          subtitle2=""
        />
        <ChecklistItem
          id="8"
          title="Abrir Caixa"
          subtitle1="Abrir o caixa com o valor real do malote"
          subtitle2="Usuário: 6 | Senha: 2849"
        />
        <ChecklistItem
          id="10"
          title="Conferir Máquina de Cartão POS e TEF"
          subtitle1="Conferir se estão funcionando"
          subtitle2=""
        />
        <ChecklistItem
          id="11"
          title="Conferir Tablet"
          subtitle1="Conferir se está com bateria"
          subtitle2=""
        />
        <ChecklistItem
          id="12"
          title="Abrir Loja do Ifood"
          subtitle1="Para abrir a loja basta entrar no app e deixar ele aberto durante o dia"
          subtitle2=""
        />
        <img className="imgIfood" width="700px" src="/ifood.png" alt="" />
        <ChecklistItem
          id="13"
          title="Conferir Toppings do Ifood"
          subtitle1="Se algum topping tiver em falta, desligar do ifood"
          subtitle2=""
        />
        <ChecklistItem
          id="14"
          title="Trocar Papel Toalha dos Morangos"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="15"
          title="Atualizar Relatório dos Salgados"
          subtitle1=""
          subtitle2=""
        />
        <div className="sectionTitle">
          <p><strong>2ª Outras Tarefas</strong></p>
        </div>
        <ChecklistItem
          id="16"
          title="Varrer Chão"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="17"
          title="Passar Mop no Chão"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="18"
          title="Limpar Banheiro"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="19"
          title="Colocar os Sacos de Lixo Internos"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="20"
          title="Limpar Bancadas"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="21"
          title="Limpar Mesas e Cadeiras do Salão"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="22"
          title="Repor Insumos"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="23"
          title="Abastecer Vitrine (-4ºC)"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="231"
          title="Colocar Bolo na Bancada"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="24"
          title="Abrir Portas de Enrolar"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="241"
          title="Abrir Janela do Salão dos Clientes"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="242"
          title="Colocar Sacos de Lixo Externos"
          subtitle1=""
          subtitle2=""
        />

        <ChecklistItem
          id="27"
          title="Limpar Pátio"
          subtitle1="Recolher lixo e passar uma vassoura"
          subtitle2=""
        />
        <ChecklistItem
          id="243"
          title="Colocar Saco Pet e Bebedouro do Cachorro"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="244"
          title="Colocar Mesas Externas"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="26"
          title="Trancar Porta de Entrada dos Funcionários"
          subtitle1="Porta de metal do corredor"
          subtitle2=""
        />
        <ChecklistItem
          id="28"
          title="Conferir Temperatura da Máquina de Waffle"
          subtitle1="Temperatura deve estar próximo de 200ºC"
          subtitle2=""
        />
        <ChecklistItem
          id="29"
          title="Conferir Quebras"
          subtitle1="Se tiver alguma quebra que pode entrar hoje, já deixe separado"
          subtitle2=""
        />
        <ChecklistItem
          id="30"
          title="Prever Cubas para Troca"
          subtitle1="Verificar se vai haver a necessidade de troca de uma cuba hoje, e já deixar planejado"
          subtitle2=""
        /> */}
        {/*         <section>
          <div>

            <div>
              <label className="idLabel" htmlFor="id">
                ID do Responsável pelo Checklist
              </label>
            </div>

            <div>
              <input
                className="idInput"
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                min="0"
                max="9999"
                required
                ref={idInputRef}

              />
            </div>
            <div>
              {user == "" ? (
                <></>
              ) : (
                <>
                  <div>
                    <input
                      name="Nome"
                      className="userInput"
                      type="text"
                      value={user}
                    />
                  </div>
                  <div>
                    <input
                      name="Unidade"
                      className="userInput"
                      type="text"
                      value={unidadeText}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div>
            <button
              onClick={handleClick}
              className="idSubmit idSubmitChecklist"
              type="submit"
            >
              Verificar ID
            </button>
          </div>
        </section> */}

        <button onClick={openModal} className="submit"
          type="submit">Confirmar Checklist</button>
      </form>
    </>
  );
}

export default ChecklistAberturaForm;
