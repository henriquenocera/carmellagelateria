import React, { useState, useRef } from "react";
import "./ChecklistForm.css";
import ChecklistItem from "./ChecklistItem";
import { ListId } from '../id.ts';


function ChecklistFechamentoForm({ handleSubmit }) {
  const [freezer, setFreezer] = useState("");
  const [geladeira, setGeladeira] = useState("");
  const [morango, setMorango] = useState("");
  const [banana, setBanana] = useState("");
  const [amora, setAmora] = useState("");
  const [maca, setMaca] = useState("");
  const [brownie, setBrownie] = useState("");
  const [panos, setPanos] = useState("");
  const [user, setUser] = useState("");
  const idInputRef = useRef(null);

  const unidadeText = "Ahu";



  function handleClick(e) {
    e.preventDefault();
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
      <form onSubmit={event => handleSubmit(event, freezer, geladeira, morango, banana, amora, maca, brownie, panos)} className="fechamentoAltoxv" id="altoxvClose">
        <div className="sectionTitle">
          <p><strong>1ª Pré Fechamento (18:00 ~ 18:59)</strong></p>
        </div>
        <ChecklistItem
          id="1"
          title="Limpar Espátulas"
          subtitle1="Lavar com água e sabão"
          subtitle2=""
        />
        <ChecklistItem
          id="2"
          title="Limpar Cubas"
          subtitle1="Sempre pegar um pano limpo"
          subtitle2=""
        />
        <ChecklistItem
          id="3"
          title="Conferir Trello (Estoque)"
          subtitle1="Revisar Trello e garantir que o estoque real bate com o estoque do trello"
          subtitle2=""
        />
        <div className="sectionTitle">
          <p><strong>2ª Fechamento (19:00)</strong></p>
        </div>
        <ChecklistItem
          id="4"
          title="Recolher Mesas Externas"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="5"
          title="Recolher Protetor de Guia"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="6"
          title="Recolher Saco Pet e Bebedouro do Cachorro"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="7"
          title="Retirar Lixo do Pátio Externo"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="71"
          title="Fechar Portas de Rolar"
          subtitle1="Trancar as portas"
          subtitle2=""
        />
        <ChecklistItem
          id="72"
          title="Guardar Cubas da Vitrine"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="8"
          title="Desligar Vitrine"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="80"
          title="Desligar Máquina de Waffle"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="9"
          title="Desligar Máquina de Café e Moedor"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="10"
          title="Fechar Caixa"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="11"
          title="Descongelar Massas Para o Dia Seguinte"
          subtitle1="Transferir massas do Freezer para o Frigobar Preto para totalizar 6 massas para o dia seguinte"
          subtitle2="Após transferência de massas realizar o inventário abaixo"
        />
        <div className="sectionTitle">
          <p>Inventário (checklist)</p>
        </div>

        <div className="inventoryFlexbox">
          <label className="inventoryLabel" htmlFor="">Massas <b>Freezer:</b></label>
          <input onChange={(event) =>
            setFreezer(event.target.value)
          } className="inventoryInput" required type="number" name="freezer" min="0" id="90" />
        </div>
        <div className="inventoryFlexbox">
          <label className="inventoryLabel" htmlFor="">Massas <b>Frigobar:</b></label>
          <input onChange={(event) =>
            setGeladeira(event.target.value)
          } className="inventoryInput" required type="number" name="geladeira" min="0" id="90" />
        </div>

        <div className="inventoryFlexbox">
          <label className="inventoryLabel" htmlFor="">Potes Fechados de <b>Geleia de Amora:</b></label>
          <input onChange={(event) =>
            setAmora(event.target.value)
          } className="inventoryInput" required type="number" name="amora" min="0" id="90" />
        </div>
        <div className="inventoryFlexbox">
          <label className="inventoryLabel" htmlFor="">Potes Fechados de <b>Geleia de Maça:</b></label>
          <input onChange={(event) =>
            setMaca(event.target.value)
          } className="inventoryInput" required type="number" name="maca" min="0" id="90" />
        </div>
        <div className="inventoryFlexbox">
          <label className="inventoryLabel" htmlFor="">Quantidade de <b>Brownies:</b></label>
          <input onChange={(event) =>
            setBrownie(event.target.value)
          } className="inventoryInput" required type="number" name="maca" min="0" id="90" />
        </div>
        <div className="inventoryFlexbox">
          <label className="inventoryLabel" htmlFor="">Quantidade de <b>Panos Limpos:</b></label>
          <input onChange={(event) =>
            setPanos(event.target.value)
          } className="inventoryInput" required type="number" name="panos" min="0" id="90" />
        </div>
        <ChecklistItem
          id="12"
          title="Foto das Frutas"
          subtitle1="Enviar uma foto do status das frutas na loja"
          subtitle2=""
        />
        <ChecklistItem
          id="13"
          title="Atualizar Trello (dia seguinte)"
          subtitle1="Atualizar vitrine conforme o que vai ser alterado amanhã"
          subtitle2=""
        />
        <ChecklistItem
          id="14"
          title="Desligar Tela do Tablet"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="15"
          title="Colocar para Carregar Tablet e Máquina POS"
          subtitle1="Carregar eles sempre na cozinha"
          subtitle2=""
        />
        <ChecklistItem
          id="16"
          title="Guardar Bolo na Geladeira"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="17"
          title="Esvaziar Água do Balde das Espátulas"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="18"
          title="Limpar Todos os Utensílios do Café"
          subtitle1="Limpar com água e sabão"
          subtitle2=""
          star
        />
        <ChecklistItem
          id="19"
          title="Limpar Máquina de Café (simples)"
          subtitle1="Passar um pano"
          subtitle2=""
          star
        />
        <ChecklistItem
          id="20"
          title="Limpar Bancada dos Salgados"
          subtitle1=""
          subtitle2=""
          star
        />
        <ChecklistItem
          id="211"
          title="Limpar Bancadas - Loja"
          subtitle1=""
          subtitle2=""
          star
        />
        <ChecklistItem
          id="212"
          title="Limpar Mesas e Cadeiras - Salão"
          subtitle1=""
          subtitle2=""
          star
        />
        <ChecklistItem
          id="21"
          title="Secar Pia"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="22"
          title="Descartar Panos"
          subtitle1="Descartar no balde de panos"
          subtitle2=""
        />
        <ChecklistItem
          id="23"
          title="Fechar Lixo do Salão dos Clientes"
          subtitle1="Se não tiver cheio, apenas dar um nó"
          subtitle2=""
        />
        <ChecklistItem
          id="24"
          title="Conferir Geladeira"
          subtitle1="Garantir que não sobrou nenuma cuba ou quebra lá dentro"
          subtitle2=""
        />
        <ChecklistItem
          id="25"
          title="Conferir Freezer, Geladeira e Friobar"
          subtitle1="Garantir que estão bem fechados"
          subtitle2=""
        />

        <ChecklistItem
          id="26"
          title="Varrer Chão"
          subtitle1=""
          subtitle2=""
          star
        />
        <ChecklistItem
          id="27"
          title="Passar Mop no Chão"
          subtitle1=""
          subtitle2=""
          star
        />
        <ChecklistItem
          id="28"
          title="Esvaziar Mop"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="29"
          title="Apagar Luzes"
          subtitle1=""
          subtitle2=""
        />
        <ChecklistItem
          id="30"
          title="Desligar Computador"
          subtitle1=""
          subtitle2=""
        />
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



        <button className="submit" type="submit">Enviar</button>
      </form >
    </>
  );
}

export default ChecklistFechamentoForm;
