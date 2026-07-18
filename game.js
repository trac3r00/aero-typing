// ── STATE ──
let state = {
  screen: 'menu',
  mode: 'journey', // 'journey' or 'practice'
  category: null,
  journey: null,
  journeyIndex: 0,
  words: [],
  currentIndex: 0,
  typed: '',
  score: 0,
  combo: 1,
  streak: 0,
  bestStreak: 0,
  totalChars: 0,
  correctChars: 0,
  startTime: null,
  timerInterval: null,
  gameTime: 60,
  wordsCompleted: 0,
  airportsVisited: [],
  bestScores: JSON.parse(localStorage.getItem('aero-typing-best') || '{}'),
  soundEnabled: true,
  isInfinite: false,
};

// ── ELEMENTS ──
const $ = id => document.getElementById(id);
const screens = {
  menu: $('menu-screen'),
  game: $('game-screen'),
  result: $('result-screen'),
  boarding: $('boarding-screen'),
  custom: $('custom-screen')
};

// ── INIT ──
function init() {
  // Landing animation
  const intro = $('airport-intro');
  if (intro) {
    setTimeout(() => intro.classList.add('hidden'), 2200);
    setTimeout(() => intro.remove(), 2800);
  }

  buildMenu();
  setupModeTabs();
  setupSwipe();
  setupCustomRoute();
  $('btn-back').addEventListener('click', goToMenu);
  $('btn-retry').addEventListener('click', retry);
  $('btn-menu').addEventListener('click', goToMenu);
  $('typing-input').addEventListener('input', onInput);
  document.addEventListener('keydown', onKeyDown);

  // Click anywhere on game screen focuses input
  $('game-screen').addEventListener('click', () => {
    if (state.screen === 'game') $('typing-input').focus();
  });

  // Time badge
  const badge = $('time-badge');
  if (badge && typeof TimeTheme !== 'undefined') {
    const t = TimeTheme.themes[TimeTheme.getPhase()];
    badge.textContent = `${t.icon} ${t.label} Flight`;
  }

  // Populate datalist for custom route
  const dl = $('airport-code-list');
  if (dl) {
    Object.keys(AIRPORTS).forEach(code => {
      const opt = document.createElement('option');
      opt.value = code;
      opt.label = AIRPORTS[code].city;
      dl.appendChild(opt);
    });
  }
}

function setupModeTabs() {
  document.querySelectorAll('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.dataset.mode;
      $('journey-grid').style.display = mode === 'journey' ? '' : 'none';
      $('practice-grid').style.display = mode === 'practice' ? '' : 'none';
    });
  });
}

function buildMenu() {
  // Journey cards — safe: only static data from JOURNEYS const
  const jGrid = $('journey-grid');
  jGrid.innerHTML = '';

  // Random Journey card
  const randCard = document.createElement('div');
  randCard.className = 'category-card random-card';
  randCard.addEventListener('click', () => startRandomJourney());
  randCard.innerHTML = `
    <div class="card-icon">🎲</div>
    <div class="card-title">Random Journey</div>
    <div class="card-desc">Surprise route through random airports</div>
    <div class="card-meta">
      <span class="difficulty medium">???</span>
      <span class="card-count">5–10 airports</span>
    </div>
  `;
  jGrid.appendChild(randCard);

  // Custom Journey card
  const customCard = document.createElement('div');
  customCard.className = 'category-card custom-card-menu';
  customCard.addEventListener('click', () => showScreen('custom'));
  customCard.innerHTML = `
    <div class="card-icon">🛠️</div>
    <div class="card-title">Custom Route</div>
    <div class="card-desc">Build your own route</div>
    <div class="card-meta">
      <span class="difficulty easy">YOUR PICK</span>
      <span class="card-count">2–12 airports</span>
    </div>
  `;
  jGrid.appendChild(customCard);

  // Infinite Mode card
  const infCard = document.createElement('div');
  infCard.className = 'category-card';
  infCard.addEventListener('click', () => startInfinite());
  infCard.innerHTML = `
    <div class="card-icon">∞</div>
    <div class="card-title">Infinite Flight</div>
    <div class="card-desc">Non-stop airports, no timer</div>
    <div class="card-meta">
      <span class="difficulty hard">ENDURANCE</span>
      <span class="card-count">endless</span>
    </div>
  `;
  jGrid.appendChild(infCard);

  for (const j of JOURNEYS) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.addEventListener('click', () => showBoarding(j.id));
    const best = state.bestScores['j-' + j.id];
    const diffClass = j.difficulty.toLowerCase();
    card.innerHTML = `
      <div class="card-icon">${j.icon}</div>
      <div class="card-title">${j.name}</div>
      <div class="card-desc">${j.description}</div>
      <div class="card-meta">
        <span class="difficulty ${diffClass}">${j.difficulty}</span>
        <span class="card-count">${j.stops.length} airports</span>
      </div>
      ${best ? `<div class="card-best">Best: ${best} WPM</div>` : ''}
    `;
    jGrid.appendChild(card);
  }

  // Practice cards
  const pGrid = $('practice-grid');
  pGrid.innerHTML = '';
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.addEventListener('click', () => startPractice(key));
    const best = state.bestScores[key];
    card.innerHTML = `
      <div class="card-icon">${cat.icon}</div>
      <div class="card-title">${cat.name}</div>
      <div class="card-desc">${cat.description}</div>
      <div class="card-count">${cat.words.length} items</div>
      ${best ? `<div class="card-best">Best: ${best} WPM</div>` : ''}
    `;
    pGrid.appendChild(card);
  }
}

