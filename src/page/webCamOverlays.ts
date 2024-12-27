// Import nécessaire si tu utilises des styles ou des dépendances
import { Component } from '../component/Component';
import { Gear } from '../component/Gear';
import '../style.css';
import { createGearLine } from '../utils/gearLine';

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


  const cornerGear = new Gear(gearsContainer, {
    position: { x: 0, y: 0 },
    radius: 150,
    teeth: { count: 20, height: 5 },
    visual: { maskPath: '/mask/gear-big-20.svg', texturePath: '/texture/copper-shiny.avif' },
    zIndex: 20
  })
  new Component(gearsContainer, {
    position: { x: cornerGear.radius - 40, y: cornerGear.radius - 40 },
    size: { height: 80, width: 80 },
    visual: { maskPath: '/mask/axe.svg', texturePath: '/texture/copper-rusty.jpg', color: 'black' },
    zIndex: 50
  })
  cornerGear.rotateState = 40

  const lineX: Gear[] = createGearLine({
    distance: 500,
    parent: gearsContainer,
    position: { x: cornerGear.center.x + cornerGear.radius, y: cornerGear.center.y },
    width: 200,
    zIndex: 50,
    gearBases: [
      {
        radius: { min: 15, max: 40 }, teeth: { count: 8, height: 10 },
        visual: { maskPath: '/mask/gear-basic-8.svg', texturePath: '/texture/copper.jpg' }
      },
      {
        radius: { min: 40, max: 80 }, teeth: { count: 20, height: 4 },
        visual: { maskPath: '/mask/gear-big-20.svg', texturePath: '/texture/copper.jpg' }
      }
    ]
  })
  lineX[0].rotationSpeed = 1
}