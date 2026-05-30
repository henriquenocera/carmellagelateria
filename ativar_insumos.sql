-- Script para definir todos os insumos como ativos nas unidades mh, ahu e altoxv

UPDATE public.cadastro_insumos
SET config_estoque = '{
  "mh": {
    "ativo": true
  },
  "ahu": {
    "ativo": true
  },
  "altoxv": {
    "ativo": true
  }
}'::jsonb;
