import { Component, ComponentConfig } from "./Component";
import { Movable } from "./MovableComponent";
type RackConfig = ComponentConfig & { teeth: { count: number, height: number } }
export class Rack extends Movable(Component) {
  public teeth: { count: number, height: number };

  constructor(parent: HTMLElement, config: RackConfig) {
    const { teeth, ...args } = config
    super(parent, args);
    this.teeth = teeth;
  }

  get innerHeight(): number {
    return this.size.height * (1 - this.teeth.height / 100)
  }
  /**
   * Largeur entre deux dents
   */
  get teethSpacing(): number {
    return this.size.width / this.teeth.count;
  }
}