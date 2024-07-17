const fs = require('fs');
const path = require('path');
module.exports = {
    getPersonagens,
    addPersonagem
};

const dataPath = path.join(__dirname, '..', 'Data', 'personagens.json');

function readJsonFileSync(filepath, encoding = 'utf8') {
  const file = fs.readFileSync(filepath, encoding);
  return JSON.parse(file);
}

function writeJsonFileSync(filepath, data, encoding = 'utf8') {
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(filepath, json, encoding);
}

// Função para adicionar um novo personagem
function addPersonagem(personagem) {
  const personagens = readJsonFileSync(dataPath);
  personagens.push(personagem);
  writeJsonFileSync(dataPath, personagens);
}

// Função para obter todos os personagens
function getPersonagens() {
  return readJsonFileSync(dataPath);
}
