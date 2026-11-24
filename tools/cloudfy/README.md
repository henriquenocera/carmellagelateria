# Importação Cloudfy pelo Windows

## Uso diário

Dê dois cliques em **`Importar-Vendas-Cloudfy.bat`**, na raiz do projeto. Mantenha a pasta do projeto no computador, com Node.js 20 ou superior instalado.

O arquivo executa o fluxo completo:

1. Instala dependências e Chromium na primeira execução, se necessário.
2. Inicia um servidor local temporário em uma porta disponível.
3. Entra no Cloudfy, confirma a empresa/filial padrão e acessa **Relatórios gerais → Vendas → Relatório de vendas**.
4. Preenche os últimos cinco dias corridos, terminando ontem, no fuso de São Paulo. Em 24/11, por exemplo, usa 19/11 a 23/11, inclusive.
5. Exporta o CSV e verifica as datas antes do upload.
6. Acessa **https://escritorio.carmellagelateria.com.br/importe-vendas-cloudfy**, faz login e envia o arquivo.
7. Clica em **Importar e Analisar**, seleciona os lançamentos **Não Encontrado**, confirma **Lançar Selecionados** e aguarda a mensagem de sucesso. Registros já conciliados são ignorados.
8. Fecha os navegadores da automação, encerra o servidor e mostra o resultado no terminal.

Não é necessário executar `cloudfy:start` nem copiar token. O token de comunicação interna é gerado e utilizado automaticamente durante a execução. O servidor escuta apenas em `127.0.0.1`.

## Credenciais e relatório

As credenciais ficam em `tools/cloudfy/.env.local`, ignorado pelo Git. Para configurar outro computador, copie `.env.example` para `.env.local` e preencha:

```dotenv
CLOUDFY_USERNAME=seu_usuario
CLOUDFY_PASSWORD=sua_senha
ESCRITORIO_EMAIL=seu_email
ESCRITORIO_PASSWORD=sua_senha
CLOUDFY_REPORT_TYPE=Por data
```

O tipo **Por data** importa a coluna **Vendas à vista** para **Qntd Total de Vendas**. O tipo **Forma de pagamento - por dia** importa valores financeiros. A automação mantém **Consolidar filiais? = Não** e deixa os filtros de filiais vazios para trazer as lojas disponíveis. O relatório padrão foi validado com AHU e ALTO DA XV.

Se o Cloudfy solicitar 2FA, conclua a autenticação na janela aberta em até dois minutos. Os perfis de navegador são exclusivos da automação e ficam em `.runtime/browser` e `.runtime/office-browser`.

## Arquivos e execução pelo terminal

O CSV exportado é salvo em:

```text
tools/cloudfy/.runtime/downloads/cloudfy-AAAA-MM-DD-AAAA-MM-DD.csv
```

Arquivos da execução, perfis e credenciais ficam ignorados pelo Git. Para executar pelo terminal:

```sh
npm run cloudfy:run
```

O BAT mantém a janela aberta com o resultado para leitura. Em outro script, pode usar `Importar-Vendas-Cloudfy.bat --no-pause`; o código de saída é 0 em caso de sucesso e 1 em caso de erro. A execução é única por vez. Se o computador for desligado durante uma execução, remova `.runtime/run.lock` antes de tentar novamente.

## Manutenção

Os seletores do Cloudfy e o login/upload no escritório foram validados nos portais reais. Caso a interface Cloudfy mude, é possível configurar `CLOUDFY_START_SELECTOR`, `CLOUDFY_END_SELECTOR`, `CLOUDFY_TYPE_SELECTOR` e `CLOUDFY_CSV_SELECTOR`. `CLOUDFY_REPORT_URL` pode apontar para a URL direta da página de relatório. A automação também procura campos em iframes.

O arquivo BAT e o serviço ficam no computador. A remoção do antigo botão na página será aplicada no domínio quando a atualização do branch `escritorio` for publicada.

## Verificação

```sh
npm run cloudfy:test
npm test -- --watchAll=false --runInBand --runTestsByPath src/routes/ImporteVendasCloudfy.test.jsx
```

Os testes cobrem período e fuso, validação do CSV, acesso ao servidor, concorrência, upload, confirmação de lançamento, registros já conciliados e erros de análise. Usam dados simulados e não alteram o banco de produção.
