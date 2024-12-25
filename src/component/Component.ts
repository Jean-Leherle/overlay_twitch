import { Position } from "../types/Position";
import { Size } from "../types/Size";
import { v7 as uuid } from 'uuid'

export type ComponentConfig = {
  size: Size,
  position: Position,
  visual: {
    texturePath: string, maskPath: string
  }
}
export class Component {
  public element: HTMLElement;
  public position: Position;
  public size: Size;
  public readonly UPDATEFRAME: number = 25;
  protected intervalId?: number;
  protected visual: {
    texturePath: string, maskPath: string
  }

  constructor(
    parent: HTMLElement,
    config: ComponentConfig
  ) {
    this.position = config.position;
    this.size = config.size;
    this.visual = config.visual
    const generatedId = uuid();
    this.element = this.initElement(generatedId);
    this.applyTextureAndMask()
    this.render(); // Applique les styles de position et de taille
    parent.appendChild(this.element);

    // Lancer les mises à jour automatiques
    this.startRealTimeUpdate();
  }

  protected initElement(id: string): HTMLElement {
    const element = document.createElement("div");
    element.id = id;
    element.classList.add('component')
    return element;
  }

  protected render(): void {
    if (this.visual)
      this.renderPosition()
    this.renderSize()
  }

  protected renderPosition(): void {
    this.element.style.left = `${this.position.x}px`;
    this.element.style.top = `${this.position.y}px`;
  }

  protected renderSize(): void {
    this.element.style.width = `${this.size.width}px`;
    this.element.style.height = `${this.size.height}px`;
  }

  public update(): void {
    // Méthode générique, surchargeable dans les sous-classes
  }

  private startRealTimeUpdate(): void {
    this.intervalId = setInterval(() => {
      this.update();
      this.render();
    }, this.UPDATEFRAME);
  }

  public stopRealTimeUpdate(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  public getDist(origin: Position, destination: Position): number {
    return Math.sqrt(Math.abs(origin.x - destination.x) ** 2 + Math.abs(origin.y - destination.y) ** 2)
  }

  public applyTextureAndMask(): void {
    this.element.style.setProperty("--component-texture", `url('${this.visual.texturePath}')`);
    this.element.style.mask = `url('${this.visual.maskPath}') center/cover repeat`;
  }
}