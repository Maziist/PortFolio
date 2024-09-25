// Éléments du DOM
const soundIntro = new Audio("../assets/son/calm.mp3");
const gameContainer = document.getElementById('gameContainer');
const container = document.getElementById('container');
const character = document.getElementById('character');
const runImage = character.querySelector('img');
const chama = document.getElementById('chama');
const eagle = document.getElementById('eagle');
const skyContainer = document.getElementById('skyContainer');
const altar = document.getElementById('altar');

// Images pour les animations
const runLImages = ['../assets/img/character/runL1.png', '../assets/img/character/runL2.png', '../assets/img/character/runL3.png', '../assets/img/character/runL4.png', '../assets/img/character/runL5.png', '../assets/img/character/runL6.png', '../assets/img/character/runL7.png', '../assets/img/character/runL8.png'];
const runRImages = ['../assets/img/character/runR1.png', '../assets/img/character/runR2.png', '../assets/img/character/runR3.png', '../assets/img/character/runR4.png', '../assets/img/character/runR5.png', '../assets/img/character/runR6.png', '../assets/img/character/runR7.png', '../assets/img/character/runR8.png'];
const runFImages = ['../assets/img/character/runF1.png', '../assets/img/character/runF2.png', '../assets/img/character/runF3.png', '../assets/img/character/runF4.png', '../assets/img/character/runF5.png', '../assets/img/character/runF6.png', '../assets/img/character/runF7.png', '../assets/img/character/runF8.png'];
const runDImages = ['../assets/img/character/runD1.png', '../assets/img/character/runD2.png', '../assets/img/character/runD3.png', '../assets/img/character/runD4.png', '../assets/img/character/runD5.png', '../assets/img/character/runD6.png', '../assets/img/character/runD7.png', '../assets/img/character/runD8.png'];
const jumpRImages = ['../assets/img/character/jumpR1.png', '../assets/img/character/jumpR2.png', '../assets/img/character/jumpR3.png', '../assets/img/character/jumpR4.png'];
const jumpLImages = ['../assets/img/character/jumpL1.png', '../assets/img/character/jumpL2.png', '../assets/img/character/jumpL3.png', '../assets/img/character/jumpL4.png'];
const jumpFImages = ['../assets/img/character/jumpF1.png', '../assets/img/character/jumpF2.png', '../assets/img/character/jumpF3.png', '../assets/img/character/jumpF4.png'];
const jumpDImages = ['../assets/img/character/jumpD1.png', '../assets/img/character/jumpD2.png', '../assets/img/character/jumpD3.png', '../assets/img/character/jumpD4.png'];
const statImages = {
    left: '../assets/img/character/statL1.png',
    right: '../assets/img/character/statR1.png',
    up: '../assets/img/character/statD1.png',
    down: '../assets/img/character/statF1.png'
};
const eagleL = ['../assets/img/eagle/eagleL1.png', '../assets/img/eagle/eagleL2.png', '../assets/img/eagle/eagleL3.png', '../assets/img/eagle/eagleL4.png'];
const eagleR = ['../assets/img/eagle/eagleR1.png', '../assets/img/eagle/eagleR2.png', '../assets/img/eagle/eagleR3.png', '../assets/img/eagle/eagleR4.png'];
const bruning = ['../assets/img/bruning/burning1.png', '../assets/img/bruning/burning2.png', '../assets/img/bruning/burning3.png', '../assets/img/bruning/burning4.png', '../assets/img/bruning/burning5.png', '../assets/img/bruning/burning6.png', '../assets/img/bruning/burning7.png', '../assets/img/bruning/burning8.png', '../assets/img/bruning/burning9.png', '../assets/img/bruning/burning10.png'];
const cloud = ['../assets/img/cloud/mpcloud3.png', '../assets/img/cloud/mpcloud5.png'];
const altarLoin = ['../assets/img/altar/altar1.png', '../assets/img/altar/altar2.png', '../assets/img/altar/altar3.png', '../assets/img/altar/altar4.png', '../assets/img/altar/altar5.png', '../assets/img/altar/altar6.png', '../assets/img/altar/altar7.png', '../assets/img/altar/altar8.png', '../assets/img/altar/altar9.png', '../assets/img/altar/altar10.png'];
const altarProche = ['../assets/img/altar/altar11.png', '../assets/img/altar/altar12.png', '../assets/img/altar/altar13.png', '../assets/img/altar/altar14.png', '../assets/img/altar/altar15.png', '../assets/img/altar/altar16.png', '../assets/img/altar/altar17.png', '../assets/img/altar/altar18.png'];
const altarCollision = ['../assets/img/altar/altar19.png', '../assets/img/altar/altar20.png', '../assets/img/altar/altar21.png', '../assets/img/altar/altar22.png', '../assets/img/altar/altar23.png', '../assets/img/altar/altar24.png', '../assets/img/altar/altar25.png', '../assets/img/altar/altar26.png', '../assets/img/altar/altar27.png', '../assets/img/altar/altar28.png'];

