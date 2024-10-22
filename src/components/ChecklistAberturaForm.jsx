import React, { useState, useRef } from "react";

import "./ChecklistForm.css";
import ChecklistItem from "./ChecklistItem";




function ChecklistAberturaForm({ handleSubmit }) {

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
      <form onSubmit={event => handleSubmit(event)} className="aberturaAltoxv" id="altoxvOpen">
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
        <ChecklistItem
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
          id="9"
          title="Abrir Caixa"
          subtitle1="Abrir o caixa com o valor real do malote"
          subtitle2=""
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
        {/*         <ChecklistItem
          id="18"
          title="Limpar Banheiro"
          subtitle1=""
          subtitle2=""
        /> */}
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
          title="Colocar Protetor de Portas"
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
      </form>
    </>
  );
}

export default ChecklistAberturaForm;
