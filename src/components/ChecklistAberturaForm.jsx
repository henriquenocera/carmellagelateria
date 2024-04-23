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
            <span className="label ">Máquina de Café</span>
          </label>
          <span className="subtitle">Ligar a Máquina de café na tomada</span>
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
            id="1013"
            type="checkbox"
            name="1013"
          />
          <label className="cbx" htmlFor="1013">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Limpeza do Chão Interno</span>
          </label>
          <span className="subtitle">(parte interna da loja, saguão dos clintes e banheiro dos clientes)
</span>

          <span className="subtitle">Varrer o chão para remover todo pó e sujeira</span>
          <span className="subtitle">Passar um MOPE no chão com água e veja</span>
        

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
            <span className="label">Limpeza das Bancadas Internas</span>
          </label>
          <span className="subtitle">Limpeza interna da loja, bancadas, pia, mesas dos clientes e utensílios</span>
        </div>
        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1014"
            type="checkbox"
            name="1014"
          />
          <label className="cbx" htmlFor="1014">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Limpeza do Pátio Externo</span>
          </label>
          <span className="subtitle">Varrer o chão para remover lixos, folhas, plásticos, papeis, etc.</span>
        

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
            <span className="label">Reposição de Insumos</span>
          </label>
          <span className="subtitle">Realizar a retirada de estoque dos insumos necessários (copinhos, pázinhas, etc)</span>
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
            <span className="label">Luz da Loja</span>

          </label>
          <span className="subtitle">Acender todas as luzes da loja</span>

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
            <span className="label">Lixos</span>
          </label>
          <span className="subtitle">Fazer a reposição dos lixos </span>
          <span className="subtitle">Lixos pequenos internos > 20 Litros</span>
          <span className="subtitle">Lixo do Banheiro dos Clientes > 40 Litros</span>
          <span className="subtitle">Lixos Grande do Saguão dos clientes > 60 Litros</span>
        </div>

        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1011"
            type="checkbox"
            name="1011"
          />
          <label className="cbx" htmlFor="1011">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Água do Degelo da Vitrine</span>
          </label>
          <span className="subtitle">Em baixo da vitrine, ao lado direito, existe um pote preto para coleta de água da vitrine durante a noite.</span>
          <span className="subtitle">Esvaziar esse pote preto e colocar ele novamente no lugar</span>

      
        </div>


        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1008"
            type="checkbox"
            name="1008"
          />
          <label className="cbx" htmlFor="1008">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Abertura do Caixa</span>
          </label>
          <span className="subtitle">Usuário: 7</span>
          <span className="subtitle">Senha: 2849</span>
          <span className="subtitle">Realizar contagem das notas para informar o valor inicial</span>

        </div>


        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1009"
            type="checkbox"
            name="1009"
          />
          <label className="cbx" htmlFor="1009">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Reposição da Vitrine ( a partir de -4º C )</span>
          </label>
        </div>

        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1012"
            type="checkbox"
            name="1012"
          />
          <label className="cbx" htmlFor="1012">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Verificar as Quebras</span>
          </label>
          <span className="subtitle">Identicar as quebras que poderão ser repostas hoje e já deixar separadas no Freezer</span>

        </div>


        <div className="checkbox-wrapper">
          <input
            required
            className="inp-cbx"
            id="1010"
            type="checkbox"
            name="1010"
          />
          <label className="cbx" htmlFor="1010">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span className="label">Abertura das Portas ( 12:00 )</span>
          </label>
          <span className="subtitle">Caso esteja tudo pronto antes, realizar a abertura das portas antes de 12:00</span>

        </div>


        <button className="submit" type="submit">Enviar</button>
      </form>
    </>
  );
}

export default ChecklistAberturaForm;
