-- Apagar todas as contas cadastradas
DELETE FROM contas;

-- Inserir as novas contas
INSERT INTO contas (descricao, agencia, conta_corrente, banco, cnpj, ativo) VALUES
('Caixa Dinheiro', '', '', '', '', true),
('Loja Ahu', '0615', '98608-0', 'Itaú', '46.812.928/0001-71', true),
('Loja Alto XV', '0615', '98554-6', 'Itaú', '46.812.928/0002-71', true),
('Loja Batel', '0615', '98553-8', 'Itaú', '46.812.928/0003-71', true),
('Fábrica', '0615', '98670-0', 'Itaú', '', true),
('Compras', '0001', '23631657-5', 'Inter', '46.812.928/0001-71', true);
