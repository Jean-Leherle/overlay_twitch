import { Component } from '../component/Component';
import { Gear } from '../component/Gear';
import { SteamComponent } from '../component/steam';
import '../style.css';
import { createGearStructure } from '../utils/gearLine';
import { irregularRotate, setPerfectRotateState } from '../utils/gearUtils';

export class WebcamOverlay {
  private container: HTMLElement | null;
  private gearsContainer: HTMLElement | null = null;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);

    if (!this.container) {
      console.error(`Container avec l'ID '${containerId}' introuvable.`);
      return;
    }
    this.initialize();
  }
  private initialize(): void {
    this.render();
    this.gearsContainer = document.getElementById('decorative-gears');

    if (!this.gearsContainer) {
      console.error("Le conteneur d'engrenages n'a pas pu être initialisé.");
      return;
    }

    this.initializeDecorativeElements();
  }

  private render(): void {
    if (this.container) {
      this.container.innerHTML = `
        <div id="webcam-overlay">
          <div id="decorative-gears"></div>
        </div>
      `;
    }
  }

  private initializeDecorativeElements(): void {
    if (!this.gearsContainer) return;

    // Ajout de l'image de l'overlay
    const imageElement = document.createElement('img');
    imageElement.src = '/image/overlayCam.png';
    imageElement.alt = 'Overlay Cam';
    imageElement.style.position = 'absolute';
    imageElement.style.width = '1200px';
    imageElement.style.height = '1200px';
    imageElement.style.zIndex = '69';
    this.gearsContainer.appendChild(imageElement);

    // Création des engrenages et autres éléments décoratifs
    const cornerGearTL = new Gear(this.gearsContainer, {
      position: { x: 0, y: 0 },
      radius: 150,
      teeth: { count: 30, height: 2.5 },
      visual: { maskPath: '/mask/gear-big-30.svg', texturePath: '/texture/copper-shiny.avif' },
      zIndex: 70
    });

    // const steam1 = new SteamComponent(this.gearsContainer, {
    //   position: { x: cornerGearTL.position.x + 300, y: cornerGearTL.position.y + 300 },
    //   zIndex: 80,
    //   rotateState: 40
    // })

    // setInterval(() => steam1.play(3), 15000);

    const steam2 = new SteamComponent(this.gearsContainer, {
      position: { x: cornerGearTL.position.x + 700, y: cornerGearTL.position.y - 20 },
      zIndex: 80,
      rotateState: -40
    })

    setInterval(() => { console.log('fume'); steam2.play(2) }, 11000);

    new Component(this.gearsContainer, {
      position: { x: cornerGearTL.radius - 40, y: cornerGearTL.radius - 40 },
      size: { height: 80, width: 80 },
      visual: { maskPath: '/mask/axe.svg', texturePath: '/texture/copper-rusty.jpg', color: 'black' },
      zIndex: 70
    });

    cornerGearTL.rotateState = 40;

    // Création des lignes d'engrenages
    const lineX = createGearStructure({
      distance: 500,
      parent: this.gearsContainer,
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
    });

    setPerfectRotateState(cornerGearTL, lineX[0]);

    const lineY = createGearStructure({
      distance: 500,
      parent: this.gearsContainer,
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
    });

    setPerfectRotateState(cornerGearTL, lineY[0]);

    irregularRotate(cornerGearTL, {
      acceleration: 0.5,
      maxSpeed: 1,
      minSpeed: 0.1,
      runningTime: 5000,
      waitingTime: 2000
    });

    const smallLineX = createGearStructure({
      parent: this.gearsContainer,
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
    });

    smallLineX[0].rotationSpeed = 2;
  }
}
