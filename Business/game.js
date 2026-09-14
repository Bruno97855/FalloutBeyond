const { getPersonagens, updatePersonagem } = require('../Business/dataFunctions.js');
const { ipcRenderer } = require('electron');

const BASE_SKILL_PERCENT = 10;
const ATTRIBUTE_SKILL_BONUS = 2;
const TAGGED_SKILL_BONUS = 15;

// Cada linha representa um atributo e as habilidades vinculadas a ele,
// seguindo o layout de referência da ficha de personagem.
const ATTRIBUTE_ROWS = [
  { attr: 'resistencia', label: 'Resistência', skills: ['Armas Grandes', 'Ataque Desarmado'] },
  { attr: 'percepcao', label: 'Percepção', skills: ['Explosivos', 'Armas de Energia', 'Lockpick'] },
  { attr: 'agilidade', label: 'Agilidade', skills: ['Armas Pequenas', 'Furtividade'] },
  { attr: 'inteligencia', label: 'Inteligência', skills: ['Medicina', 'Reparar', 'Ciência'] },
  { attr: 'forca', label: 'Força', skills: ['Armas Corpo-a-Corpo'] },
  { attr: 'carisma', label: 'Carisma', skills: ['Discurso', 'Barganha'] },
  { attr: 'sorte', label: 'Sorte', skills: [] }
];

const ATTRIBUTE_SHORT = {
  resistencia: 'Res',
  percepcao: 'Per',
  agilidade: 'Agi',
  inteligencia: 'Int',
  forca: 'For',
  carisma: 'Car',
  sorte: 'Sor'
};

document.addEventListener('DOMContentLoaded', () => {
  const character = loadCurrentCharacter();

  if (!character) {
    alert('Personagem não encontrado.');
    ipcRenderer.send('play');
    return;
  }

  // Preenche campos ainda não existentes no save (vida, habilidades, armadura, etc.)
  // aplicando as regras já implementadas, e persiste imediatamente no banco.
  if (ensureCharacterDefaults(character)) {
    saveCharacter(character);
  }

  renderCharacterSheet(character);
});

document.getElementById('backButton').addEventListener('click', () => {
  ipcRenderer.send('play');
});

function loadCurrentCharacter() {
  const idRaw = localStorage.getItem('currentCharacterId');
  const personagens = getPersonagens();

  if (idRaw !== null) {
    const id = parseInt(idRaw, 10);
    const found = personagens.find((p) => p.id === id);
    if (found) {
      return found;
    }
  }

  return personagens[personagens.length - 1] || null;
}

function saveCharacter(character) {
  updatePersonagem(character);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function parseIntClamped(value, min, max, fallback) {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return fallback;
  }
  return clamp(parsed, min, max);
}

// Bônus de sorte que se aplica a TODAS as habilidades (metade do valor de Sorte, a partir de 2 pontos).
function getLuckSkillBonus(sorte) {
  return Math.floor(sorte / 2);
}

function calcSkillPercent(attributeValue, isTagged, sorte) {
  const value = BASE_SKILL_PERCENT
    + attributeValue * ATTRIBUTE_SKILL_BONUS
    + (isTagged ? TAGGED_SKILL_BONUS : 0)
    + getLuckSkillBonus(sorte);

  return clamp(value, 0, 100);
}

function computeAllSkills(attributes, taggedSkills) {
  const skills = {};

  ATTRIBUTE_ROWS.forEach((row) => {
    const attributeValue = attributes[row.attr];
    row.skills.forEach((skillName) => {
      const isTagged = taggedSkills.includes(skillName);
      skills[skillName] = calcSkillPercent(attributeValue, isTagged, attributes.sorte);
    });
  });

  return skills;
}

// Preenche, uma única vez, os campos derivados que ainda não existem no save.
function ensureCharacterDefaults(character) {
  let changed = false;
  const attributes = character.attributes;

  if (character.skills === undefined) {
    character.skills = computeAllSkills(attributes, character.taggedSkills || []);
    changed = true;
  }
  if (character.critico === undefined) {
    character.critico = clamp(attributes.sorte, 0, 100);
    changed = true;
  }
  if (character.pvMax === undefined) {
    character.pvMax = attributes.resistencia * 2;
    changed = true;
  }
  if (character.currentPv === undefined) {
    character.currentPv = character.pvMax;
    changed = true;
  }
  if (character.protVeneno === undefined) {
    character.protVeneno = clamp((attributes.resistencia - 1) * 5, 0, 85);
    changed = true;
  }
  if (character.protRadiacao === undefined) {
    character.protRadiacao = clamp((attributes.resistencia - 1) * 2, 0, 85);
    changed = true;
  }
  if (character.pontosAcao === undefined) {
    character.pontosAcao = attributes.agilidade + 4;
    changed = true;
  }
  if (character.armadura === undefined) {
    character.armadura = 0;
    changed = true;
  }
  if (character.radiacao === undefined) {
    character.radiacao = 0;
    changed = true;
  }
  if (character.xp === undefined) {
    character.xp = 0;
    changed = true;
  }

  return changed;
}

