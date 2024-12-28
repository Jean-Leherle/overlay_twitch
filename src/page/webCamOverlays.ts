// Import nécessaire si tu utilises des styles ou des dépendances
import { Component } from '../component/Component';
import { Gear } from '../component/Gear';
import '../style.css';
import { createGearColumn, createGearLine } from '../utils/gearLine';
import { centerTocontactGear, irregularRotate, setPerfectRotateState } from '../utils/gearUtils';

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

  // Exemple : Ajouter et animer un engrenage


  const cornerGearTL = new Gear(gearsContainer, {
    position: { x: 0, y: 0 },
    radius: 150,
    teeth: { count: 30, height: 5 },
    visual: { maskPath: '/mask/gear-big-30.svg', texturePath: '/texture/copper-shiny.avif' },
    zIndex: 20
  })
  new Component(gearsContainer, {
    position: { x: cornerGearTL.radius - 40, y: cornerGearTL.radius - 40 },
    size: { height: 80, width: 80 },
    visual: { maskPath: '/mask/axe.svg', texturePath: '/texture/copper-rusty.jpg', color: 'black' },
    zIndex: 50
  })
  cornerGearTL.rotateState = 40

  const lineX: Gear[] = createGearLine({
    distance: 500,
    parent: gearsContainer,
    position: { x: cornerGearTL.center.x + cornerGearTL.innerRadius, y: cornerGearTL.center.y },
    width: 200,
    zIndex: 50,
    gearBases: [
      {
        radius: { min: 25, max: 40 }, teeth: { count: 8, height: 10 },
        visual: { maskPath: '/mask/gear-basic-8.svg', texturePath: '/texture/copper.jpg' }
      },
      {
        radius: { min: 35, max: 60 }, teeth: { count: 20, height: 4.5 },
        visual: { maskPath: '/mask/gear-big-20.svg', texturePath: '/texture/copper.jpg' }
      }
    ],
    orientation: 'right'
  })
  setPerfectRotateState(cornerGearTL, lineX[0])

  const lineY: Gear[] = createGearColumn({
    distance: 500,
    parent: gearsContainer,
    position: { x: cornerGearTL.center.x, y: cornerGearTL.center.y + cornerGearTL.innerRadius },
    width: 150,
    zIndex: 50,
    gearBases: [
      {
        radius: { min: 25, max: 40 }, teeth: { count: 8, height: 10 },
        visual: { maskPath: '/mask/gear-basic-8.svg', texturePath: '/texture/copper.jpg' }
      },
      {
        radius: { min: 45, max: 60 }, teeth: { count: 20, height: 4.5 },
        visual: { maskPath: '/mask/gear-big-20.svg', texturePath: '/texture/copper.jpg' }
      }
    ],
    orientation: 'down'
  })
  const cornerGearBLRadius = 150
  const cornerGearBL = new Gear(gearsContainer, {
    position: {
      x: cornerGearTL.center.x - cornerGearBLRadius,
      y: centerTocontactGear(lineY[lineY.length - 1], {
        innerRadius: cornerGearBLRadius * 0.95,
        fixedCenter: { x: cornerGearTL.center.x },
        orientation: 'down'
      }) - cornerGearBLRadius
    },
    radius: cornerGearBLRadius,
    teeth: { count: 30, height: 5 },
    visual: { maskPath: '/mask/gear-big-30.svg', texturePath: '/texture/copper-shiny.avif' },
    zIndex: 40
  })


  setPerfectRotateState(cornerGearTL, lineY[0])
  setPerfectRotateState(lineY[lineY.length - 1], cornerGearBL)
  irregularRotate(cornerGearTL, {
    acceleration: 0.5,
    maxSpeed: 1,
    minSpeed: 0.1,
    runningTime: 5000,
    waitingTime: 2000
  })
}