// ── SCREENS ──
function showScreen(name) {
  Object.values(screens).forEach(s => { if (s) s.classList.remove('active'); });
  if (screens[name]) screens[name].classList.add('active');
  state.screen = name;
}

function goToMenu() {
  clearInterval(state.timerInterval);
  state.isInfinite = false;
  if (typeof WorldMap !== 'undefined') WorldMap.clear();
  SoundEngine.stopBgm();
  buildMenu();
  showScreen('menu');
}

// ── BOARDING ANIMATION ──
function showBoarding(journeyId) {
  const journey = JOURNEYS.find(j => j.id === journeyId);
  if (!journey) return;

  SoundEngine.boardingChime();

  const boardingScreen = $('boarding-screen');
  const firstAirport = AIRPORTS[journey.stops[0]];
  const lastAirport = AIRPORTS[journey.stops[journey.stops.length - 1]];

  // Build boarding pass — all static data
  $('bp-from-code').textContent = journey.stops[0];
  $('bp-from-city').textContent = firstAirport ? firstAirport.city : '';
  $('bp-to-code').textContent = journey.stops[journey.stops.length - 1];
  $('bp-to-city').textContent = lastAirport ? lastAirport.city : '';
  $('bp-route').textContent = journey.name;
  $('bp-stops').textContent = journey.stops.length + ' airports';
  $('bp-gate').textContent = String.fromCharCode(65 + Math.floor(Math.random() * 8)) + Math.floor(Math.random() * 40 + 1);
  $('bp-seat').textContent = Math.floor(Math.random() * 30 + 1) + String.fromCharCode(65 + Math.floor(Math.random() * 6));
  $('bp-flight').textContent = 'AT' + Math.floor(Math.random() * 9000 + 1000);

  const now = new Date();
  $('bp-time').textContent = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  $('bp-date').textContent = now.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});

  showScreen('boarding');

  // Dice animation for random journeys
  const diceWrap = $('bp-dice-wrap');
  const dice = $('bp-dice');
  if (journeyId.startsWith('random-') || journeyId.startsWith('infinite-')) {
    diceWrap.style.display = '';
    const faces = ['⚀','⚁','⚂','⚃','⚄','⚅'];
    dice.classList.add('rolling');
    SoundEngine.diceRoll();
    let rolls = 0;
    const rollInterval = setInterval(() => {
      dice.textContent = faces[Math.floor(Math.random() * 6)];
      rolls++;
      if (rolls > 10) { clearInterval(rollInterval); dice.classList.remove('rolling'); dice.textContent = '🎲'; }
    }, 80);
  } else {
    diceWrap.style.display = 'none';
  }

  // Status animation
  const status = $('bp-status');
  status.textContent = 'CHECKED IN';
  status.className = 'bp-status';

  setTimeout(() => {
    status.textContent = 'BOARDING...';
    status.className = 'bp-status boarding';
  }, 800);

  setTimeout(() => {
    status.textContent = 'SWIPE TO BOARD →';
    status.className = 'bp-status ready';
  }, 1800);

  // Store journey ID for swipe handler
  _boardingJourneyId = journeyId;
}

