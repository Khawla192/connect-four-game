/*-------------- Constants -------------*/
const playerColors = ['red', 'yellow']

/*---------- Variables (state) ---------*/
let currentPlayer = 0
let board = []
let timerInterval
let timePerTurn = 5
let playerNames = ['', '']
let connectSize = 4

/*----- Cached Element References  -----*/
const gameBoardEl = document.getElementById('game-board')
const turnInfoEl = document.getElementById('turn-info')
const timerInfoEl = document.getElementById('timer-info')
const startGameBtn = document.getElementById('start-game')
const player1Input = document.getElementById('player1Name')
const player2Input = document.getElementById('player2Name')
const gridSizeInput = document.getElementById('gridSize')
const timerInput = document.getElementById('timePerTurn')
const connectSizeInput = document.getElementById('connectSize')
const gameSettingsForm = document.getElementById('gameSettings')
const screenOrganizer = document.querySelector('.screen-organizer')

/*-------------- Functions -------------*/
function initializeGame() {
    playerNames[0] = player1Input.value || 'Player 1'
    playerNames[1] = player2Input.value || 'Player 2'
    const gridSizeValue = gridSizeInput.value.split('x')
    const rows = parseInt(gridSizeValue[0])
    const cols = parseInt(gridSizeValue[1])
    timePerTurn = parseInt(timerInput.value) || 7
    connectSize = parseInt(connectSizeInput.value)
    board = Array.from({ length: rows }, () => Array(cols).fill(null))
    createBoard(rows, cols)
    startTurnTimer()
    updateTurnInfo()
}

function createBoard(rows, cols) {
    gameBoardEl.innerHTML = ''
    gameBoardEl.style.gridTemplateColumns = `repeat(${cols}, 50px)`
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellEl = document.createElement('div')
            cellEl.classList.add('cell')
            cellEl.dataset.row = rowIndex
            cellEl.dataset.col = colIndex
            cellEl.addEventListener('click', handleCellClick)
            gameBoardEl.appendChild(cellEl)
        })
    })
}

function handleCellClick(event) {
    const col = parseInt(event.target.dataset.col)
    const row = findAvailableRow(col)
    if (row === -1) return
    board[row][col] = currentPlayer
    const cellEl = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`)
    cellEl.classList.add(playerColors[currentPlayer])
    
    if (checkWin(row, col)) {
        endGame('win')
    } else if (checkTie()) {
        endGame('tie')
    } else {
        currentPlayer = 1 - currentPlayer
        updateTurnInfo()
        startTurnTimer()
    }
}

function findAvailableRow(col) {
    for (let row = board.length - 1; row >= 0; row--) {
        if (board[row][col] === null) {
            return row
        }
    }
    return -1
}

function checkWin(row, col) {
    const directions = [
        { r: 1, c: 0 },   // Horizontal
        { r: 0, c: 1 },   // Vertical
        { r: 1, c: 1 },   // Diagonal down-right
        { r: 1, c: -1 }   // Diagonal up-right
    ]

    for (let { r, c } of directions) {
        let count = 1
        for (let sign of [-1, 1]) {
            let newRow = row + sign * c
            let newCol = col + sign * r
            while (
                newRow >= 0 && 
                newRow < board.length && 
                newCol >= 0 && 
                newCol < board[0].length && 
                board[newRow][newCol] === currentPlayer
            ) {
                count++
                newRow += sign * c
                newCol += sign * r
            }
        }
        if (count >= connectSize) return true
    }
    return false
}

function checkTie() {
    return board.every(row => row.every(cell => cell !== null))
}

function endGame(result) {
    clearInterval(timerInterval)
    
    if (result === 'win') {
        turnInfoEl.innerHTML = `
            <div class="winning-message ${playerColors[currentPlayer]}-text">
                ${playerNames[currentPlayer]} Wins!
            </div>
        `
    } else if (result === 'tie') {
        turnInfoEl.textContent = "It's a Tie!"
        turnInfoEl.style.color = 'blue'
    }
    
    // Disable clicks out side the board range
    gameBoardEl.removeEventListener('click', handleCellClick)
    gameBoardEl.querySelectorAll('.cell').forEach(cell => {
        cell.style.pointerEvents = 'none'
    })

    const restartButton = document.createElement('button')
    restartButton.className = 'start-button'
    restartButton.textContent = 'Play Again'
    restartButton.onclick = () => {
        location.reload()
    }
    turnInfoEl.appendChild(restartButton)
}

function updateTurnInfo() {
    turnInfoEl.innerHTML = `<span class="${playerColors[currentPlayer]}-text">${playerNames[currentPlayer]}'s turn</span>`
}

function startTurnTimer() {
    clearInterval(timerInterval)
    let timeLeft = timePerTurn
    timerInfoEl.textContent = `Time left: ${timeLeft}s`
    timerInterval = setInterval(() => {
        timeLeft--
        timerInfoEl.textContent = `Time left: ${timeLeft}s`
        if (timeLeft <= 0) {
            clearInterval(timerInterval)
            currentPlayer = 1 - currentPlayer
            updateTurnInfo()
            startTurnTimer()
        }
    }, 1000)
}

/*----------- Event Listeners ----------*/
gameSettingsForm.addEventListener('submit', function(event) {
    event.preventDefault()
    initializeGame()
    
    // Hide rules and settings
    document.querySelector('.rules').style.display = 'none'
    document.querySelector('.screen-organizer').style.display = 'none'
    document.querySelector('h1').style.display = 'none'
    
    // Show game elements
    document.getElementById('game-info').style.display = 'block'
    document.getElementById('game-board').style.display = 'grid'
    
    // Center the game board
    document.boc.style.justifyContent = 'center'
})
