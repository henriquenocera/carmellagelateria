-- Script SQL para adicionar a coluna "folgas_fixas" na tabela "profiles"
-- Execute esta linha no SQL Editor do seu Supabase:

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS folgas_fixas text DEFAULT '';