// ── RANDOM JOURNEY ──
function startRandomJourney() {
  const allCodes = Object.keys(AIRPORTS);
  const count = 5 + Math.floor(Math.random() * 6); // 5-10 airports
  const stops = [];
  const used = new Set();

  while (stops.length < count) {
    const code = allCodes[Math.floor(Math.random() * allCodes.length)];
    if (!used.has(code)) {
      used.add(code);
      stops.push(code);
    }
  }

  // Create temporary journey
  const randomJourney = {
    id: 'random-' + Date.now(),
    name: `${AIRPORTS[stops[0]].city} → ${AIRPORTS[stops[stops.length-1]].city}`,
    icon: '🎲',
    description: 'Random world tour',
    difficulty: count > 7 ? 'Hard' : 'Medium',
    stops: stops
  };

  // Add to JOURNEYS temporarily for boarding
  JOURNEYS.push(randomJourney);
  showBoarding(randomJourney.id);
}

// ── JOURNEY MODE ──
function startJourney(journeyId) {
  const journey = JOURNEYS.find(j => j.id === journeyId);
  state.mode = 'journey';
  state.journey = journey;
  state.journeyIndex = 0;
  state.isInfinite = journeyId.startsWith('infinite-');
  state.category = 'j-' + journeyId;
  state.typed = '';
  state.score = 0;
  state.combo = 1;
  state.streak = 0;
  state.bestStreak = 0;
  state.totalChars = 0;
  state.correctChars = 0;
  state.wordsCompleted = 0;
  state.airportsVisited = [];
  state.startTime = null;
  clearInterval(state.timerInterval);

  state.words = [];
  for (const code of journey.stops) {
    const airport = AIRPORTS[code];
    if (airport) {
      state.words.push({ type: 'code', text: code, airport: airport });
      state.words.push({ type: 'city', text: airport.city, airport: airport });
      state.words.push({ type: 'country', text: airport.country, airport: airport });
    }
  }
  state.currentIndex = 0;

  $('game-category-name').textContent = journey.name;
  $('timer').textContent = '0:00';
  $('stat-score').textContent = '0';
  $('live-wpm').textContent = '0';
  $('live-accuracy').textContent = '100%';
  $('live-streak').textContent = '0';
  $('live-combo').textContent = 'x1';

  $('journey-progress').style.display = '';
  $('airport-card').style.display = '';
  $('airport-fact').style.display = 'none';
  renderJourneyProgress();
  renderAirportCard();

  showScreen('game');
  renderWord();
  renderQueue();
  syncBackground();

  const input = $('typing-input');
  input.value = '';
  input.focus();

  SoundEngine.startBgm();
}

// ── PRACTICE MODE ──
function startPractice(categoryKey) {
  const cat = CATEGORIES[categoryKey];
  state.mode = 'practice';
  state.journey = null;
  state.category = categoryKey;
  state.words = shuffle([...cat.words]).map(w => ({type:'word', text:w, airport:null}));
  state.currentIndex = 0;
  state.typed = '';
  state.score = 0;
  state.combo = 1;
  state.streak = 0;
  state.bestStreak = 0;
  state.totalChars = 0;
  state.correctChars = 0;
  state.wordsCompleted = 0;
  state.airportsVisited = [];
  state.startTime = null;
  state.gameTime = 60;
  clearInterval(state.timerInterval);

  $('game-category-name').textContent = cat.name;
  $('timer').textContent = formatTime(state.gameTime);
  $('stat-score').textContent = '0';
  $('live-wpm').textContent = '0';
  $('live-accuracy').textContent = '100%';
  $('live-streak').textContent = '0';
  $('live-combo').textContent = 'x1';

  $('journey-progress').style.display = 'none';
  $('airport-card').style.display = 'none';
  $('airport-fact').style.display = 'none';

  showScreen('game');
  renderWord();
  renderQueue();
  syncBackground();

  const input = $('typing-input');
  input.value = '';
  input.focus();

  SoundEngine.startBgm();
}

