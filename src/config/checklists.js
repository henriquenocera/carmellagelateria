export const checklistAberturaSteps = [
  {
    title: "1ª - Equipamentos",
    items: [
      { id: "1", title: "Limpeza interna da vitrine", subtitle1: "Interior com um pano úmido", },
      { id: "2", title: "Limpeza externa da vitrine", subtitle1: "Vidros com álcool líquido", subtitle2: "" },
      { id: "3", title: "Ligar a Vitrine", subtitle1: "Utilizar o controlador", subtitle2: "" },
      { id: "4", title: "Ligar a máquina de café e o moedor", subtitle1: "Utilizar tomadas 220v 'tomadas vermelhas'", subtitle2: "Girar o controlador da máquina de café para a posição '1'" },
      { id: "5", title: "Acender Todas as Luzes", subtitle1: "", subtitle2: "" },
      { id: "6", title: "Ligar máquininha de cartão POS", subtitle1: "Se estiver sem bateria, colocar para carregar", subtitle2: "" },
      { id: "7", title: "Ligar Tablet", subtitle1: "Se estiver sem bateria, colocar para carregar", subtitle2: "" },
      { id: "8", title: "Realizar a contagem de notas do malote", subtitle1: "Utilizar o contador de notas e moedas abaixo", subtitle2: "" },
      { id: "9", title: "Realizar a abertura do caixa", subtitle1: "Abrir o caixa com o valor real do malote", subtitle2: "Usuário: 5 | Senha: 2849" },
    ]
  },
  {
    title: "2ª - Organização",
    items: [
      { id: "10", title: "Trocar papel toalha dos morangos", subtitle1: "", subtitle2: "" },
      {
        id: "11", title: "Atualizar relatório dos salgados", subtitle1: "", subtitle2: "", buttonText: "Relatório dos Salgados",
        buttonLink: "/salgados"
      },
      { id: "12", title: "Colocar sacos de lixo interno", subtitle1: "Sacos de lixo de 20 Litros", subtitle2: "" },
      { id: "13", title: "Colocar sacos de lixo externos", subtitle1: "Sacos de lixo de 40 Litros", subtitle2: "" },
      { id: "14", title: "Colocar sacos de lixo no banheiro", subtitle1: "Sacos de lixo de 40 Litros", subtitle2: "" },
      { id: "15", title: "Repor papel higiênico no banheiro", subtitle1: "", subtitle2: "" },
      { id: "16", title: "Repor papel toalha no banheiro", subtitle1: "", subtitle2: "" },
      { id: "17", title: "Repor insumos necessários", subtitle1: "Retirar do estoque", subtitle2: "" },
    ]
  },
  {
    title: "3° - Limpeza",
    items: [
      { id: "18", title: "Limpar as bancadas da loja", subtitle1: "Pano e álcool líquido", subtitle2: "" },
      { id: "19", title: "Limpar as mesas e cadeiras do salão", subtitle1: "Pano e álcool líquido", subtitle2: "" },
      { id: "20", title: "Varrer o chão", subtitle1: "Salão dos clientes e parte interna da loja", subtitle2: "" },
      { id: "21", title: "Passar um mope no chão", subtitle1: "Parte interna da loja", subtitle2: "" },
      { id: "90", title: "(SEGUNDA) - Passar um mope no chão no salão dos clientes", subtitle1: "Piso madeirado", subtitle2: "", weekday: 1 },

    ]
  },
  {
    title: "4º - Abertura",
    items: [
      { id: "22", title: "Abastecer vitrine (-4ºC)", subtitle1: "", subtitle2: "" },
      { id: "23", title: "Abrir portas de enrolar", subtitle1: "", subtitle2: "" },
      { id: "24", title: "Abrir janela do salão dos clientes", subtitle1: "", subtitle2: "" },
      { id: "25", title: "Colocar saco pet", subtitle1: "", subtitle2: "" },
      { id: "26", title: "Colocar mesas externas", subtitle1: "", subtitle2: "" },
      { id: "27", title: "Trancar porta de entrada dos funcionários", subtitle1: "Porta de metal do corredor", subtitle2: "" },
      { id: "28", title: "Abrir loja do ifood", subtitle1: "Para abrir a loja basta entrar no app e deixar ele aberto durante o dia", subtitle2: "" },
      { id: "29", title: "Conferir toppings do ifood", subtitle1: "Se algum topping tiver em falta, desligar do ifood", subtitle2: "" },
      { id: "30", title: "Conferir quebras", subtitle1: "Se tiver alguma quebra que pode entrar hoje, já deixe separado", subtitle2: "" },
      {
        id: "91", title: "Realizar Aferição de Mão - Sexta", subtitle1: "", subtitle2: "", new: "19-03-2026", buttonText: "Aferição de Mão",
        buttonLink: "/afericao", weekday: 5,
      },
      {
        id: "92", title: "Realizar Aferição de Mão - Sábado", subtitle1: "", subtitle2: "", new: "19-03-2026", buttonText: "Aferição de Mão",
        buttonLink: "/afericao", weekday: 6,
      },
      {
        id: "93", title: "Realizar Aferição de Mão - Domingo", subtitle1: "", subtitle2: "", new: "19-03-2026", buttonText: "Aferição de Mão",
        buttonLink: "/afericao", weekday: 0,
      },

    ]
  }
];

