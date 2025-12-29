
document.addEventListener('DOMContentLoaded', () => {
    // Views Configuration
    const views = {
        mainMenu: document.getElementById('main-menu'),
        improveMenu: document.getElementById('improve-menu'),
        genderGame: document.getElementById('gender-game-view'),
        sejourMenu: document.getElementById('sejour-menu'),
        flashcards: document.getElementById('sejour-view'),
        integrate: document.getElementById('integrate-view')
    };

    // Main Menu Navigation
    const btnImprove = document.getElementById('card-improve');
    const btnSejour = document.getElementById('card-sejour');
    const btnIntegrate = document.getElementById('card-integrate');

    if (btnImprove) {
        btnImprove.onclick = () => {
            navigateTo('improveMenu');
        };
    }

    if (btnSejour) {
        btnSejour.onclick = () => {
            navigateTo('sejourMenu');
        };
    }

    if (btnIntegrate) {
        btnIntegrate.onclick = () => {
            navigateTo('integrate');
        };
    }

    // Improve Sub-menu Navigation
    const btnGenderSwipe = document.getElementById('btn-gender-swipe');
    if (btnGenderSwipe) {
        btnGenderSwipe.onclick = () => {
            navigateTo('genderGame');
        };
    }

    // Sejour Sub-menu Navigation
    const btnCsp = document.getElementById('btn-csp');
    const btnCr = document.getElementById('btn-cr');

    if (btnCsp) {
        btnCsp.onclick = () => {
            navigateTo('flashcards');
            if (window.startFlashcards) window.startFlashcards('csp');
        };
    }

    if (btnCr) {
        btnCr.onclick = () => {
            navigateTo('flashcards');
            if (window.startFlashcards) window.startFlashcards('cr');
        };
    }

    // Back Navigation
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling if nested

            // Determine where to go based on current view
            if (views.flashcards && !views.flashcards.classList.contains('hidden')) {
                navigateTo('sejourMenu');
            } else if (views.genderGame && !views.genderGame.classList.contains('hidden')) {
                navigateTo('improveMenu');
            } else if (views.improveMenu && !views.improveMenu.classList.contains('hidden')) {
                navigateTo('mainMenu');
            } else if (views.sejourMenu && !views.sejourMenu.classList.contains('hidden')) {
                navigateTo('mainMenu');
            } else if (views.integrate && !views.integrate.classList.contains('hidden')) {
                navigateTo('mainMenu');
            } else {
                navigateTo('mainMenu');
            }
        });
    });

    function navigateTo(viewName) {
        // Hide all views
        Object.values(views).forEach(el => {
            if (el) el.classList.add('hidden');
        });

        // Show target view
        if (views[viewName]) {
            views[viewName].classList.remove('hidden');
        }
    }

    // Initialize Gender Game (bind events)
    if (window.initGenderGame) {
        window.initGenderGame();
    }

    // Show Main Menu by default handled by HTML/CSS classes (hidden or not)
    // Ensure correct initial state
    navigateTo('mainMenu');
});
