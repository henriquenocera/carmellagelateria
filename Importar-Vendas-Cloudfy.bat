@echo off
setlocal
title Carmella - Importar vendas Cloudfy

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Instale Node.js 20 ou superior e tente novamente.
  goto failure
)
node -e "if (Number(process.versions.node.split('.')[0]) < 20) process.exit(1)"
if errorlevel 1 (
  echo Esta automacao requer Node.js 20 ou superior.
  goto failure
)

if not exist "%~dp0tools\cloudfy\node_modules\playwright\cli.js" (
  echo Instalando dependencias da automacao...
  call npm --prefix "%~dp0tools\cloudfy" ci
  if errorlevel 1 goto failure
)

node "%~dp0tools\cloudfy\run.cjs"
if errorlevel 1 goto failure

echo.
echo Importacao concluida. O servidor local foi encerrado automaticamente.
if /I not "%~1"=="--no-pause" pause
exit /b 0

:failure
echo.
echo A importacao nao foi concluida. Confira a mensagem acima.
if /I not "%~1"=="--no-pause" pause
exit /b 1
