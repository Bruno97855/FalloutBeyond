const { getPersonagens, addPersonagem } = require('../Business/dataFunctions.js');

document.getElementById('backButton').addEventListener('click', () => {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('main');
});

document.getElementById('confirm').addEventListener('click', () => {
  const saves = getPersonagens();
  if(saves.length < 5){
    const name = document.getElementById('nameCaracter')
    const character = { name: name.value, class: 'classeTeste', level: 1 };
    addPersonagem(character);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  loadSaves();
});

function loadSaves() {
  const saves = getPersonagens();
  const tableBody = document.querySelector('#table tbody');

  tableBody.innerHTML = '';

  if (saves.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="3">No saves found</td></tr>';
    return;
  }

  saves.forEach(x => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${x.name}</td>
      <td>${x.level}.lv</td>
    `;

    tableBody.appendChild(row);
  });

  const header = document.querySelector('#table thead th');
  header.textContent = `${saves.length}/5`;
}
  