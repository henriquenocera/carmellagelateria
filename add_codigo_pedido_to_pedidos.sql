-- Adiciona a coluna codigo_pedido na tabela pedidos_food_service
ALTER TABLE pedidos_food_service 
ADD COLUMN IF NOT EXISTS codigo_pedido TEXT;
