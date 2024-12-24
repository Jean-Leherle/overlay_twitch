export type StaticProps = {
  teeth: { number: number, height: number, width: number }; // Nombre de dents
  radius: number; // Rayon en pixels
}

export type VariableProps = {
  position: Position; // Position (x, y) en pixels
  zIndex: number;
  clockwise?: boolean; // Sens de rotation (horaire/antihoraire)
  rotationSpeed?: number; // Vitesse de rotation en degrés/seconde
  rotateState?: number //état de rotation en deg 
}
export type GearProps = StaticProps & VariableProps
export interface Position { x: number; y: number }

export class Gear {
  static readonly UPDATEFREQUENCY: number = 25
  private element: HTMLElement;
  public props: GearProps;

  constructor(parent: HTMLElement, props: GearProps, svg: string, texturePath: string) {
    this.props = props;

    // Créer l'élément HTML
    this.element = document.createElement('div');
    this.element.classList.add('gear');

    this.element.style.setProperty('--gear-shadow', `url("${texturePath}")`);
    this.element.style.setProperty('--gear-mask', `url('${svg}')`);

    // Utiliser le SVG comme masque
    this.element.style.mask = `url('${svg}') 0 0/${this.props.radius * 2}px ${this.props.radius * 2}px no-repeat`;

    this.render();
    parent.appendChild(this.element);
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
    const rotateOffset = totalRotations % 1
    const rotationSpeed = delay / (1000 * totalRotations)

    this.updateProps({ rotationSpeed })
    await this.transtalteTo(destination, delay)
    this.updateProps({ rotationSpeed: 0, rotateState: this.props.clockwise ? rotateOffset * 360 : rotateOffset * -360 })
  }


  private render() {
    const { radius, rotationSpeed, clockwise, position, zIndex, rotateState } = this.props;

    // Appliquer les styles dynamiquement
    this.element.style.width = `${radius * 2}px`;
    this.element.style.height = `${radius * 2}px`;
    this.element.style.left = `${position.x}px`;
    this.element.style.top = `${position.y}px`;
    this.element.style.zIndex = `${zIndex}`
    if (rotateState != null) this.element.style.rotate = `${rotateState}deg`
    if (rotationSpeed) {
      this.element.style.animation = `rotate ${rotationSpeed}s linear infinite`;
      this.element.style.animationDirection = clockwise ? 'normal' : 'reverse';
    } else {
      this.element.style.animation = '';
    }
  }
}
