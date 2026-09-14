const { addPersonagem } = require('../Business/dataFunctions.js');
const { ipcRenderer } = require('electron');

const TOTAL_POINTS = 40;
const MIN_ATTR = 0;
const MAX_ATTR = 10;

const ATTRIBUTES = ['resistencia', 'percepcao', 'agilidade', 'inteligencia', 'forca', 'carisma', 'sorte'];

const SKILLS = [
  'Armas Grandes',
  'Ataque Desarmado',
  'Explosivos',
  'Armas de Energia',
  'Lockpick',
  'Armas Pequenas',
  'Furtividade',
  'Medicina',
  'Reparar',
  'Ciência',
  'Armas Corpo-a-Corpo',
  'Discurso',
  'Barganha'
];

const attributeInputs = ATTRIBUTES.map((attr) => document.getElementById(`attr-${attr}`));
const pointsLeftEl = document.getElementById('pointsLeft');
const skillSelects = [
  document.getElementById('skill-1'),
  document.getElementById('skill-2'),
  document.getElementById('skill-3')
];

document.addEventListener('DOMContentLoaded', () => {
  populateSkillSelects();
  updatePointsLeft();
});

attributeInputs.forEach((input) => {
  input.addEventListener('input', () => handleAttributeChange(input));
});

skillSelects.forEach((select) => {
  select.addEventListener('change', updateSkillSelectsOptions);
});

document.getElementById('randomRollButton').addEventListener('click', rollRandomAttributes);

document.getElementById('backButton').addEventListener('click', () => {
  ipcRenderer.send('play');
});

document.getElementById('confirmButton').addEventListener('click', confirmCharacter);

function handleAttributeChange(input) {
  let value = parseInt(input.value, 10);

  if (isNaN(value)) {
    value = MIN_ATTR;
  }

  value = Math.min(MAX_ATTR, Math.max(MIN_ATTR, value));

  const otherAttributesTotal = getAttributesTotal() - getAttributeValue(input);
  if (otherAttributesTotal + value > TOTAL_POINTS) {
    value = TOTAL_POINTS - otherAttributesTotal;
  }

  input.value = value;
  updatePointsLeft();
}

function getAttributeValue(input) {
  const value = parseInt(input.value, 10);
  return isNaN(value) ? 0 : value;
}

function getAttributesTotal() {
  return attributeInputs.reduce((total, input) => total + getAttributeValue(input), 0);
}

function updatePointsLeft() {
  const total = getAttributesTotal();
  const remaining = TOTAL_POINTS - total;
  pointsLeftEl.textContent = remaining;
  pointsLeftEl.parentElement.classList.toggle('over-limit', remaining < 0);
}

function rollRandomAttributes() {
  const values = ATTRIBUTES.map(() => MIN_ATTR);
  let remaining = TOTAL_POINTS;

  while (remaining > 0) {
    const availableIndexes = values
      .map((value, index) => (value < MAX_ATTR ? index : -1))
      .filter((index) => index !== -1);

    if (availableIndexes.length === 0) {
      break;
    }

    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    values[randomIndex] += 1;
    remaining -= 1;
  }

  attributeInputs.forEach((input, index) => {
    input.value = values[index];
  });

  updatePointsLeft();
}

function populateSkillSelects() {
  skillSelects.forEach((select) => {
    select.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecione';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    SKILLS.forEach((skill) => {
      const option = document.createElement('option');
      option.value = skill;
      option.textContent = skill;
      select.appendChild(option);
    });
  });
}

function updateSkillSelectsOptions() {
  const selectedSkills = skillSelects.map((select) => select.value).filter(Boolean);

  skillSelects.forEach((select) => {
    Array.from(select.options).forEach((option) => {
      if (!option.value) {
        return;
      }
      option.disabled = selectedSkills.includes(option.value) && select.value !== option.value;
    });
  });
}

function confirmCharacter() {
  const total = getAttributesTotal();

  if (total !== TOTAL_POINTS) {
    alert(`Distribua todos os ${TOTAL_POINTS} pontos disponíveis antes de prosseguir. Pontos restantes: ${TOTAL_POINTS - total}.`);
    return;
  }

  const taggedSkills = skillSelects.map((select) => select.value);

  if (taggedSkills.some((skill) => !skill)) {
    alert('Selecione as 3 perícias tag antes de prosseguir.');
    return;
  }

  if (new Set(taggedSkills).size !== taggedSkills.length) {
    alert('As 3 perícias tag devem ser diferentes entre si.');
    return;
  }

  const name = localStorage.getItem('newCharacterName');

  if (!name) {
    alert('Nome do personagem não encontrado. Volte e informe o nome novamente.');
    ipcRenderer.send('play');
    return;
  }

  const attributes = {};
  ATTRIBUTES.forEach((attr, index) => {
    attributes[attr] = getAttributeValue(attributeInputs[index]);
  });

  const character = {
    name,
    class: 'classeTeste',
    level: 1,
    attributes,
    taggedSkills
  };

  const savedCharacter = addPersonagem(character);
  localStorage.removeItem('newCharacterName');
  localStorage.setItem('currentCharacterId', savedCharacter.id);

  ipcRenderer.send('game');
}
