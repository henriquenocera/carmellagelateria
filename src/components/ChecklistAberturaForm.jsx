import React from "react";
import "./ChecklistForm.css";
import ChecklistItem from "./ChecklistItem";

function ChecklistAberturaForm({ handleSubmit }) {


  return (
    <>
      <form onSubmit={event => handleSubmit(event)} className="aberturaAltoxv" id="altoxvOpen">
        <div className="sectionTitle">
          <p>1ª Prioridade</p>
        </div>
        <ChecklistItem
          id="1"
          title="Vitrine"
          subtitle1="Realizar a limpeza interna e externa da vitrine. Aço inox com pano úmido e vidros com álcool líquido"
          subtitle2="Após a limpeza, ligar a vitrine"
        />
        <ChecklistItem
          id="2"
          title="Máquina de Café e Moedor"
          subtitle1="Ligar a Máquina de café e o moedor na tomada"
          subtitle2="Ligar o controlador da máquina de café"
        />
        <ChecklistItem
          id="3"
          title="Sistema"
          subtitle1="Verificar se o sistema está funcionando, impressora e máquina de cartão TEF"
          subtitle2="Verificar se a máquina de cartão POS e o tablet estão funcionando e com bateria"
        />
        <ChecklistItem
          id="4"
          title="Itens em Falta"
          subtitle1="Verificar antes da abertura se tem algum produto / insumo em falta"
          subtitle2="Caso tenha algo faltando, avisar no grupo do Whats"
        />
        <div className="sectionTitle">
          <p>2ª Outras Tarefas</p>
        </div>
        <ChecklistItem
          id="5"
          title="Loja Ifood"
          subtitle1="Abrir loja no Ifood, verificar se no app consta o aviso de loja aberta"
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
