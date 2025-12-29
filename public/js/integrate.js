
let integrationData = null;
let navigationStack = [];

async function loadIntegrationData() {
    if (integrationData) return integrationData;
    try {
        // For now, we only have theme 1. In future, we could have an index or merge them.
        const res = await fetch('/data/integration_theme_1.json');
        if (!res.ok) throw new Error("Failed to load content");
        integrationData = await res.json();
        return integrationData;
    } catch (e) {
        console.error(e);
        alert("Impossible de charger le contenu : " + e.message);
        return null;
    }
}

function startIntegrationFlow(themeId) {
    // Currently only supporting theme 1
    if (themeId !== 'theme-1') {
        alert("Ce thème n'est pas encore disponible.");
        return;
    }

    loadIntegrationData().then(data => {
        if (!data) return;

        navigationStack = []; // Reset stack
        navigateToNode(data); // Start at root

        // Switch view to content view
        document.querySelectorAll('section').forEach(el => el.classList.add('hidden'));
        document.getElementById('integrate-content-view').classList.remove('hidden');
    });
}

function navigateToNode(node) {
    navigationStack.push(node);
    renderNode(node);
}

function navigateBackIntegration() {
    if (navigationStack.length > 1) {
        navigationStack.pop(); // Remove current
        const previous = navigationStack[navigationStack.length - 1];
        renderNode(previous);
    } else {
        // If at root, go back to main menu
        const views = {
            integrateMenu: document.getElementById('integrate-view'),
            integrateContent: document.getElementById('integrate-content-view')
        };
        views.integrateContent.classList.add('hidden');
        views.integrateMenu.classList.remove('hidden');
    }
}

function renderNode(node) {
    const titleEl = document.getElementById('integrate-content-title');
    const bodyEl = document.getElementById('integrate-content-body');

    // Set Header
    titleEl.textContent = node.title || "Contenu";
    bodyEl.innerHTML = ''; // Clear previous content

    // Render based on type
    if (node.type === 'category' || (node.children && node.children.length > 0)) {
        renderCategory(node, bodyEl);
    } else if (node.type === 'fiche' || node.content_blocks) {
        renderFiche(node, bodyEl);
    }
}

function renderCategory(node, container) {
    const grid = document.createElement('div');
    grid.className = 'menu-grid';

    if (node.children) {
        node.children.forEach(child => {
            const card = document.createElement('div');
            card.className = 'menu-card';
            card.style.minHeight = '150px'; // Slightly smaller cards for sub-items

            // Icon based on title keywords (simple heuristic)
            let icon = '📄';
            if (child.title.toLowerCase().includes('liberté')) icon = '🕊️';
            if (child.title.toLowerCase().includes('égalité')) icon = '⚖️';
            if (child.title.toLowerCase().includes('fraternité')) icon = '🤝';
            if (child.title.toLowerCase().includes('laïcité')) icon = '🏛️';
            if (child.title.toLowerCase().includes('symbole')) icon = '🇫🇷';

            card.innerHTML = `
                <div style="font-size: 2em; margin-bottom: 10px;">${icon}</div>
                <h3>${child.title}</h3>
            `;

            card.onclick = () => navigateToNode(child);
            grid.appendChild(card);
        });
    }

    container.appendChild(grid);
}

function renderFiche(node, container) {
    const article = document.createElement('div');
    article.className = 'fiche-content';
    article.style.textAlign = 'left';
    article.style.maxWidth = '800px';
    article.style.margin = '0 auto';
    article.style.padding = '20px';
    article.style.background = 'white';
    article.style.borderRadius = '16px';
    article.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';

    if (node.content_blocks) {
        node.content_blocks.forEach(block => {
            const el = document.createElement(block.tag);
            el.textContent = block.text;

            // Simple styling
            if (block.tag === 'h2') {
                el.style.color = '#1a1a1a';
                el.style.borderBottom = '2px solid #eee';
                el.style.paddingBottom = '10px';
                el.style.marginTop = '30px';
            }
            if (block.tag === 'h3') {
                el.style.color = '#667eea';
                el.style.marginTop = '20px';
            }
            if (block.tag === 'p') {
                el.style.lineHeight = '1.6';
                el.style.marginBottom = '15px';
                el.style.color = '#333';
            }
            if (block.tag === 'ul') {
                el.style.paddingLeft = '20px';
                el.style.marginBottom = '15px';
            }

            article.appendChild(el);
        });
    }

    container.appendChild(article);
}

// Exports
window.startIntegrationFlow = startIntegrationFlow;
window.navigateBackIntegration = navigateBackIntegration;
