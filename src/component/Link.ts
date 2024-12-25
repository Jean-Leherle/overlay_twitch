import { v7 as uuid } from 'uuid'
export type LinkType = 'rotationSync' | 'translationSync' | 'custom';

export class Link {
  public readonly id: string;
  public readonly elements: any[]; // Peut être typé plus précisément avec des interfaces
  public readonly type: LinkType;
  public readonly updateFunction: (elements: any[]) => void;

  constructor(elements: any[], type: LinkType, updateFunction?: (elements: any[]) => void) {
    this.id = `link-${uuid()}`;
    this.elements = elements;
    this.type = type;
    this.updateFunction = updateFunction ?? this.defaultUpdateFunction;
  }

  private defaultUpdateFunction(elements: any[]): void {
    // Implémentation par défaut, comme synchroniser la rotation
    if (this.type === 'rotationSync') {
      const [primary, ...rest] = elements;
      rest.forEach((element) => {
        element.updateProps({ rotateState: primary.props.rotateState });
      });
    }
  }

  public update(): void {
    this.updateFunction(this.elements);
  }
}