import { Position } from "../types/Position";
import { Component } from "./Component";

export interface SteamConfig {
  position: Position; // Position de la vapeur
  zIndex?: number; // Index z pour la hiérarchie visuelle
  size?: { width: number; height: number };
  rotateState: number;
}

export class SteamComponent extends Component {
  private videoElement: HTMLVideoElement;
  private playCount: number | null = null; // Nombre de lectures à effectuer (null = boucle infinie)
  private currentPlayCount: number = 0; // Compteur des lectures effectuées
  private isPlaying: boolean = false; // Indique si une lecture est en cours

  constructor(parent: HTMLElement, config: SteamConfig) {
    super(parent, {
      size: config.size ?? { width: 200, height: 100 },
      position: { x: config.position.x, y: config.position.y },
      visual: { maskPath: "", texturePath: "" },
      zIndex: config.zIndex ?? 100,
    });

    // Appliquer la rotation à l'élément parent
    this.parentElement.style.transform = `rotate(${config.rotateState}deg)`;

    // Insérer l'élément vidéo directement dans le DOM
    this.parentElement.innerHTML = `
      <video
        src="/image/steam.webm"
        muted
        playsinline
        preload="auto"
      ></video>
    `;

    this.videoElement = this.parentElement.querySelector("video") as HTMLVideoElement;

    // Ajuster la taille de l'élément parent en fonction des dimensions configurées
    if (config.size) {
      this.parentElement.style.width = `${config.size.width}px`;
      this.parentElement.style.height = `${config.size.height}px`;
    }
    this.videoElement.addEventListener("ended", () => this.handleVideoEnd());
  }

  public play(playCount: number | null = null): void {

    if (this.isPlaying) {
      return; // Empêche de relancer si déjà en lecture
    }

    this.playCount = playCount;
    this.currentPlayCount = 0;
    this.isPlaying = true;

    this.videoElement.loop = false; // Désactiver la boucle native
    this.videoElement.play(); // Démarrer la lecture
  }

  public pause(): void {
    this.videoElement.pause();
  }

  private handleVideoEnd(): void {
    this.currentPlayCount++;

    if (this.playCount === null || this.currentPlayCount < this.playCount) {
      this.videoElement.currentTime = 0; // Revenir au début
      this.videoElement.play(); // Redémarrer
    } else {
      this.isPlaying = false; // Lecture terminée
    }
  }
}