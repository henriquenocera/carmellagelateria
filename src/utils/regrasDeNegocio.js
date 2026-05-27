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
        tipo: 'erro',
        titulo: 'Excesso na Vitrine - Ahú',
        mensagem: `A vitrine está com ${estoque.ahu.vitrine} cubas expostas. O limite máximo da loja Ahú é de ${regras.ahu.maxVitrine} cubas.`
      });
    } else if (estoque.ahu.vitrine < regras.ahu.maxVitrine) {
      // Regra 2: Vitrine abaixo do máximo
      notificacoes.push({
        id: 'ahu-vitrine-baixa',
        tipo: 'info',
        titulo: 'Espaço na Vitrine - Ahú',
        mensagem: `A vitrine está com ${estoque.ahu.vitrine} cubas expostas. Há espaço para mais ${regras.ahu.maxVitrine - estoque.ahu.vitrine} cubas (O limite é ${regras.ahu.maxVitrine}).`
      });
    }

    // Regra 2: Quantidade total de cubas menor que o estipulado
    if (totalAhu < regras.ahu.minTotal) {
      notificacoes.push({
        id: 'ahu-estoque-baixo',
        tipo: 'aviso',
        titulo: 'Estoque Baixo de Cubas - Ahú',
        mensagem: `Atenção: A loja Ahú está com apenas ${totalAhu} cubas no total (Vitrine + Freezer). O mínimo de segurança é ${regras.ahu.minTotal} cubas.`
      });
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
        tipo: 'erro',
        titulo: 'Excesso na Vitrine - Alto da XV',
        mensagem: `A vitrine está com ${estoque.altoxv.vitrine} cubas expostas. O limite máximo do Alto da XV é de ${regras.altoxv.maxVitrine} cubas.`
      });
    } else if (estoque.altoxv.vitrine < regras.altoxv.maxVitrine) {
      // Regra 2: Vitrine abaixo do máximo
      notificacoes.push({
        id: 'altoxv-vitrine-baixa',
        tipo: 'info',
        titulo: 'Espaço na Vitrine - Alto da XV',
        mensagem: `A vitrine está com ${estoque.altoxv.vitrine} cubas expostas. Há espaço para mais ${regras.altoxv.maxVitrine - estoque.altoxv.vitrine} cubas (O limite é ${regras.altoxv.maxVitrine}).`
      });
    }

    // Regra 2: Quantidade total de cubas menor que o estipulado
    if (totalXv < regras.altoxv.minTotal) {
      notificacoes.push({
        id: 'altoxv-estoque-baixo',
        tipo: 'aviso',
        titulo: 'Estoque Baixo de Cubas - Alto da XV',
        mensagem: `Atenção: A loja Alto da XV está com apenas ${totalXv} cubas no total (Vitrine + Freezer). O mínimo de segurança é ${regras.altoxv.minTotal} cubas.`
      });
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
