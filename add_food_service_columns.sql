ALTER TABLE pedidos_food_service
ADD COLUMN IF NOT EXISTS quantidade_produzida numeric,
ADD COLUMN IF NOT EXISTS data_entrega date;
