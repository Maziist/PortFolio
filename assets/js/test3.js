// Éléments du DOM
const container = document.getElementById('container');
const character = document.getElementById('character');
const runImage = document.getElementById('run');
const platforms = document.querySelectorAll('.platform');
const modals = document.querySelectorAll('.modal');
const mapSizeY = document.querySelector('body').offsetHeight;
const limitY = mapSizeY * 35 / 100;
const bottomLimit = 0;

// Images pour les animations
const runLImages = ['../img/character/runL1.png', '../img/character/runL2.png', '../img/character/runL3.png', '../img/character/runL4.png', '../img/character/runL5.png', '../img/character/runL6.png', '../img/character/runL7.png', '../img/character/runL8.png'];
const runRImages = ['../img/character/runR1.png', '../img/character/runR2.png', '../img/character/runR3.png', '../img/character/runR4.png', '../img/character/runR5.png', '../img/character/runR6.png', '../img/character/runR7.png', '../img/character/runR8.png'];
const runFImages = ['../img/character/runF1.png', '../img/character/runF2.png', '../img/character/runF3.png', '../img/character/runF4.png', '../img/character/runF5.png', '../img/character/runF6.png', '../img/character/runF7.png', '../img/character/runF8.png'];
const runDImages = ['../img/character/runD1.png', '../img/character/runD2.png', '../img/character/runD3.png', '../img/character/runD4.png', '../img/character/runD5.png', '../img/character/runD6.png', '../img/character/runD7.png', '../img/character/runD8.png'];
const jumpRImages = ['../img/character/jumpR1.png', '../img/character/jumpR2.png', '../img/character/jumpR3.png', '../img/character/jumpR4.png'];
const jumpLImages = ['../img/character/jumpL1.png', '../img/character/jumpL2.png', '../img/character/jumpL3.png', '../img/character/jumpL4.png'];
const jumpFImages = ['../img/character/jumpF1.png', '../img/character/jumpF2.png', '../img/character/jumpF3.png', '../img/character/jumpF4.png'];
const jumpDImages = ['../img/character/jumpD1.png', '../img/character/jumpD2.png', '../img/character/jumpD3.png', '../img/character/jumpD4.png'];
const statImages = {
    left: '../img/character/statL1.png',
    right: '../img/character/statR1.png',
    up: '../img/character/statD1.png',
    down: '../img/character/statF1.png'
};

// Variables de contrôle
let characterX = 0;
let characterY = 0;
let isJumping = false;
let jumpHeight = 100;
let jumpStartY = 0;
let jumpProgress = 0;
let moveSpeed = 5;
let currentFrame = 0;
let frameCount = 0;
let currentDirection = 'right';
let currentPlatform = null;


// Gestion des touches
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function updateAnimation(images) {
    frameCount++;
    if (frameCount >= 5) {
        currentFrame = (currentFrame + 1) % images.length;
        runImage.src = images[currentFrame];
        frameCount = 0;
    }
}

