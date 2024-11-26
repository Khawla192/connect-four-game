/*-------------- Constants -------------*/
const rows = 6
const cols = 7
const winningLength = 4
const players = ['red', 'yellow']

/*---------- Variables (state) ---------*/
let board
let currentPlayer
let winner
let gameActive
let tie
let firstPlayer = players[0]
let secondPlayer = players[1]
let firstPlayerScore
let secondPlayerScore

/*----- Cached Element References  -----*/
const boardEl = document.getElementById('board')
const cellEl = document.querySelectorAll('.cell')
const messageEl = document.getElementById('message')
const resetBtnEl = document.getElementById('resetBtn')
const newGameBtnEl = document.getElementById('newGameBtn')
const firstPlayerNameEl = document.getElementById('first-player')
const secondPlayerNameEl = document.getElementById('second-player')
const firstPlayerScoreEl = document.getElementById('first-player-score')
const secondPlayerScoreEl = document.getElementById('second-player-score')
const displayPlayerNameEl = document.querySelector('.display-Player-name')

/*-------------- Functions -------------*/
const render = () => {
    updateBoard()
    updateMessage()
    updateScores()
    updatePlayerDisplay()
}

const init = () => {
    board = []
    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < cols; j++) {
            board[i][j] = 0
        }
    }
    currentPlayer = firstPlayer
    winner = false
    tie = false
    gameActive = true
    
    firstPlayerNameEl.value = ''
    secondPlayerNameEl.value = ''

    render()
}

const startNewGame = () => {
    board = []
    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < cols; j++) {
            board[i][j] = 0
        }
    }
    currentPlayer = firstPlayer
    winner = false
    tie = false
    gameActive = true
    
    cellEl.forEach(cell => {
        cell.textContent = ''
        cell.style.backgroundColor = ''
        cell.style.color = ''
    })
    
    render()
}

const updateBoard = () => {
    const cells = boardEl.children;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cellIndex = row * cols + col
            const cell = cells[cellIndex]
            cell.className = 'cell'
            if (board[row][col] !== 0) {
                cell.classList.add(players[board[row][col] - 1])
            }
        }
    }
}

const updateMessage = () => {
    if (winner) {
        const winnerName = getPlayerName(currentPlayer)
        messageEl.textContent = `Congrats ${winnerName} Wins!`
        messageEl.style.color = currentPlayer === firstPlayer ? '#1a73e8' : '#e82b1a'

        if (currentPlayer === firstPlayer) {
            firstPlayerScore++
        } else {
            secondPlayerScore++
        }
        updateScores()
    } else if (tie) {
        messageEl.textContent = "It's a Tie!"
        messageEl.style.color = 'green'
    } else {
        const playerName = getPlayerName(currentPlayer)
        messageEl.textContent = `${playerName}'s Turn`
        messageEl.style.color = currentPlayer === firstPlayer ? '#1a73e8' : '#e82b1a'
    }
}

const updateScores = () => {
    firstPlayerScoreEl.textContent = firstPlayerScore
    secondPlayerScoreEl.textContent = secondPlayerScore
}

const updatePlayerDisplay = () => {
    const firstPlayerName = firstPlayerNameEl.value || 'Player RED'
    const secondPlayerName = secondPlayerNameEl.value || 'Player YELLOW'
    displayPlayerNameEl.textContent = `${firstPlayerName} vs ${secondPlayerName}`
}

const handleClick = (col) => {
    if (!gameActive) return
}

const switchPlayerTurn = () => {
    if (currentPlayer === firstPlayer) {
        currentPlayer = secondPlayer
    } else {
        currentPlayer = firstPlayer
    }
}

const checkForWinner = (row, col) => {
    const directions = [
        { r: 0, c: 1 },  // Horizontal
        { r: 1, c: 0 },  // Vertical
        { r: 1, c: 1 },  // Diagonal \
        { r: 1, c: -1 }, // Diagonal /
    ]
}

const checkForTie = () => {
    tie = !board.includes('')
}

/*----------- Event Listeners ----------*/
cellEl.forEach((cell) => {
    cell.addEventListener('click', handleClick)
})

boardEl.addEventListener('click', handleClick)

firstPlayerNameEl.addEventListener('input', updatePlayerDisplay)
secondPlayerNameEl.addEventListener('input', updatePlayerDisplay)

newGameBtnEl.addEventListener('click', startNewGame)
resetBtnEl.addEventListener('click', init)

init()