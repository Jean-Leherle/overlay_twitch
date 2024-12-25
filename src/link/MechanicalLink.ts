import { Component } from "../component/Component";
import { Gear } from "../component/Gear";
import { isRotatable } from '../component/RotatableComponent'


type LinkFunction<T extends Component, U extends Component> = (source: T, target: U) => void;

export class MechanicalLink<T extends Component, U extends Component> {
  private source: T;
  private target: U;
  private linkFunction: LinkFunction<T, U>;

  constructor(
    source: T,
    target: U,
    linkFunction: LinkFunction<T, U>
  ) {
    this.source = source;
    this.target = target;
    this.linkFunction = linkFunction;
  }


  /**
   * Appliquer le lien mécanique.
   */
  public apply(): void {
    this.linkFunction(this.source, this.target);
  }

  /**
   * Fonction de lien : Composants fixés ensemble (même position, rotation, etc.).
   */
  static synchronized(source: Component, target: Component): void {
    if (isRotatable(source) && isRotatable(target)) {
      target.rotationSpeed = source.rotationSpeed;
    }
  }

  /**
   * Fonction de lien : Relation entre deux engrenages.
   */
  static gearLink(source: Gear, target: Gear): void {
    // Vérifier que les deux engrenages ont des dents
    if (source.teeth && target.teeth) {
      // Calculer la vitesse de rotation en fonction du ratio des dents
      target.rotationSpeed =
        -source.rotationSpeed * (target.teeth.number / source.teeth.number);
    }
    else {
      target.rotationSpeed = - source.rotationSpeed * (target.radius / source.radius)
    }
  }

  /**
   * Ajouter d'autres types de liens si nécessaire (ex. crémaillère, poulie).
   */
}
