// Éléments du DOM
const container = document.getElementById('container');
const character = document.getElementById('character');
const runImage = document.getElementById('run');

// Images pour les animations
const runLImages = [
    './assets/img/character/runL1.png',
    './assets/img/character/runL2.png',
    './assets/img/character/runL3.png',
    './assets/img/character/runL4.png',
    './assets/img/character/runL5.png',
    './assets/img/character/runL6.png',
    './assets/img/character/runL7.png',
    './assets/img/character/runL8.png'
];
const runRImages = [
    './assets/img/character/runR1.png',
    './assets/img/character/runR2.png',
    './assets/img/character/runR3.png',
    './assets/img/character/runR4.png',
    './assets/img/character/runR5.png',
    './assets/img/character/runR6.png',
    './assets/img/character/runR7.png',
    './assets/img/character/runR8.png'
];
const runFImages = [
    './assets/img/character/runF1.png',
    './assets/img/character/runF2.png',
    './assets/img/character/runF3.png',
    './assets/img/character/runF4.png',
    './assets/img/character/runF5.png',
    './assets/img/character/runF6.png',
    './assets/img/character/runF7.png',
    './assets/img/character/runF8.png'
];
const runDImages = [
    './assets/img/character/runD1.png',
    './assets/img/character/runD2.png',
    './assets/img/character/runD3.png',
    './assets/img/character/runD4.png',
    './assets/img/character/runD5.png',
    './assets/img/character/runD6.png',
    './assets/img/character/runD7.png',
    './assets/img/character/runD8.png'
];
const jumpRImages = [
    './assets/img/character/jumpR1.png',
    './assets/img/character/jumpR2.png',
    './assets/img/character/jumpR3.png',
    './assets/img/character/jumpR4.png'
];
const jumpLImages = [
    './assets/img/character/jumpL1.png',
    './assets/img/character/jumpL2.png',
    './assets/img/character/jumpL3.png',
    './assets/img/character/jumpL4.png'
];
const jumpFImages = [
    './assets/img/character/jumpF1.png',
    './assets/img/character/jumpF2.png',
    './assets/img/character/jumpF3.png',
    './assets/img/character/jumpF4.png'
];
const jumpDImages = [
    './assets/img/character/jumpD1.png',
    './assets/img/character/jumpD2.png',
    './assets/img/character/jumpD3.png',
    './assets/img/character/jumpD4.png'
];
const statImages = {
    left: './assets/img/character/statL1.png',
    right: './assets/img/character/statR1.png',
    up: './assets/img/character/statD1.png',
    down: './assets/img/character/statF1.png'
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

// Gestion des touches
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    updateVirtualKeyboard(e.code, true);
});
document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    updateVirtualKeyboard(e.code, false);
});

// Fonction pour mettre à jour le clavier virtuel
function updateVirtualKeyboard(keyCode, isKeyDown) {
    let keyElement;
    switch(keyCode) {
        case 'ArrowUp':
            keyElement = document.getElementById('arrowUp');
            break;
        case 'ArrowDown':
            keyElement = document.getElementById('arrowDown');
            break;
        case 'ArrowLeft':
            keyElement = document.getElementById('arrowLeft');
            break;
        case 'ArrowRight':
            keyElement = document.getElementById('arrowRight');
            break;
        case 'Space':
            keyElement = document.getElementById('space');
            break;
    }

    if (keyElement) {
        if (isKeyDown) {
            keyElement.classList.add('active');
        } else {
            keyElement.classList.remove('active');
        }
    }
}

// Fonction pour mettre à jour l'animation
function updateAnimation(images) {
    frameCount++;
    if (frameCount >= 5) {
        currentFrame = (currentFrame + 1) % images.length;
        runImage.src = images[currentFrame];
        frameCount = 0;
    }
}

// Gestion du saut
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
        switch (currentDirection) {
            case 'left': jumpImages = jumpLImages; break;
            case 'right': jumpImages = jumpRImages; break;
            case 'up': jumpImages = jumpDImages; break;
            case 'down': jumpImages = jumpFImages; break;
        }

        let jumpFrame = Math.floor(jumpProgress * jumpImages.length);
        runImage.src = jumpImages[Math.min(jumpFrame, jumpImages.length - 1)];
    }
}
// Fonction pour changer de page
function changePage(direction) {
    switch (direction) {
        case 'left':
            localStorage.setItem("fromPage", "right");
            window.location.href = './pages/contact.html';
            break;
        case 'right':
            localStorage.setItem("fromPage", "left");
            window.location.href = './pages/aboutme.html';
            break;
        case 'up':
            localStorage.setItem("fromPage", "left");
            window.location.href = './pages/myproject.html';
            break;
    }
}
// Fonction pour positionner le personnage au chargement de la page
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
// Fonction pour mettre à jour la position du personnage
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
    if (characterY < 0) {
        characterY = 0;
    }

    character.style.left = characterX + 'px';
    character.style.bottom = characterY + 'px';

    if (isJumping) {
        
    } else if (isMoving) { // L'animation de saut est gérée dans handleJump
        switch (currentDirection) {
            case 'left': updateAnimation(runLImages); break;
            case 'right': updateAnimation(runRImages); break;
            case 'up': updateAnimation(runDImages); break;
            case 'down': updateAnimation(runFImages); break;
        }
    } else {
        runImage.src = statImages[currentDirection];
    }
}

// Boucle principale du jeu
function gameLoop() {
    updateCharacterPosition();
    requestAnimationFrame(gameLoop);
}

// Initialisation
function init() {
    character.style.position = 'absolute';
    positionCharacterOnLoad();
    gameLoop();
    showVirtualKeyboard()
}

// Démarrage du jeu
window.addEventListener('load', init);

// Gestion du retour de page (pour le bouton retour du navigateur)
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        positionCharacterOnLoad();
    }
});

// Generer un Text animer qui s'écrit tout seul
const aText = [
    "Bienvenue dans mon univers creatif",
    "Vous decouvrirez mes projets les plus marquants",
    " et reflets de ma creativite.",
    "Explorez en musique ou non, tel est votre choix.",
    "Bonne visite a vous !"
];
const iSpeed = 100; // Temps de frappe generer
let iIndex = 0; // Index de possition du text
let iArrLength = aText[0].length; // Longueur du tableau aText
const iScrollAt = 20; // Commencement du défilement du text en haut a un nombre de lingne

let iTextPos = 0; // Initialiser la position du texte
let sContents = ''; // Détermine la ligne de départ du texte à affiche
let iRow; // Détermine la ligne de départ du texte à afficher.

// Fonction pour créer un effet de machine à écrire
function typewriter() {
    sContents = ' ';
    iRow = Math.max(0, iIndex - iScrollAt);
    const destination = document.getElementById("typedtext");

    while (iRow < iIndex) {
        sContents += aText[iRow++] + '<br />';
    }
    destination.innerHTML = sContents + aText[iIndex].substring(0, iTextPos) + "_";
    if (iTextPos++ == iArrLength) {
        iTextPos = 0;
        iIndex++;
        if (iIndex != aText.length) {
            iArrLength = aText[iIndex].length;
            setTimeout(typewriter, 500); // Créer l'effet d'animation.
        }
    } else {
        setTimeout(typewriter, iSpeed);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    typewriter();
});