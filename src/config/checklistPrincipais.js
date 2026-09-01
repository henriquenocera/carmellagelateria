// Checklist de Tarefas Principais da Loja (Abertura e Fechamento)
// Edite este arquivo para adicionar, remover ou alterar as principais tarefas do checklist.

export const checklistPrincipaisAbertura = [
  {
    title: "1ª - Equipamentos",
    items: [
      { id: "p_money", title: "Contagem de Notas e Moedas do Malote", subtitle1: "Preencha os valores abaixo" },
      { id: "p1", title: "Luz da Vitrine Acessa", subtitle1: ""},
      { id: "p2", title: "Máquina de café Ligada", subtitle1: "" },
    ]
  },
  {
    title: "2ª - Organização",
    items: [
      { id: "p6", title: "Relatório dos Salgados Atualizado", subtitle1: "" },
      { id: "p7", title: "Todos os Sacos de lixos colocados", subtitle1: "" },
    ]
  },
  {
    title: "3ª - Limpeza",
    items: [
      { id: "p3", title: "Banheiro dos Clientes Limpo", subtitle1: "" },
    ]
  },
  {
    title: "4ª - Abertura",
    items: [
      { id: "p8", title: "Loja do Ifood aberta", subtitle1: "" },
      { id: "p9", title: "Loja do 99 aberta", subtitle1: "" },
      { id: "p10", title: "Conferir Sabores dos Gelatos no Ifood", subtitle1: "" },
      { id: "p11", title: "Porta dos Funcionários Fechada e Trancada", subtitle1: "" },
      { id: "p12", title: "Cavalete na frente da Loja", subtitle1: "" },
      { id: "p17", title: "Conferir Sistema de Cubas - Atualizado", subtitle1: "" },

    ]
  }
];

export const checklistPrincipaisFechamento = [

  {
    title: "1ª - Fechamento (19:00)",
    items: [
      { id: "pf7", title: "Cavalete Recolhido", subtitle1: "" },
      { id: "pf71", title: "Portão Preto Fechado e Trancado", subtitle1: "" },
      { id: "pf3", title: "Recolher Cadeiras do Gramado", subtitle1: "" },
      { id: "pf70", title: "Recolher Sacos de Lixos", subtitle1: "" },
      { id: "pf6", title: "Porta do salão dos clientes Trancada", subtitle1: "Caso não tenha clientes no salão" },
      { id: "pf1", title: "Foto das Frutas", subtitle1: "" },
      { id: "pf2", title: "Conferir Sistema de Cubas - Atualizado", subtitle1: "" },
      { id: "pf11", title: "Pote de Casquinha fechado", subtitle1: "" },
      { id: "pf8", title: "Máquina de Café Desligada", subtitle1: "" },
      { id: "pf9", title: "Máquininha de Cartão Carregando", subtitle1: "" },
      { id: "pf12", title: "Travas Internas das 3 portas", subtitle1: "" },
      { id: "pf10", title: "Conferir Geladeira", subtitle1: "Se não sobrou nenhuma cuba" },
      { id: "pf5", title: "Janela da Sala dos Funcionários", subtitle1: "" },
    ]
  },
  {
    title: "2ª - Inventário",
    items: [
      { id: "pf_waffles", title: "Inventário de Waffles", subtitle1: "Informe as quantidades e datas de vencimento" },
      { id: "pf_brownies", title: "Inventário de Brownies", subtitle1: "Informe as quantidades e datas de vencimento" },
      { id: "pf_panos", title: "Contagem de Panos", subtitle1: "Informe a quantidade total de panos" }
    ]
  }
];
