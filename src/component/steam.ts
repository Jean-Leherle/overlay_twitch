import { Position } from "../types/Position";
import { Component } from "./Component";

export interface SteamConfig {
  position: Position; // Position de la missive
  zIndex?: number; // Index z pour la hiérarchie visuelle
  size?: { width: number, height: number };
  rotateState: number;
}

export class SteamComponent extends Component {
  private steamVideoElement: HTMLVideoElement;
  private playCount: number | null = null; // Nombre de lectures restantes (null pour boucle infinie)
  private currentPlayCount: number = 0; // Compteur des lectures effectuées

  constructor(parent: HTMLElement, config: SteamConfig) {
    super(parent,
      {
        size: config.size ?? { width: 200, height: 100 },
        position: { x: config.position.x, y: config.position.y },
        visual: { maskPath: '', texturePath: '' },
        zIndex: config.zIndex ?? 100,
      });

    this.parentElement.style.transform = `rotate(${config.rotateState}deg)`;
    this.parentElement.innerHTML = `
      <canvas id="videoCanvas" width="500" height="300"></canvas>
      <video id="videoSource" src="/image/steam.mp4" muted playsinline></video>`;

    this.steamVideoElement = this.parentElement.querySelector('#videoSource') as HTMLVideoElement;

    this.steamVideoElement.autoplay = false;

    this.formatVideo();

    // Écoutez la fin de la vidéo pour gérer les lectures multiples
    this.steamVideoElement.addEventListener('ended', this.handleVideoEnd.bind(this));

    document.addEventListener('play-steam', this.handlePlaySteam.bind(this) as EventListener);
  }

  public applyTextureAndMask(): void { }

  private handlePlaySteam(event: Event): void {
    const customEvent = event as CustomEvent<number>;
    console.log('play steam in steam');

    if (Math.random() * 10 >= customEvent.detail) return;
    this.play(Math.floor(Math.random() * 3) + 1);
  }

  private handleVideoEnd(): void {
    if (this.playCount === null) {
      // Lecture en boucle
      this.steamVideoElement.play();
    } else if (this.currentPlayCount < this.playCount - 1) {
      // Lecture multiple
      this.currentPlayCount++;
      this.currentPlayCount %= 100;
      this.steamVideoElement.play();
    } else {
      // Arrêter la lecture après le nombre défini
      this.currentPlayCount = 0;
    }
  }

  public async play(playCount: number | null = null): Promise<void> {
    this.playCount = playCount;
    this.currentPlayCount = 0;

    // Réinitialiser la vidéo si elle est en pause ou terminée
    if (this.steamVideoElement.paused || this.steamVideoElement.ended) {
      this.steamVideoElement.currentTime = 0; // Remettre à zéro le temps de lecture
      await this.steamVideoElement.play(); // Relancer la lecture
    }
  }

  private formatVideo(): void {
    const canvas = this.parentElement.querySelector('#videoCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const green = { r: 0, g: 153, b: 0 }; // Couleur verte à supprimer

    this.steamVideoElement.addEventListener('play', () => {
      const drawFrame = () => {
        if (!this.steamVideoElement.ended && ctx) {
          ctx.drawImage(this.steamVideoElement, 0, 0, canvas.width, canvas.height);
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const length = frame.data.length;

          // Traitement pour supprimer la couleur verte (par exemple)
          for (let i = 0; i < length; i += 4) {
            const r = frame.data[i];
            const g = frame.data[i + 1];
            const b = frame.data[i + 2];

            if (
              (r - green.r) < 20 &&
              (g - green.g) < 20 &&
              (b - green.b) < 20
            ) {
              frame.data[i + 3] = 0; // Rendre transparent
            }
          }

          ctx.putImageData(frame, 0, 0);
          setTimeout(() => requestAnimationFrame(drawFrame), 80);
        }
      };

      drawFrame(); // Démarrer le dessin en boucle à chaque image de la vidéo
    });
  }
}
