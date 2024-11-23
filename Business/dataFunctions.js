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

  // Gerar um novo id unico
  const newId = personagens.length > 0
    ? Math.max(...personagens.map(p => p.id)) + 1
    : 1;

  const personagemComId = { id: newId, ...personagem }; // Adiciona o id ao personagem
  personagens.push(personagemComId);

  writeJsonFileSync(dataPath, personagens);
  return personagemComId; // Retorna o personagem criado com o id
}

// Função para obter todos os personagens
function getPersonagens() {
  return readJsonFileSync(dataPath);
}
