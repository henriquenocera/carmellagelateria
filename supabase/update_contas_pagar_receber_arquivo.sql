-- 1. Adicionar coluna arquivo_url na tabela contas_pagar_receber
ALTER TABLE public.contas_pagar_receber ADD COLUMN IF NOT EXISTS arquivo_url text;

-- 2. Criar bucket 'comprovantes' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('comprovantes', 'comprovantes', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas de segurança do Storage para o bucket 'comprovantes'
-- Caso já existam, utilizamos CREATE POLICY IF NOT EXISTS ou simplesmente DROP/CREATE para garantir a permissão de leitura, escrita e exclusão.
DROP POLICY IF EXISTS "Permitir leitura de comprovantes para autenticados" ON storage.objects;
CREATE POLICY "Permitir leitura de comprovantes para autenticados" ON storage.objects
    FOR SELECT TO authenticated USING (bucket_id = 'comprovantes');

DROP POLICY IF EXISTS "Permitir upload de comprovantes para autenticados" ON storage.objects;
CREATE POLICY "Permitir upload de comprovantes para autenticados" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'comprovantes');

DROP POLICY IF EXISTS "Permitir exclusão de comprovantes para autenticados" ON storage.objects;
CREATE POLICY "Permitir exclusão de comprovantes para autenticados" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'comprovantes');
