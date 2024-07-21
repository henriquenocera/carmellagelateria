import React from "react";
import "./ChecklistForm.css";
import ChecklistItem from "./ChecklistItem";

function ChecklistAberturaForm({ handleSubmit }) {


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
          subtitle2=""
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
          subtitle2="Usuário: 5 | Senha: 2849"
        />
        <ChecklistItem
          id="9"
          title="Conferir Máquina de Cartão POS e TEF"
          subtitle1="Conferir se estão funcionando"
          subtitle2=""
        />
        <ChecklistItem
          id="10"
          title="Conferir Tablet"
          subtitle1="Conferir se está com bateria"
          subtitle2=""
        />
        <ChecklistItem
          id="11"
          title="Abrir Loja do Ifood"
          subtitle1="Para abrir a loja basta entrar no app e deixar ele aberto durante o dia"
          subtitle2=""
        />
        <ChecklistItem
          id="11"
          title="Loja do Ifood"
          subtitle1="Para abrir a loja basta entrar no app e deixar ele aberto durante o dia"
          subtitle2=""
        />
        <div className="sectionTitle">
          <p>2ª Outras Tarefas</p>
        </div>
        <ChecklistItem
          id="5"
          title="Loja Ifood"
          subtitle1="Abrir loja no Ifood, verificar se no app consta o aviso de loja aberta"
          subtitle2="Manter o app do ifood sempre aberto no tablet durante o dia"
        />
        <ChecklistItem
          id="6"
          title="Limpeza do Chão Interno"
          subtitle1="(parte interna da loja, saguão dos clintes e sala de trás)"
          subtitle2="Varrer o chão para remover todo pó e sujeira. Depois passar o MOPE no chão com água e veja"
        />
        <ChecklistItem
          id="7"
          title="Limpeza das Bancadas Internas"
          subtitle1="Limpeza interna da loja, bancadas, pia, mesas dos clientes e utensílios"
        />
        <ChecklistItem
          id="8"
          title="Limpeza das Pátio Externo"
          subtitle1="Varrer o chão para remover lixos, folhas, plásticos, papeis, etc."
        />
        <ChecklistItem
          id="9"
          title="Reposição de Insumos"
          subtitle1="Realizar a retirada de estoque dos insumos necessários (copinhos, pázinhas, etc)"
        />
        <ChecklistItem
          id="10"
          title="Máquina de Waffle"
          subtitle1="Ligar a máquina de Waffle na “Tomada Vermelha 220V"
          subtitle2="Verificar o controlador manual se está configurado em 200º C"
        />
        <ChecklistItem
          id="11"
          title="Luz da Loja"
          subtitle1="Acender todas as luzes da loja"
        />
        <ChecklistItem
          id="12"
          title="Lixos"
          subtitle1="Fazer a reposição dos lixos"
          subtitle2="Lixos pequenos internos > 20 Litros"
          subtitle3="Lixos externos > 40 Litros"
          subtitle4="Lixo grande interno > 60 Litros"
        />
        <ChecklistItem
          id="13"
          title="Saco do Dog"
        />
        <ChecklistItem
          id="14"
          title="Protetor de Portas"
          subtitle1="Estruturas de metal branca para proteger os trilhos da porta da Carmella"
        />
        <ChecklistItem
          id="15"
          title="Abertura do Caixa"
          subtitle1="Usuário: 5"
          subtitle2="Senha: 2849"
          subtitle3="Realizar contagem das notas para informar o valor inicial"
        />
        <ChecklistItem
          id="16"
          title="Reposição da Vitrine ( a partir de -4º C )"
        />
        <ChecklistItem
          id="17"
          title="Verificar Quebras"
          subtitle1="Identicar as quebras que poderão ser repostas hoje e já deixar separadas no Freezer"
        />
        <ChecklistItem
          id="18"
          title="Abertura das Portas ( 12:00 )"
          subtitle1="Caso esteja tudo pronto antes, realizar a abertura das portas antes de 12:00"
        />
        <button className="submit" type="submit">Enviar</button>
      </form>
    </>
  );
}

export default ChecklistAberturaForm;
