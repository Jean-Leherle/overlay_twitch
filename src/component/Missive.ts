import { Component } from "./Component";
import { Movable } from "./MovableComponent";
import { Rotatable } from "./RotatableComponent";
import { Position } from "../types/Position";
import { ParsedMessage } from "../utils/tchatUtils";
import { v7 as uuid } from "uuid";

// Configuration spécifique pour Missive
export interface MissiveConfig {
  position: Position; // Position de la missive
  zIndex: number; // Index z pour la hiérarchie visuelle
  message: ParsedMessage; // Contenu du texte
}

// Combine les mixins pour inclure les fonctionnalités "movable" et "rotatable"
const Base = Movable(Rotatable(Component));

export class Missive extends Base {
  public uuid: string = uuid()
  public parsedMessage: ParsedMessage;
  private coverTextElement: HTMLElement;
  public static readonly SIZE: { width: number, height: number } = { width: 300, height: 100 }

  private state: "closed" | "opening" | "open" | "closing" = "closed"; // État de la missive

  constructor(parent: HTMLElement, config: MissiveConfig) {

    super(parent, { ...config, visual: { maskPath: '', texturePath: '' }, size: Missive.SIZE });
    this.parsedMessage = config.message;

    // Initialiser l'élément texte
    this.coverTextElement = this.createCoverTextElement();
    this.updateText();
    this.parentElement.appendChild(this.coverTextElement);
  }

  // Crée l'élément texte (fixé au centre de la missive)
  private createCoverTextElement(): HTMLElement {
    const textElement = document.createElement("div");
    textElement.classList.add("missive-cover");  // Applique la classe CSS
    textElement.style.zIndex = String(this.zIndex + 1);  // Applique dynamiquement le zIndex
    return textElement;
  }

  private adjustTextSizeToContainer() {
    const containerWidth = this.parentElement.offsetWidth; // Largeur du conteneur parent (200px)

    // Calculer la taille de la police en fonction de la largeur du conteneur
    const fontSize = Math.round(Math.min(containerWidth / 10, 24)); // Ajuster la taille du texte en fonction de la largeur
    this.childElement.style.fontSize = `${fontSize}px`;
  }

  // Met à jour le texte affiché
  private updateText(): void {
    this.coverTextElement.innerText = this.parsedMessage.username;
    this.adjustTextSizeToContainer();
  }

  private animateRotationTo(targetAngle: number, duration: number = 1000): Promise<void> {
    return new Promise(resolve => {
      const startAngle = this.rotateState;
      const angleDelta = targetAngle - startAngle;
      const startTime = performance.now();

      const step = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        this.rotateState = startAngle + angleDelta * progress;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          this.rotateState = targetAngle;
          resolve();
        }
      };

      requestAnimationFrame(step);
    });
  }

  public async open(): Promise<void> {
    if (this.state !== "closed") return;
    this.state = "opening";

    await Promise.all([
      this.moveTo({ x: this.position.x + 140, y: this.position.y - 80 }, 12 * 45),
      this.animateRotationTo(90, 12 * 45)
    ])

    this.state = "open";
  }

  public async close(): Promise<void> {
    if (this.state !== "open") return; // Si déjà fermé, ignorer
    this.state = "closing";
    await this.moveTo({ x: this.position.x, y: this.position.y + 300 }, 400);
    this.parentElement.innerHTML = "";
    this.stopRealTimeUpdate();
    this.state = "closed";
  }

  protected applyTextureFilter(): void {
    this.parentElement.style.zIndex = String(this.zIndex)
  }
  protected applyTextureAndMask(): void {
    if (this.visual.maskPath.length === 0 && this.visual.texturePath.length === 0) {
      this.childElement.classList.add("missive-texture");  // Applique la classe CSS
    }
    this.applyTextureFilter();
  }
}
