import { Component } from "../component/Component";
import { Gear } from "../component/Gear";
//import { Rack } from "../component/Rack";
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

    // Conserver les anciennes fonctions `update`
    const originalSourceUpdate = this.source.update.bind(this.source);
    //const originalTargetUpdate = this.target.update.bind(this.target);

    this.source.update = () => {
      originalSourceUpdate();
      this.apply();
    };
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
    // Calculer la vitesse de rotation en fonction du ratio des dents
    target.rotationSpeed = source.rotationSpeed * (source.teeth.count / target.teeth.count);
    target.clockwise = (source.clockwise * -1) as 1 | -1
  }

  /*  static rackGear(initialAngle: number, initialTurn: number = 0) {
     return (rack: Rack, gear: Gear) => {
 
       const INITIAL_ANGLE = initialAngle //angle initial
       const TEETH_SPACING = rack.size.width / rack.teeth.count; // Espacement des dents (px/dent)
 
       // Calcul du nombre de tours (positif ou négatif)
       const rotateState = gear.rotateState + INITIAL_ANGLE + (gear.totalTurns - initialTurn) * 360
 
       const ANGLE_PER_TOOTH = gear.angleByTeeth; // Angle entre deux dents sur la crémaillère
       const closerIndiceTeeth = Math.round(rotateState / ANGLE_PER_TOOTH); // Calcul de la dent la plus proche
       const basePlacement = closerIndiceTeeth * TEETH_SPACING
       const interPlacement = (rotateState / ANGLE_PER_TOOTH - closerIndiceTeeth) * TEETH_SPACING
       gear.position.x = rack.position.x + interPlacement + basePlacement;
       gear.position.y = rack.position.y - (gear.radius + gear.innerRadius); // Position Y fixe
     }
   } */
}
