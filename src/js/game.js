// VARIÁVEIS E FUNÇÕES REUTILIZÁVEIS
const TRANSITION_TIME_01 = 100
const TRANSITION_TIME_045 = 450
const TRANSITION_TIME_05 = 500
const TRANSITION_TIME_06 = 600
const TRANSITION_TIME_1 = 1000
const TRANSITION_TIME_2 = 2000

// Remove todos os acentos da string
const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

// FUNCIONALIDADES DO JOGO
let screenWidth
let screenHeight
let difficult
let startingGame
let timerGame
let life = 3
let gameTime = 0
let spawnTime = 0
let score = 0
let bestScore = 0
let killCount = 0
let multiplySequence = 0
let multiplyPoints = 1

// BOTÕES
const btnPlay = document.getElementById('play')
const btnConfig = document.getElementById('config')
const btnClose = document.getElementById('btn-close')
const btnCloseAlert = document.getElementById('close-alert')
const btnTypeGame = [...document.getElementsByClassName('btn-type-game')]
const btnRestart = document.getElementById('restart')

// MENU PRINCIPAL
const mainMenu = document.getElementById('main-menu')
const configMenu = document.getElementById('config-menu')
const difficultyType = [...document.getElementsByClassName('difficulty-type')]
const difficultyItem = [...document.getElementsByClassName('difficulty-item')]
const bestRecord = document.getElementById('best-record')
const typeGameOptions = document.getElementById('type-game')

// ALERTA
const alertModal = document.getElementById('alert-modal')

// GAMEPLAY
const gameplay = document.getElementById('gameplay')
const gameArea = document.getElementById('game-area')
const inGameScore = document.getElementById('score')
const deadMosquitoCount = document.getElementById('dead-mosquito-count')
const difficultName = document.getElementById('difficult-name')
const multiply = document.getElementById('multiply')
const timeIcon = document.getElementById('time-icon')
const time = document.getElementById('time')
const totalMosquitoDead = document.getElementById('total-mosquito-dead')
const totalScore = document.getElementById('total-score')
const difficultInGame = document.getElementById('difficult-game')

// GAME OVER
const gameOverMenu = document.getElementById('game-over')

// 2. Se existir um armazenamento local com a melhor pontuação, o valor irá ser trocado
if(localStorage.getItem('bestScore')) {
    bestScore = parseInt(localStorage.getItem('bestScore'))
}

// 3. Se necessário os valores da pontuação será colocado na tela
bestRecord.textContent = bestScore

function openConfig() {
    mainMenu.classList.add('hidden')

    setTimeout(() => {
        mainMenu.classList.add('disabled')
        configMenu.classList.remove('disabled')

        setTimeout(() => {
            configMenu.classList.add('open-width')

            setTimeout(() => {
                configMenu.classList.add('open-height')
            }, TRANSITION_TIME_05)
        }, TRANSITION_TIME_01)
    }, TRANSITION_TIME_05)
}



function closeConfig() {
    configMenu.classList.remove('open-height')

    setTimeout(() => {
        configMenu.classList.remove('open-width')

        setTimeout(() => {
            mainMenu.classList.remove('disabled')
            configMenu.classList.add('disabled')
        }, TRANSITION_TIME_05)
        
        setTimeout(() => {
            mainMenu.classList.remove('hidden')
        }, TRANSITION_TIME_06)
    }, TRANSITION_TIME_05)
}



function difficultSelected(event) {
    difficult = event.currentTarget.textContent
    difficultName.textContent = difficult
    // Remove todos os acentos da string
    difficultConverted = removeAccents(difficult)
        
    difficultyType.forEach(btn => btn.classList.remove('selected'))
    event.currentTarget.classList.add('selected')

    let timeDifficult = {
        facil: 1500,
        normal: 1250,
        dificil: 1000,
        extremo: 750
    }[difficultConverted]

    spawnTime = timeDifficult

    closeConfig()
}


