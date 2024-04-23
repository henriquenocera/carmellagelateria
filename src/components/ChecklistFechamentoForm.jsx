import React, { useState } from "react";
import "./ChecklistForm.css";

function ChecklistFechamentoForm({ handleSubmit }) {
  const [freezer, setFreezer] = useState("");
  const [geladeira, setGeladeira] = useState("");
  const [morango, setMorango] = useState("");
  const [banana, setBanana] = useState("");
  const [amora, setAmora] = useState("");
  const [maca, setMaca] = useState("");
  const [brownie, setBrownie] = useState("");
  const [panos, setPanos] = useState("");


  return (
    <>
      <form onSubmit={event => handleSubmit(event, freezer, geladeira, morango, banana, amora, maca, brownie, panos)} className="fechamentoAltoxv" id="altoxvClose">
        <div className="sectionTitle">
          <p>1ª Pré Fechamento (18:00 ~ 18:55)</p>
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
            <span className="label">Espátulas e Cubas</span>
          </label>
          <span className="subtitle">Realizar a limpeza das espátulas</span>
          <span className="subtitle">Realizar a limpeza das cubas (nunca limpar cubas na frente do cliente)</span>


        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="2"
            type="checkbox"
            name="2"
          />
          <label className="cbx" htmlFor="2">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Atualizar Trello</span>
          </label>
          <span className="subtitle">Freezer e Vitrine</span>
        </div>
        <div className="sectionTitle">
          <p>2ª Fechamento (19:00)</p>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="3"
            type="checkbox"
            name="3"
          />
          <label className="cbx" htmlFor="3">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Fechamento das Portas</span>
          </label>
          <span className="subtitle">Realizar o fechamento das portas após as 19:00, caso tenha cliente na loja, esperar todos os clientes irem embora.</span>

        </div>


        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="6"
            type="checkbox"
            name="6"
          />
          <label className="cbx" htmlFor="6">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Guardar Cubas no Freezer</span>
          </label>
          <span className="subtitle">Carregar cubas sempre de 1 em 1</span>


        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="7"
            type="checkbox"
            name="7"
          />
          <label className="cbx" htmlFor="7">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Desligar Vitrine</span>
          </label>
          <span className="subtitle">Limpar todo resto de sorvete que for possível</span>

        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1002"
            type="checkbox"
            name="1002"
          />
          <label className="cbx" htmlFor="1002">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Lixo do Saguão dos Clientes</span>
          </label>
          <span className="subtitle">Caso o lixo não esteja cheio ainda, dar um nó nele para usar no dia seguinte</span>

        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="12"
            type="checkbox"
            name="12"
          />
          <label className="cbx" htmlFor="12">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Banheiro dos Clientes</span>
          </label>
          <span className="subtitle">Retirar o lixo do banheiro</span>
          <span className="subtitle">Apagar a luz</span>

        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1003"
            type="checkbox"
            name="1003"
          />
          <label className="cbx" htmlFor="1003">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Limpeza do Chão Interno</span>
          </label>
          <span className="subtitle">(parte interna da loja, saguão dos clintes e banheiro dos clientes)</span>
          <span className="subtitle">Varrer o chão para remover todo pó e sujeira</span>
          <span className="subtitle">Depois passar o MOPE no chão com água e veja</span>


        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="27"
            type="checkbox"
            name="27"
          />
          <label className="cbx" htmlFor="27">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Máquina POS</span>
          </label>
          <span className="subtitle">Colocar a maquininha de cartão para carregar</span>

        </div>

        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="9"
            type="checkbox"
            name="9"
          />
          <label className="cbx" htmlFor="9">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Máquina de Café e Moedor</span>
          </label>
          <span className="subtitle">Desligar Máquina de Café e Moedor, devem ser retirados da tomada</span>


        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="109"
            type="checkbox"
            name="109"
          />
          <label className="cbx" htmlFor="109">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Utensílios do Café </span>
          </label>
          <span className="subtitle">Realizar a limpeza dos pitches, porta filtro, tamper, porta tamper e gaveta de borra. <br></br>Lavar com água e sabão</span>


        </div>


  

        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="13"
            type="checkbox"
            name="13"
          />
          <label className="cbx" htmlFor="13">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Fechar Caixa</span>
          </label>
          <span className="subtitle">Realizar o fechamento do caixa pelo sistema, guardar a comanda de fechamento de caixa dentro do malote</span>
        </div>
        
      <div className="sectionTitle">
        <p>3ª Contagem de Estoque</p>
      </div>
      <div className="inventoryFlexbox">
        <label className="inventoryLabel"htmlFor="">Brownies:</label>
        <input onChange={(event) =>
              setBrownie(event.target.value)
            } className="inventoryInput" required type="number" name="brownie" min="0" id="90" />
      </div>
      <div className="inventoryFlexbox">
        <label className="inventoryLabel"htmlFor="">Panos Limpos:</label>
        <input onChange={(event) =>
              setPanos(event.target.value)
            } className="inventoryInput" required type="number" name="panos" min="0" id="90" />
      </div>
        
       
        <div className="sectionTitle">
          <p>4ª Saída</p>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="15"
            type="checkbox"
            name="15"
          />
          <label className="cbx" htmlFor="15">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Freezer e Geladeiras</span>
          </label>
          <span className="subtitle">Garantir que estão bem fechados → Frezer Uso, Geladeira da Cozinha</span>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="16"
            type="checkbox"
            name="16"
          />
          <label className="cbx" htmlFor="16">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Geladeira da Cozinha</span>
          </label>
          <span className="subtitle">Conferir se não sobrou nenhuma cuba lá dentro antes de ir embora</span>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="17"
            type="checkbox"
            name="17"
          />
          <label className="cbx" htmlFor="17">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Confirmar Checklist e Desligar Computador</span>
          </label>

        </div>

        <button className="submit" type="submit">Enviar</button>
      </form>
    </>
  );
}

export default ChecklistFechamentoForm;
