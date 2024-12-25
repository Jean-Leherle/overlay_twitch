import { Position } from "../types/Position";
import { Component } from "./Component";

export type MovableProps = {
  position: Position; // position (x, y)
};

export function Movable<T extends new (...args: any[]) => Component>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      this.update();
    }

    public update(): void {
      super.update(); // Appelle `update()` de la classe de base
      this.updatePosition(); // Ajoute le comportement de mise à jour de la position
    }

    public async moveTo(destination: Position, duration: number): Promise<void> {
      const initialPosition = { ...this.position };
      let t = 0;

      const lerp = (start: number, end: number, t: number) => start + (end - start) * t; //linear interpolation : interpolation linéaire

      while (t < duration) {
        this.position.x = lerp(initialPosition.x, destination.x, t / duration);
        this.position.y = lerp(initialPosition.y, destination.y, t / duration);
        await new Promise(resolve => setTimeout(resolve, this.UPDATEFRAME));
        t += this.UPDATEFRAME;
      }
      this.position = destination;
    }

    public updatePosition(): void {
      this.parentElement.style.left = `${this.position.x}px`;
      this.parentElement.style.top = `${this.position.y}px`;
    }
  };
}
