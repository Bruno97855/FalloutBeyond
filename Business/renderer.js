
document.getElementById('credits').addEventListener('click', () => {
  const { ipcRenderer } = require('electron');
  ipcRenderer.send('credits');
});

document.getElementById('play').addEventListener('click', () => {
  const { ipcRenderer } = require('electron');
  ipcRenderer.send('play');
});
