import React from "react";
import "./ChecklistForm.css";

function ChecklistAberturaForm({ handleSubmit }) {


  return (
    <>
      <form onSubmit={event => handleSubmit(event)} className="aberturaAltoxv" id="altoxvOpen">
        <div className="sectionTitle">
          <p>1ª Prioridade</p>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1000"
            type="checkbox"
            name="1000"
          />
          <label className="cbx" htmlFor="1000">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label ">Vitrine</span>
          </label>
          <span className="subtitle">Realizar a limpeza interna e externa da vitrine. Aço inox com pano úmido e vidros com álcool líquido</span>
          <span className="subtitle">Após a limpeza, ligar a vitrine</span>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1001"
            type="checkbox"
            name="1001"
          />
          <label className="cbx" htmlFor="1001">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label ">Máquina de Café e Moedor</span>
          </label>
          <span className="subtitle">Ligar a Máquina de café e o moedor na tomada</span>
          <span className="subtitle">Ligar o controlador da máquina de café</span>
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
            <span className="label">Sistema</span>
          </label>
          <span className="subtitle">Verificar se o sistema está funcionando, impressora e máquina de cartão TEF</span>
          <span className="subtitle">Verificar se a máquina de cartão POS e o tablet estão funcionando e com bateria</span>
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
            <span className="label">Itens em Falta</span>
          </label>
          <span className="subtitle">Verificar antes da abertura se tem algum produto / insumo em falta</span>
          <span className="subtitle">Caso tenha algo faltando, avisar no grupo do Whats</span>
        </div>
        <div className="sectionTitle">
          <p>2ª Outras Tarefas</p>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1004"
            type="checkbox"
            name="1004"
          />
          <label className="cbx" htmlFor="1004">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label new ">Loja Ifood</span>
          </label>
          <span className="subtitle new ">Abrir loja no Ifood, verificar se no app consta o aviso de loja aberta</span>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1005"
            type="checkbox"
            name="1005"
          />
          <label className="cbx" htmlFor="1005">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Limpeza do Chão Interno</span>
          </label>
          <span className="subtitle">(parte interna da loja, saguão dos clintes e sala de trás)</span>
          <span className="subtitle">Varrer o chão para remover todo pó e sujeira <br></br>Depois passar o MOPE no chão com água e veja</span>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1006"
            type="checkbox"
            name="1006"
          />
          <label className="cbx" htmlFor="1006">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Limpeza das Bancadas Internas</span>
          </label>
          <span className="subtitle">Limpeza interna da loja, bancadas, pia, mesas dos clientes e utensílios</span>
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
            <span className="label">Limpeza das Pátio Externo</span>
          </label>
          <span className="subtitle">Limpeza interna da loja, bancadas, pia, mesas dos clientes e utensílios</span>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1007"
            type="checkbox"
            name="1007"
          />
          <label className="cbx" htmlFor="1007">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Reposição de Insumos</span>
          </label>
          <span className="subtitle">Realizar a retirada de estoque dos insumos necessários (copinhos, pázinhas, etc)</span>
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
            <span className="label">Máquina de Waffle </span>
          </label>
          <span className="subtitle">Ligar a máquina de Waffle na “Tomada Vermelha 220V”</span>
          <span className="subtitle">Verificar o controlador manual se está configurado em 200º C</span>
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
            <span className="label">Luz da Loja</span>
          </label>

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
            <span className="label">Cavalete Externo</span>
          </label>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="107"
            type="checkbox"
            name="107"
          />
          <label className="cbx" htmlFor="107">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Saco do Dog</span>
          </label>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="108"
            type="checkbox"
            name="108"
          />
          <label className="cbx" htmlFor="108">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Protetor de Portas</span>
          </label>
          <span className="subtitle">Estruturas de metal branca para proteger os trilhos da porta da Carmella</span>

        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="11"
            type="checkbox"
            name="11"
          />
          <label className="cbx" htmlFor="11">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Lixos</span>
          </label>
          <span className="subtitle">Fazer a reposição dos lixos internos e externos</span>
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
            <span className="label">Abertura do Caixa</span>
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
            <span className="label">Reposição da Vitrine ( -9º C )</span>
          </label>
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
            <span className="label">Abertura das Portas ( 12:00 )</span>
          </label>
        </div>


        <button className="submit" type="submit">Enviar</button>
      </form>
    </>
  );
}

export default ChecklistAberturaForm;