function retry() {
  if (state.mode === 'journey' && state.journey) {
    if (state.journey.id.startsWith('random-')) {
      // Generate a NEW random route
      startRandomJourney();
    } else {
      startJourney(state.journey.id);
    }
  } else {
    startPractice(state.category);
  }
}

// ── JOURNEY UI ──
function renderJourneyProgress() {
  const container = $('progress-stops');
  container.innerHTML = '';
  if (!state.journey) return;

  const currentAirportIndex = getCurrentJourneyStopIndex();

  state.journey.stops.forEach((code, i) => {
    const stopEl = document.createElement('div');
    stopEl.className = 'progress-stop';
    if (i < currentAirportIndex) stopEl.classList.add('visited');
    else if (i === currentAirportIndex) stopEl.classList.add('current');

    const dot = document.createElement('span');
    dot.className = 'stop-dot';
    const label = document.createElement('span');
    label.className = 'stop-code';
    label.textContent = code;
    stopEl.appendChild(dot);
    stopEl.appendChild(label);
    container.appendChild(stopEl);

    if (i < state.journey.stops.length - 1) {
      const line = document.createElement('div');
      line.className = 'progress-line';
      if (i < currentAirportIndex) line.classList.add('visited');
      container.appendChild(line);
    }
  });
}

function getCurrentJourneyStopIndex() {
  if (!state.journey) return 0;
  return Math.floor(state.currentIndex / 3);
}

function renderAirportCard() {
  if (!state.journey || state.currentIndex >= state.words.length) return;
  const current = state.words[state.currentIndex];
  const airport = current.airport;
  if (!airport) return;

  const code = state.journey.stops[getCurrentJourneyStopIndex()];
  $('airport-code-display').textContent = code;
  $('airport-name-display').textContent = airport.name;
  $('airport-city-display').textContent = `${airport.city}, ${airport.country}`;

  const input = $('typing-input');
  if (current.type === 'code') input.placeholder = 'Type the airport code...';
  else if (current.type === 'city') input.placeholder = 'Type the city name...';
  else if (current.type === 'country') input.placeholder = 'Type the country...';
}

// ── RENDER ──
function renderWord() {
  if (state.currentIndex >= state.words.length) return;
  const word = state.words[state.currentIndex].text;
  const display = $('word-display');
  display.innerHTML = '';

  for (let i = 0; i < word.length; i++) {
    const span = document.createElement('span');
    span.className = 'char';
    // Safe: word[i] is from AIRPORTS/CATEGORIES const data only
    if (word[i] === ' ') {
      span.innerHTML = '&nbsp;';
      span.classList.add('space-char');
    } else {
      span.textContent = word[i];
    }

    if (i < state.typed.length) {
      span.classList.add(state.typed[i].toLowerCase() === word[i].toLowerCase() ? 'correct' : 'incorrect');
    } else if (i === state.typed.length) {
      span.classList.add('current');
    } else {
      span.classList.add('pending');
    }
    display.appendChild(span);
  }

  // Show type label for journey mode
  const oldLabels = display.parentElement.querySelectorAll('.word-type-label');
  oldLabels.forEach(el => el.remove());
  if (state.mode === 'journey') {
    const current = state.words[state.currentIndex];
    const label = document.createElement('div');
    label.className = 'word-type-label';
    if (current.type === 'code') label.textContent = 'IATA Code';
    else if (current.type === 'city') label.textContent = 'City';
    else if (current.type === 'country') label.textContent = 'Country';
    display.parentElement.insertBefore(label, display);
  }
}

function renderQueue() {
  const queue = $('queue-display');
  queue.innerHTML = '';

  if (state.mode === 'journey') {
    const currentStop = getCurrentJourneyStopIndex();
    const startIdx = currentStop * 3;
    for (let i = state.currentIndex + 1; i < Math.min(startIdx + 3, state.words.length); i++) {
      const item = document.createElement('span');
      item.className = 'queue-item';
      item.textContent = state.words[i].text;
      queue.appendChild(item);
    }
    const nextStop = (currentStop + 1) * 3;
    if (nextStop < state.words.length) {
      const nextAirport = state.words[nextStop].airport;
      if (nextAirport) {
        const preview = document.createElement('span');
        preview.className = 'queue-item next-airport';
        preview.textContent = `Next: ${nextAirport.city}`;
        queue.appendChild(preview);
      }
    }
  } else {
    const start = state.currentIndex + 1;
    const end = Math.min(start + 4, state.words.length);
    for (let i = start; i < end; i++) {
      const item = document.createElement('span');
      item.className = 'queue-item';
      item.textContent = state.words[i].text;
      queue.appendChild(item);
    }
  }
}

