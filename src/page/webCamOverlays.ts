// Import nécessaire si tu utilises des styles ou des dépendances
import { Component } from '../component/Component';
import { Gear } from '../component/Gear';
import '../style.css';

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
    visual: { maskPath: '/mask/axe.svg', texturePath: '/texture/copper-rusty.jpg' },
    zIndex: 50
  })
}