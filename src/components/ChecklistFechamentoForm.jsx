import React, { useState, useRef } from "react";
import "./ChecklistForm.css";
import ChecklistItem from "./ChecklistItem";

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

    if (idInput == 270312) {
      setUser("Henrique");
    } else if (idInput == 1727) {
      setUser("Marina");
    } else if (idInput == 6532) {
      setUser("Nicolas");
    } else if (idInput == 1735) {
      setUser("Denise");
    } else if (idInput == 1476) {
      setUser("Eduarda L.");
    } else if (idInput == 2467) {
      setUser("Sthefani");
    } else if (idInput == 9485) {
      setUser("Anna");
    } else {
      setUser("");
    }
  }

  return (
    <>
      <form onSubmit={event => handleSubmit(event, freezer, geladeira, morango, banana, amora, maca, brownie, panos, user)} className="fechamentoAltoxv" id="altoxvClose">
        <div className="sectionTitle">
          <p>1ª Pré Fechamento (18:00 ~ 18:55)</p>
        </div>
        <ChecklistItem
          id="1"
          title="Espátulas e Cubas"
          subtitle1="Realizar a limpeza das espátulas
          "
          subtitle2="Realizar a limpeza das cubas (nunca limpar cubas na frente do cliente)
          "
        />
        <ChecklistItem
          id="2"
          title="Atualizar Trello"
          subtitle1="Freezer e Vitrine"

        />

        <div className="sectionTitle">
          <p>2ª Fechamento (19:00)</p>
        </div>
        <ChecklistItem
          id="3"
          title="Fechamento das Portas"
          subtitle1="Realizar o fechamento das portas após as 19:00, caso tenha cliente na loja, esperar todos os clientes irem embora.
          "
        />
        <ChecklistItem
          id="4"
          title="Fechar e Trancar  a Porta Preta Externa dos Fundos"
        />
        <ChecklistItem
          id="5"
          title="Guardar Cubas no Freezer"
          subtitle1="Carregar cubas sempre de 1 em 1"
        />
        <ChecklistItem
          id="6"
          title="Desligar Vitrine"
          subtitle1="Limpar todo resto de sorvete que for possível"
        />
        <ChecklistItem
          id="7"
          title="Lixo do Saguão dos Clientes"
          subtitle1="Caso o lixo não esteja cheio ainda, dar um nó nele para usar no dia seguinte "
        />
        <ChecklistItem
          id="8"
          title="Limpeza do Chão Interno"
          subtitle1="(parte interna da loja e saguão dos clintes)"
          subtitle2="Varrer o chão para remover todo pó e sujeira"
          subtitle3="Depois passar o MOPE no chão com água e veja"
        />
        <ChecklistItem
          id="9"
          title="Tablet e Máquina POS"
          subtitle1="Guardar tablet e máquina POS e colocar eles para carregar"
        />
        <ChecklistItem
          id="10"
          title="Máquina Waffle"
          subtitle1="Desligar Máquina de Waffle, deve ser retirado da tomada"
        />
        <ChecklistItem
          id="11"
          title="Máquina de Café e Moedor"
          subtitle1="Desligar Máquina de Café e Moedor, devem ser retirados da tomada"
        />
        <ChecklistItem
          id="12"
          title="Utensílios do Café"
          subtitle1="Realizar a limpeza dos pitches, porta filtro, tamper, porta tamper e gaveta de borra. Lavar com água e sabão"
        />
        <ChecklistItem
          id="22"
          title="Limpeza da Bancada da Sala dos Fundos (Sanduíche)"
          subtitle1="Remover restos de farelo e limpar com um pano e álcool líquido a bancada"
        />
        <ChecklistItem
          id="13"
          title="Banheiro dos Funcionários"
          subtitle1="Retirar o lixo do banheiro dos funcionários ( cajo haja necessidade )"
        />
        <ChecklistItem
          id="14"
          title="Retirar Lixos Internos"
        />
        <ChecklistItem
          id="15"
          title="Retirar Lixos Externos"
        />
        <ChecklistItem
          id="16"
          title="Recolher Saco do Dog"
        />
        <ChecklistItem
          id="17"
          title="Fechar Caixa"
          subtitle1="Realizar o fechamento do caixa pelo sistema, guardar a comanda de fechamento de caixa dentro do malote"
        />
        <ChecklistItem
          id="18"
          title="Massas de Waffle"
          subtitle1="Transferir massas do Freezer para o Frigobar Preto para totalizar 10 massas para o dia seguinte"
          subtitle2="Após transferência de massas realizar contagem do nº de massas no Freezer e Geladeira"
        />


        <div className="sectionTitle">
          <p>3ª Contagem de Estoque</p>
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
          <label className="inventoryLabel" htmlFor="">Potes Fechados de <b>Morango:</b></label>
          <input onChange={(event) =>
            setMorango(event.target.value)
          } className="inventoryInput" required type="number" name="morango" min="0" id="90" />
        </div>
        <div className="inventoryFlexbox">
          <label className="inventoryLabel" htmlFor="">Potes Fechados de <b>Banana:</b></label>
          <input onChange={(event) =>
            setBanana(event.target.value)
          } className="inventoryInput" required type="number" name="banana" min="0" id="90" />
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
        <div className="sectionTitle">
          <p>4ª Saída</p>
        </div>
        <ChecklistItem
          id="23"
          title="Descarte Correto dos Panos sujos"
          subtitle1="Panos sujos sempre devem ser colocados no balde ao final do dia"
        />
        <ChecklistItem
          id="19"
          title="Freezer e Geladeiras"
          subtitle1="Garantir que estão bem fechados → Frezer Uso, Freezer Estoque, Geladeira da Sala dos Fundos, Frigobar Preto, Frigobar Branco e Geladeira da Coca"
        />
        <ChecklistItem
          id="20"
          title="Geladeira da Sala dos Fundos"
          subtitle1="Garantir que não sobrou nenhuma cuba lá dentro antes de ir embora"
        />
        <ChecklistItem
          id="21"
          title="Confirmar Checklist e Desligar Computador"
        />
        {/* 
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
              autoFocus
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
        </div> */}
        {/*         <div>
          <button
            onClick={handleClick}
            className="idSubmit idSubmitChecklist"
            type="submit"
          >
            Verificar ID
          </button>
        </div> */}
        <button className="submit" type="submit">Enviar</button>
      </form>
    </>
  );
}

export default ChecklistFechamentoForm;
