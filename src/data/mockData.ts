import type { CardItem, ColumnData } from '../types';

export const COLUMNS: ColumnData[] = [
  { id: 'freezer-estoque', title: 'Freezer Estoque', maxCapacity: 18 },
  { id: 'freezer-uso', title: 'Freezer Uso', maxCapacity: 12 },
  { id: 'vitrine-atual', title: 'Vitrine Atual', maxCapacity: 16 },
];

export const INITIAL_CARDS: CardItem[] = [
  // Freezer Estoque
  { id: '1', title: 'Baunilha', status: 'freezer-estoque', startedAt: '9 de abr.' },
  { id: '2', title: 'Chocolate', status: 'freezer-estoque', startedAt: '16 de abr.' },
  { id: '3', title: 'Pistache', status: 'freezer-estoque', startedAt: '14 de abr.' },
  { id: '4', title: 'Limão', status: 'freezer-estoque', startedAt: '17 de abr.' },
  { id: '5', title: 'Maracujá', status: 'freezer-estoque', startedAt: '4 de abr.' },
  { id: '6', title: 'Dolce Mocha', status: 'freezer-estoque', startedAt: '17 de abr.' },
  { id: '7', title: 'Stracciatella', status: 'freezer-estoque', startedAt: '8 de abr.' },
  { id: '8', title: 'Romeu e Julieta', status: 'freezer-estoque', startedAt: '9 de abr.' },
  { id: '9', title: 'Doce de Leite', status: 'freezer-estoque', startedAt: '8 de abr.' },

  // Freezer Uso
  { id: '10', title: 'Coco com doce de leite', status: 'freezer-uso', startedAt: '25 de mar.' },
  { id: '11', title: 'Leite Condensado com Morango', status: 'freezer-uso', startedAt: '8 de abr.' },
  { id: '12', title: 'Lemon Pie', status: 'freezer-uso', startedAt: '8 de abr.' },
  { id: '13', title: 'Paçoca com chocolate', status: 'freezer-uso', startedAt: '8 de abr.' },
  { id: '14', title: 'Chocolate Branco com Maracujá', status: 'freezer-uso', startedAt: '28 de mar.' },
  { id: '15', title: 'Banoffee', status: 'freezer-uso', startedAt: '6 de abr.' },
  { id: '16', title: 'Morango', status: 'freezer-uso', startedAt: '4 de abr.' },
  { id: '17', title: 'Abacaxi com Hortelã e Gengibre', status: 'freezer-uso', startedAt: '4 de abr.' },
  { id: '18', title: 'Ninho com Nutella', status: 'freezer-uso', startedAt: '9 de abr.' },

  // Vitrine Atual
  { id: '19', title: 'Baunilha', status: 'vitrine-atual', startedAt: '9 de abr.', endedAt: '19 de abr.' },
  { id: '20', title: 'Pistache', status: 'vitrine-atual', startedAt: '14 de abr.', endedAt: '19 de abr.' },
  { id: '21', title: 'Chocolate', status: 'vitrine-atual', startedAt: '16 de abr.', endedAt: '19 de abr.' },
  { id: '22', title: 'Milho Verde', status: 'vitrine-atual', startedAt: '8 de abr.', endedAt: '19 de abr.' },
  { id: '23', title: 'Maracujá', status: 'vitrine-atual', startedAt: '4 de abr.', endedAt: '19 de abr.' },
  { id: '24', title: 'Kinder', status: 'vitrine-atual', startedAt: '10 de abr.', endedAt: '19 de abr.' },
  { id: '25', title: 'Café', status: 'vitrine-atual', startedAt: '16 de abr.', endedAt: '19 de abr.' },
  { id: '26', title: 'Coco Diet', status: 'vitrine-atual', startedAt: '9 de abr.', endedAt: '19 de abr.' },
  { id: '27', title: 'Stracciatela', status: 'vitrine-atual', startedAt: '24 de mar.', endedAt: '16 de abr.' },
];
