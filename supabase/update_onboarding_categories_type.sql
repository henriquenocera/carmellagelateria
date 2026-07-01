-- Comando para alterar a tabela onboarding_categories existente e adicionar a coluna 'type'
ALTER TABLE public.onboarding_categories 
ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'checklist' CHECK (type IN ('checklist', 'text'));