function syncBackground() {
  if (typeof WorldMap === 'undefined') return;
  if (state.currentIndex >= state.words.length) { WorldMap.clear(); return; }

  if (state.mode === 'journey' && state.journey) {
    const stopIdx = getCurrentJourneyStopIndex();
    const fromCode = state.journey.stops[Math.max(0, stopIdx - 1)];
    const toCode = state.journey.stops[stopIdx];
    WorldMap.showJourneyLeg(fromCode, toCode, state.journey.stops, stopIdx);
  } else {
    const current = state.words[state.currentIndex];
    if (current.type === 'word') {
      WorldMap.setAirline(current.text);
    }
  }
}

// ── INPUT ──
function onInput(e) {
  if (!state.startTime) {
    state.startTime = Date.now();
    if (state.mode === 'practice') startTimer();
  }

  state.typed = e.target.value;
  if (state.currentIndex >= state.words.length) return;
  const currentWord = state.words[state.currentIndex].text;

  if (state.soundEnabled) SoundEngine.keyPress();
  renderWord();

  if (state.typed.toLowerCase() === currentWord.toLowerCase()) {
    wordComplete(true);
  }
}

function onKeyDown(e) {
  if (state.screen !== 'game') return;

  if (e.key === 'Enter') {
    e.preventDefault();
    if (state.currentIndex >= state.words.length) return;
    const currentWord = state.words[state.currentIndex].text;
    if (state.typed.toLowerCase() === currentWord.toLowerCase()) {
      wordComplete(true);
    } else if (state.typed.length > 0) {
      // Wrong — shake but do NOT skip
      if (state.soundEnabled) SoundEngine.incorrect();
      $('typing-input').classList.add('shake');
      setTimeout(() => $('typing-input').classList.remove('shake'), 300);
    }
  }

  if (e.key === 'Tab') {
    e.preventDefault();
  }

  if (e.key === 'Escape' && state.isInfinite) {
    endGame();
  }
}

function wordComplete(correct) {
  if (state.currentIndex >= state.words.length) return;
  const wordObj = state.words[state.currentIndex];
  const word = wordObj.text;

  if (correct) {
    state.totalChars += word.length;
    state.correctChars += word.length;
    state.wordsCompleted++;
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;

    if (state.streak > 0 && state.streak % 5 === 0) {
      state.combo = Math.min(state.combo + 1, 5);
      showComboFlash(state.combo);
      if (state.soundEnabled) SoundEngine.comboChime(state.combo);
      SoundEngine.setCombo(state.combo);
    }

    const baseScore = word.length * 10;
    state.score += baseScore * state.combo;

    if (state.soundEnabled) SoundEngine.correct();

    // Journey: show fact when completing airport (after country)
    if (state.mode === 'journey' && wordObj.type === 'country' && wordObj.airport) {
      state.airportsVisited.push(wordObj.airport);
      showAirportFact(wordObj.airport);
      if (state.soundEnabled) SoundEngine.takeoff();
    }
  } else {
    // Wrong word — do NOT advance
    state.streak = 0;
    state.combo = 1;
    if (state.soundEnabled) SoundEngine.incorrect();
    SoundEngine.setCombo(1);
    $('typing-input').classList.add('shake');
    setTimeout(() => $('typing-input').classList.remove('shake'), 300);
    return; // Stay on same word
  }

  state.currentIndex++;

  if (state.mode === 'journey' && state.currentIndex >= state.words.length) {
    if (state.isInfinite) {
      // Replenish with more random airports
      const allCodes = Object.keys(AIRPORTS);
      const more = shuffle([...allCodes]).slice(0, 20);
      for (const code of more) {
        const airport = AIRPORTS[code];
        if (airport) {
          state.words.push({ type: 'code', text: code, airport });
          state.words.push({ type: 'city', text: airport.city, airport });
          state.words.push({ type: 'country', text: airport.country, airport });
        }
      }
      if (state.journey) state.journey.stops.push(...more);
    } else {
      endGame();
      return;
    }
  }

  if (state.mode === 'practice' && state.currentIndex >= state.words.length) {
    state.words = shuffle([...CATEGORIES[state.category].words]).map(w => ({type:'word', text:w, airport:null}));
    state.currentIndex = 0;
  }

  state.typed = '';
  $('typing-input').value = '';
  renderWord();
  renderQueue();
  updateStats();
  syncBackground();

  if (state.mode === 'journey') {
    renderJourneyProgress();
    renderAirportCard();
  }
}