// Reaplica todas as regras já implementadas quando um atributo é editado
// (habilidades, crítico, PV Máx, proteções e pontos de ação).
function recomputeFromAttributes(character) {
  const attributes = character.attributes;

  character.skills = computeAllSkills(attributes, character.taggedSkills || []);
  character.critico = clamp(attributes.sorte, 0, 100);
  character.pvMax = attributes.resistencia * 2;
  character.currentPv = clamp(character.currentPv ?? character.pvMax, 0, character.pvMax);
  character.protVeneno = clamp((attributes.resistencia - 1) * 5, 0, 85);
  character.protRadiacao = clamp((attributes.resistencia - 1) * 2, 0, 85);
  character.pontosAcao = attributes.agilidade + 4;
}

function renderCharacterSheet(character) {
  document.getElementById('charName').textContent = character.name;

  bindSimpleField('charLevel', character, 'level', 1, 999);
  bindSimpleField('charXp', character, 'xp', 0, 999999);

  bindSimpleField('statPvMax', character, 'pvMax', 0, 999);
  bindSimpleField('statPv', character, 'currentPv', 0, 999);
  bindSimpleField('statProtVeneno', character, 'protVeneno', 0, 85);
  bindSimpleField('statProtRadiacao', character, 'protRadiacao', 0, 85);
  bindSimpleField('statPontosAcao', character, 'pontosAcao', 0, 99);
  bindSimpleField('statCritico', character, 'critico', 0, 100);
  bindSimpleField('statArmadura', character, 'armadura', 0, 999);
  bindSimpleField('statRadiacao', character, 'radiacao', 0, 999);

  const rowsContainer = document.getElementById('attributesRows');
  rowsContainer.innerHTML = '';

  const attributesRow = document.createElement('div');
  attributesRow.className = 'attributes-row';

  const skillsRow = document.createElement('div');
  skillsRow.className = 'skills-row';

  ATTRIBUTE_ROWS.forEach((row) => {
    attributesRow.appendChild(buildAttrBox(row, character));

    row.skills.forEach((skillName) => {
      skillsRow.appendChild(buildSkillBox(skillName, character));
    });
  });

  rowsContainer.appendChild(attributesRow);
  rowsContainer.appendChild(skillsRow);
}

// Liga um input simples (sem regras em cascata) a um campo do personagem: ao
// editar, o valor é salvo diretamente no banco.
function bindSimpleField(elementId, character, field, min, max) {
  const input = document.getElementById(elementId);
  input.value = character[field];

  input.onchange = () => {
    const newValue = parseIntClamped(input.value, min, max, character[field]);
    input.value = newValue;
    character[field] = newValue;
    saveCharacter(character);
  };
}

function buildAttrBox(row, character) {
  const attributes = character.attributes;
  const attributeValue = attributes[row.attr];

  const attrBox = document.createElement('div');
  attrBox.className = 'game-attr-box';

  const attrLabel = document.createElement('span');
  attrLabel.className = 'font-style large-font';
  attrLabel.textContent = row.label;
  attrBox.appendChild(attrLabel);

  const attrInput = document.createElement('input');
  attrInput.type = 'number';
  attrInput.className = 'font-style xlarge-font attr-input';
  attrInput.min = '0';
  attrInput.max = '10';
  attrInput.value = attributeValue;
  attrInput.addEventListener('change', () => {
    attributes[row.attr] = parseIntClamped(attrInput.value, 0, 10, attributeValue);
    recomputeFromAttributes(character);
    saveCharacter(character);
    renderCharacterSheet(character);
  });
  attrBox.appendChild(attrInput);

  const bonusSpan = document.createElement('span');
  bonusSpan.className = 'font-style attr-bonus';
  bonusSpan.textContent = `Bônus ${ATTRIBUTE_SHORT[row.attr]}/2 = +${Math.floor(attributeValue / 2)}`;
  attrBox.appendChild(bonusSpan);

  return attrBox;
}

function buildSkillBox(skillName, character) {
  const isTagged = (character.taggedSkills || []).includes(skillName);

  const skillBox = document.createElement('div');
  skillBox.className = `game-skill-box${isTagged ? ' tagged' : ''}`;

  if (isTagged) {
    const badge = document.createElement('span');
    badge.className = 'tag-badge';
    badge.textContent = 'TAG';
    skillBox.appendChild(badge);
  }

  const nameSpan = document.createElement('span');
  nameSpan.className = 'font-style large-font';
  nameSpan.textContent = skillName;
  skillBox.appendChild(nameSpan);

  const skillInput = document.createElement('input');
  skillInput.type = 'number';
  skillInput.className = 'font-style xlarge-font skill-input';
  skillInput.min = '0';
  skillInput.max = '100';
  skillInput.value = character.skills[skillName];
  skillInput.addEventListener('change', () => {
    character.skills[skillName] = parseIntClamped(skillInput.value, 0, 100, character.skills[skillName]);
    skillInput.value = character.skills[skillName];
    saveCharacter(character);
  });
  skillBox.appendChild(skillInput);

  const percentLabel = document.createElement('span');
  percentLabel.className = 'font-style xlarge-font';
  percentLabel.textContent = '%';
  skillBox.appendChild(percentLabel);

  return skillBox;
}
