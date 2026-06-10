export const manualData = [
  {
    id: "operacional",
    title: "Operacional",
    icon: "⚙️",
    categories: [
      {
        id: "sistema-pdv",
        title: "Sistema PDV",
        icon: "📋",
        products: [
          {
            id: 100,
            name: "Abertura de Loja",
            portions: [
              {
                size: "Checklist de Abertura",
                description: "Tarefas para iniciar o dia",
                container: "Uso interno",
                steps: [
                  "1. Ligar as luzes e o ar condicionado",
                  "2. Ligar a máquina de café espresso",
                  "3. Verificar a temperatura da vitrine de gelatos (-12ºC a -15ºC)",
                  "4. Conferir o fundo de caixa e iniciar o PDV",
                  "5. Preparar a vitrine (alinhar as cubas e limpar os vidros)",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "produtos",
    title: "Produtos",
    icon: "🛍️",
    categories: [
      {
        id: "medidas",
        title: "Gelatos",
        icon: "🍦",
        products: [
          {
            id: 1,
            name: "Porção Espátula",
            portions: [
              {
                size: "Porção padrão da espátula",
                grams: 70,
                description: "porção padrão",
              },
            ],
          },
          {
            id: 2,
            name: "Gelatos",
            portions: [
              {
                size: "Pequeno",
                grams: 120,
                description: "1 Sabor",
                container: "- Copo pequeno 80ml \n- Casquinha Pequena",
                finishedImage: "/images/manual/pequeno.png",
                preparationMedia: { type: "video", url: "/images/manual/servir-sorvete.mp4" },
                steps: [
                  "Pegar o copo pequeno e encher até o topo (~90gr), depois completar com mais meia porção (~30gr)",
                  "Preencher a casquina pequena com sorvete (~20gr), depois pegar 1 porção e meia (~100gr) e completar por cima",
                ],
              },
              {
                size: "Médio",
                grams: 140,
                description: "até 2 sabores",
                container: "- Copo pequeno 80ml \n- Cascão Grande",
                finishedImage: "/images/manual/copo-medio.jpg",
                preparationMedia: { type: "video", url: "/images/manual/servir-sorvete.mp4" },
                steps: [
                  "Pegar o copo pequeno e preencher com 2 porções padrão de 70gr cada, uma de cada lado do potinho para manter os sabores um ao lado do outro",
                  "Pegar o cascão e preencher com 2 porções padrão de 70gr cada, um por baixo e outra por cima",
                ],
              },
              {
                size: "Grande",
                grams: 210,
                description: "até 3 sabores",
                container: "- Copo grande 120ml \n- Cascão Grande",
                finishedImage: "/images/manual/copo-grande.jpg",
                preparationMedia: { type: "video", url: "/images/manual/servir-sorvete.mp4" },
                steps: [
                  "Pegar o copo grande e preencher com 3 porções padrão de 70gr cada, uma de cada lado do potinho divido em 3",
                  "Pegar o cascão e preencher com 3 porções padrão de 70gr cada, um por baixo e as outras 2 por cima lado a lado",
                ],
              },
              {
                size: "Pote 480ml",
                grams: 400,
                description: "até 2 sabores",
                container: "Pote 480ml",
                finishedImage: "/images/manual/copo-grande.jpg",
                steps: [
                  "Pegar o pote de 480ml e servir uma porção de cada lado",
                  "Entregar ao cliente dentro da Sacola",
                ],
              },
              {
                size: "Sorvete do Dog",
                description: "Sorvete de Banana e Beterraba",
                container: "Copo de 100ml descartável",
                finishedImage: "/images/manual/copo-grande.jpg",
                steps: [
                  "Descongelar o balde de 1hr a 2hr",
                  "Porcionar uma bolinha com o boleador mecânico",
                  "Cobrir com um filme plástico cada porção",
                  "Guardar as porções no Freezer",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "waffle",
        title: "Waffle & Brownie",
        icon: "🧇",
        products: [
          {
            id: 3,
            name: "Waffle",
            portions: [
              {
                size: "Waffle de Lìege",
                description: "Waffle belga",
                container: "Prato de cerâmica (comer no local) \nEmbalagem de papel (para levar)",
              },
            ],
            steps: [
              "4mins a 180ºC no forninho",
              "Montagem dos toppings conforme manual impresso na loja",
            ],
          },
          {
            id: 4,
            name: "Brownie",
            portions: [
              {
                size: "Brownie",
                description: "Brownie de Chocolate",
                container: "Prato de cerâmica (comer no local) \nEmbalagem de alumínio (para levar)",
              },
            ],
            steps: [
              "Desenformar da embalagem de alumínio em um prato de cerâmica",
              "Aquecer por 45 segundos no microondas",
              "Servir com uma colher",
              "Caso tenha uma bola de sorvete para acompanhar, servir a bola de sorvete com o boleador em cima do brownie",
              "Finalizar com a calda de chocolate",
            ],
          },
        ],
      },
      {
        id: "sanduiche",
        title: "Sanduíches e Quiches",
        icon: "🥖",
        products: [
          {
            id: 5,
            name: "Sanduíches Baguete",
            portions: [
              {
                size: "Sanduíche",
                description: "Sanduíches congelados",
                container: "Prato de cerâmica (comer no local) \nEmbalagem de papel (para levar)",
              },
            ],
            steps: [
              "Abrir o sanduíche da embalagem plástica e colocar sob uma folha de papel manteiga",
              "Aquecer por 1min e 30seg à 2min no microondas",
              "Aquecer por 3min na Air Fryer a 180º",
              "Cortar o sanduíche ao meio",
              "Retirar o sanduíche do papel manteiga e empratar no prato de cerâmica ou na embalagem de papel",
            ],
          },
          {
            id: 6,
            name: "Quiches",
            portions: [
              {
                size: "Quiches",
                description: "Quiche Congelado",
                container: "Prato de cerâmica (comer no local) \nEmbalagem de alumínio (para levar)",
              },
            ],
            steps: [
              "Abrir o quiche da embalagem plástica e colocar sob uma folha de papel manteiga",
              "Aquecer por 1min e 30seg no microondas",
              "Aquecer por 3min na Air Fryer a 180º",
              "Retirar o quiche do papel manteiga e empratar no prato de cerâmica ou na embalagem de papel",
            ],
          },
        ],
      },
      {
        id: "cafe",
        title: "Cafés",
        icon: "☕",
        products: [
          {
            id: 7,
            name: "Cafés",
            portions: [
              {
                size: "Espresso Simples",
                description: "30ml de espresso",
                container: "- Copo de papel pequeno 110ml \n- Xícara de vidro pequeno",
                steps: [
                  "⚠️ Porta Filtro Simples",
                  "⚠️ Moedor 1 dose",
                  "Extrair 30ml de espresso por 20~30seg",
                ],
              },
              {
                size: "Espresso Duplo",
                description: "60ml de espresso",
                container: "- Copo de papel pequeno 110ml \n- Xícara de vidro pequeno",
                steps: [
                  "⚠️ Porta Filtro Duplo",
                  "⚠️ Moedor 2 doses",
                  "Extrair 60ml de espresso por 20~30seg",
                ],
              },
              {
                size: "Espresso Lungo",
                description: "60ml de espresso",
                container: "- Copo de papel pequeno 110ml \n- Xícara de vidro pequeno",
                steps: [
                  "⚠️ Porta Filtro Simples",
                  "⚠️ Moedor 1 dose",
                  "Extrair 60ml de espresso por 40~60seg em uma dose alongada",
                ],
              },
              {
                size: "Americano / Caricoca",
                description: "30ml de espresso + 30ml de água",
                container: "- Copo de papel pequeno 110ml \n- Xícara de vidro pequeno",
                steps: [
                  "⚠️ Porta Filtro Simples",
                  "⚠️ Moedor 1 dose",
                  "Extrair 30ml de espresso por 20~30seg e completar com 30ml de água quente",
                ],
              },
              {
                size: "Machiato",
                description: "30ml de espresso + Crema do leite",
                container: "- Copo de papel pequeno 110ml \n- Xícara de vidro pequeno",
                steps: [
                  "⚠️ Porta Filtro Simples",
                  "⚠️ Moedor 1 dose",
                  "⚠️ 100ml de Leite",
                  "⚠️ Pitcher Pequeno",
                  "Extrair 30ml de espresso por 20~30seg",
                  "Vaporizar 100ml de leite no Pitcher Pequeno",
                  "Colocar ~3 colheres de espuma do leite em cima da dose de espresso",
                ],
              },
              {
                size: "Espresso com Leite Pequeno",
                description: "30ml de espresso + 30ml de leite",
                container: "- Copo de papel pequeno 110ml \n- Xícara de vidro pequeno",
                steps: [
                  "⚠️ Porta Filtro Simples",
                  "⚠️ Moedor 1 dose",
                  "⚠️ 100ml de Leite",
                  "⚠️ Pitcher Pequeno",
                  "Extrair 30ml de espresso por 20~30seg",
                  "Vaporizar 100ml de leite no Pitcher Pequeno",
                  "Colocar 30ml de leite vaporizado dentro da dose de 30ml de espresso para totalizar 60ml total",
                ],
              },
              {
                size: "Espresso com Leite Grande",
                description: "60ml de espresso + 60ml de leite",
                container: "- Copo de papel pequeno 110ml \n- Xícara de vidro Média",
                steps: [
                  "⚠️ Porta Filtro Duplo",
                  "⚠️ Moedor 2 dose",
                  "⚠️ 100ml de Leite",
                  "⚠️ Pitcher Pequeno",
                  "Extrair 30ml de espresso por 20~30seg",
                  "Vaporizar 100ml de leite no Pitcher Pequeno",
                  "Colocar 60ml de leite vaporizado dentro da dose de 60ml de espresso para totalizar 120ml total",
                ],
              },
              {
                size: "Cappuccino Italiano",
                description: "30ml de espresso + 150ml de leite",
                container: "- Copo de papel Grande 270ml \n- Xícara de Cerâmica Grande",
                steps: [
                  "⚠️ Porta Filtro Simples",
                  "⚠️ Moedor 1 dose",
                  "⚠️ 150ml de Leite",
                  "⚠️ Pitcher Grande",
                  "Extrair 30ml de espresso por 20~30seg",
                  "Vaporizar 150ml de leite no Pitcher Grande",
                  "Adicionar primeiro o leite vaporizado (mais líquido) e em seguida concentrar a espuma no topo da xícara/copo",
                ],
              },
              {
                size: "Cappuccino Brasileiro",
                description: "Mistura adoçada",
                container: "- Copo de papel Grande 270ml \n- Xícara de Cerâmica Grande",
                steps: [
                  "⚠️ 30gr de pó de Cacppuccino",
                  "⚠️ 150ml de Leite",
                  "⚠️ Pitcher Grande",
                  "Misturar o leite com o pó dentro do pitcher e fazer a vaporização",
                ],
              },
              {
                size: "Latte",
                description: "30ml de espresso + 150ml de leite",
                container: "- Copo de papel Grande 270ml \n- Xícara de Cerâmica Grande",
                steps: [
                  "⚠️ Porta Filtro Simples",
                  "⚠️ Moedor 1 dose",
                  "⚠️ 150ml de Leite",
                  "⚠️ Pitcher Grande",
                  "Extrair 30ml de espresso por 20~30seg",
                  "Vaporizar 150ml de leite no Pitcher Grande",
                  "Misturar o leite vaporizado com a crema no Pitcher e adicionar a xicara/copo",
                ],
              },
              {
                size: "Vanilla Latte",
                description: "30ml de espresso + 150ml de leite + 20ml de xarope de Baunilha",
                container: "- Copo de papel Grande 270ml \n- Xícara de Cerâmica Grande",
                steps: [
                  "⚠️ Porta Filtro Simples",
                  "⚠️ Moedor 1 dose",
                  "⚠️ 150ml de Leite",
                  "⚠️ 20ml de Xarope de Baunilha",
                  "⚠️ Pitcher Grande",
                  "Adicionar 20ml de xarope na xícara",
                  "Extrair 30ml de espresso por 20~30seg",
                  "Vaporizar 150ml de leite no Pitcher Grande",
                  "Misturar o leite vaporizado com a crema no Pitcher e adicionar a xicara/copo",
                ],
              },
              {
                size: "Caramel Latte",
                description: "30ml de espresso + 150ml de leite + 20ml de xarope de Caramelo",
                container: "- Copo de papel Grande 270ml \n- Xícara de Cerâmica Grande",
                steps: [
                  "⚠️ Porta Filtro Simples",
                  "⚠️ Moedor 1 dose",
                  "⚠️ 150ml de Leite",
                  "⚠️ 20ml de Xarope de Caramelo",
                  "⚠️ Pitcher Grande",
                  "Adicionar 20ml de xarope na xícara",
                  "Extrair 30ml de espresso por 20~30seg",
                  "Vaporizar 150ml de leite no Pitcher Grande",
                  "Misturar o leite vaporizado com a crema no Pitcher e adicionar a xicara/copo",
                ],
              },
              {
                size: "Mocha",
                description: "30ml de espresso + 150ml de leite + 15gr de cacau em pó",
                container: "- Copo de papel Grande 270ml \n- Xícara de Cerâmica Grande",
                steps: [
                  "⚠️ Porta Filtro Simples",
                  "⚠️ Moedor 1 dose",
                  "⚠️ 150ml de Leite",
                  "⚠️ 15gr de Cacau em pó",
                  "⚠️ Pitcher Grande",
                  "Adicionar 20gr de cacau em pó com água quente na xícara e mecher",
                  "Extrair 30ml de espresso por 20~30seg",
                  "Vaporizar 150ml de leite no Pitcher Grande",
                  "Misturar o leite vaporizado com a crema no Pitcher e adicionar a xicara/copo",
                ],
              },
              {
                size: "Café Passado",
                description: "1 dose de café + água quente",
                container: "- Copo de papel Grande 270ml \n- Xícara de Cerâmica Grande",
                steps: [
                  "⚠️ Moedor 1 dose",
                  "⚠️ 200ml de água quente",
                  "Colocar o filtro de papel no coador sobre a xícara e o copo",
                  "Adicionar uma dose do pó de café no filtro de papel",
                  "Adicionar 200ml de água quente e aguardar ~4min",
                ],
              },
              {
                size: "Café Passado c/ Leite",
                description: "1 dose de café + água quente + leite",
                container: "- Copo de papel Grande 270ml \n- Xícara de Cerâmica Grande",
                steps: [
                  "⚠️ Moedor 1 dose",
                  "⚠️ 100ml de água quente",
                  "⚠️ 100ml de leite",
                  "⚠️ Pitcher Pequeno",
                  "Colocar o filtro de papel no coador sobre a xícara e o copo",
                  "Adicionar uma dose do pó de café no filtro de papel",
                  "Adicionar 100ml de água quente e aguardar ~4min",
                  "Vaporizar 100ml de leite",
                  "Misturar o leite com a crema e adicionar ao café passado",
                ],
              },
              {
                size: "Chocolate Quente",
                description: "Chocolate Cremoso",
                container: "- Copo de papel Grande 270ml \n- Xícara de Cerâmica Grande",
                steps: [
                  "⚠️ 30gr de pó de Chocolate",
                  "⚠️ 150ml de Leite",
                  "⚠️ Pitcher Grande",
                  "Misturar o leite com o pó dentro do pitcher e fazer a vaporização",
                ],
              },
              {
                size: "Chá Quente",
                description: "Chá Quente (Sachê)",
                container: "- Copo de papel Grande 270ml \n- Xícara de Cerâmica Grande",
                steps: [
                  "⚠️ 1 sachê de chá",
                  "⚠️ 200ml de água",
                  "Adicionar o sachê e água quente na xícara / copo e aguardar ~3min",
                ],
              },
              {
                size: "Affogato",
                description: "1 dose de espresso + 1 bola de Gelato",
                container: "Xícara de Cerâmica Grande",
                steps: [
                  "⚠️ 70gr de Gelato (1 bola) servido com o boleador",
                  "⚠️ 1 dose de espresso (30ml)",
                  "Adicionar a bola de Gelato na xícara e tirar uma dose de espresso em cima dela",
                ],
              },
            ],
          },
        ],
      },
    ],
  },

];