function showAirportFact(airport) {
  const factEl = $('airport-fact');
  factEl.style.display = '';
  factEl.textContent = `✈ ${airport.city} — ${airport.fact}`;
  factEl.classList.add('fact-enter');
  setTimeout(() => {
    factEl.classList.remove('fact-enter');
    factEl.style.display = 'none';
  }, 3000);
}

function showComboFlash(combo) {
  const flash = document.createElement('div');
  flash.className = 'combo-flash';
  flash.textContent = `x${combo}`;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 600);
}

function startTimer() {
  let remaining = state.gameTime;
  $('timer').textContent = formatTime(remaining);

  state.timerInterval = setInterval(() => {
    remaining--;
    $('timer').textContent = formatTime(remaining);
    updateStats();

    if (remaining <= 0) {
      clearInterval(state.timerInterval);
      endGame();
    }
  }, 1000);
}

function updateStats() {
  const elapsed = (Date.now() - state.startTime) / 1000 / 60;
  const wpm = elapsed > 0 ? Math.round(state.correctChars / 5 / elapsed) : 0;
  const accuracy = state.totalChars > 0
    ? Math.round((state.correctChars / state.totalChars) * 100) : 100;

  $('live-wpm').textContent = wpm;
  $('live-accuracy').textContent = accuracy + '%';
  $('live-streak').textContent = state.streak;
  $('live-combo').textContent = 'x' + state.combo;
  $('stat-score').textContent = state.score;

  if (state.mode === 'journey' && state.startTime) {
    const sec = Math.floor((Date.now() - state.startTime) / 1000);
    $('timer').textContent = formatTime(sec);
  }
}

function endGame() {
  clearInterval(state.timerInterval);
  SoundEngine.stopBgm();

  const elapsed = (Date.now() - state.startTime) / 1000;
  const elapsedMin = elapsed / 60;
  const wpm = elapsedMin > 0 ? Math.round(state.correctChars / 5 / elapsedMin) : 0;
  const accuracy = state.totalChars > 0
    ? Math.round((state.correctChars / state.totalChars) * 100) : 100;

  const key = state.category;
  const prev = state.bestScores[key] || 0;
  if (wpm > prev) {
    state.bestScores[key] = wpm;
    localStorage.setItem('aero-typing-best', JSON.stringify(state.bestScores));
  }

  if (state.mode === 'journey') {
    $('result-title').textContent = 'Journey Complete ✈️';
    if (state.soundEnabled) SoundEngine.fanfare();
  } else {
    $('result-title').textContent = 'Flight Complete ✈️';
  }

  $('result-category').textContent = state.mode === 'journey'
    ? state.journey.name
    : CATEGORIES[state.category].name;
  $('result-wpm').textContent = wpm;
  $('result-accuracy').textContent = accuracy + '%';
  $('result-score').textContent = state.score;
  $('result-time').textContent = formatTime(Math.round(elapsed));
  $('result-words').textContent = state.wordsCompleted;
  $('result-best-streak').textContent = state.bestStreak;

  // Airports learned
  const learnedSection = $('airports-learned');
  if (state.mode === 'journey' && state.airportsVisited.length > 0) {
    learnedSection.style.display = '';
    const list = $('learned-list');
    list.innerHTML = '';
    state.airportsVisited.forEach(a => {
      const el = document.createElement('div');
      el.className = 'learned-airport';
      const code = document.createElement('span');
      code.className = 'learned-code';
      const codeStr = Object.keys(AIRPORTS).find(k => AIRPORTS[k] === a) || '';
      code.textContent = codeStr;
      const city = document.createElement('span');
      city.className = 'learned-city';
      city.textContent = a.city;
      el.appendChild(code);
      el.appendChild(city);
      list.appendChild(el);
    });
  } else {
    learnedSection.style.display = 'none';
  }

  const rankEl = $('result-rank');
  if (wpm >= 80) {
    rankEl.textContent = '🏆 Captain — Elite Typist';
    rankEl.className = 'result-rank captain';
  } else if (wpm >= 60) {
    rankEl.textContent = '✈️ First Officer — Impressive';
    rankEl.className = 'result-rank first-officer';
  } else if (wpm >= 40) {
    rankEl.textContent = '🛫 Co-Pilot — Getting There';
    rankEl.className = 'result-rank copilot';
  } else {
    rankEl.textContent = '📋 Trainee — Keep Practicing';
    rankEl.className = 'result-rank trainee';
  }

  if (typeof WorldMap !== 'undefined') WorldMap.clear();
  showScreen('result');
}