function handleJump() {
    if (isJumping) {
        jumpProgress += 0.05;
        if (jumpProgress >= 1) {
            isJumping = false;
            jumpProgress = 0;
            characterY = jumpStartY;
        } else {
            characterY = jumpStartY + Math.sin(jumpProgress * Math.PI) * jumpHeight;
        }

        let jumpImages;
        switch(currentDirection) {
            case 'left': jumpImages = jumpLImages; break;
            case 'right': jumpImages = jumpRImages; break;
            case 'up': jumpImages = jumpDImages; break;
            case 'down': jumpImages = jumpFImages; break;
        }

        let jumpFrame = Math.floor(jumpProgress * jumpImages.length);
        runImage.src = jumpImages[Math.min(jumpFrame, jumpImages.length - 1)];
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

function hideAllModals() {
    modals.forEach(modal => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
    });
}

function checkCollision() {
    let collisionDetected = false;
    platforms.forEach(platform => {
        const rect = platform.getBoundingClientRect();
        const charRect = character.getBoundingClientRect();
        if (charRect.right > rect.left && charRect.left < rect.right &&
            charRect.bottom > rect.top && charRect.top < rect.bottom) {
            currentPlatform = platform;
            showModal(platform.dataset.modal);
            collisionDetected = true;
        }
    });
    if (!collisionDetected) {
        hideAllModals();
    }

    // Vérifier les collisions avec les panneaux
    checkPanelCollisions();
}

function checkPanelCollisions() {
    const characterRect = character.getBoundingClientRect();
    for (let i = 1; i <= 4; i++) {
        const panel = document.getElementById('panel' + i);
        if (panel) {
            const panelRect = panel.getBoundingClientRect();
            if (checkCollisionBetweenRects(characterRect, panelRect)) {
                openModalForPanel('panel' + i);
                break; // Sortir de la boucle après avoir ouvert une modal
            }
        }
    }
}

function checkCollisionBetweenRects(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

function openModalForPanel(panelId) {
    const modalId = 'modal' + panelId.charAt(panelId.length - 1);
    showModal(modalId);
}


// Modifiez la fonction updateCharacterPosition comme suit
function updateCharacterPosition() {
    let isMoving = false;
    let horizontalMove = 0;
    let verticalMove = 0;

    if (keys.ArrowLeft) {
        horizontalMove -= moveSpeed;
        currentDirection = 'left';
        isMoving = true;
    }
    if (keys.ArrowRight) {
        horizontalMove += moveSpeed;
        currentDirection = 'right';
        isMoving = true;
    }
    if (keys.ArrowUp) {
        verticalMove += moveSpeed;
        currentDirection = 'up';
        isMoving = true;
    }
    if (keys.ArrowDown) {
        verticalMove -= moveSpeed;
        currentDirection = 'down';
        isMoving = true;
    }
    if (keys.Space && !isJumping) {
        isJumping = true;
        jumpStartY = characterY;
        jumpProgress = 0;
    }

    characterX += horizontalMove;
    characterY += verticalMove;

    handleJump();

    // Vérification des limites de l'écran et changement de page
    if (characterX < 0) {
        changePage('left');
        return;
    }
    if (characterX + character.offsetWidth > window.innerWidth) {
        changePage('right');
        return;
    }
    if (characterY + character.offsetHeight > window.innerHeight) {
        changePage('up');
        return;
    }
    
    // Ajoutez cette condition pour empêcher le personnage de descendre en dessous de la limite
    if (characterY < bottomLimit) {
        characterY = bottomLimit;
    }

    character.style.left = characterX + 'px';
    character.style.bottom = characterY + 'px';

    if (isJumping) {
        // L'animation de saut est gérée dans handleJump
    } else if (isMoving) {
        switch(currentDirection) {
            case 'left': updateAnimation(runLImages); break;
            case 'right': updateAnimation(runRImages); break;
            case 'up': updateAnimation(runDImages); break;
            case 'down': updateAnimation(runFImages); break;
        }
    } else {
        runImage.src = statImages[currentDirection];
    }

    checkCollision();
}

function positionCharacterOnLoad() {
    const fromPage = localStorage.getItem("fromPage");
    if (fromPage === "right") {
        characterX = window.innerWidth - character.offsetWidth;
        currentDirection = 'left';
    } else {
        characterX = 0;
        currentDirection = 'right';
    }
    character.style.left = characterX + 'px';
    runImage.src = statImages[currentDirection];
    localStorage.removeItem("fromPage");
}
function changePage(direction) {
    switch(direction) {
        case 'left':
            localStorage.setItem("fromPage", "right");
            window.location.href = '../pages/aboutme.html';
            break;
        case 'right':
            localStorage.setItem("fromPage", "left");
            window.location.href = '../pages/contact.html';
            break;
    }
}


function gameLoop() {
    updateCharacterPosition();
    requestAnimationFrame(gameLoop);
}

function init() {
    character.style.position = 'absolute';
    runImage.src = statImages.left;
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', hideAllModals);
    });
    document.querySelectorAll('.modal-redirect').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const url = e.target.dataset.url;
            if (url) {
                window.location.href = url;
            }
        });
    });
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideAllModals();
        }
    });
    gameLoop();
}

// Lancer l'initialisation
init();

