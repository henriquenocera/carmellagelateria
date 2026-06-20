-- Deleta primeiro as subcategorias para evitar erros de foreign key
DELETE FROM categorias_financeiras WHERE parent_id IS NOT NULL;
-- Deleta as categorias principais
DELETE FROM categorias_financeiras;

WITH parent_100 AS (
    INSERT INTO categorias_financeiras (nome) VALUES ('100 Receitas') RETURNING id
),
child_100 AS (
    INSERT INTO categorias_financeiras (nome, parent_id)
    SELECT val.nome, p.id FROM parent_100 p CROSS JOIN (
        VALUES 
            ('101 Vendas Loja - Cartão'),
            ('102 Vendas Loja - Pix'),
            ('103 Vendas Loja - Dinheiro'),
            ('104 Vendas Loja - Delivery'),
            ('105 Vendas Food Service'),
            ('106 Outras Receitas'),
            ('107 Empréstimos'),
            ('108 Aportes'),
            ('109 Rendimentos de Aplicações')
    ) AS val(nome)
),
parent_200 AS (
    INSERT INTO categorias_financeiras (nome) VALUES ('200 Imposto') RETURNING id
),
child_200 AS (
    INSERT INTO categorias_financeiras (nome, parent_id)
    SELECT val.nome, p.id FROM parent_200 p CROSS JOIN (
        VALUES 
            ('201 Simples Nacional - DAS')
    ) AS val(nome)
),
parent_300 AS (
    INSERT INTO categorias_financeiras (nome) VALUES ('300 Custo de Produção') RETURNING id
),
child_300 AS (
    INSERT INTO categorias_financeiras (nome, parent_id)
    SELECT val.nome, p.id FROM parent_300 p CROSS JOIN (
        VALUES 
            ('301 Loja'),
            ('302 Fábrica'),
            ('303 Compra de Sorvete'),
            ('304 Serviços p/ Produção')
    ) AS val(nome)
),
parent_400 AS (
    INSERT INTO categorias_financeiras (nome) VALUES ('400 Custo Pessoal') RETURNING id
),
child_400 AS (
    INSERT INTO categorias_financeiras (nome, parent_id)
    SELECT val.nome, p.id FROM parent_400 p CROSS JOIN (
        VALUES 
            ('401 Salário'),
            ('402 13º Salário'),
            ('403 Férias'),
            ('404 FGTS'),
            ('405 INSS'),
            ('406 Vale Alimentação'),
            ('407 Vale Transporte'),
            ('408 Taxa'),
            ('409 Bonus'),
            ('410 Taxa Sindicato'),
            ('411 Exames Médicos')
    ) AS val(nome)
),
parent_450 AS (
    INSERT INTO categorias_financeiras (nome) VALUES ('450 Pro labore') RETURNING id
),
child_450 AS (
    INSERT INTO categorias_financeiras (nome, parent_id)
    SELECT val.nome, p.id FROM parent_450 p CROSS JOIN (
        VALUES 
            ('451 Pro labore')
    ) AS val(nome)
),
parent_500 AS (
    INSERT INTO categorias_financeiras (nome) VALUES ('500 Despesas Variáveis') RETURNING id
),
child_500 AS (
    INSERT INTO categorias_financeiras (nome, parent_id)
    SELECT val.nome, p.id FROM parent_500 p CROSS JOIN (
        VALUES 
            ('501 Insumos Administrativos'),
            ('502 Frete'),
            ('503 Ajuste de Caixa'),
            ('504 Compra de Material de Limpeza'),
            ('505 Cartão de Crédito'),
            ('506 Troco p/ Loja'),
            ('507 Desconto'),
            ('508 Outros'),
            ('509 Gasolina'),
            ('510 Despesas Administrativas')
    ) AS val(nome)
),
parent_600 AS (
    INSERT INTO categorias_financeiras (nome) VALUES ('600 Despesas Comerciais') RETURNING id
),
child_600 AS (
    INSERT INTO categorias_financeiras (nome, parent_id)
    SELECT val.nome, p.id FROM parent_600 p CROSS JOIN (
        VALUES 
            ('601 Comissão Vendedor'),
            ('602 Despesas Marketing'),
            ('603 Despesas Vendas'),
            ('604 Taxas de Vendas - Cartão'),
            ('605 Taxas de Vendas - Delivery')
    ) AS val(nome)
),
parent_700 AS (
    INSERT INTO categorias_financeiras (nome) VALUES ('700 Despesas Fixas') RETURNING id
),
child_700 AS (
    INSERT INTO categorias_financeiras (nome, parent_id)
    SELECT val.nome, p.id FROM parent_700 p CROSS JOIN (
        VALUES 
            ('701 Luz'),
            ('702 Água'),
            ('703 Internet'),
            ('704 Telefone'),
            ('705 Aluguel'),
            ('706 IPTU'),
            ('707 Seguro'),
            ('708 Segurança'),
            ('709 Contador'),
            ('710 E-mail'),
            ('711 ERP'),
            ('712 Limpeza'),
            ('713 Aluguel de Equipamentos'),
            ('714 Gás'),
            ('715 Jardinagem')
    ) AS val(nome)
),
parent_800 AS (
    INSERT INTO categorias_financeiras (nome) VALUES ('800 Despesas Financeiras') RETURNING id
),
child_800 AS (
    INSERT INTO categorias_financeiras (nome, parent_id)
    SELECT val.nome, p.id FROM parent_800 p CROSS JOIN (
        VALUES 
            ('801 Juros e Multas'),
            ('802 Tarifa de Conta Corrente'),
            ('803 Taxas de Transferência'),
            ('804 Transf. Entre Contas')
    ) AS val(nome)
),
parent_900 AS (
    INSERT INTO categorias_financeiras (nome) VALUES ('900 Investimentos') RETURNING id
),
child_900 AS (
    INSERT INTO categorias_financeiras (nome, parent_id)
    SELECT val.nome, p.id FROM parent_900 p CROSS JOIN (
        VALUES 
            ('901 Equipamentos'),
            ('902 Veículos'),
            ('903 Manutenção'),
            ('904 Intangíveis'),
            ('905 Obras'),
            ('906 Utensílios'),
            ('907 Cursos Online'),
            ('908 Desenvolvimento Novos Produtos'),
            ('909 Pagamento de Investidores'),
            ('910 Taxas e Guias'),
            ('911 Uniformes')
    ) AS val(nome)
)
SELECT 'Categorias inseridas com sucesso!' AS resultado;
