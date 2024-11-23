
document.getElementById('credits').addEventListener('click', () => {
  const { ipcRenderer } = require('electron');
  ipcRenderer.send('credits');
});

document.getElementById('newGame').addEventListener('click', () => {
  const { ipcRenderer } = require('electron');
  ipcRenderer.send('newGame');
});
