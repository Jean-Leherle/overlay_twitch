import { Component } from "./Component";
export interface RotatableProps {
  rotationSpeed: number;
  rotateState: number;
  clockwise: 1 | -1;
  updateRotation: () => void;
}

export function Rotatable<T extends new (...args: any[]) => Component>(Base: T) {
  return class extends Base {
    public rotationSpeed: number = 0;
    public rotateState: number = 0;
    public clockwise: 1 | -1 = 1;
    public totalTurns: number = 0

    public update(): void {
      super.update(); // Appelle `update()` de la classe de base
      this.updateRotation(); // Ajoute le comportement de rotation
    }

    public updateRotation(): void {
      if (this.rotationSpeed > 0) {
        this.rotateState = (this.rotateState + this.clockwise * this.rotationSpeed);
        if (this.rotateState > 360) {
          this.rotateState %= 360;
          this.totalTurns++
          this.totalTurns %= 1000
        }
      }
      this.parentElement.style.transform = `rotate(${this.rotateState}deg)`;
    }
  };
}

export function isRotatable(component: Component): component is Component & RotatableProps {
  return (
    "rotationSpeed" in component &&
    "rotateState" in component &&
    "clockwise" in component
  );
}