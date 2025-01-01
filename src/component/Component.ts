import { Position } from "../types/Position";
import { Size } from "../types/Size";

export type VisualConfig = {
  texturePath: string,
  maskPath: string,
  color?: string

}
export type ComponentConfig = {
  size: Size,
  zIndex?: number
  position: Position,
  visual: VisualConfig
}
export class Component {
  public childElement: HTMLElement;
  public parentElement: HTMLElement;
  public position: Position;
  public size: Size;
  public zIndex: number;
  public readonly UPDATEFRAME: number = 25;
  protected intervalId?: NodeJS.Timeout;
  protected visual: VisualConfig
  protected bgElement?: HTMLElement

  constructor(
    parent: HTMLElement,
    config: ComponentConfig
  ) {
    this.position = config.position;
    this.size = config.size;
    this.visual = config.visual
    this.zIndex = config.zIndex ?? 0
    this.parentElement = this.initElement();
    this.childElement = this.initElement('child-component')
    this.parentElement.appendChild(this.childElement)
    if (this.visual.color) {
      this.bgElement = this.initElement('mask-layer')
      this.parentElement.appendChild(this.bgElement)
      this.applyBgColor()
    }
    this.applyTextureAndMask()
    this.render(); // Applique les styles de position et de taille
    parent.appendChild(this.parentElement);

    // Lancer les mises à jour automatiques
    this.startRealTimeUpdate();
  }

  protected initElement(classLabel?: string): HTMLElement {
    const element = document.createElement("div");
    element.classList.add(classLabel ?? 'component')
    return element;
  }

  protected render(): void {
    this.renderPosition()
    this.renderSize()
  }

  protected renderPosition(): void {
    this.parentElement.style.left = `${this.position.x}px`;
    this.parentElement.style.top = `${this.position.y}px`;
  }

  protected renderSize(): void {
    this.parentElement.style.width = `${this.size.width}px`;
    this.parentElement.style.height = `${this.size.height}px`;
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

  protected applyTextureFilter(): void {
    this.parentElement.style.zIndex = String(this.zIndex)
    this.childElement.style.filter = `brightness(${this.zIndex}%) grayscale(${100 - this.zIndex}%)`
  }
  protected applyTextureAndMask(): void {
    this.childElement.style.setProperty("--component-texture", `url('${this.visual.texturePath}')`);
    this.childElement.style.mask = `url('${this.visual.maskPath}') center/cover repeat`;
    this.applyTextureFilter()
  }
  protected applyBgColor(): void {
    if (this.visual.color && this.bgElement) {
      this.bgElement.style.setProperty("--background-color", `${this.visual.color}`);
      this.bgElement.style.mask = `url('${this.visual.maskPath.replace('.svg', '-bg.svg')}') center/cover repeat`;
    }
  }
}