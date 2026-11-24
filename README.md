# Carmella — Escritório

## Importação automática Cloudfy

Execute **`Importar-Vendas-Cloudfy.bat`** na raiz do projeto com dois cliques. Ele inicia um servidor temporário, exporta o CSV dos últimos cinco dias até ontem no Cloudfy, entra no escritório e envia o arquivo para análise e importação. O servidor é encerrado ao finalizar. Não é necessário copiar token nem iniciar o servidor manualmente.

Requer Node.js 20 ou superior. As dependências e o navegador são instalados automaticamente na primeira execução, se necessário. As credenciais ficam em `tools/cloudfy/.env.local`, ignorado pelo Git.

Configuração e detalhes: [tools/cloudfy/README.md](tools/cloudfy/README.md).
