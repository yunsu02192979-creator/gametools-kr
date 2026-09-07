const GAMES = {
  valorant: { name: 'VALORANT', yaw: 0.07 },
  cs2: { name: 'Counter-Strike 2', yaw: 0.022 },
  apex: { name: 'Apex Legends', yaw: 0.022 },
  overwatch2: { name: 'Overwatch 2', yaw: 0.0066 },
};

const els = {
  sourceGame: document.querySelector('#sourceGame'),
  targetGame: document.querySelector('#targetGame'),
  sourceSens: document.querySelector('#sourceSens'),
  sourceDpi: document.querySelector('#sourceDpi'),
  targetDpi: document.querySelector('#targetDpi'),
  targetSens: document.querySelector('#targetSens'),
  targetGameLabel: document.querySelector('#targetGameLabel'),
  cm360: document.querySelector('#cm360'),
  sourceEdpi: document.querySelector('#sourceEdpi'),
  targetEdpi: document.querySelector('#targetEdpi'),
  allGamesBody: document.querySelector('#allGamesBody'),
  errorBox: document.querySelector('#errorBox'),
  swapBtn: document.querySelector('#swapBtn'),
  copyBtn: document.querySelector('#copyBtn'),
  shareBtn: document.querySelector('#shareBtn'),
  saveBtn: document.querySelector('#saveBtn'),
  profileName: document.querySelector('#profileName'),
  savedProfiles: document.querySelector('#savedProfiles'),
};

function addGameOptions() {
  Object.entries(GAMES).forEach(([id, game]) => {
    els.sourceGame.add(new Option(game.name, id));
    els.targetGame.add(new Option(game.name, id));
  });
  els.sourceGame.value = 'valorant';
  els.targetGame.value = 'cs2';
}

function positiveNumber(input) {
  const n = Number(input.value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function format(value, max = 4) {
  return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: max }).format(value);
}

function calculate() {
  const sens = positiveNumber(els.sourceSens);
  const sourceDpi = positiveNumber(els.sourceDpi);
  const targetDpi = positiveNumber(els.targetDpi);
  const source = GAMES[els.sourceGame.value];
  const target = GAMES[els.targetGame.value];

  if (!sens || !sourceDpi || !targetDpi || !source || !target) {
    els.errorBox.hidden = false;
    els.errorBox.textContent = '감도와 DPI에는 0보다 큰 숫자를 입력하세요.';
    return;
  }
  els.errorBox.hidden = true;

  const cm360 = 2.54 * 360 / (sourceDpi * sens * source.yaw);
  const targetSens = (sourceDpi * sens * source.yaw) / (targetDpi * target.yaw);
  const sourceEdpi = sourceDpi * sens;
  const targetEdpi = targetDpi * targetSens;

  els.targetSens.textContent = format(targetSens, 4);
  els.targetGameLabel.textContent = target.name;
  els.cm360.textContent = format(cm360, 2);
  els.sourceEdpi.textContent = format(sourceEdpi, 2);
  els.targetEdpi.textContent = format(targetEdpi, 2);

  renderAllGames(sourceDpi, sens, source.yaw, targetDpi);
}

function renderAllGames(sourceDpi, sens, sourceYaw, targetDpi) {
  const rotationRate = sourceDpi * sens * sourceYaw;
  els.allGamesBody.innerHTML = '';

  Object.entries(GAMES).forEach(([id, game]) => {
    const gameSens = rotationRate / (targetDpi * game.yaw);
    const tr = document.createElement('tr');
    if (id === els.targetGame.value) tr.dataset.target = 'true';

    const gameCell = document.createElement('td');
    const sensCell = document.createElement('td');
    const edpiCell = document.createElement('td');
    gameCell.textContent = game.name;
    sensCell.textContent = format(gameSens, 4);
    edpiCell.textContent = format(targetDpi * gameSens, 2);
    tr.append(gameCell, sensCell, edpiCell);
    els.allGamesBody.appendChild(tr);
  });
}

function swapGames() {
  const sourceId = els.sourceGame.value;
  const targetId = els.targetGame.value;
  const targetSensNow = Number(String(els.targetSens.textContent).replace(/,/g, ''));

  els.sourceGame.value = targetId;
  els.targetGame.value = sourceId;
  if (Number.isFinite(targetSensNow) && targetSensNow > 0) els.sourceSens.value = targetSensNow;

  const dpi = els.sourceDpi.value;
  els.sourceDpi.value = els.targetDpi.value;
  els.targetDpi.value = dpi;
  calculate();
}

