// Éléments du DOM
const soundIntro = new Audio("../assets/son/ending.mp3")
const container = document.getElementById('container');
const character = document.getElementById('character');
const runImage = document.getElementById('run');
const tableau = document.querySelector('.imageContainer');
const bunny1 = document.getElementById('bunny');

// Images pour les animations
const runLImages = ['../assets/img/character/runL1.png', '../assets/img/character/runL2.png', '../assets/img/character/runL3.png', '../assets/img/character/runL4.png', '../assets/img/character/runL5.png', '../assets/img/character/runL6.png', '../assets/img/character/runL7.png', '../assets/img/character/runL8.png'];
const runRImages = ['../assets/img/character/runR1.png', '../assets/img/character/runR2.png', '../assets/img/character/runR3.png', '../assets/img/character/runR4.png', '../assets/img/character/runR5.png', '../assets/img/character/runR6.png', '../assets/img/character/runR7.png', '../assets/img/character/runR8.png'];
const runFImages = ['../assets/img/character/runF1.png', '../assets/img/character/runF2.png', '../assets/img/character/runF3.png', '../assets/img/character/runF4.png', '../assets/img/character/runF5.png', '../assets/img/character/runF6.png', '../assets/img/character/runF7.png', '../assets/img/character/runF8.png'];
const runDImages = ['../assets/img/character/runD1.png', '../assets/img/character/runD2.png', '../assets/img/character/runD3.png', '../assets/img/character/runD4.png', '../assets/img/character/runD5.png', '../assets/img/character/runD6.png', '../assets/img/character/runD7.png', '../assets/img/character/runD8.png'];
const jumpRImages = ['../assets/img/character/jumpR1.png', '../assets/img/character/jumpR2.png', '../assets/img/character/jumpR3.png', '../assets/img/character/jumpR4.png'];
const jumpLImages = ['../assets/img/character/jumpL1.png', '../assets/img/character/jumpL2.png', '../assets/img/character/jumpL3.png', '.../assets/img/character/jumpL4.png'];
const jumpFImages = ['../assets/img/character/jumpF1.png', '../assets/img/character/jumpF2.png', '../assets/img/character/jumpF3.png', '../assets/img/character/jumpF4.png'];
const jumpDImages = ['../assets/img/character/jumpD1.png', '../assets/img/character/jumpD2.png', '../assets/img/character/jumpD3.png', '../assets/img/character/jumpD4.png'];

const statImages = {
  left: '../assets/img/character/statL1.png',
  right: '../assets/img/character/statR1.png'
};
const bunnyL = [
  '../assets/img/bunny/bunnyL7.png','../assets/img/bunny/bunnyL8.png','../assets/img/bunny/bunnyL9.png','../assets/img/bunny/bunnyL10.png','../assets/img/bunny/bunnyL11.png','../assets/img/bunny/bunnyL12.png'
]
const bunnyR = [
  '../assets/img/bunny/bunnyR7.png','../assets/img/bunny/bunnyR8.png','../assets/img/bunny/bunnyR9.png','../assets/img/bunny/bunnyR10.png','../assets/img/bunny/bunnyR11.png','../assets/img/bunny/bunnyR12.png'
]

// Variables de contrôle
let characterX = 0;
let characterY = 0;
let isJumping = false;
let jumpHeight = 100;
let jumpStartY = 0;
let jumpProgress = 0;
let moveSpeed = 5;
let currentFrame = 0;
let characterFrameCount = 0;
let currentDirection = 'right';
let bunnyFrame = 0;
let bunnyFrameCount = 0;
let bunnyX = 0;
let bunnyDirection = 'right';
let bunnySpeed = 2;
const frameDelay = 3;


// Gestion des touches
const keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});
document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});
// Fonction pour mettre à jour l'animation
function updateCharacterAnimation(images) {
  characterFrameCount++;
  if (characterFrameCount >= 5) {
    currentFrame = (currentFrame + 1) % images.length;
    runImage.src = images[currentFrame];
    characterFrameCount = 0;
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
            window.location.href = '../../pages/myproject.html';
            break;
        case 'right':
            localStorage.setItem("fromPage", "left");
            window.location.href = '../index.html';
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

  character.style.left = characterX + 'px';
  character.style.bottom = characterY + 'px';

  if (isJumping) {
    // L'animation de saut est gérée dans handleJump
  }  else if (isMoving) {
    switch (currentDirection) {
      case 'left': updateCharacterAnimation(runLImages); break;
      case 'right': updateCharacterAnimation(runRImages); break;
    }
  } else {
    runImage.src = statImages[currentDirection];
  }
}
// Mise à jour de la position du lapin
function updateBunnyAnimation() {
  if (bunnyDirection === 'right') {
    bunnyX += bunnySpeed;
    if (bunnyX > window.innerWidth - 50) {
      bunnyDirection = 'left';
      bunnyFrame = 0;
    }
  } else {
    bunnyX -= bunnySpeed;
    if (bunnyX < 0) {
      bunnyDirection = 'right';
      bunnyFrame = 0;
    }
  }
  // Mise à jour de l'image du lapin
  bunnyFrameCount++;
  if (bunnyFrameCount >= frameDelay) {
    bunnyFrameCount = 0;
    if (bunnyDirection === 'right') {
      bunnyFrame = (bunnyFrame + 1) % bunnyR.length;
      bunny1.src = bunnyR[bunnyFrame];
    } else {
      bunnyFrame = (bunnyFrame + 1) % bunnyL.length;
      bunny1.src = bunnyL[bunnyFrame];
    }
  }

  // Application de la nouvelle position avec une transition fluide
  bunny1.style.transition = 'left 0.1s linear';
  bunny1.style.left = bunnyX + 'px';
}

function gameLoop(timestamp) {
  updateCharacterPosition(); // Ceci inclut maintenant l'appel à updateCharacterAnimation
  updateBunnyAnimation();
  requestAnimationFrame(gameLoop);
}

function init() {
  character.style.position = 'absolute';
  bunnyX = 0;
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
  requestAnimationFrame(gameLoop);
}

// Démarrage du jeu
init();