export const checklistFechamentoSteps = [
  {
    title: `1ª Pré Fechamento - 
    Horários: (18:00 ~ 18:45)`,
    items: [
      { id: "1", title: "Limpar espátulas", subtitle1: "Lavar com água e sabão", subtitle2: "" },
      { id: "2", title: "Limpar cubas", subtitle1: "Sempre pegar um pano limpo", subtitle2: "" },
      { id: "3", title: "Limpar todos os utensílios do café", subtitle1: "Limpar com água e sabão", subtitle2: "" },
      { id: "4", title: "Limpar bancada dos salgados", subtitle1: "", subtitle2: "" },
      { id: "5", title: "Limpar máquina de café (simples)", subtitle1: "", subtitle2: "" },
      { id: "6", title: "Conferir estoque de cubas", subtitle1: "Revisar Estoque e garantir que o estoque real bate com o estoque do sistema", subtitle2: "Atualizar o estoque com as entradas e saídas do dia seguinte" },
      { id: "7", title: "Foto das frutas", subtitle1: "Enviar uma foto das frutas na loja no grupo do whatsapp da loja", subtitle2: "" }
    ]
  },
  {
    title: `2ª Pré Fechamento - Horários: (18:45 ~ 19:00)`,
    items: [
      { id: "8", title: "Recolher mesas externas", subtitle1: "Caso tenha clientes sentados, aguardar", subtitle2: "" },
      { id: "9", title: "Fechar janela do salão dos clientes", subtitle1: "Caso tenha clientes sentados, aguardar", subtitle2: "" },
      { id: "10", title: "Recolher saco pet e bebedouro do cachorro", subtitle1: "", subtitle2: "" },
      { id: "11", title: "Colocar para carregar tablet e máquininha POS", subtitle1: "", subtitle2: "" },
      { id: "12", title: "Limpar mesas e cadeiras do salão dos clientes", subtitle1: "", subtitle2: "" },
    ]
  },
  {
    title: "3ª Fechamento (19:00)",
    items: [
      { id: "13", title: "Fechar as portas de enrolar", subtitle1: "", subtitle2: "" },
      { id: "14", title: "Guardar cubas da vitrine no freezer", subtitle1: "", subtitle2: "" },
      { id: "15", title: "Desligar a vitrine", subtitle1: "Utilizar o controlador", subtitle2: "" },
      { id: "16", title: "Desligar a máquina de café e moedor", subtitle1: "", subtitle2: "" },
      { id: "17", title: "Desligar tela do tablet", subtitle1: "", subtitle2: "" },
      { id: "18", title: "Retirar todos os lixos", subtitle1: "Lixos internos, externos, banheiro e salão dos clientes", subtitle2: "" },
      { id: "19", title: "(DOMINGO) - Hoje não passa caminhão do lixo, deixar os lixos no corredor", subtitle1: "", subtitle2: "", weekday: 0 },
      { id: "20", title: "Fechar caixa no PDV", subtitle1: "", subtitle2: "" },
      { id: "21", title: "Esvaziar água do balde das espátulas", subtitle1: "", subtitle2: "" },
      { id: "22", title: "Fechar pote de casquinhas", subtitle1: "", subtitle2: "" },


    ]
  },
  {
    title: "4ª Inventário",
    items: [

    ]
  },
  {
    title: "4ª Finalização e Limpeza",
    items: [
      { id: "23", title: "Secar pia", subtitle1: "", subtitle2: "" },
      { id: "24", title: "Descartar panos", subtitle1: "Descartar no balde de panos", subtitle2: "" },
      { id: "25", title: "Conferir geladeira", subtitle1: "Garantir que não sobrou nenuma cuba ou quebra lá dentro", subtitle2: "" },
      { id: "26", title: "Conferir freezer, geladeira e friobar", subtitle1: "Garantir que estão bem fechados", subtitle2: "" },
      { id: "27", title: "Varrer o chão", subtitle1: "Salão dos clientes e parte interna da loja", subtitle2: "" },
      { id: "28", title: "Passar um mope no chão", subtitle1: "Parte interna da loja", subtitle2: "" },
      { id: "29", title: "Esvaziar mope", subtitle1: "Não deixar ele cheio a noite inteira", subtitle2: "" },
      { id: "30", title: "Apagar todas as luzes", subtitle1: "", subtitle2: "" },
      { id: "31", title: "Apagar as luzes dos freezers", subtitle1: "", subtitle2: "" },
      { id: "32", title: "Desligar computador", subtitle1: "", subtitle2: "" }
    ]
  }
];
