-- Adiciona a coluna user_id na tabela entradas_mercadoria caso ela não exista
ALTER TABLE public.entradas_mercadoria 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Para que a gente consiga buscar o nome do usuário através da view/table "profiles"
-- certifique-se de que a relação já existe. Caso não exista uma foreign key de user_id 
-- para public.profiles (se você usar public.profiles ao invés de auth.users), a API do Supabase resolve isso automaticamente se houver a referência para auth.users e profile tem o mesmo id.
