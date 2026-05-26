-- Script SQL para adicionar a coluna "data_registro" na tabela "profiles"
-- Execute esta linha no SQL Editor do seu Supabase:

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS data_registro date;