async function writeClipboard(text, button, successText) {
  try {
    await navigator.clipboard.writeText(text);
    const old = button.textContent;
    button.textContent = successText;
    setTimeout(() => (button.textContent = old), 1200);
  } catch {
    button.textContent = '복사 실패';
    setTimeout(() => (button.textContent = '다시 시도'), 1200);
  }
}

function copyResult() {
  const text = `${els.targetGameLabel.textContent} 감도 ${els.targetSens.textContent} | ${els.cm360.textContent} cm/360`;
  writeClipboard(text, els.copyBtn, '복사됨');
}

function currentShareUrl() {
  const url = new URL(window.location.href);
  url.hash = '';
  url.search = '';
  url.searchParams.set('from', els.sourceGame.value);
  url.searchParams.set('to', els.targetGame.value);
  url.searchParams.set('sens', els.sourceSens.value);
  url.searchParams.set('dpi', els.sourceDpi.value);
  url.searchParams.set('tdpi', els.targetDpi.value);
  return url.toString();
}

function copyShareUrl() {
  writeClipboard(currentShareUrl(), els.shareBtn, 'URL 복사됨');
}

function applyUrlSettings() {
  const params = new URLSearchParams(window.location.search);
  const from = params.get('from');
  const to = params.get('to');
  const sens = Number(params.get('sens'));
  const dpi = Number(params.get('dpi'));
  const tdpi = Number(params.get('tdpi'));

  if (from && GAMES[from]) els.sourceGame.value = from;
  if (to && GAMES[to]) els.targetGame.value = to;
  if (Number.isFinite(sens) && sens > 0) els.sourceSens.value = sens;
  if (Number.isFinite(dpi) && dpi > 0) els.sourceDpi.value = dpi;
  if (Number.isFinite(tdpi) && tdpi > 0) els.targetDpi.value = tdpi;
}

function getProfiles() {
  try { return JSON.parse(localStorage.getItem('gametools-sens-profiles') || '[]'); }
  catch { return []; }
}

function saveProfile() {
  const name = els.profileName.value.trim() || `${GAMES[els.sourceGame.value].name} 설정`;
  const profiles = getProfiles();
  profiles.unshift({
    id: Date.now(),
    name,
    sourceGame: els.sourceGame.value,
    targetGame: els.targetGame.value,
    sourceSens: els.sourceSens.value,
    sourceDpi: els.sourceDpi.value,
    targetDpi: els.targetDpi.value,
  });
  localStorage.setItem('gametools-sens-profiles', JSON.stringify(profiles.slice(0, 8)));
  els.profileName.value = '';
  renderProfiles();
}

function loadProfile(profile) {
  els.sourceGame.value = profile.sourceGame;
  els.targetGame.value = profile.targetGame;
  els.sourceSens.value = profile.sourceSens;
  els.sourceDpi.value = profile.sourceDpi;
  els.targetDpi.value = profile.targetDpi;
  calculate();
  document.querySelector('#converter').scrollIntoView({ behavior: 'smooth' });
}

function deleteProfile(id) {
  const profiles = getProfiles().filter((p) => p.id !== id);
  localStorage.setItem('gametools-sens-profiles', JSON.stringify(profiles));
  renderProfiles();
}

function renderProfiles() {
  const profiles = getProfiles();
  els.savedProfiles.innerHTML = '';

  profiles.forEach((profile) => {
    const chip = document.createElement('div');
    chip.className = 'profile-chip';

    const load = document.createElement('button');
    load.type = 'button';
    load.textContent = profile.name;
    load.addEventListener('click', () => loadProfile(profile));

    const del = document.createElement('button');
    del.type = 'button';
    del.setAttribute('aria-label', `${profile.name} 삭제`);
    del.textContent = '×';
    del.addEventListener('click', () => deleteProfile(profile.id));

    chip.append(load, del);
    els.savedProfiles.appendChild(chip);
  });
}

addGameOptions();
applyUrlSettings();

['input', 'change'].forEach((eventName) => {
  [els.sourceGame, els.targetGame, els.sourceSens, els.sourceDpi, els.targetDpi].forEach((el) => {
    el.addEventListener(eventName, calculate);
  });
});

els.swapBtn.addEventListener('click', swapGames);
els.copyBtn.addEventListener('click', copyResult);
els.shareBtn.addEventListener('click', copyShareUrl);
els.saveBtn.addEventListener('click', saveProfile);

calculate();
renderProfiles();
