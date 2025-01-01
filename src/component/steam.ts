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
    <video id="videoSource" src="public/image/steam.mp4" muted playsinline></video>`

    this.steamVideoElement = document.getElementById('videoSource') as HTMLVideoElement;
    this.formatVideo();
    document.addEventListener('play-steam', this.handlePlaySteam.bind(this) as EventListener);
  }
  public applyTextureAndMask(): void { }


  private handlePlaySteam(event: CustomEvent<number>): void {
    if ((Math.random() * 10) >= event.detail) return;
    this.play();
  }

  private formatVideo(): void {

    const canvas = document.getElementById('videoCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    // Paramètres pour le chroma key (ajustez les tolérances selon votre vidéo)
    const green = { r: 0, g: 153, b: 0 }; // Couleur verte à supprimer
    const tolerance = 80; // Tolérance pour détecter le vert

    this.steamVideoElement.addEventListener('play', () => {
      const drawFrame = () => {
        if (!this.steamVideoElement.ended && ctx) {
          ctx.drawImage(this.steamVideoElement, 0, 0, canvas.width, canvas.height);
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const length = frame.data.length;

          for (let i = 0; i < length; i += 4) {
            const r = frame.data[i];
            const g = frame.data[i + 1];
            const b = frame.data[i + 2];

            // Si la couleur est proche du vert, rendre transparent
            if (
              Math.abs(r - green.r) < tolerance &&
              Math.abs(g - green.g) < tolerance &&
              Math.abs(b - green.b) < tolerance
            ) {
              frame.data[i + 3] = 0; // Alpha à 0 (transparent)
            }
          }

          ctx.putImageData(frame, 0, 0);
          requestAnimationFrame(drawFrame);
        }
      };

      drawFrame();
    });
  }
  public play(): void {
    this.steamVideoElement.play();
  }


}