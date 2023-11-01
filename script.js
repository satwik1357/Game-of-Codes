const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");
const board = document.getElementById("board");
const cells = document.querySelectorAll("[data-cell]");
const popup = document.getElementById("result-popup");
const winnerText = document.getElementById("winner-text");
const closePopupButton = document.getElementById("close-popup");
const leaderboardContent = document.getElementById("leaderboard-content");

let currentPlayer = "X";
let gameActive = false;
let winner = null;
let player1 = "";
let player2 = "";
let player1Wins = 0;
let player2Wins = 0;
let player1Losses = 0;
let player2Losses = 0;

// An array to store player objects
let players = [];

function startGame() {
    player1 = prompt("Enter the name of Player 1 (X):") || "Player 1";
    player2 = prompt("Enter the name of Player 2 (O):") || "Player 2";

    gameActive = true;
    winner = null;
    currentPlayer = "X";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.addEventListener("click", handleCellClick, { once: true });
    });
    popup.style.display = "none";
}

function resetGame() {
    startGame();
}

function updateLeaderboard(winnerName, loserName) {
    const winnerIndex = players.findIndex(player => player.name === winnerName);
    const loserIndex = players.findIndex(player => player.name === loserName);

    if (winnerIndex !== -1) {
        players[winnerIndex].wins += 1;
    } else {
        players.push({ name: winnerName, wins: 1, losses: 0 });
    }

    if (loserIndex !== -1) {
        players[loserIndex].losses += 1;
    } else {
        players.push({ name: loserName, wins: 0, losses: 1 });
    }

    // Sort players in descending order of wins
    players.sort((a, b) => b.wins - a.wins);

    // Render the leaderboard
    leaderboardContent.innerHTML = players.map(player => {
        return `<p>${player.name}: Wins - ${player.wins}, Losses - ${player.losses}</p>`;
    }).join('');
}

function handleCellClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    if (currentPlayer === "X") {
        cell.textContent = "X";
    } else {
        cell.textContent = "O";
    }

    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
}

function checkWin(player) {
    const winningCombination = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winningCombination.some(combination => {
        return combination.every(index => cells[index].textContent === player);
    });
}

function isDraw() {
    return Array.from(cells).every(cell => cell.textContent !== "");
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        winnerText.textContent = "It's a Draw!";
    } else {
        winnerText.textContent = `Player ${currentPlayer === "X" ? player1 : player2} Wins!`;
        if (currentPlayer === "X") {
            player1Wins++;
            player2Losses++;
        } else {
            player2Wins++;
            player1Losses++;
        }
    }
    updateLeaderboard(player1, player2);
    popup.style.display = "block";
}

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
closePopupButton.addEventListener("click", () => popup.style.display = "none");

// Initialize the leaderboard when the page loads
updateLeaderboard(player1, player2);

startGame();

