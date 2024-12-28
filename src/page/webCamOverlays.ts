// Import nécessaire si tu utilises des styles ou des dépendances
import { Component } from '../component/Component';
import { Gear } from '../component/Gear';
import '../style.css';
import { createGearStructure } from '../utils/gearLine';
import { irregularRotate, setPerfectRotateState } from '../utils/gearUtils';

// Fonction principale pour initialiser l'overlay
export function initWebcamOverlay(containerId: string) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container avec l'ID '${containerId}' introuvable.`);
    return;
  }

  // Structure HTML de l'overlay
  container.innerHTML = `
    <div id="webcam-overlay">
      <div id="decorative-gears">
      </div>
    </div>
  `;

  // Appelle ici la logique pour animer les engrenages ou personnaliser l'affichage
  initializeDecorativeElements();
}

// Fonction pour animer les éléments décoratifs (engrenages, etc.)
function initializeDecorativeElements() {
  const gearsContainer = document.getElementById('decorative-gears');
  if (!gearsContainer) return;

  const imageElement = document.createElement('img');
  imageElement.src = '/image/overlayCam.png';
  imageElement.alt = 'Overlay Cam';
  imageElement.style.position = 'absolute';
  imageElement.style.width = '1200px';
  imageElement.style.height = '1200px';
  imageElement.style.zIndex = '69';
  gearsContainer.appendChild(imageElement);

  // Création des engrenages et autres éléments décoratifs


  const cornerGearTL = new Gear(gearsContainer, {
    position: { x: 0, y: 0 },
    radius: 150,
    teeth: { count: 30, height: 2.5 },
    visual: { maskPath: '/mask/gear-big-30.svg', texturePath: '/texture/copper-shiny.avif' },
    zIndex: 70
  })
  new Component(gearsContainer, {
    position: { x: cornerGearTL.radius - 40, y: cornerGearTL.radius - 40 },
    size: { height: 80, width: 80 },
    visual: { maskPath: '/mask/axe.svg', texturePath: '/texture/copper-rusty.jpg', color: 'black' },
    zIndex: 70
  })
  cornerGearTL.rotateState = 40

  const lineX: Gear[] = createGearStructure({
    distance: 500,
    parent: gearsContainer,
    position: { x: cornerGearTL.center.x + cornerGearTL.innerRadius, y: cornerGearTL.center.y },
    width: 250,
    zIndex: 50,
    gearBases: [
      {
        radius: { min: 30, max: 40 }, teeth: { count: 8, height: 10 },
        visual: { maskPath: '/mask/gear-basic-8.svg', texturePath: '/texture/copper.jpg' }
      },
      {
        radius: { min: 60, max: 80 }, teeth: { count: 20, height: 4.5 },
        visual: { maskPath: '/mask/gear-big-20.svg', texturePath: '/texture/copper.jpg' }
      }
    ],
    orientation: 'right'
  })
  setPerfectRotateState(cornerGearTL, lineX[0])

  const lineY: Gear[] = createGearStructure({
    distance: 500,
    parent: gearsContainer,
    position: { x: cornerGearTL.center.x, y: cornerGearTL.center.y + cornerGearTL.innerRadius },
    width: 200,
    zIndex: 50,
    gearBases: [
      {
        radius: { min: 40, max: 60 }, teeth: { count: 8, height: 10 },
        visual: { maskPath: '/mask/gear-basic-8.svg', texturePath: '/texture/copper.jpg' }
      },
      {
        radius: { min: 60, max: 80 }, teeth: { count: 20, height: 4.5 },
        visual: { maskPath: '/mask/gear-big-20.svg', texturePath: '/texture/copper.jpg' }
      }
    ],
    orientation: 'down'
  })
  setPerfectRotateState(cornerGearTL, lineY[0])
  irregularRotate(cornerGearTL, {
    acceleration: 0.5,
    maxSpeed: 1,
    minSpeed: 0.1,
    runningTime: 5000,
    waitingTime: 2000
  })

  const smallLineX = createGearStructure({
    parent: gearsContainer,
    distance: 150,
    position: { x: 780, y: 1100 },
    width: 40,
    zIndex: 80,
    gearBases: [
      {
        radius: { min: 30, max: 40 }, teeth: { count: 8, height: 10 },
        visual: { maskPath: '/mask/gear-big-30.svg', texturePath: '/texture/copper-clean.jpg' }
      },
      {
        radius: { min: 20, max: 30 }, teeth: { count: 20, height: 4.5 },
        visual: { maskPath: '/mask/gear-big-20.svg', texturePath: '/texture/copper-clean.jpg' }
      }
    ],
    orientation: 'left',
  })
  smallLineX[0].rotationSpeed = 2
}
