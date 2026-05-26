-- Script SQL para adicionar a coluna "controlar_frequencia" na tabela "profiles"
-- Execute esta linha no SQL Editor do seu Supabase:

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS controlar_frequencia boolean DEFAULT true;

-- Atualizar os registros existentes para true (caso o default não seja aplicado retroativamente dependendo da sua versão do Postgres)
UPDATE public.profiles SET controlar_frequencia = true WHERE controlar_frequencia IS NULL;
