-- Script SQL para adicionar as colunas de observação na tabela "frequencia"
-- Execute esta linha no SQL Editor do seu Supabase:

ALTER TABLE public.frequencia ADD COLUMN IF NOT EXISTS observacao text;
ALTER TABLE public.frequencia ADD COLUMN IF NOT EXISTS observacao_by uuid REFERENCES public.profiles(id);
ALTER TABLE public.frequencia ADD COLUMN IF NOT EXISTS observacao_at timestamp with time zone;
