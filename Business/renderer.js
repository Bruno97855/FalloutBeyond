
document.getElementById('credits').addEventListener('click', () => {
  const { ipcRenderer } = require('electron');
  ipcRenderer.send('credits');
});
