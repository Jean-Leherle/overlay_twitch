import { Position } from "../types/Position";
import { Component } from "./Component";

export interface SteamConfig {
  position: Position; // Position de la missive
  zIndex?: number; // Index z pour la hiérarchie visuelle
  size?: { width: number, height: number };
  rotateState: number;
}

export class SteamComponent extends Component {
  private static preformattedFrames: ImageData[] | null = null; // Frames préformatées (partagées)
  private static preformatPromise: Promise<ImageData[]> | null = null; // Promesse pour éviter un préformatage multiple
  private static delay: number = 80; // Délai entre chaque frame en ms

  private canvaElement: HTMLCanvasElement;
  private playCount: number | null = null; // Nombre de lectures restantes (null pour boucle infinie)
  private currentPlayCount: number = 0; // Compteur des lectures effectuées
  private isPlaying: boolean = false;


  constructor(parent: HTMLElement, config: SteamConfig) {
    super(parent, {
      size: config.size ?? { width: 200, height: 100 },
      position: { x: config.position.x, y: config.position.y },
      visual: { maskPath: "", texturePath: "" },
      zIndex: config.zIndex ?? 100,
    });

    this.parentElement.style.transform = `rotate(${config.rotateState}deg)`;
    this.parentElement.innerHTML = `
      <canvas id="videoCanvas" width="500" height="300"></canvas>
      <video id="videoSource" src="/image/steam.mp4" muted playsinline></video>`;

    this.canvaElement = this.parentElement.querySelector("#videoCanvas") as HTMLCanvasElement;

    // Initier le préformatage si ce n'est pas déjà fait
    if (!SteamComponent.preformattedFrames && !SteamComponent.preformatPromise) {
      const steamVideoElement = this.parentElement.querySelector("#videoSource") as HTMLVideoElement;
      steamVideoElement.pause();
      steamVideoElement.autoplay = false;

      SteamComponent.preformatPromise = new Promise((resolve) => {
        steamVideoElement.addEventListener("loadeddata", async () => {
          SteamComponent.preformattedFrames = await SteamComponent.preFormatVideo(
            steamVideoElement
          );

          resolve(SteamComponent.preformattedFrames);
        });
      });
    }
  }

  public static async preFormatVideo(video: HTMLVideoElement): Promise<ImageData[]> {
    const frames: ImageData[] = [];
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) {
      console.error("Impossible de créer un contexte pour le canvas");
      return frames;
    }

    // Configure le canvas à la taille de la vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const green = { r: 0, g: 153, b: 0 }; // Couleur verte à supprimer

    return new Promise((resolve) => {
      const captureFrame = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Supprime la couleur verte
        for (let i = 0; i < frame.data.length; i += 4) {
          const r = frame.data[i];
          const g = frame.data[i + 1];
          const b = frame.data[i + 2];

          if (
            Math.abs(r - green.r) < 40 &&
            Math.abs(g - green.g) < 40 &&
            Math.abs(b - green.b) < 40
          ) {
            frame.data[i + 3] = 0; // Rend le pixel transparent
          }
        }

        frames.push(frame);

        if (video.currentTime < video.duration) {
          video.currentTime += SteamComponent.delay / 1000; // Avance de quelques ms
        } else {
          resolve(frames);
        }
      };

      video.addEventListener("seeked", captureFrame);
      video.currentTime = 0; // Démarre au début
    });

  }

  public async play(playCount: number | null = null): Promise<void> {
    if (this.isPlaying) {
      return; // Empêche de lancer une nouvelle lecture
    }

    this.isPlaying = true; // Indique qu'une lecture est en cours

    // Attendre la fin du préformatage si nécessaire
    if (!SteamComponent.preformattedFrames) {
      await SteamComponent.preformatPromise;
    }

    // Vérifie si les frames sont disponibles
    if (!SteamComponent.preformattedFrames || SteamComponent.preformattedFrames.length === 0) {
      console.error("Les frames préformatées ne sont pas disponibles.");
      this.isPlaying = false; // Réinitialise l'état en cas d'erreur
      return;
    }

    // Ajuster les dimensions du canvas avant d'afficher les frames
    const frameWidth = SteamComponent.preformattedFrames[0].width;
    const frameHeight = SteamComponent.preformattedFrames[0].height;
    this.canvaElement.width = frameWidth;
    this.canvaElement.height = frameHeight;

    this.playCount = playCount ?? 1;
    this.currentPlayCount = 0;

    while (this.playCount === null || this.currentPlayCount < this.playCount) {
      for (const frame of SteamComponent.preformattedFrames) {
        const promise = new Promise((resolve) =>
          setTimeout(resolve, SteamComponent.delay)
        );
        const ctx = this.canvaElement.getContext("2d");
        if (!ctx) {
          console.error("Contexte du canvas non trouvé.");
          this.isPlaying = false; // Réinitialise l'état en cas d'erreur
          return;
        }

        ctx.putImageData(frame, 0, 0);
        await promise;
      }
      this.currentPlayCount++;
    }

    this.isPlaying = false; // Réinitialise l'état après la fin de la lecture
  }
}
