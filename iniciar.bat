@echo off
title EstagioOn // Engenharia Quimica - Uberlandia
echo Iniciando servidor EstagioOn em http://localhost:3450 ...
start "" http://localhost:3450
node "%~dp0server.js"
pause
