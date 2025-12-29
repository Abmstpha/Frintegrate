
// State variables
let currentWords = [], currentWordIndex = 0, score = 0, gameActive = false;
let history = [];
let cachedWords = null;

// DOM Elements references
let startScreen, loadingScreen, gameScreen, scoreScreen, errorScreen;
let currentWordEl, currentTransEl, progressBar, progressText, wordCard;
let finalScore, scoreMessage, errorMessage;
let reviewBtn, reviewOverlay, reviewPanel, reviewHistoryList;

// Initialization function
function initGenderGame() {
  // Bind DOM elements
  startScreen = document.getElementById('gender-start-screen');
  loadingScreen = document.getElementById('gender-loading-screen');
  gameScreen = document.getElementById('gender-game-screen');
  scoreScreen = document.getElementById('gender-score-screen');
  errorScreen = document.getElementById('gender-error-screen');

  currentWordEl = document.getElementById('current-word');
  currentTransEl = document.getElementById('current-translation');
  progressBar = document.getElementById('progress-bar');
  progressText = document.getElementById('progress-text');
  wordCard = document.getElementById('word-card');

  finalScore = document.getElementById('final-score');
  scoreMessage = document.getElementById('score-message');
  errorMessage = document.getElementById('error-message');

  reviewBtn = document.getElementById('review-btn');
  reviewOverlay = document.getElementById('review-overlay');
  reviewPanel = document.getElementById('review-panel');
  reviewHistoryList = document.getElementById('review-history-list');

  // Attach event listeners
  if (reviewBtn) reviewBtn.onclick = showReviewPanel;

  // Review overlay close events
  if (reviewOverlay) {
    reviewOverlay.addEventListener('click', (e) => {
      if (e.target === reviewOverlay) closeReviewPanel();
    });

    // Close button inside panel
    const closeBtn = reviewPanel.querySelector('.review-close-btn');
    if (closeBtn) closeBtn.onclick = closeReviewPanel;
  }

  // Keyboard events
  document.addEventListener('keydown', handleGenderKeydown);

  // Touch/Mouse events on word card
  if (wordCard) {
    let touchStartX = 0, mouseStartX = 0, isDown = false;

    wordCard.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
    wordCard.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 50) makeGenderGuess(dx > 0 ? 'masculine' : 'feminine', dx > 0 ? 'right' : 'left');
    });

    wordCard.addEventListener('mousedown', e => { mouseStartX = e.clientX; isDown = true; });
    wordCard.addEventListener('mouseup', e => {
      if (!isDown) return;
      const dx = e.clientX - mouseStartX;
      if (Math.abs(dx) > 50) makeGenderGuess(dx > 0 ? 'masculine' : 'feminine', dx > 0 ? 'right' : 'left');
      isDown = false;
    });

    wordCard.addEventListener('mouseleave', () => isDown = false);
    wordCard.addEventListener('selectstart', e => e.preventDefault());
  }
}

function handleGenderKeydown(e) {
  if (!gameActive) return;
  // Ensure we are in the gender game view?
  // Ideally checking if gender-game-screen is visible
  if (gameScreen && gameScreen.style.display !== 'none') {
    if (e.key === 'ArrowLeft') makeGenderGuess('feminine', 'left');
    if (e.key === 'ArrowRight') makeGenderGuess('masculine', 'right');
  }
}

async function loadWordsOnce() {
  if (cachedWords) return cachedWords;
  const res = await fetch('/data/words.json');
  if (!res.ok) throw new Error('Unable to fetch local words.json');
  cachedWords = await res.json();
  return cachedWords;
}

