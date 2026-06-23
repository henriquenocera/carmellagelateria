-- Atualiza o valor de venda unitário para todos os sabores de gelato
UPDATE cadastro_produtos SET preco_venda = 133 WHERE is_sabor = true;

-- Atualiza o valor de venda food service para sabores específicos
UPDATE cadastro_produtos SET preco_venda_food_service = 44.00 WHERE TRIM(nome) = 'Abacaxi com Hortelã';
UPDATE cadastro_produtos SET preco_venda_food_service = 53.00 WHERE TRIM(nome) = 'Frutas Vermelhas';
UPDATE cadastro_produtos SET preco_venda_food_service = 43.10 WHERE TRIM(nome) = 'Maracujá';
UPDATE cadastro_produtos SET preco_venda_food_service = 40.00 WHERE TRIM(nome) = 'Morango';
UPDATE cadastro_produtos SET preco_venda_food_service = 36.25 WHERE TRIM(nome) = 'Limão Siciliano';
UPDATE cadastro_produtos SET preco_venda_food_service = 31.30 WHERE TRIM(nome) = 'Limão Tahiti';
UPDATE cadastro_produtos SET preco_venda_food_service = 38.00 WHERE TRIM(nome) = 'Uva';
UPDATE cadastro_produtos SET preco_venda_food_service = 40.50 WHERE TRIM(nome) = 'Fior de Latte';
UPDATE cadastro_produtos SET preco_venda_food_service = 42.50 WHERE TRIM(nome) = 'Baunilha';
UPDATE cadastro_produtos SET preco_venda_food_service = 41.40 WHERE TRIM(nome) = 'Iogurte';
UPDATE cadastro_produtos SET preco_venda_food_service = 43.25 WHERE TRIM(nome) = 'Coco';
UPDATE cadastro_produtos SET preco_venda_food_service = 42.00 WHERE TRIM(nome) = 'Cocada';
UPDATE cadastro_produtos SET preco_venda_food_service = 43.40 WHERE TRIM(nome) = 'Caramelo Salgado';
UPDATE cadastro_produtos SET preco_venda_food_service = 45.60 WHERE TRIM(nome) = 'Doce de Leite';
UPDATE cadastro_produtos SET preco_venda_food_service = 39.60 WHERE TRIM(nome) = 'Banana (com Leite)';
UPDATE cadastro_produtos SET preco_venda_food_service = 41.40 WHERE TRIM(nome) = 'Milho Verde';
UPDATE cadastro_produtos SET preco_venda_food_service = 57.90 WHERE TRIM(nome) = 'Chocolate Branco';
UPDATE cadastro_produtos SET preco_venda_food_service = 43.00 WHERE TRIM(nome) = 'Chocolate';
UPDATE cadastro_produtos SET preco_venda_food_service = 42.40 WHERE TRIM(nome) = 'Café';
UPDATE cadastro_produtos SET preco_venda_food_service = 71.40 WHERE TRIM(nome) = 'Pistache';
UPDATE cadastro_produtos SET preco_venda_food_service = 48.90 WHERE TRIM(nome) = 'Castanha do Pará';
UPDATE cadastro_produtos SET preco_venda_food_service = 50.20 WHERE TRIM(nome) = 'Nozes Pecan';
UPDATE cadastro_produtos SET preco_venda_food_service = 43.40 WHERE TRIM(nome) = 'Paçoca';
UPDATE cadastro_produtos SET preco_venda_food_service = 43.30 WHERE TRIM(nome) = 'Stracciatella';
UPDATE cadastro_produtos SET preco_venda_food_service = 45.40 WHERE TRIM(nome) = 'Don Vitto';
UPDATE cadastro_produtos SET preco_venda_food_service = 44.40 WHERE TRIM(nome) = 'Torta Belga';
UPDATE cadastro_produtos SET preco_venda_food_service = 46.00 WHERE TRIM(nome) = 'Leite Ninho com Nutella';
UPDATE cadastro_produtos SET preco_venda_food_service = 44.00 WHERE TRIM(nome) = 'Leite Condensado com Morango';
UPDATE cadastro_produtos SET preco_venda_food_service = 45.50 WHERE TRIM(nome) = 'Cheesecake de Framboesa';
UPDATE cadastro_produtos SET preco_venda_food_service = 43.40 WHERE TRIM(nome) = 'Romeu e Julieta';
UPDATE cadastro_produtos SET preco_venda_food_service = 43.40 WHERE TRIM(nome) = 'Banoffe';
UPDATE cadastro_produtos SET preco_venda_food_service = 50.00 WHERE TRIM(nome) = 'Hortelã com Chocolate';
UPDATE cadastro_produtos SET preco_venda_food_service = 47.70 WHERE TRIM(nome) = 'Iogurte com Amarena';
