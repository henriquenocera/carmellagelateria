ALTER TABLE conciliacao_vendas
ADD COLUMN IF NOT EXISTS pix_cloudfy_importado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cartao_cloudfy_importado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS caixa_cloudfy_importado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ifood_cloudfy_importado BOOLEAN DEFAULT false;
