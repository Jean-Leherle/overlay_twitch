export interface GearProps {
  teeth: number; // Nombre de dents
  radius: number; // Rayon en pixels
  rotationSpeed?: number | undefined; // Vitesse de rotation en degrés/seconde
  clockwise?: boolean | undefined; // Sens de rotation (horaire/antihoraire)
  position: { x: number; y: number }; // Position (x, y) en pixels
}

export class Gear {
  private element: HTMLElement;
  private props: GearProps;

  constructor(parent: HTMLElement, props: GearProps, svg: string, texturePath: string) {
    this.props = props;

    // Créer l'élément HTML
    this.element = document.createElement('div');
    this.element.classList.add('gear');

    this.element.style.backgroundColor = 'black'
    this.element.style.backgroundImage = `url('${texturePath}')`; // Appliquer la texture comme fond

    // Utiliser le SVG comme masque
    this.element.style.mask = `url('${svg}') 0 0/${this.props.radius * 2}px ${this.props.radius * 2}px no-repeat`;

    this.render();
    parent.appendChild(this.element);

  }

  // Mettre à jour les propriétés dynamiquement (position, vitesse, sens, etc.)
  public updateProps(newProps: Partial<Omit<GearProps, 'teeth'>>) {
    this.props = { ...this.props, ...newProps };
    this.render();
  }

  private render() {
    const { radius, rotationSpeed, clockwise, position } = this.props;

    // Appliquer les styles dynamiquement
    this.element.style.width = `${radius * 2}px`;
    this.element.style.height = `${radius * 2}px`;

    this.element.style.position = 'absolute';
    this.element.style.left = `${position.x}px`;
    this.element.style.top = `${position.y}px`;
    if (rotationSpeed) {
      this.element.style.animation = `rotate ${360 / rotationSpeed}s linear infinite`;
      this.element.style.animationDirection = clockwise ? 'normal' : 'reverse';
    } else {
      this.element.style.animation = '';
    }
  }
}
