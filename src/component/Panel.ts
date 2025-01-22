import { Component } from "./Component";
import { Movable } from "./MovableComponent";
import { Rotatable } from "./RotatableComponent";
import { Position } from "../types/Position";
import { v7 as uuid } from "uuid";

// Configuration spécifique pour Panel
export interface PanelConfig {
  position: Position; // Position initiale du panneau
  zIndex: number; // Index z pour la hiérarchie visuelle
}

// Combine les mixins pour inclure les fonctionnalités "movable" et "rotatable"
const Base = Movable(Rotatable(Component));

export class Panel extends Base {
  public uuid: string = uuid();
  public username: string = '';
  public textElement: HTMLElement;
  public static readonly SIZE: { width: number, height: number } = { width: 600, height: 300 };

  constructor(parent: HTMLElement, config: PanelConfig) {
    super(parent, { ...config, visual: { maskPath: '/mask/panneau-black.svg', texturePath: '/texture/panneau.png' }, size: Panel.SIZE });
    this.textElement = document.createElement('div');
    this.textElement.classList.add('panel-text');
    this.parentElement.classList.add('panel');
    this.childElement.appendChild(this.textElement);
  }


  // Met à jour le texte affiché (le nom du follower)
  public updateText(text: string): void {
    this.textElement.innerText = text;
  }
}
