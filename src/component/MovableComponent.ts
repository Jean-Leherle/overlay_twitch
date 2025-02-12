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
      return new Promise((resolve) => {
        const deltaX = destination.x - this.position.x;
        const deltaY = destination.y - this.position.y;

        // Création d'une animation CSS unique pour cet élément
        const animationId = `move-${this.id}-${Date.now()}`;

        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(`
          @keyframes ${animationId} {
            from { transform: translate(0, 0);}
            to {transform: translate(${deltaX}px, ${deltaY}px);}
          }
        `, styleSheet.cssRules.length);

        this.activeAnimations.set(animationId, `${duration}ms linear forwards`);
        this.updateAnimationStyles();

        setTimeout(() => {
          this.activeAnimations.delete(animationId);
          this.updateAnimationStyles();
          this.position = destination;
          this.renderPosition();
          this.removeAnimationRule(animationId);
          resolve();
        }, duration);
      });
    }

    public updatePosition(): void {
      this.parentElement.style.left = `${this.position.x}px`;
      this.parentElement.style.top = `${this.position.y}px`;
    }
  };
}
