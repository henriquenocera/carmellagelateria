-- ==========================================
-- SCRIPT DE CRIAÇÃO DA TABELA DE PERFIS DE USUÁRIOS
-- Execute este script no SQL Editor do seu painel do Supabase.
-- ==========================================

-- 1. Criação da tabela de perfis vinculada ao auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar o Row Level Security (RLS) para segurança de dados
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Acesso RLS
-- Permite que qualquer usuário autenticado leia as informações (para exibir o nome no Kanban)
CREATE POLICY "Allow read access to profiles for all authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Permite que os usuários atualizem apenas o seu próprio perfil
CREATE POLICY "Allow update access to own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 4. Função e Gatilho para automatizar a criação de novos perfis na criação de usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove o gatilho se ele já existir e cria novamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Sincronizar/Cadastrar usuários já existentes na base de dados (se houver)
INSERT INTO public.profiles (id, email, name)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1))
FROM auth.users
ON CONFLICT (id) DO NOTHING;
