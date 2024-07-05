console.log("creditos")
document.getElementById('backButton').addEventListener('click', () => {
    debugger
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('main');
  });