// Variables globales
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
let eagleX = 0;
let eagleY = 0;
let eagleDirection = 'right';
let eagleFrame = 0;
let eagleFrameCount = 0;
let eagleSpeed = 2;
const eagleFrameDelay = 5;
let altarState = 'loin';
let altarFrame = 0;
let altarFrameCount = 0;
const altarFrameDelay = 5;
const keys = {};

// Écouteurs d'événements
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Fonctions
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
            let jumpImages;
            switch (currentDirection) {
                case 'left':
                    jumpImages = jumpLImages;
                    break;
                case 'right':
                    jumpImages = jumpRImages;
                    break;
                case 'up':
                    jumpImages = jumpDImages;
                    break;
                case 'down':
                    jumpImages = jumpFImages;
                    break;
            }
            let jumpFrame = Math.floor(jumpProgress * jumpImages.length);
            runImage.src = jumpImages[Math.min(jumpFrame, jumpImages.length - 1)];
        }
    }
}

function changePage(direction) {
    switch (direction) {
        case 'left':
            localStorage.setItem("fromPage", "right");
            window.location.href = '../../pages/aboutme.html';
            break;
        case 'right':
            localStorage.setItem("fromPage", "left");
            window.location.href = '../../pages/contact.html';
            break;
    }
}

function positionCharacterOnLoad() {
    const fromPage = localStorage.getItem("fromPage");
    switch (fromPage) {
        case "right":
            characterX = gameContainer.offsetWidth - character.offsetWidth;
            currentDirection = 'left';
            break;
        case "left":
            characterX = 0;
            currentDirection = 'right';
            break;
        case "up":
            characterY = 0;
            currentDirection = 'down';
            break;
        case "down":
            characterY = gameContainer.offsetHeight - character.offsetHeight;
            currentDirection = 'up';
            break;
        default:
            characterX = 0;
            characterY = 0;
            currentDirection = 'right';
    }
    characterY = 200;
    character.style.left = characterX + 'px';
    character.style.bottom = characterY + 'px';
    runImage.src = statImages[currentDirection];
    localStorage.removeItem("fromPage");
}

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

    // Vérification des limites et changement de page
    if (characterX < 0) {
        changePage('left');
        return;
    } else if (characterX >= gameContainer.offsetWidth - character.offsetWidth) {
        changePage('right');
        return;
    }

   // Vérification des limites horizontales
   characterX = Math.max(0, Math.min(characterX, gameContainer.offsetWidth - character.offsetWidth));
    
   // Vérification des limites verticales
   characterY = Math.max(100, Math.min(characterY, gameContainer.offsetHeight - character.offsetHeight - 250));
    character.style.left = characterX + 'px';
    character.style.bottom = characterY + 'px';
    adjustContainerPosition();
    if (isJumping) {
        // L'animation de saut est gérée dans handleJump
    } else if (isMoving) {
        switch (currentDirection) {
            case 'left':
                updateAnimation(runLImages);
                break;
            case 'right':
                updateAnimation(runRImages);
                break;
            case 'up':
                updateAnimation(runDImages);
                break;
            case 'down':
                updateAnimation(runFImages);
                break;
        }
    } else {
        runImage.src = statImages[currentDirection];
    }

    checkPanelCollisions();
}

function updateEagleAnimation() {
    if (eagleDirection === 'right') {
        eagleX += eagleSpeed;
        if (eagleX > window.innerWidth - 50) {
            eagleDirection = 'left';
            eagleFrame = 0;
        }
    } else {
        eagleX -= eagleSpeed;
        if (eagleX < 0) {
            eagleDirection = 'right';
            eagleFrame = 0;
        }
    }

    eagleY = Math.sin(eagleX * 0.02) * 50 + 100;

    eagleFrameCount++;
    if (eagleFrameCount >= eagleFrameDelay) {
        eagleFrameCount = 0;
        if (eagleDirection === 'right') {
            eagleFrame = (eagleFrame + 1) % eagleR.length;
            eagle.src = eagleR[eagleFrame];
        } else {
            eagleFrame = (eagleFrame + 1) % eagleL.length;
            eagle.src = eagleL[eagleFrame];
        }
    }

    eagle.style.transition = 'left 0.1s linear, top 0.1s linear';
    eagle.style.left = eagleX + 'px';
    eagle.style.top = eagleY + 'px';
}

function createCloud() {
    const cloudElement = document.createElement('img');
    const randomIndex = Math.floor(Math.random() * cloud.length);
    cloudElement.src = cloud[randomIndex];
    cloudElement.style.position = 'absolute';
    cloudElement.style.top = `${Math.random() * 70 + 70}px`;
    cloudElement.style.left = '-100px';
    cloudElement.style.zIndex = '1';
    cloudElement.style.width = '200px';

    if (skyContainer) {
        skyContainer.appendChild(cloudElement);
    } else {
        console.error('Cloud container not found');
    }
    return cloudElement;
}

