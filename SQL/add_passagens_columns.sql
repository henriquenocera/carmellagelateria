-- Script SQL para adicionar as colunas "passagens_urbs" e "passagens_metrocard" na tabela "profiles"
-- Execute esta linha no SQL Editor do seu Supabase:

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS passagens_urbs integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS passagens_metrocard integer DEFAULT 0;
