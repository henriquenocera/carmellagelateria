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
            <span className="label ">Vitrine</span>
          </label>
          <span className="subtitle">Realizar a limpeza interna e externa da vitrine antes de ligar. Interior e exterior com pano úmido e vidros com álcool líquido</span>

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
            <span className="label">Sistema</span>
          </label>
          <span className="subtitle">Verificar se o sistema está funcionando, impressora e máquina de cartão TEF</span>
          <span className="subtitle">Verificar se a máquina de cartão POS e o tablet estão funcionando e com bateria</span>
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
            id="205"
            type="checkbox"
            name="205"
          />
          <label className="cbx" htmlFor="205">
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
            <span className="label">Limpeza Interna</span>
          </label>
          <span className="subtitle">Limpeza interna da loja, bancadas, pia, saguão, mesas dos clientes e utensílios</span>
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
            <span className="label">Reposição da Vitrine ( -12º C )</span>
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
