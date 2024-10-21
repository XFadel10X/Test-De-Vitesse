// Importation de la base de données Firestore à partir de Config.js
import { db } from './Config.js';
import { collection, addDoc, getDocs, orderBy, query, limit } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Variables globales
const cube = document.getElementById('cube');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('scoreDisplay');
const startButton = document.getElementById('startButton');
const leaderboardList = document.getElementById('leaderboardList');
let playerName = '';
let score = 0;
let gameActive = false;
let timer;

// Fonction pour obtenir une position aléatoire pour le cube
function getRandomPosition() {
    const containerRect = gameContainer.getBoundingClientRect();
    const cubeSize = 50;
    const maxX = containerRect.width - cubeSize;
    const maxY = containerRect.height - cubeSize;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    return { x: randomX, y: randomY };
}

// Fonction pour démarrer le jeu
function startGame() {
    // Vérifiez si le jeu est déjà actif
    if (gameActive) {
        return; // Ne rien faire si une partie est déjà en cours
    }

    playerName = document.getElementById('playerName').value || 'Joueur';
    score = 0;
    gameActive = true;
    scoreDisplay.textContent = 'Score : 0';

    // Masquer le bouton "Commencer", le titre et le champ de saisie
    startButton.classList.add('hidden');
    document.getElementById('playerName').classList.add('hidden'); // Masquer le champ de saisie
    document.querySelector('#gameContainer h2').classList.add('hidden'); // Masquer le titre

    // Rendre le cube visible
    cube.style.display = 'block';

    // Déplacer le cube initialement
    moveCube();

    // Démarrer le timer pour 10 secondes
    timer = setTimeout(endGame, 10000);
}

// Fonction pour déplacer le cube
function moveCube() {
    const { x, y } = getRandomPosition();
    cube.style.left = `${x}px`;
    cube.style.top = `${y}px`;
}

// Fonction pour envoyer le score à Firestore
async function sendScore(playerName, score) {
    try {
        const docRef = await addDoc(collection(db, "leaderboard"), {
            playerName: playerName,
            score: score
        });
        console.log("Document écrit avec ID: ", docRef.id);
        loadLeaderboard(); // Recharge le classement
    } catch (e) {
        console.error("Erreur lors de l'ajout du document: ", e);
    }
}

// Fonction pour charger le classement
async function loadLeaderboard() {
    const leaderboardRef = collection(db, "leaderboard");
    const q = query(leaderboardRef, orderBy("score", "desc"), limit(10));

    try {
        const querySnapshot = await getDocs(q);
        leaderboardList.innerHTML = ''; // Vider la liste

        querySnapshot.forEach((doc) => {
            const childData = doc.data();
            const li = document.createElement('li');
            li.textContent = `${childData.playerName}: ${childData.score}`;
            leaderboardList.appendChild(li);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du classement:', error);
    }
}

// Gestion des clics sur le cube
cube.addEventListener('click', () => {
    if (gameActive) {
        score++;
        scoreDisplay.textContent = `Score : ${score}`; // Met à jour l'affichage du score
        moveCube();
    }
});

// Lancement du jeu en appuyant sur le bouton
startButton.addEventListener('click', startGame);

// Fin du jeu
function endGame() {
    gameActive = false;
    cube.style.display = 'none'; // Cacher le cube à la fin du jeu
    startButton.classList.remove('hidden'); // Réafficher le bouton "Commencer"
    document.getElementById('playerName').classList.remove('hidden'); // Réafficher le champ de saisie
    document.querySelector('#gameContainer h2').classList.remove('hidden'); // Réafficher le titre

    const finalScore = score;
    sendScore(playerName, finalScore);
}

// Charger le classement à l'ouverture de la page
loadLeaderboard();
