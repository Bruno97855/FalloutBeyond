# FalloutBeyond
# Projeto de Ficha de Personagem

Este projeto é uma aplicação para gerenciar fichas de personagens, construída com Electron e Node.js.

## Requisitos

Certifique-se de que o Node.js está instalado no seu computador. Você pode baixá-lo e instalá-lo a partir do [site oficial do Node.js](https://nodejs.org/).

## Configuração do Projeto

Siga os passos abaixo para configurar o projeto no seu computador:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Bruno97855/FalloutBeyond.git

2. Instale as dependências do Node.js:

   No diretório do projeto, execute o seguinte comando para instalar todas as dependências necessárias listadas no package.json:
   npm install

3. Instale o Electron globalmente (se necessário):

   Se você ainda não tem o Electron instalado globalmente, você pode instalá-lo usando o npm:
   npm install -g electron

5. Após instalar todas as dependências, você pode executar a aplicação com o seguinte comando:

   npm start

## Criando o Instalador

1. Instale o electron-builder:

   npm install --save-dev electron-builder

2. Adicione um script de build no package.json:

   "scripts": {
  "start": "electron .",
  "dist": "electron-builder"
  }

3. Configure o electron-builder no package.json:

  "build": {
    "appId": "com.example.app",
    "productName": "Fallout Beyond",
    "directories": {
      "output": "dist"//coloque o caminho de sída que preferir
    },
  }

4. Crie o instalador:

   npm run dist

## Estrutura do Projeto

main.js: Arquivo principal que inicializa a aplicação Electron.
Business/renderer.js: Script de pré-carregamento que é executado antes que a página web seja carregada.
Views/index.html: Página HTML principal da aplicação.
Icons/vault-tec.svg: Ícone da aplicação.

## Contribuição
Se você quiser contribuir para este projeto, sinta-se à vontade para fazer um fork do repositório, criar um branch para suas mudanças e enviar um pull request.
