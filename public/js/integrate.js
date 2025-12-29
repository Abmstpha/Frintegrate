
let integrationData = null;
let currentThemeId = null;
let navigationStack = [];

async function loadIntegrationData(themeId) {
    if (integrationData && currentThemeId === themeId) return integrationData;
    try {
        const filename = `integration_${themeId.replace('-', '_')}.json`;
        const res = await fetch(`/data/${filename}`);
        if (!res.ok) throw new Error("Failed to load content for " + themeId);
        integrationData = await res.json();
        currentThemeId = themeId;
        return integrationData;
    } catch (e) {
        console.error(e);
        alert("Impossible de charger le contenu : " + e.message);
        return null;
    }
}

function startIntegrationFlow(themeId) {
    loadIntegrationData(themeId).then(data => {
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

// Progress Tracking
function getProgress() {
    return JSON.parse(localStorage.getItem('frintegrate_progress') || '{}');
}

function toggleReadStatus(url) {
    const progress = getProgress();
    const isNowRead = !progress[url];

    if (isNowRead) {
        progress[url] = true;
    } else {
        delete progress[url];
    }
    localStorage.setItem('frintegrate_progress', JSON.stringify(progress));

    // Update UI if any cards are visible matching this URL
    document.querySelectorAll(`[data-url="${url}"]`).forEach(el => {
        if (isNowRead) {
            el.classList.add('completed');
            if (!el.querySelector('.status-badge')) {
                el.insertAdjacentHTML('beforeend', '<div class="status-badge">✅ Lu</div>');
            }
        } else {
            el.classList.remove('completed');
            const badge = el.querySelector('.status-badge');
            if (badge) badge.remove();
        }
    });

    return isNowRead; // Return new status
}

function isRead(url) {
    const progress = getProgress();
    return !!progress[url];
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
            card.style.minHeight = '160px'; // Slightly taller
            card.setAttribute('data-url', child.url);

            // Icon based on title keywords (simple heuristic)
            let icon = '📄';
            const lowerTitle = child.title.toLowerCase();
            if (lowerTitle.includes('liberté')) icon = '🕊️';
            else if (lowerTitle.includes('égalité')) icon = '⚖️';
            else if (lowerTitle.includes('fraternité')) icon = '🤝';
            else if (lowerTitle.includes('laïcité')) icon = '🏛️';
            else if (lowerTitle.includes('symbole')) icon = '🇫🇷';
            else if (lowerTitle.includes('histoire')) icon = '📚';
            else if (lowerTitle.includes('guerre')) icon = '⚔️';
            else if (lowerTitle.includes('culture')) icon = '🎨';
            else if (lowerTitle.includes('vote')) icon = '🗳️';
            else if (lowerTitle.includes('droit')) icon = '📜';
            else if (lowerTitle.includes('sécurité')) icon = '👮';
            else if (lowerTitle.includes('santé')) icon = '🏥';
            else if (lowerTitle.includes('travail')) icon = '💼';

            // Check status
            const completedClass = isRead(child.url) ? 'completed' : '';
            const badge = isRead(child.url) ? '<div class="status-badge">✅ Lu</div>' : '';

            card.innerHTML = `
                <div style="font-size: 2.5em; margin-bottom: 15px;">${icon}</div>
                <h3 style="font-size: 1.1em; line-height: 1.4;">${child.title}</h3>
                ${badge}
            `;
            if (completedClass) card.classList.add(completedClass);

            card.onclick = () => navigateToNode(child);
            grid.appendChild(card);
        });
    }

    container.appendChild(grid);
}

function renderFiche(node, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'fiche-wrapper animate-fade-in';

    // Objectives Card Logic
    let objectives = [];
    let bodyBlocks = [];

    let capturingObjectives = false;

    if (node.content_blocks) {
        node.content_blocks.forEach(block => {
            const text = block.text;
            // Identify objective headers (loose match)
            if (text.toLowerCase().includes('objectifs de la fiche') || text.toLowerCase().includes('objectif de la fiche')) {
                capturingObjectives = true;
                return; // Skip the header itself
            }

            // Heuristic to stop capturing objectives
            if (capturingObjectives) {
                if (block.tag.startsWith('h')) {
                    capturingObjectives = false;
                    bodyBlocks.push(block); // It's a new section
                } else {
                    objectives.push(block);
                }
            } else {
                bodyBlocks.push(block);
            }
        });
    }

    // Render Objectives
    if (objectives.length > 0) {
        const objCard = document.createElement('div');
        objCard.className = 'objectives-card';
        objCard.innerHTML = `
            <div class="obj-icon">🎯</div>
            <div class="obj-content">
                <h4 style="margin:0 0 10px 0;">Objectifs</h4>
                <ul style="margin:0; padding-left:20px;">
                    ${objectives.map(o => `<li>${o.text}</li>`).join('')}
                </ul>
            </div>
        `;
        wrapper.appendChild(objCard);
    }

    // Render Body
    const contentBody = document.createElement('div');
    contentBody.className = 'fiche-body';

    bodyBlocks.forEach(block => {
        const el = document.createElement(block.tag);
        el.textContent = block.text;

        // Add classes for styling hooks in CSS
        if (block.tag === 'h2') el.className = 'fiche-h2';
        if (block.tag === 'h3') el.className = 'fiche-h3';
        if (block.tag === 'p') el.className = 'fiche-p';
        if (block.tag === 'ul') el.className = 'fiche-ul';

        contentBody.appendChild(el);
    });

    wrapper.appendChild(contentBody);

    // Completion Action
    const actionArea = document.createElement('div');
    actionArea.className = 'fiche-actions';
    actionArea.style.marginTop = '40px';
    actionArea.style.textAlign = 'center';
    actionArea.style.paddingBottom = '40px';

    const isDone = isRead(node.url);
    const btn = document.createElement('button');
    btn.className = `action-btn ${isDone ? 'completed' : ''}`;
    btn.textContent = isDone ? '✅ Terminé' : 'Marquer comme lu';
    // Remove disabled attribute setting

    btn.onclick = (e) => {
        const newState = toggleReadStatus(node.url);
        if (newState) {
            btn.textContent = '✅ Terminé';
            btn.classList.add('completed');
        } else {
            btn.textContent = 'Marquer comme lu';
            btn.classList.remove('completed');
        }
        // Do NOT disable the button, allowing toggle
        btn.disabled = false;
    };

    actionArea.appendChild(btn);
    wrapper.appendChild(actionArea);

    container.appendChild(wrapper);
}

// Exports
window.startIntegrationFlow = startIntegrationFlow;
window.navigateBackIntegration = navigateBackIntegration;