// ── SWIPE TO BOARD ──
let _boardingJourneyId = null;

function setupSwipe() {
  const track = $('bp-swipe-track');
  const handle = $('bp-swipe-handle');
  if (!track || !handle) return;

  let startX = 0;
  let dragging = false;
  const threshold = 0.7; // 70% of track width

  function onStart(e) {
    dragging = true;
    startX = (e.touches ? e.touches[0] : e).clientX;
    handle.style.transition = 'none';
  }

  function onMove(e) {
    if (!dragging) return;
    const x = (e.touches ? e.touches[0] : e).clientX;
    const dx = x - startX;
    const pct = Math.min(1, Math.max(0, dx / (track.offsetWidth - 80)));
    handle.style.width = (80 + pct * (track.offsetWidth - 80)) + 'px';
  }

  function onEnd() {
    if (!dragging) return;
    dragging = false;
    handle.style.transition = 'width 0.3s ease';
    const pct = handle.offsetWidth / track.offsetWidth;
    if (pct >= threshold) {
      handle.classList.add('swiped');
      handle.textContent = '✈ Boarding!';
      handle.style.width = '100%';
      setTimeout(() => {
        handle.classList.remove('swiped');
        handle.textContent = '▸ Swipe';
        handle.style.width = '80px';
        if (_boardingJourneyId) startJourney(_boardingJourneyId);
      }, 600);
    } else {
      handle.style.width = '80px';
    }
  }

  track.addEventListener('mousedown', onStart);
  track.addEventListener('touchstart', onStart, { passive: true });
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchend', onEnd);
}

// ── CUSTOM ROUTE ──
function setupCustomRoute() {
  const startBtn = $('custom-start-btn');
  const backBtn = $('custom-back-btn');
  if (!startBtn || !backBtn) return;

  startBtn.addEventListener('click', () => {
    const raw = $('custom-raw-route').value.toUpperCase();
    const codes = raw.split(/[\s,]+/).filter(c => AIRPORTS[c]);
    if (codes.length < 2) { alert('Need at least 2 valid airport codes'); return; }
    if (codes.length > 12) codes.length = 12;

    const customJourney = {
      id: 'custom-' + Date.now(),
      name: `${AIRPORTS[codes[0]].city} to ${AIRPORTS[codes[codes.length-1]].city}`,
      icon: '🛠️',
      description: 'Custom route',
      difficulty: codes.length > 6 ? 'Hard' : 'Medium',
      stops: codes
    };
    JOURNEYS.push(customJourney);
    $('custom-raw-route').value = '';
    showBoarding(customJourney.id);
  });

  backBtn.addEventListener('click', goToMenu);
}

// ── INFINITE MODE ──
function startInfinite() {
  const allCodes = Object.keys(AIRPORTS);
  const shuffled = shuffle([...allCodes]);
  const stops = shuffled.slice(0, 50); // start with 50, replenish later

  const infJourney = {
    id: 'infinite-' + Date.now(),
    name: 'Infinite Flight',
    icon: '∞',
    description: 'Non-stop world tour',
    difficulty: 'Endurance',
    stops: stops
  };
  JOURNEYS.push(infJourney);

  state.isInfinite = true;
  showBoarding(infJourney.id);
}

// ── UTILS ──
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

init();
