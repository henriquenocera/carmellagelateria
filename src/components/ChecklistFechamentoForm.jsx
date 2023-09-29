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

  return (
    <>
      <form onSubmit={event => handleSubmit(event, freezer, geladeira, morango, banana, amora, maca, brownie)} className="fechamentoAltoxv" id="altoxvClose">
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
            <span className="label">Limpar Espátulas e Cubas</span>
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
            <span className="label new">Fechar Porta dos Fundos ( 3 chaves )</span>
          </label>
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
            <span className="label">Colocar Tablet e Máquina POS para Carregar</span>
          </label>
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
            <span className="label">Desligar Máquina Waffle ( Tirar da Tomada )</span>
          </label>
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
            <span className="label">Desligar Máquina de Café e Moedor ( Tirar da Tomada )</span>
          </label>
          <span className="subtitle">Lavar porta filtros e pitchers com água e sabão</span>
          <span className="subtitle">Esvaziar gaveta de borra no lixo e lavar com água e sabão</span>

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
            <span className="label">Retirar Lixo do Banheiro dos Clientes</span>
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
            <span className="label">Retirar Lixo do Banheiro dos Funcionários ( Caso haja necessidade )</span>
          </label>
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
            <span className="label">Fechar Caixa e Lacrar Malote</span>
          </label>
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
            <span className="label">Massas de Waffle - Descongelar para o Dia Seguinte</span>
          </label>
          <span className="subtitle">Transferir massas do Freezer para o Frigobar Preto para totalizar <b>12</b> massas para o dia seguinte</span>
          <span className="subtitle">Após transferência de massas realizar contagem do nº de massas no Freezer e Geladeira</span>
        </div>
        <div className="sectionTitle">
          <p>3ª Contagem de Estoque</p>
        </div>
        <div className="checkbox-wrapper">
          <label className="label" htmlFor="">Quantidade de massas totais congeladas no <b>Freezer:</b></label>
          <input onChange={(event) =>
            setFreezer(event.target.value)
          } className="inputNumber" required type="number" name="freezer" min="0" id="90" />
        </div>
        <div className="checkbox-wrapper">
          <label className="label" htmlFor="">Quantidade de massas totais no <b>Frigobar Preto:</b></label>
          <input onChange={(event) =>
            setGeladeira(event.target.value)
          } className="inputNumber" required type="number" name="geladeira" min="0" id="91" />
        </div>
        <div className="checkbox-wrapper">
          <label className="label" htmlFor="">Quantidade Potes Fechados de <b>Morango</b> na Geladeira da Cozinha</label>
          <input onChange={(event) =>
            setMorango(event.target.value)
          } className="inputNumber" required type="number" name="morango" min="0" id="92" />
        </div>
        <div className="checkbox-wrapper">
          <label className="label" htmlFor="">Quantidade Potes Fechados de <b>Banana</b> na Geladeira da Cozinha</label>
          <input onChange={(event) =>
            setBanana(event.target.value)
          } className="inputNumber" required type="number" name="banana" min="0" id="92" />
        </div>
        <div className="checkbox-wrapper">
          <label className="label" htmlFor="">Quantidade Potes Fechados de <b>Geleia de Amora</b> na Geladeira da Cozinha</label>
          <input onChange={(event) =>
            setAmora(event.target.value)
          } className="inputNumber" required type="number" name="amora" min="0" id="92" />
        </div>
        <div className="checkbox-wrapper">
          <label className="label" htmlFor="">Quantidade Potes Fechados de <b>Torta de Maça</b> na Geladeira da Cozinha</label>
          <input onChange={(event) =>
            setMaca(event.target.value)
          } className="inputNumber" required type="number" name="maca" min="0" id="92" />
        </div>
        <div className="checkbox-wrapper">
          <label className="label" htmlFor="">Quantidade de <b>Brownies</b> na Geladeira da Cozinha</label>
          <input onChange={(event) =>
            setBrownie(event.target.value)
          } className="inputNumber" required type="number" name="brownie" min="0" id="92" />
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
            <span className="label">Verificar Freezer e Geladeiras</span>
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
            <span className="label">Verificar Dentro da Geladeira da Cozinha</span>
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
      </form>
    </>
  );
}

export default ChecklistFechamentoForm;
