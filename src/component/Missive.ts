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

  private state: "closed" | "opening" | "open" | "closing" = "closed"; // État de la missive

  constructor(parent: HTMLElement, config: MissiveConfig) {

    super(parent, { ...config, visual: { maskPath: '', texturePath: '' }, size: { width: 300, height: 100 } });
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

  public async open(): Promise<void> {
    if (this.state !== "closed") return; // Si déjà ouvert ou en ouverture, ignorer
    this.state = "opening";
    this.moveTo({ x: this.position.x + 200, y: this.position.y - 100 }, 12 * 45)
    // Rortation de 90°
    for (let i = 0; i <= 90; i += 2) {
      this.rotateState = i;
      //attendre 1s/90 = 11ms
      await new Promise(resolve => setTimeout(resolve, 12));
      // Affiche uniquement le username
      this.updateText();
    }
    this.rotateState = 90;

    this.state = "open";
    this.parentElement.dispatchEvent(new CustomEvent('missiveOpened', { detail: this, bubbles: true }));

  }

  public async close(): Promise<void> {
    if (this.state !== "open") return; // Si déjà fermé, ignorer
    this.state = "closing";
    await this.moveTo({ x: this.position.x, y: this.position.y + 400 }, 400)
    this.parentElement.innerHTML = ""
    this.parentElement.dispatchEvent(new CustomEvent('missiveClosed', { detail: this, bubbles: true }));
    this.state = "closed";
  }

  protected applyTextureFilter(): void {
    this.parentElement.style.zIndex = String(this.zIndex)
  }
  protected applyTextureAndMask(): void {
    if (this.visual.maskPath.length === 0 && this.visual.texturePath.length === 0) {
      this.childElement.classList.add("missive-texture");  // Applique la classe CSS
    }
  }
}
