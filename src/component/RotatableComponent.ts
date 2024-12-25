import { Component } from "./Component";

export function Rotatable<T extends new (...args: any[]) => Component>(Base: T) {
  return class extends Base {
    public rotationSpeed: number = 0;
    public rotateState: number = 0;
    public clockwise: 1 | -1 = 1;

    public update(): void {
      super.update(); // Appelle `update()` de la classe de base
      this.updateRotation(); // Ajoute le comportement de rotation
    }

    public updateRotation(): void {
      if (this.rotationSpeed > 0) {
        this.rotateState =
          (this.rotateState + this.clockwise * this.rotationSpeed) % 360;
        this.element.style.transform = `rotate(${this.rotateState}deg)`;
      }
    }
  };
}