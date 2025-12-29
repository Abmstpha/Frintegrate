
let flashcardData = [];
let currentCardIndex = 0;
let isFlipped = false;
let currentType = '';

// We will bind elements dynamically or assume IDs exist
// IDs expected:
// - flashcard-view (container)
// - flashcard-card (the flippable element)
// - flashcard-question
// - flashcard-category
// - flashcard-answer
// - flashcard-counter

async function loadFlashcardData(type) {
    const url = type === 'csp' ? '/data/questions-csp.json' : '/data/questions-cr.json';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load questions');
    return await res.json();
}

async function startFlashcards(type) {
    currentType = type;
    try {
        const rawData = await loadFlashcardData(type);

        // Flatten the new object structure { "Category": [qs...], ... } -> [ {category, ...q}, ... ]
        flashcardData = [];

        if (Array.isArray(rawData)) {
            // Fallback if data is still an array
            flashcardData = rawData;
        } else {
            // New structure: Iterate over categories
            for (const [category, questions] of Object.entries(rawData)) {
                if (Array.isArray(questions)) {
                    questions.forEach(q => {
                        flashcardData.push({
                            ...q,
                            category: category // Add category field back to the item
                        });
                    });
                }
            }
        }

        // Shuffle for randomness
        flashcardData.sort(() => Math.random() - 0.5);

        currentCardIndex = 0;
        isFlipped = false;
        renderCard();
    } catch (e) {
        console.error(e);
        alert('Error loading questions: ' + e.message);
    }
}

function renderCard() {
    if (!flashcardData.length) return;
    const item = flashcardData[currentCardIndex];

    const questionEl = document.getElementById('flashcard-question');
    const categoryEl = document.getElementById('flashcard-category');
    const answerEl = document.getElementById('flashcard-answer');
    const cardEl = document.getElementById('flashcard-card');
    const counterEl = document.getElementById('flashcard-counter');

    if (questionEl) questionEl.textContent = item.question;
    if (categoryEl) categoryEl.innerText = item.category; // innerText to handle potential styling if needed
    if (answerEl) answerEl.textContent = item.answer;

    // Reset flip state
    isFlipped = false;
    if (cardEl) cardEl.classList.remove('flipped');

    if (counterEl) counterEl.textContent = `${currentCardIndex + 1} / ${flashcardData.length}`;
}

function flipCard() {
    isFlipped = !isFlipped;
    const cardEl = document.getElementById('flashcard-card');
    if (cardEl) cardEl.classList.toggle('flipped');
}

function nextCard(e) {
    if (e) e.stopPropagation(); // Prevent flip if clicking button inside card area
    if (currentCardIndex < flashcardData.length - 1) {
        currentCardIndex++;
        renderCard();
    } else {
        // Loop back to start
        currentCardIndex = 0;
        renderCard();
    }
}

function prevCard(e) {
    if (e) e.stopPropagation();
    if (currentCardIndex > 0) {
        currentCardIndex--;
        renderCard();
    }
}

// Keyboard navigation for flashcards
document.addEventListener('keydown', (e) => {
    const view = document.getElementById('sejour-view'); // Specific view wrapper
    // Ensure we are in flashcard mode. 
    // We can check if the view is not hidden.
    if (view && !view.classList.contains('hidden')) {
        if (e.code === 'Space') {
            flipCard();
            e.preventDefault(); // Prevent scrolling
        }
        if (e.code === 'ArrowRight') nextCard();
        if (e.code === 'ArrowLeft') prevCard();
    }
});

// Touch Swipe Logic for Flashcards
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => {
    const flashcardContainer = document.querySelector('.flashcard-container');
    if (flashcardContainer) {
        flashcardContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        flashcardContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
});

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swiped Left -> Next Card
        nextCard();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        // Swiped Right -> Previous Card
        prevCard();
    }
}

// Exports
window.startFlashcards = startFlashcards;
window.flipCard = flipCard;
window.nextCard = nextCard;
window.prevCard = prevCard;
