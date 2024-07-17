const { getPersonagens, addPersonagem } = require('../Business/dataFunctions.js');

document.getElementById('backButton').addEventListener('click', () => {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('main');
});

function testeChamada(){
  debugger
  const characters = [
    { name: 'Frodo', class: 'Hobbit', level: 5 },
    { name: 'Gandalf', class: 'Wizard', level: 10 }
  ];
    
  addPersonagem(characters);
  var personagens = getPersonagens();
}
  
