const { getPersonagens, addPersonagem } = require('../Business/dataFunctions.js');

document.getElementById('backButton').addEventListener('click', () => {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('main');
});

document.getElementById('createCharacter').addEventListener('click', () => {
  debugger
  const name = document.getElementById('nameCaracter')
  const character = [
    { name: name.value, class: 'classeTeste', level: 1 },
  ];
  addPersonagem(character);
});
  
