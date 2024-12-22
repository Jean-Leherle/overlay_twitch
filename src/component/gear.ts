export interface GearProps {
  teeth: number; // Nombre de dents
  radius: number; // Rayon en pixels
  rotationSpeed: number; // Vitesse de rotation en degrés/seconde
  clockwise: boolean; // Sens de rotation (horaire/antihoraire)
  position: { x: number; y: number }; // Position (x, y) en pixels
}

export class Gear {
  private element: HTMLElement;
  private props: GearProps;
  private svg: string; // SVG du gear

  constructor(parent: HTMLElement, props: GearProps, svg: string) {
    this.props = props;
    this.svg = svg; // Le SVG est défini à l'initialisation et ne peut pas changer

    // Créer l'élément HTML
    this.element = document.createElement('div');
    this.element.classList.add('gear');
    parent.appendChild(this.element);

    this.render();
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
    this.element.style.borderRadius = '50%';
    this.element.style.position = 'absolute';
    this.element.style.left = `${position.x}px`;
    this.element.style.top = `${position.y}px`;
    this.element.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(
      this.svg
    )}')`;// Encodage inline du SVG
    this.element.style.backgroundSize = 'contain';
    this.element.style.animation = `rotate ${
      360 / rotationSpeed
    }s linear infinite`;
    this.element.style.animationDirection = clockwise ? 'normal' : 'reverse';
  }
}
