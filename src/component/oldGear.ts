import { v7 as uuid } from 'uuid'
export type StaticProps = {
  teeth: { number: number, height: number, width: number }; // Nombre de dents
  radius: number; // Rayon en pixels
}

export type VariableProps = {
  position: Position; // Position (x, y) en pixels
  zIndex: number;
  clockwise?: 1 | -1; // Sens de rotation (horaire/antihoraire)
  rotationSpeed?: number; // Vitesse de rotation en degrés/seconde
  rotateState?: number  //état de rotation en deg

}
export type GearProps = StaticProps & VariableProps
export interface Position { x: number; y: number }

export class Gear {
  static readonly UPDATEFREQUENCY: number = 25
  static gearsStore: Gear[] = []
  public element: HTMLElement;
  public label: string
  public props: GearProps;
  public readonly id: string;

  constructor(parent: HTMLElement, props: GearProps, svg: string, texturePath: string, label?: string) {
    this.id = `gear-${uuid()}`
    this.label = label ?? this.id
    this.props = props;
    this.element = this.initElement(svg, texturePath)
    this.render();
    parent.appendChild(this.element);

    setInterval(this.rotateMethod, Gear.UPDATEFREQUENCY)

    Gear.gearsStore.push(this)
  }

  private rotateMethod = () => {
    if (this.props.rotationSpeed && this.props.rotationSpeed > 0) {
      this.props.rotateState ??= 0
      this.props.rotateState = this.props.rotateState + (this.props.clockwise ?? 1) * this.props.rotationSpeed
      this.renderRotationState()
    }
  }

  private initElement(svg: string, texturePath: string): HTMLElement {
    // Créer l'élément HTML
    const element = document.createElement('div');
    element.classList.add('gear');
    element.id = this.id

    element.style.setProperty('--gear-texture', `url("${texturePath}")`);
    element.style.setProperty('--gear-mask', `url('${svg}')`);

    // Utiliser le SVG comme masque
    element.style.mask = `url('${svg}') 0 0/${this.props.radius * 2}px ${this.props.radius * 2}px no-repeat`;
    return element
  }

  static getGearById(id: string): Gear | undefined {
    return Gear.gearsStore.find((gear) => gear.id === id);
  }

  static getGearByLabel(label: string): Gear | undefined {
    return Gear.gearsStore.find((gear) => gear.label === label);
  }


  // Mettre à jour les propriétés dynamiquement (position, vitesse, sens, etc.)
  public updateProps(newProps: Partial<VariableProps>) {
    this.props = { ...this.props, ...newProps };
    this.render();
  }

  public async transtalteTo(position: Position, delay: number): Promise<void> {
    const initialPosition = { ...this.props.position }
    let t = 0

    const actualPosition = (origin: number, destination: number): number => {
      return Math.round(origin + (destination - origin) * t / delay)
    }
    while (t < delay) {
      this.updateProps({
        position: {
          x: actualPosition(initialPosition.x, position.x),
          y: actualPosition(initialPosition.y, position.y)
        }
      })
      await new Promise(resolve => setTimeout(resolve, Gear.UPDATEFREQUENCY))
      t += Gear.UPDATEFREQUENCY
    }
    this.updateProps({ position })
  }

  public getDist(origin: Position, destination: Position): number {
    return Math.sqrt(Math.abs(origin.x - destination.x) ** 2 + Math.abs(origin.y - destination.y) ** 2)
  }

  public async moveTo(destination: Position, delay: number): Promise<void> {
    const { height } = this.props.teeth;
    // Rayon intérieur (distance sur laquelle la dent s'engage)
    const innerRadius = this.props.radius * (1 - height / 100);

    // Distance totale à parcourir
    const totalDistance = this.getDist(this.props.position, destination)
    const innerCircumference = 2 * Math.PI * innerRadius;
    const totalRotations = totalDistance / innerCircumference;
    const rotationSpeed = delay / (1000 * totalRotations)

    this.updateProps({ rotationSpeed })
    await this.transtalteTo(destination, delay)
    this.updateProps({ rotationSpeed: 0 })
  }

  private renderRotationState() {
    if (this.props.rotateState != null) this.element.style.rotate = `${this.props.rotateState}deg`
  }

  private render() {
    const { radius, position, zIndex } = this.props;

    // Appliquer les styles dynamiquement
    this.element.style.width = `${radius * 2}px`;
    this.element.style.height = `${radius * 2}px`;
    this.element.style.left = `${position.x}px`;
    this.element.style.top = `${position.y}px`;
    this.element.style.zIndex = `${zIndex}`
    this.renderRotationState()
    //   this.element.style.animation = `rotate ${rotationSpeed}s linear infinite`;
    //   this.element.style.animationDirection = clockwise ? 'normal' : 'reverse';
    // } else {
    //   this.element.style.animation = '';
    // }
  }
}
