let currentPlayer = 'X'
let player1Mark = 'X'
let gameMode = 'player'
let board = ['', '', '', '', '', '', '', '', '']
let gameActive = true
let scores = { X: 0, O: 0, tie: 0 }

const menu = document.getElementById('menu')
const gameContainer = document.getElementById('gameContainer')
const cells = document.querySelectorAll('.cell')
const turnIcon = document.getElementById('turnIcon')

const scoreX = document.getElementById('scoreX')
const scoreO = document.getElementById('scoreO')
const scoreTie = document.getElementById('scoreTie')

const xLabel = document.getElementById('xLabel')
const oLabel = document.getElementById('oLabel')

const resultModal = document.getElementById('resultModal')
const restartModal = document.getElementById('restartModal')
const modalMessage = document.getElementById('modalMessage')
const modalWinner = document.getElementById('modalWinner')

const winningConditions = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
]

initEventListeners()

function initEventListeners() {
	document.querySelectorAll('.toggle-btn').forEach(btn => {
		btn.onclick = () => {
			document
				.querySelectorAll('.toggle-btn')
				.forEach(b => b.classList.remove('active'))
			btn.classList.add('active')
			player1Mark = btn.dataset.mark
		}
	})

	document.querySelector('.new-game-cpu').onclick = () => startGame('cpu')
	document.querySelector('.new-game-player').onclick = () => startGame('player')

	cells.forEach(cell => {
		cell.onclick = handleCellClick
		cell.onmouseenter = handleCellHover
		cell.onmouseleave = e => e.target.removeAttribute('data-hover')
	})

	document.getElementById('restartBtn').onclick = () =>
		restartModal.classList.add('active')

	document.getElementById('quitBtn').onclick = quitGame
	document.getElementById('nextRoundBtn').onclick = nextRound
	document.getElementById('cancelRestartBtn').onclick = () =>
		restartModal.classList.remove('active')
	document.getElementById('confirmRestartBtn').onclick = confirmRestart
}

function startGame(mode) {
	gameMode = mode
	menu.classList.remove('active')
	gameContainer.style.display = 'block'

	if (mode === 'cpu') {
		xLabel.textContent = player1Mark === 'X' ? 'X (You)' : 'X (CPU)'
		oLabel.textContent = player1Mark === 'O' ? 'O (You)' : 'O (CPU)'
	} else {
		xLabel.textContent = 'X (P1)'
		oLabel.textContent = 'O (P2)'
	}

	resetBoard()
	maybeCpuFirstMove()
}

function maybeCpuFirstMove() {
	if (gameMode === 'cpu' && player1Mark === 'O') {
		setTimeout(cpuMove, 1000)
	}
}

function resetBoard() {
	board = ['', '', '', '', '', '', '', '', '']
	gameActive = true
	currentPlayer = 'X'
	turnIcon.textContent = 'X'

	cells.forEach(cell => {
		cell.textContent = ''
		cell.className = 'cell'
		cell.removeAttribute('data-hover')
	})
}

function handleCellHover(e) {
	if (!e.target.classList.contains('taken') && gameActive) {
		e.target.setAttribute('data-hover', currentPlayer)
	}
}

function handleCellClick(e) {
	const index = +e.target.dataset.index

	if (!gameActive || board[index]) return
	if (gameMode === 'cpu' && currentPlayer !== player1Mark) return

	makeMove(index, e.target)
}

// ================= MOVE =================
function makeMove(index, cell) {
	board[index] = currentPlayer
	cell.textContent = currentPlayer
	cell.classList.add(currentPlayer.toLowerCase(), 'taken')
	cell.removeAttribute('data-hover')

	if (checkResult()) return

	currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
	turnIcon.textContent = currentPlayer

	if (gameMode === 'cpu' && currentPlayer !== player1Mark) {
		setTimeout(cpuMove, 500)
	}
}

// ================= CPU =================
function cpuMove() {
	const empty = board
		.map((v, i) => (v === '' ? i : null))
		.filter(v => v !== null)

	if (!empty.length || !gameActive) return

	const i = empty[Math.floor(Math.random() * empty.length)]
	makeMove(i, cells[i])
}

// ================= RESULT =================
function checkResult() {
	for (const [a, b, c] of winningConditions) {
		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			gameActive = false
			scores[currentPlayer]++
			updateScore()
			showResultModal(currentPlayer)
			return true
		}
	}

	if (!board.includes('')) {
		gameActive = false
		scores.tie++
		updateScore()
		showResultModal('tie')
		return true
	}

	return false
}

// ================= UI =================
function updateScore() {
	scoreX.textContent = scores.X
	scoreO.textContent = scores.O
	scoreTie.textContent = scores.tie
}

function showResultModal(winner) {
	if (winner === 'tie') {
		modalMessage.textContent = ''
		modalWinner.innerHTML =
			'<span class="modal-winner-text tie">Round Tied</span>'
	} else {
		modalMessage.textContent =
			gameMode === 'cpu'
				? winner === player1Mark
					? 'You Won!'
					: 'Oh No, You Lost...'
				: winner === 'X'
				? 'Player 1 Wins!'
				: 'Player 2 Wins!'

		modalWinner.innerHTML = `
			<span class="modal-winner-icon ${winner.toLowerCase()}">${winner}</span>
			<span class="modal-winner-text ${winner.toLowerCase()}">Takes the Round</span>
		`
	}

	resultModal.classList.add('active')
}

// ================= CONTROLS =================
function nextRound() {
	resultModal.classList.remove('active')
	resetBoard()
	maybeCpuFirstMove()
}

function confirmRestart() {
	restartModal.classList.remove('active')
	resetBoard()
	maybeCpuFirstMove()
}

function quitGame() {
	resultModal.classList.remove('active')
	gameContainer.style.display = 'none'
	menu.classList.add('active')
	scores = { X: 0, O: 0, tie: 0 }
	updateScore()
}