function closeAlert() {
    alertModal.classList.remove('show')

    setTimeout(() => {
        alertModal.classList.add('disabled')
    }, TRANSITION_TIME_05)
}



function startGame() {
    if(!spawnTime) {
        alertModal.classList.remove('disabled')

        setTimeout(() => {
            alertModal.classList.add('show')
        }, TRANSITION_TIME_01)
    } else {
        mainMenu.classList.add('hidden')

        setTimeout(() => {
            mainMenu.classList.add('disabled')
            
            typeGame()
        }, TRANSITION_TIME_05)
    }
}


function typeGame() {
    typeGameOptions.classList.remove('disabled')

    setTimeout(() => {
        typeGameOptions.classList.remove('hidden')

        btnTypeGame.forEach(item => item.addEventListener('click', selectedTypeGame))
    }, TRANSITION_TIME_01)
}



function selectedTypeGame(event) {
    gameTime = event.target.textContent
    gameTime = gameTime.replace(/\s+/g, '').toLowerCase()
    gameTime = removeAccents(gameTime)

    let typeGameSelected = {
        contraotempo: 60,
        sobrevivencia: 0
    }[gameTime]

    gameTime = typeGameSelected

    gameStarted()
}


function gameStarted() {
    typeGameOptions.classList.add('hidden')

    setTimeout(() => {
        typeGameOptions.classList.add('disabled')
        mainMenu.classList.add('d-none')

        gameplay.classList.remove('disabled')

        setTimeout(() => {
            gameplay.classList.add('start')

            setTimeout(() => {
                container.classList.remove('blur')

                screenDimension()
                
                startingGame = setInterval(() => {
                    inGameInfos()
                    
                    startLogicGame()
                }, spawnTime)

                if(gameTime == 60) {
                    inGameTimer()
                }
                else if(gameTime == 0) {
                    inGameInfinity()
                }
            }, TRANSITION_TIME_05)
        }, TRANSITION_TIME_01)
    }, TRANSITION_TIME_05)
}


function screenDimension() {
    screenWidth = gameArea.clientWidth
    screenHeight = gameArea.clientHeight
}


function startLogicGame() {    
    let [mosquitoSizePx, mosquitoSizeClass] = mosquitoSize()
    let mosquitoSideClass = mosquitoSide()

    const mosquito = document.getElementById('mosquito')

    if(mosquito) {
        if(mosquito && !mosquito.classList.contains('mosquito-dead')) {
            loseLife(mosquito)
        }
    }
    
    let positionX = Math.floor(Math.random() * screenWidth) - mosquitoSizePx
    let positionY = Math.floor(Math.random() * screenHeight) - mosquitoSizePx

    positionX = Math.max(0, positionX)
    positionY = Math.max(0, positionY)

    let createMosquito = document.createElement('img')
    createMosquito.id = 'mosquito'
    createMosquito.className = `${mosquitoSizeClass} ${mosquitoSideClass}`
    createMosquito.src = 'src/img/mosquito.png'
    createMosquito.alt = 'Mosquito'
    createMosquito.style.position = 'absolute'
    createMosquito.style.left = `${positionX}px`
    createMosquito.style.top = `${positionY}px`
    gameArea.appendChild(createMosquito)

    createMosquito.addEventListener('click', () => mosquitoDead(createMosquito, mosquitoSizeClass))
}



function mosquitoSize() {
    const mosquitoSizeType = [
        [30, 'mosquito-small'],
        [60, 'mosquito-normal'],
        [90, 'mosquito-big']
    ]

    return mosquitoSizeType[Math.floor(Math.random() * 3)]
}



function mosquitoSide() {
    return Math.random() < 0.5 ? 'side-left' : 'side-right'
}



function mosquitoDead(createMosquito, mosquitoSizeClass) {
    createMosquito.classList.add('mosquito-dead')
    killCount++
    multiplySequence++

    let mosquitoScore = {
        'mosquito-small': 9,
        'mosquito-normal': 6,
        'mosquito-big': 3
    }[mosquitoSizeClass]

    multiplyInGameScore()
    
    score += mosquitoScore * multiplyPoints
    inGameScore.textContent = score

    deadMosquitoCount.textContent = killCount

    setTimeout(() => {
        createMosquito.remove()
    }, TRANSITION_TIME_045)
}



