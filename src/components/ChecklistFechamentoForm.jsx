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
          <p>1ª Pré Fechamento (18:00 ~ 18:50)</p>
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
          <span className="subtitle">Freezer Uso e Vitrine</span>
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
            <span className="label">Fechamento das Portas ( 19:00 ) </span>
          </label>
          <span className="subtitle">Realizar o fechamento das portas após as 19:00, caso tenha cliente na loja, esperar todos os clientes irem embora.
          </span>
        </div>

        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="4"
            type="checkbox"
            name="4"
          />
          <label className="cbx" htmlFor="4">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label new">Fechar Porta dos Fundos ( 2 chaves - Topo e Meio )</span>
          </label>
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
            <span className="label">Guardar Cubas Limpas no Freezer</span>
          </label>
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
            <span className="label">Tablet e Máquina POS para Carregar</span>
          </label>
          <span className="subtitle">Guardas tablet e máquina POS na cozinha e colocar eles para carregar
          </span>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="8"
            type="checkbox"
            name="8"
          />
          <label className="cbx" htmlFor="8">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Máquina Waffle</span>
          </label>
          <span className="subtitle">Desligar Máquina de Waffle, deve ser retirado da tomada
          </span>
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
          <span className="subtitle">Desligar Máquina de Café e Moedor, devem ser retirados da tomada
          </span>

        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="912"
            type="checkbox"
            name="912"
          />
          <label className="cbx" htmlFor="912">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Utensílios do Café</span>
          </label>
          <span className="subtitle">Realizar a limpeza dos pitches, porta filtro, tamper, porta tamper e gaveta de borra. Lavar com água e sabão          </span>

        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="10"
            type="checkbox"
            name="10"
          />
          <label className="cbx" htmlFor="10">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Banheiro dos Clientes</span>
          </label>
          <span className="subtitle">Retirar o lixo do banheiro ( cajo haja necessidade )
          </span>
          <span className="subtitle">Verificar papel higiênico e papel toalha
          </span>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="5"
            type="checkbox"
            name="5"
          />
          <label className="cbx" htmlFor="5">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Desligar luz do Banheiro dos Clientes</span>
          </label>
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
            <span className="label">Banheiro dos Funcionários</span>
          </label>
          <span className="subtitle">Retirar o lixo do banheiro ( cajo haja necessidade )
          </span>

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

          <span className="subtitle">Realizar o fechamento do caixa pelo sistema, guardar a comanda de fechamento de caixa dentro do malote e lacrar o malote</span>

        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="135"
            type="checkbox"
            name="135"
          />
          <label className="cbx" htmlFor="135">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Esvaziar Rodo Mope</span>
          </label>
          <span className="subtitle">Remover toda água do container do rodo mope</span>

        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="136"
            type="checkbox"
            name="136"
          />
          <label className="cbx" htmlFor="136">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Recolher Lixos Internos</span>
          </label>

        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="137"
            type="checkbox"
            name="137"
          />
          <label className="cbx" htmlFor="137">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Amarrar Lixo do Saguão dos Clientes</span>
          </label>
          <span className="subtitle">Caso esteja cheio, fazer o recolhimento normal</span>

        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="143"
            type="checkbox"
            name="143"
          />
          <label className="cbx" htmlFor="143">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Limpeza da Bancada da Cozinha (sanduíches)</span>
          </label>
          <span className="subtitle">Remover restos de farelo e limpar com um pano e álcool líquido a bancada</span>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="142"
            type="checkbox"
            name="142"
          />
          <label className="cbx" htmlFor="142">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Fechar Janela da Sala dos Funcionários</span>
          </label>
          <span className="subtitle">Remover toda água do container do rodo mope</span>

        </div>

        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="14"
            type="checkbox"
            name="14"
          />
          <label className="cbx" htmlFor="14">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Massas de Waffle</span>
          </label>
          <span className="subtitle">Transferir massas do Freezer para o Frigobar Preto para totalizar <b>12</b> massas para o dia seguinte</span>
          <span className="subtitle">Após transferência de massas realizar contagem do nº de massas no Freezer e Geladeira</span>
        </div>
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
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="150"
            type="checkbox"
            name="150"
          />
          <label className="cbx" htmlFor="150">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Descarte Correto dos Panos Sujos</span>
          </label>
          <span className="subtitle">Panos sujos sempre devem ser colocados no balde ao final do dia</span>
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
          <span className="subtitle">Garantir que estão bem fechados → Frezer Uso, Frigobar Preto, Frigobar Branco e Geladeira da Cozinha</span>
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
          <span className="subtitle">Garantir que não sobrou nenhuma cuba lá dentro antes de ir embora</span>
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
      </form >
    </>
  );
}

export default ChecklistFechamentoForm;
