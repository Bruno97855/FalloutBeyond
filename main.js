// Importa os módulos necessários do Electron
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Função para criar a janela principal
function createWindow() {
  // Caminho para o script de pré-carregamento (renderer.js)
  const preloadPath = path.join(__dirname, 'Business','renderer.js');
  // Cria uma nova janela do navegador
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'Icons', 'vault-boy.ico'),
    webPreferences: {
      // Especifica o script de pré-carregamento a ser usado
      preload: preloadPath,
      // Habilita a integração do Node.js na página renderizada (necessário para acesso a APIs do Node)
      nodeIntegration: true,
      // Desativa o isolamento de contexto para permitir acesso direto ao Node.js APIs
      contextIsolation: false,
      // Habilita o módulo remoto para acessar APIs do Electron na página renderizada
      enableRemoteModule: true
    }
  });

  // Caminho para o arquivo index.html que será carregado na janela
  const indexPath = path.join(__dirname, 'Views', 'index.html');
  // Carrega o arquivo index.html na janela principal
  mainWindow.loadFile(indexPath).then(() => {
    // Abre as ferramentas de desenvolvedor quando o arquivo é carregado com sucesso
    mainWindow.webContents.openDevTools();
  }).catch((err) => {
    // Exibe um erro no console se houver problemas ao carregar index.html
    console.error('Error loading index.html:', err);
  });

  // Remove o menu padrão da aplicação (File, Edit, etc.)
  Menu.setApplicationMenu(null);
}

// Evento que é disparado quando o Electron está pronto para criar janelas do navegador
app.whenReady().then(() => {
  // Cria a janela principal quando o Electron está pronto
  createWindow();

  // Evento ativado quando o aplicativo é ativado (macOS)
  app.on('activate', function () {
    // Cria uma nova janela se não houver nenhuma janela aberta quando o aplicativo é ativado
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Evento que é disparado quando todas as janelas do aplicativo são fechadas
app.on('window-all-closed', function () {
  // Fecha o aplicativo quando todas as janelas são fechadas, exceto no macOS
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