function animateCloud(cloudElement) {
    let position = -100;
    const speed = 0.1 + Math.random() * 1;
    const containerWidth = window.innerWidth;

    function move() {
        position += speed;
        cloudElement.style.left = `${position}px`;
        if (position > containerWidth) {
            cloudElement.remove();
        } else {
            requestAnimationFrame(move);
        }
    }
    move();
}

function manageCloudAnimation() {
    const newCloud = createCloud();
    if (newCloud) {
        animateCloud(newCloud);
    }
    const interval = 5000 + Math.random() * 5000;
    setTimeout(manageCloudAnimation, interval);
}

function updateAltarAnimation() {
    for (let i = 1; i <= 4; i++) {
        const panel = document.getElementById(`panel${i}`);
        if (!panel) continue;

        const characterRect = character.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const distanceY = Math.abs(characterRect.right - characterRect.width / 2 - (panelRect.right - panelRect.width / 2));
        const distanceX = Math.abs(characterRect.bottom - characterRect.height / 2 - (panelRect.bottom - panelRect.height / 2));
        let currentAltarImages;
        if (distanceY > 110 || distanceX > 110) {
            currentAltarImages = altarLoin;
        } else if (distanceY > 40 || distanceX > 40) {
            currentAltarImages = altarProche;
        } else {
            currentAltarImages = altarCollision;
        }

        altarFrameCount++;
        if (altarFrameCount >= altarFrameDelay) {
            altarFrameCount = 0;
            altarFrame = (altarFrame + 1) % currentAltarImages.length;
            panel.querySelector('img').src = currentAltarImages[altarFrame];
        }
    }
}

function showModal(modalId) {

    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function hideAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function checkPanelCollisions() {
    const characterRect = character.getBoundingClientRect();
    const characterCenterX = characterRect.left + characterRect.width / 2;
    const characterCenterY = characterRect.top + characterRect.height / 2;

    for (let i = 1; i <= 4; i++) {
        const panel = document.getElementById(`panel${i}`);
        if (!panel) continue;

        const img = panel.querySelector('img');
        if (!img) continue;

        const imgRect = img.getBoundingClientRect();
        const imgCenterX = imgRect.left + imgRect.width / 2;
        const imgCenterY = imgRect.top + imgRect.height / 2;

        // Définir une zone de collision au centre de l'image
        const collisionRadius = 15; // Ajustez selon vos besoins

        // Calculer la distance entre le centre du personnage et le centre de l'image
        const distanceX = Math.abs(characterCenterX - imgCenterX);
        const distanceY = Math.abs(characterCenterY - imgCenterY);

        // Vérifier si le centre du personnage est dans la zone de collision
        if (distanceX <= collisionRadius && distanceY <= collisionRadius) {
            showModal(`modal${i}`);
            return; // Sortir de la fonction après avoir ouvert une modal
        }
    }

    // Si aucune collision n'est détectée, fermer toutes les modals
    hideAllModals();
}
function adjustContainerPosition() {
    const containerRect = container.getBoundingClientRect();
    const characterRect = character.getBoundingClientRect();
    
    let newLeft = -characterRect.left + window.innerWidth / 2;
    let newTop = -characterRect.top + window.innerHeight / 2;
    
    newLeft = Math.min(0, Math.max(newLeft, window.innerWidth - containerRect.width));
    newTop = Math.min(0, Math.max(newTop, window.innerHeight - containerRect.height));
    
    container.style.transform = `translate(${newLeft}px, ${newTop}px)`;
}
function gameLoop() {
    updateCharacterPosition();
    updateEagleAnimation();
    updateAltarAnimation();
    requestAnimationFrame(gameLoop);
}

function init() {
    character.style.left = '0px';
    character.style.bottom = '0px';
    character.style.position = 'absolute';
    eagle.style.position = 'absolute';
    eagle.src = eagleR[0];
    chama.style.top = '47%';
    chama.style.right = '43.5%';

    soundIntro.loop = true;
    soundIntro.volume = 0.5;
    const soundToggle = document.getElementById('soundToggle');
    soundToggle.addEventListener('change', function () {
        if (this.checked) {
            soundIntro.pause();
        } else {
            soundIntro.play();
        }
    });

    if (!soundToggle.checked) {
        soundIntro.play();
    }
    if (altar) {
        altar.src = altarLoin[0];
    }
    manageCloudAnimation();
    positionCharacterOnLoad();
    adjustContainerPosition();
    gameLoop();
}

// Lancer l'initialisation
window.addEventListener('resize', adjustContainerPosition);
window.addEventListener('load', init);