function multiplyInGameScore() {
    if(multiplySequence == 5) {
        multiplyPoints++
        multiply.textContent = `${multiplyPoints}X`
    }

    else if(multiplySequence == 10) {
        multiplyPoints++
        multiply.textContent = `${multiplyPoints}X`
    }

    else if(multiplySequence == 15) {
        multiplyPoints++
        multiply.textContent = `${multiplyPoints}X`

    }

    else if(multiplySequence == 20) {
        multiplyPoints++
        multiply.textContent = `${multiplyPoints}X`
    }
}



function loseLife(mosquito) {    
    resetInGameInfos()
    
    if(life > 0 && life <= 3) {
        document.getElementById(`life-${life}`).classList.replace('fa-solid', 'fa-regular')
        life--
    }
    else {
        gameOver()
    }

    mosquito.remove()
}



function inGameTimer() {
    timerGame = setInterval(() => {
        timeIcon.className = 'fa-solid fa-clock'
        
        time.textContent = gameTime
        gameTime--

        if(gameTime < 0) {
            clearInterval(timerGame)
            
            gameOver()
        }
    }, 1000)
}



function inGameInfinity() {
    timeIcon.className = 'fa-solid fa-infinity'
    time.textContent = ''
}



function inGameInfos() {
    inGameScore.textContent = score
    deadMosquitoCount.textContent = killCount
    multiply.textContent = `${multiplyPoints}X`
}



function resetInGameInfos() {
    multiplySequence = 0
    multiplyPoints = 1
    multiply.textContent = `${multiplyPoints}X`
}



function gameOver() {
    clearInterval(startingGame)
    clearInterval(timerGame)

    totalMosquitoDead.textContent = killCount
    totalScore.textContent = score
    difficultInGame.textContent = difficult

    // 1. Se a melhor pontuação for batida irá salvar no armazenamento local
    if(score > bestScore) {
        bestScore = score
        localStorage.setItem('bestScore', bestScore)
    }

    bestRecord.textContent = bestScore

    life = 3
    score = 0
    multiplyPoints = 1
    killCount = 0
    gameTime = 0
    time.textContent = ''

    deadMosquitoCount.textContent = '0'
    inGameScore.textContent = '0'
    multiply.textContent = '1X'

    for(let i = 1; i <= 3; i++) {
        document.getElementById(`life-${i}`).classList.replace('fa-regular', 'fa-solid')
    }

    gameplay.classList.remove('start')
    gameArea.classList.add('hidden')
    
    setTimeout(() => {
        gameplay.classList.add('disabled')
        gameOverMenu.classList.remove('disabled')
        
        setTimeout(() => {
            gameOverMenu.classList.add('show')

            container.classList.add('blur')
        }, TRANSITION_TIME_01);
    }, TRANSITION_TIME_05)
}



function restartGame() {
    gameOverMenu.classList.remove('show')

    const mosquito = document.getElementById('mosquito')

    if(mosquito) {
        mosquito.remove()
    }
    
    setTimeout(() => {
        gameOverMenu.classList.add('disabled')

        mainMenu.classList.remove('d-none')
        mainMenu.classList.remove('disabled')
        
        setTimeout(() => {
            mainMenu.classList.remove('hidden')

            gameArea.classList.remove('hidden')
        }, TRANSITION_TIME_01)
    }, TRANSITION_TIME_05)
}



btnConfig.addEventListener('click', openConfig)
btnClose.addEventListener('click', closeConfig)
difficultyType.forEach(item => item.addEventListener('click', difficultSelected))
btnCloseAlert.addEventListener('click', closeAlert)
btnPlay.addEventListener('click', startGame)
btnTypeGame.forEach(item => item.addEventListener('click', selectedTypeGame))
btnRestart.addEventListener('click', restartGame)