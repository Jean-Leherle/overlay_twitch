import { Component } from "./Component";
import { Movable } from "./MovableComponent";
import { Rotatable } from "./RotatableComponent";
import { Position } from "../types/Position";

export interface GearConfig {
  radius: number;
  position: Position;
  zIndex: number
  visual: { texturePath: string; maskPath: string };
  teeth?: { number: number; height: number };
}

const Base = Movable(Rotatable(Component)); // Combine les mixins

export class Gear extends Base {
  public radius: number;
  public teeth?: { number: number, height: number }

  constructor(
    parent: HTMLElement,
    config: GearConfig // Utilisation de l'objet de configuration
  ) {
    // Calcul de la taille à partir du rayon
    const size = { width: config.radius * 2, height: config.radius * 2 };
    super(parent, { size, position: config.position, visual: config.visual, zIndex: config.zIndex });

    this.radius = config.radius;
    this.teeth = config.teeth

    // Appliquer la texture et le masque si fournis
    this.applyTextureAndMask();
  }
  public applyTextureAndMask(): void {
    this.childElement.style.setProperty('--component-texture', `url("${this.visual.texturePath}")`);

    // Utiliser le SVG comme masque
    this.childElement.style.mask = `url('${this.visual.maskPath}') 0 0/${this.radius * 2}px ${this.radius * 2}px no-repeat`;

    this.applyTextureFilter()
  }

  public async mechanicalMoveTo(destination: Position, delay: number): Promise<void> {
    const height = this.teeth?.height ?? 0;
    // Rayon intérieur (distance sur laquelle la dent s'engage)
    const innerRadius = this.radius * (1 - height / 100);

    // Distance totale à parcourir
    const totalDistance = this.getDist(this.position, destination)
    const innerCircumference = 2 * Math.PI * innerRadius;
    const totalRotations = totalDistance / innerCircumference;
    this.rotationSpeed = delay / (1000 * totalRotations)
    await this.moveTo(destination, delay)
    this.rotationSpeed = 0
  }
}