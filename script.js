
import { db } from './config.js';
import { collection, addDoc, getDocs, orderBy, query, limit } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


const cube = document.getElementById('cube');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('scoreDisplay');
const startButton = document.getElementById('startButton');
const leaderboardList = document.getElementById('leaderboardList');
let playerName = '';
let score = 0;
let gameActive = false;
let timer;


function getRandomPosition() {
    const containerRect = gameContainer.getBoundingClientRect();
    const cubeSize = 50;
    const maxX = containerRect.width - cubeSize;
    const maxY = containerRect.height - cubeSize;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    return { x: randomX, y: randomY };
}


function startGame() {

    if (gameActive) {
        return; 
    }

    playerName = document.getElementById('playerName').value || 'Joueur';
    score = 0;
    gameActive = true;
    scoreDisplay.textContent = 'Score : 0';

    startButton.classList.add('hidden');
    document.getElementById('playerName').classList.add('hidden'); 
    document.querySelector('#gameContainer h2').classList.add('hidden'); 

    cube.style.display = 'block';

    moveCube();

    timer = setTimeout(endGame, 10000);
}

function moveCube() {
    const { x, y } = getRandomPosition();
    cube.style.left = `${x}px`;
    cube.style.top = `${y}px`;
}


async function sendScore(playerName, score) {
    try {
        const docRef = await addDoc(collection(db, "leaderboard"), {
            playerName: playerName,
            score: score
        });
        console.log("Document écrit avec ID: ", docRef.id);
        loadLeaderboard(); 
    } catch (e) {
        console.error("Erreur lors de l'ajout du document: ", e);
    }
}


async function loadLeaderboard() {
    const leaderboardRef = collection(db, "leaderboard");
    const q = query(leaderboardRef, orderBy("score", "desc"), limit(10));

    try {
        const querySnapshot = await getDocs(q);
        leaderboardList.innerHTML = ''; 

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
document.addEventListener('mousemove', function(e) {
    const navbar = document.querySelector('.navbar');
    if (e.clientX < 100) {
        navbar.style.left = '0';
    } else {
        navbar.style.left = '-200px';
    }
});
