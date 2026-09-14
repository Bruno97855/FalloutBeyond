const fs = require('fs');
const path = require('path');
module.exports = {
    getPersonagens,
    addPersonagem,
    updatePersonagem,
    deletePersonagem
};

const dataPath = path.join(__dirname, '..', 'Data', 'personagens.json');

function readJsonFileSync(filepath, encoding = 'utf8') {
  if (fs.existsSync(filepath)) {
    const file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
  } else {
    return [];
  }
}

function writeJsonFileSync(filepath, data, encoding = 'utf8') {
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(filepath, json, encoding);
}

// Função para adicionar um novo personagem
function addPersonagem(personagem) {
  const personagens = readJsonFileSync(dataPath);

  // Calcula o próximo ID com base no maior ID já existente
  const nextId = personagens.reduce((maxId, p) => Math.max(maxId, p.id || 0), 0) + 1;
  const personagemComId = { id: nextId, ...personagem };

  personagens.push(personagemComId);

  writeJsonFileSync(dataPath, personagens);
  return personagemComId;
}

// Função para obter todos os personagens
function getPersonagens() {
  return readJsonFileSync(dataPath);
}

// Função para atualizar um personagem já existente (identificado pelo id)
function updatePersonagem(personagem) {
  const personagens = readJsonFileSync(dataPath);
  const index = personagens.findIndex((p) => p.id === personagem.id);

  if (index === -1) {
    return null;
  }

  personagens[index] = personagem;
  writeJsonFileSync(dataPath, personagens);
  return personagem;
}

// Função para excluir permanentemente um personagem (identificado pelo id)
function deletePersonagem(id) {
  const personagens = readJsonFileSync(dataPath);
  const index = personagens.findIndex((p) => p.id === id);

  if (index === -1) {
    return false;
  }

  personagens.splice(index, 1);
  writeJsonFileSync(dataPath, personagens);
  return true;
}
