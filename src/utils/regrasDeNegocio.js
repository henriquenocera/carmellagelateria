export const avaliarRegrasDeNegocio = (dados) => {
  const notificacoes = [];

  if (!dados) return notificacoes;

  const { estoque, checklists } = dados;

  const extrairNumero = (valorString) => {
    if (!valorString) return 0;
    const match = String(valorString).trim().match(/^\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Definição dos limites para cada loja
  const regras = {
    ahu: {
      nome: 'Ahú',
      maxVitrine: 16,
      minTotal: 22
    },
    altoxv: {
      nome: 'Alto da XV',
      maxVitrine: 12,
      minTotal: 18
    }
  };

  // ---- Loja Ahú ----
  if (estoque.ahu) {
    const totalAhu = estoque.ahu.vitrine + estoque.ahu.estoque;

    // Regra 1: Vitrine acima do máximo
    if (estoque.ahu.vitrine > regras.ahu.maxVitrine) {
      notificacoes.push({
        id: 'ahu-vitrine-alta',
        tipo: 'aviso',
        titulo: 'Excesso na Vitrine - Ahú',
        mensagem: `A vitrine está com ${estoque.ahu.vitrine} cubas expostas. O limite máximo da loja Ahú é de ${regras.ahu.maxVitrine} cubas.`
      });
    } else if (estoque.ahu.vitrine < regras.ahu.maxVitrine) {
      // Regra 2: Vitrine abaixo do máximo
      notificacoes.push({
        id: 'ahu-vitrine-baixa',
        tipo: 'aviso',
        titulo: 'Vitrine Baixa - Ahú',
        mensagem: `A vitrine está com ${estoque.ahu.vitrine} cubas expostas. Há espaço para mais ${regras.ahu.maxVitrine - estoque.ahu.vitrine} cubas (O limite é ${regras.ahu.maxVitrine}).`
      });
    }

    // Regra 2: Quantidade total de cubas menor que o estipulado
    if (totalAhu < regras.ahu.minTotal) {
      notificacoes.push({
        id: 'ahu-estoque-baixo',
        tipo: 'erro',
        titulo: 'Estoque Baixo de Cubas - Ahú',
        mensagem: `Atenção: A loja Ahú está com apenas ${totalAhu} cubas no total (Vitrine + Freezer). O mínimo de segurança é ${regras.ahu.minTotal} cubas.`
      });
    }

    if (estoque.ahu.itensVitrine) {
      // Regra 3: Sabor obrigatório (Chocolate)
      const temChocolate = estoque.ahu.itensVitrine.includes('chocolate');
      if (!temChocolate) {
        notificacoes.push({
          id: 'ahu-falta-chocolate',
          tipo: 'aviso',
          titulo: 'Falta de Chocolate na Vitrine - Ahú',
          mensagem: 'O sabor Chocolate é obrigatório e não está presente na vitrine da loja Ahú.'
        });
      }

      // Regra 4: Sabor obrigatório (Baunilha)
      const temBaunilha = estoque.ahu.itensVitrine.includes('baunilha');
      if (!temBaunilha) {
        notificacoes.push({
          id: 'ahu-falta-baunilha',
          tipo: 'aviso',
          titulo: 'Falta de Baunilha na Vitrine - Ahú',
          mensagem: 'O sabor Baunilha é obrigatório e não está presente na vitrine da loja Ahú.'
        });
      }
    }

    if (estoque.ahu.itensEstoque) {
      // Regra 5: Reserva obrigatória no Freezer (Chocolate)
      const temChocolateFreezer = estoque.ahu.itensEstoque.includes('chocolate');
      if (!temChocolateFreezer) {
        notificacoes.push({
          id: 'ahu-falta-chocolate-freezer',
          tipo: 'aviso',
          titulo: 'Falta de Chocolate no Freezer - Ahú',
          mensagem: 'O sabor Chocolate precisa ter pelo menos 1 cuba de reserva no freezer da loja Ahú.'
        });
      }

      // Regra 6: Reserva obrigatória no Freezer (Baunilha)
      const temBaunilhaFreezer = estoque.ahu.itensEstoque.includes('baunilha');
      if (!temBaunilhaFreezer) {
        notificacoes.push({
          id: 'ahu-falta-baunilha-freezer',
          tipo: 'aviso',
          titulo: 'Falta de Baunilha no Freezer - Ahú',
          mensagem: 'O sabor Baunilha precisa ter pelo menos 1 cuba de reserva no freezer da loja Ahú.'
        });
      }
    }
  }

  // Regras de Checklist - Loja Ahú
  if (checklists && checklists.ahu) {
    const numMassas = extrairNumero(checklists.ahu.massas);
    const numBrownies = extrairNumero(checklists.ahu.brownies);

    if (numMassas < 5) {
      notificacoes.push({
        id: 'ahu-massas-baixo',
        tipo: 'erro',
        titulo: `Falta de Waffles - Ahú (${numMassas} un.)`
      });
    }

    if (numBrownies < 6) {
      notificacoes.push({
        id: 'ahu-brownies-baixo',
        tipo: 'erro',
        titulo: `Falta de Brownies - Ahú (${numBrownies} un.)`
      });
    }
  }

  // ---- Loja Alto da XV ----
  if (estoque.altoxv) {
    const totalXv = estoque.altoxv.vitrine + estoque.altoxv.estoque;

    // Regra 1: Vitrine acima do máximo
    if (estoque.altoxv.vitrine > regras.altoxv.maxVitrine) {
      notificacoes.push({
        id: 'altoxv-vitrine-alta',
        tipo: 'aviso',
        titulo: 'Excesso na Vitrine - Alto da XV',
        mensagem: `A vitrine está com ${estoque.altoxv.vitrine} cubas expostas. O limite máximo do Alto da XV é de ${regras.altoxv.maxVitrine} cubas.`
      });
    } else if (estoque.altoxv.vitrine < regras.altoxv.maxVitrine) {
      // Regra 2: Vitrine abaixo do máximo
      notificacoes.push({
        id: 'altoxv-vitrine-baixa',
        tipo: 'aviso',
        titulo: 'Vitrine Baixa - Alto da XV',
        mensagem: `A vitrine está com ${estoque.altoxv.vitrine} cubas expostas. Há espaço para mais ${regras.altoxv.maxVitrine - estoque.altoxv.vitrine} cubas (O limite é ${regras.altoxv.maxVitrine}).`
      });
    }

    // Regra 2: Quantidade total de cubas menor que o estipulado
    if (totalXv < regras.altoxv.minTotal) {
      notificacoes.push({
        id: 'altoxv-estoque-baixo',
        tipo: 'erro',
        titulo: 'Estoque Baixo de Cubas - Alto da XV',
        mensagem: `Atenção: A loja Alto da XV está com apenas ${totalXv} cubas no total (Vitrine + Freezer). O mínimo de segurança é ${regras.altoxv.minTotal} cubas.`
      });
    }

    if (estoque.altoxv.itensVitrine) {
      // Regra 3: Sabor obrigatório (Chocolate)
      const temChocolate = estoque.altoxv.itensVitrine.includes('chocolate');
      if (!temChocolate) {
        notificacoes.push({
          id: 'altoxv-falta-chocolate',
          tipo: 'aviso',
          titulo: 'Falta de Chocolate na Vitrine - Alto da XV',
          mensagem: 'O sabor Chocolate é obrigatório e não está presente na vitrine da loja Alto da XV.'
        });
      }

      // Regra 4: Sabor obrigatório (Baunilha)
      const temBaunilha = estoque.altoxv.itensVitrine.includes('baunilha');
      if (!temBaunilha) {
        notificacoes.push({
          id: 'altoxv-falta-baunilha',
          tipo: 'aviso',
          titulo: 'Falta de Baunilha na Vitrine - Alto da XV',
          mensagem: 'O sabor Baunilha é obrigatório e não está presente na vitrine da loja Alto da XV.'
        });
      }
    }

    if (estoque.altoxv.itensEstoque) {
      // Regra 5: Reserva obrigatória no Freezer (Chocolate)
      const temChocolateFreezer = estoque.altoxv.itensEstoque.includes('chocolate');
      if (!temChocolateFreezer) {
        notificacoes.push({
          id: 'altoxv-falta-chocolate-freezer',
          tipo: 'aviso',
          titulo: 'Falta de Chocolate no Freezer - Alto da XV',
          mensagem: 'O sabor Chocolate precisa ter pelo menos 1 cuba de reserva no freezer da loja Alto da XV.'
        });
      }

      // Regra 6: Reserva obrigatória no Freezer (Baunilha)
      const temBaunilhaFreezer = estoque.altoxv.itensEstoque.includes('baunilha');
      if (!temBaunilhaFreezer) {
        notificacoes.push({
          id: 'altoxv-falta-baunilha-freezer',
          tipo: 'aviso',
          titulo: 'Falta de Baunilha no Freezer - Alto da XV',
          mensagem: 'O sabor Baunilha precisa ter pelo menos 1 cuba de reserva no freezer da loja Alto da XV.'
        });
      }
    }
  }

  // Regras de Checklist - Loja Alto da XV
  if (checklists && checklists.altoxv) {
    const numMassas = extrairNumero(checklists.altoxv.massas);
    const numBrownies = extrairNumero(checklists.altoxv.brownies);

    if (numMassas < 5) {
      notificacoes.push({
        id: 'altoxv-massas-baixo',
        tipo: 'erro',
        titulo: `Falta de Waffles - Alto da XV (${numMassas} un.)`
      });
    }

    if (numBrownies < 6) {
      notificacoes.push({
        id: 'altoxv-brownies-baixo',
        tipo: 'erro',
        titulo: `Falta de Brownies - Alto da XV (${numBrownies} un.)`
      });
    }
  }

  return notificacoes;
};
