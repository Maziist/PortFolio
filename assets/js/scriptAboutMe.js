// Éléments du DOM
const soundIntro = new Audio("../assets/son/IntoTheSpaceship.wav")
const container = document.getElementById('container');
const character = document.getElementById('character');
const runImage = document.getElementById('run');
const tableau = document.querySelector('.imageContainer');
const clouds = [];
const numClouds = 3;
const cloudSpeed = 1;

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
};
const cloudImages = [
    '../assets/img/cloud/cloud1.png', '../assets/img/cloud/cloud4.png', '../assets/img/cloud/cloud3.png',
    '../assets/img/cloud/cloud5.png', '../assets/img/cloud/cloud2.png', '../assets/img/cloud/cloud6.png'
];

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
let tableauMoving = false;
let tableauX = 0;

// Gestion des touches
const keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});
document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});
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
    let jumpImages = currentDirection === 'left' ? jumpLImages : jumpRImages;
    let jumpFrame = Math.floor(jumpProgress * jumpImages.length);
    runImage.src = jumpImages[Math.min(jumpFrame, jumpImages.length - 1)];
  }
}
// Fonction pour changer de page
function changePage(direction) {
    switch(direction) {
        case 'left':
            localStorage.setItem("fromPage", "right");
            window.location.href = '../../index.html';
            break;
        case 'right':
            localStorage.setItem("fromPage", "left");
            window.location.href = '../../pages/myproject.html';
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

    // Collision avec le tableau
    const characterRect = character.getBoundingClientRect();
    const tableauRect = tableau.getBoundingClientRect();
    if (characterRect.right > tableauRect.left &&
        characterRect.left < tableauRect.right &&
        characterRect.bottom > tableauRect.top &&
        characterRect.top < tableauRect.bottom) {
        if (!tableauMoving) {
            tableauMoving = true;
            animateTableau();
        }
    } else {
        tableauMoving = false;
    }

    character.style.left = characterX + 'px';
    character.style.bottom = characterY + 'px';
    if (isJumping) { // Animation de saut est gérée dans handleJump
    } else if (isMoving) {
        updateAnimation(currentDirection === 'left' ? runLImages : runRImages);
    } else {
        runImage.src = statImages[currentDirection];
    }
}
// Animation du tableau
function animateTableau() {
    if (!tableauMoving) return;
    tableauX += 2;
    tableau.style.transform = `translateX(${tableauX}px)`;
    if (tableauX < 25) {
        requestAnimationFrame(animateTableau);
    } else {
        returnTableau();
    }
}

function returnTableau() {
    tableauX -= 1;
    tableau.style.transform = `translateX(${tableauX}px)`;
    if (tableauX > 0) {
        requestAnimationFrame(returnTableau);
    } else {
        tableauMoving = false;
    }
}

// Créeation des nuages
function createAndAnimateClouds() {
    const cloudArea = {
        width: window.innerWidth * 1,
        height: 10,
        top: 0,
    };
    for (let i = 0; i < numClouds; i++) {
        const cloud = document.createElement('img');
        cloud.src = cloudImages[Math.floor(Math.random() * cloudImages.length)]; // Apparaitre les nuage aléatoir
        cloud.style.position = 'fixed';
        cloud.style.left = `${(window.innerWidth - cloudArea.width) / 2 + Math.random() * cloudArea.width}px`;
        cloud.style.top = `${cloudArea.top + Math.random() * cloudArea.height}px`;
        cloud.style.zIndex = '-1';
        const scale = 0.5 + Math.random() * 0.5;
        cloud.style.transform = `scale(${scale})`;
        container.appendChild(cloud);
        clouds.push({
            element: cloud,
            speed: cloudSpeed * (0.5 + Math.random()),
            initialLeft: parseFloat(cloud.style.left)
        });
    }
}
// Animation des nuages
function animateClouds() {
    clouds.forEach(cloud => {
        let cloudX = parseFloat(cloud.element.style.left);
        cloudX += cloud.speed;
        if (cloudX > cloud.initialLeft + window.innerWidth) {
            cloudX = cloud.initialLeft - cloud.element.width;
            cloud.element.src = cloudImages[Math.floor(Math.random() * cloudImages.length)];
            cloud.element.style.top = `${Math.random() * 10}px`;
        }
        cloud.element.style.left = `${cloudX}px`;
    });
    requestAnimationFrame(animateClouds);
}
// Boucle principale du jeu
function gameLoop() {
    updateCharacterPosition();
    requestAnimationFrame(gameLoop);
}

// Initialisation
function init() {
    character.style.position = 'absolute';
    // Démarrer la lecture du son en boucle
    soundIntro.loop = true;
    soundIntro.volume = 0.5; // Ajustez le volume selon vos préférences (0.0 à 1.0)
    const soundToggle = document.getElementById('soundToggle');
    soundToggle.addEventListener('change', function() {
        if (this.checked) {
            soundIntro.pause();
        } else {
            soundIntro.play();
        }
    });
  
    // Jouer le son si le toggle est activé par défaut
    if (soundToggle.checked) {
        soundIntro.play();
    }

    positionCharacterOnLoad();
    createAndAnimateClouds();
    gameLoop();
}

// Démarrage du jeu
init();
animateClouds();

const aText = [
    "Je suis une jeune développeuse junior passionnée en route pour créer des expériences numériques magnifiques et fonctionnelles. Dès le moment où j'ai vu le portfolio du développeur Bruno Simon et construit ma première page web \"Hello, World!\", j'ai su que j'avais trouvé ma vocation et une nouvelle passion. Depuis mes débuts dans le monde du développement web, chaque projet qu'on réalise est une opportunité d'apprendre quelque chose de nouveau, améliorer mon art et repousser mes limites. Passionnée d'art et de jeu vidéo cela me permet d'avoir de l'inspiration pour de nouveau projet.", 
];
const iSpeed = 10; // Temps de frappe generer
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
