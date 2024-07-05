console.log("bateu");


document.getElementById('credits').addEventListener('click', () => {
  debugger
  const { ipcRenderer } = require('electron');
  ipcRenderer.send('credits');
});
