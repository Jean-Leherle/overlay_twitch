import { Component } from "./Component";
export interface RotatableProps {
  rotationSpeed: number;
  rotateState: number;
  clockwise: 1 | -1;
  updateRotation: () => void;
}

export function Rotatable<T extends new (...args: any[]) => Component>(Base: T) {
  return class extends Base {
    private _rotationSpeed: number = 0; // Degrés par seconde
    public _rotateState: number = 0;
    public clockwise: 1 | -1 = 1;
    public totalTurns: number = 0

    public get rotateState(): number {
      return this._rotateState;
    }

    public set rotateState(angle: number) {
      this._rotateState = angle % 360;
      this.updateRotationTransform();
    }


    public get rotationSpeed(): number {
      return this._rotationSpeed;
    }

    public set rotationSpeed(speed: number) {
      if (this._rotationSpeed === speed) return;
      this._rotationSpeed = speed;

      if (speed > 0) {
        this.startRotation();
      } else {
        this.stopRotation();
      }
    }
    public async rotateTo(targetAngle: number, duration: number): Promise<void> {
      return new Promise((resolve) => {
        const animationId = `rotate-to-${this.id}-${Date.now()}`;

        this.stopRotation(); // Nettoyer avant de démarrer la nouvelle animation

        this.styleSheet.insertRule(`
          @keyframes ${animationId} {
            from { transform: rotate(${this._rotateState}deg); }
            to { transform: rotate(${targetAngle}deg); }
          }
        `, this.styleSheet.cssRules.length);

        this.activeAnimations.set(animationId, `${duration}ms linear forwards`);
        this.updateAnimationStyles();

        setTimeout(() => {
          this.activeAnimations.delete(animationId);
          this.removeAnimationRule(animationId);
          this._rotateState = targetAngle % 360;
          this.updateRotationTransform();
          resolve();
        }, duration);
      });
    }

    private startRotation(): void {
      const animationId = `rotate-${this.id}`;
      this.stopRotation(); // Nettoyer avant de redémarrer

      this.styleSheet.insertRule(`
        @keyframes ${animationId} {
          from { transform: rotate(${this.rotateState}deg); }
          to { transform: rotate(${this.rotateState + 360 * this.clockwise}deg); }
        }
      `, this.styleSheet.cssRules.length);

      this.activeAnimations.set(animationId, `${360 / this._rotationSpeed}s linear infinite`);
      this.updateAnimationStyles();
    }

    private stopRotation(): void {
      for (const animationId of this.activeAnimations.keys()) {
        if (animationId.startsWith("rotate-")) {
          this.activeAnimations.delete(animationId);
          this.removeAnimationRule(animationId);
        }
      }
      this.updateAnimationStyles();
    }

    private updateRotationTransform(): void {
      this.parentElement.style.transform = `rotate(${this._rotateState}deg)`;
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