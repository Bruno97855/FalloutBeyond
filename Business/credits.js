
document.getElementById('backButton').addEventListener('click', () => {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('main');
  });