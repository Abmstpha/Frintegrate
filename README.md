# 🇫🇷 Frintegrate

**Frintegrate** is your all-in-one companion for learning French and integrating into French society. It combines interactive language learning games with essential civic knowledge tools.

## 🎮 Live Demo

**[Play Now on Frintegrate](https://frintegrate.onrender.com)**

## ✨ Features

### 1. 🗣️ Improve your French

- **Genre Swipe Game**: Master the difference between *le* (masculine) and *la* (feminine).
- **1,134+ Words**: Extensive vocabulary covering everyday nouns.
- **Mobile Responsive**: Smooth swipe gestures for a native app feel.
- **Review Mode**: Learn from your mistakes with a dedicated review panel.

### 2. 🪪 Prepare for Séjour

- **Civic Flashcards**: Interactive study tool for residence permit exams.
- **Targeted Content**:
  - **CSP**: Questions for *Carte de Séjour Pluriannuelle*.
  - **CR**: Questions for *Carte de Résident*.
- **Touch Navigation**: Swipe between cards on mobile.

### 3. 🏰 Learn and Integrate France

- Placeholder for future modules on History, Geography, and Republican Values.

---

## 🎯 How to Use

### Genre Swipe

1. Navigate to **Improve your French** > **Genre Swipe**.
2. Swipe **Left** for Feminine (*la*), **Right** for Masculine (*le*).
3. Complete 30 words and check your score!

### Flashcards

1. Navigate to **Prepare for Séjour**.
2. Select your exam (**CSP** or **CR**).
3. Read the question, tap the card to **flip** and see the answer.
4. Swipe **Left** for next card, **Right** for previous (or use arrow keys).

---

## 📁 Project Structure

The project has been refactored into a clean, modular architecture:

```
Frintegrate/
├── public/
│   ├── css/
│   │   └── styles.css          # Centralized styling
│   ├── js/
│   │   ├── main.js             # Navigation & View Config
│   │   ├── game-gender.js      # 'Genre Swipe' Game Logic
│   │   └── flashcards.js       # Flashcard Logic
│   ├── data/
│   │   ├── questions-csp.json  # CSP Exam Questions
│   │   ├── questions-cr.json   # CR Exam Questions
│   │   └── words.json          # French Nouns Database
│   └── index.html              # Main SPA Entry Point
├── server.js                   # Node.js Express Server
├── package.json                # Dependencies
└── .gitignore                  # Git Configuration
```

## 🚀 Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 (Animations, Gradients), JavaScript (ES6+).
- **Backend**: Node.js, Express (serves static assets and JSON API).
- **Deployment**: Render (Auto-deploy on commit).

## 🚢 Deployment

This project requires **Node.js**.

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Start Dev Server**:

   ```bash
   npm run dev
   ```

3. **Build/Run**:

   ```bash
   npm start
   ```

Deployed automatically to **Render** on every push to `main`.

## 👨‍💻 Author

**Abdellahi El Moustapha** - [LinkedIn](https://www.linkedin.com/in/abmstpha/)

---

**Frintegrate** - *Apprendre, Comprendre, S'intégrer.* 🇫🇷✨