async function loadLocalWords() {
  const allWords = await loadWordsOnce();
  return shuffle([...allWords]).slice(0, 30);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

async function startGenderGame() {
  // Re-bind elements in case they were hidden/detached? 
  // initGenderGame() should be called once on page load.

  currentWords = []; currentWordIndex = 0; score = 0; gameActive = false;
  history = [];

  hideAllGenderScreens();
  if (loadingScreen) loadingScreen.style.display = 'block';

  try {
    currentWords = await loadLocalWords();
  } catch (e) {
    return showGenderError(e.message);
  }

  gameActive = true;
  hideAllGenderScreens();
  if (gameScreen) gameScreen.style.display = 'block';
  displayCurrentGenderWord();
}

function displayCurrentGenderWord() {
  if (currentWordIndex >= currentWords.length) return endGenderGame();
  const w = currentWords[currentWordIndex];
  if (currentWordEl) currentWordEl.textContent = w.word;
  if (currentTransEl) currentTransEl.textContent = w.translation;

  if (progressBar) {
    const prog = ((currentWordIndex + 1) / currentWords.length) * 100;
    progressBar.style.width = prog + '%';
  }
  if (progressText) {
    progressText.textContent = `Word ${currentWordIndex + 1} of ${currentWords.length}`;
  }
  if (wordCard) wordCard.className = 'word-card';
}

function makeGenderGuess(guess, swipeDirection = null) {
  if (!gameActive) return;
  gameActive = false;

  const w = currentWords[currentWordIndex];
  const isCorrect = guess === w.gender;

  history.push({
    word: w.word,
    translation: w.translation,
    gender: w.gender,
    wasCorrect: isCorrect,
    guess: guess
  });

  const swipeClass = swipeDirection === 'left'
    ? 'slide-left'
    : swipeDirection === 'right'
      ? 'slide-right'
      : guess === 'feminine'
        ? 'slide-left'
        : 'slide-right';

  if (isCorrect) {
    score++;
    wordCard.classList.add('correct', swipeClass);
  } else {
    wordCard.classList.add('incorrect', swipeClass);
  }

  setTimeout(() => {
    wordCard.className = 'word-card';
    currentWordIndex++;

    if (currentWordIndex < currentWords.length) {
      displayCurrentGenderWord();
      gameActive = true;
    } else {
      endGenderGame();
    }
  }, 600);
}

function endGenderGame() {
  gameActive = false;
  hideAllGenderScreens();
  if (scoreScreen) scoreScreen.style.display = 'block';

  if (finalScore) finalScore.textContent = `You got ${score} out of 30 correct`;

  let cls = '', msg = '';
  if (score === 30) {
    cls = 'score-perfect';
    msg = '🏆 Perfect score! You’re a gender guru!';
  } else if (score >= 27) {
    cls = 'score-excellent';
    msg = '🎉 Excellent! Almost perfect!';
  } else if (score >= 23) {
    cls = 'score-great';
    msg = '👍 Great job!';
  } else if (score >= 18) {
    cls = 'score-good';
    msg = '🙂 Not bad! Keep practicing!';
  } else if (score >= 12) {
    cls = 'score-ok';
    msg = '🤔 You’re getting there! Keep studying';
  } else {
    cls = 'score-needs-work';
    msg = '📚 Keep studying—practice makes perfect!';
  }

  if (finalScore) finalScore.className = `final-score ${cls}`;
  if (scoreMessage) scoreMessage.textContent = msg;

  if (reviewBtn) {
    reviewBtn.style.display = history.length > 0 ? 'inline-block' : 'none';
  }
}

function showReviewPanel() {
  if (!reviewHistoryList) return;
  reviewHistoryList.innerHTML = '';
  history.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'review-card ' + (item.wasCorrect ? 'correct' : 'incorrect');
    div.innerHTML = `
      <span class="review-word">${item.word}</span>
      <span class="review-translation">${item.translation || ''}</span>
      <span class="review-gender">${item.gender === 'feminine' ? 'la (f)' : 'le (m)'}</span>
      <span class="review-correctness">${item.wasCorrect ? '✔' : '✖'}</span>
    `;
    reviewHistoryList.appendChild(div);
  });

  if (reviewOverlay) {
    reviewOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeReviewPanel() {
  if (reviewOverlay) reviewOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

function hideAllGenderScreens() {
  [startScreen, loadingScreen, gameScreen, scoreScreen, errorScreen].forEach(el => {
    if (el) el.style.display = 'none';
  });
  closeReviewPanel();
}

function showGenderError(msg) {
  hideAllGenderScreens();
  if (errorMessage) errorMessage.textContent = msg;
  if (errorScreen) errorScreen.style.display = 'block';
}

// Global exposure
window.initGenderGame = initGenderGame;
window.startGenderGame = startGenderGame;
