import { Gear } from '../component/Gear'; // Classe Gear
import { VisualConfig } from '../component/Component';
import { Position } from '../types/Position';
import { setPerfectRotateState } from './gearUtils';

type GearBaseConfig = {
  radius: { min: number, max: number }
  visual: VisualConfig;
  teeth: { count: number; height: number };
};

type GearLineConfig = {
  parent: HTMLElement;
  distance: number; // Distance totale à parcourir
  width: number;
  position: Position;
  zIndex: number; // Niveau de profondeur des engrenages
  gearBases: GearBaseConfig[]; // Tableau de configurations de base pour les engrenages
};

export function createGearLine(config: GearLineConfig & { orientation: 'left' | 'right' }): Gear[] {
  const {
    parent,
    distance,
    width,
    position,
    zIndex,
    gearBases,
    orientation,
  } = config;

  const gears: Gear[] = [];
  let currentX = position.x;

  while ((orientation === 'right' && currentX < distance + position.x) || (orientation === 'left' && currentX > position.x - distance)) {
    const baseConfig = gearBases[Math.floor(Math.random() * gearBases.length)]; // Récupérer une config de base
    const radius = Math.round(Math.random() * (baseConfig.radius.max - baseConfig.radius.min) + baseConfig.radius.min);
    const innerRadius = radius * (1 - baseConfig.teeth.height / 100);
    let centerY = 0;
    let centerX = 0;
    const previousGear = gears[gears.length - 1];
    if (gears.length > 0) {
      // Limiter par la bande du haut ou que mon gear n'atteigne pas le precedent gear
      const cMin = Math.max(position.y - width / 2, previousGear.center.y - previousGear.innerRadius - innerRadius);
      const cMax = Math.min(position.y + width / 2, previousGear.center.y + previousGear.innerRadius + innerRadius);
      centerY = Math.random() * (cMax - cMin) + cMin;

      const deltaX = Math.sqrt(Math.pow(previousGear.innerRadius + innerRadius, 2) - Math.pow(previousGear.center.y - centerY, 2));
      centerX = orientation === 'right' ? previousGear.center.x + deltaX : previousGear.center.x - deltaX;
      currentX = centerX + radius;
    } else {
      centerY = position.y;
      centerX = position.x + innerRadius;
    }

    // Création de l'engrenage
    const gear = new Gear(parent, {
      position: { x: centerX - radius, y: centerY - radius },
      radius,
      teeth: baseConfig.teeth,
      visual: baseConfig.visual,
      zIndex: zIndex + Math.round((20 * Math.random())) - 5,
    });

    if (gears.length > 0) {
      // Synchronisation mécanique avec l'engrenage précédent
      setPerfectRotateState(previousGear, gear);
    }

    gears.push(gear);
  }
  return gears;
}


export function createGearColumn(config: GearLineConfig & { orientation: 'up' | 'down' }): Gear[] {
  const {
    parent,
    distance,
    width,
    position,
    zIndex,
    gearBases,
    orientation,
  } = config;

  const gears: Gear[] = [];
  let currentY = position.y; // Initialiser à la position verticale de départ

  while ((orientation === 'down' && currentY < distance + position.y) || (orientation === 'up' && currentY > position.y - distance)) {
    const baseConfig = gearBases[Math.floor(Math.random() * gearBases.length)]; // Récupérer une config de base
    const radius = Math.round(Math.random() * (baseConfig.radius.max - baseConfig.radius.min) + baseConfig.radius.min);
    const innerRadius = radius * (1 - baseConfig.teeth.height / 100);
    let centerX = 0;
    let centerY = 0;
    const previousGear = gears[gears.length - 1];
    if (gears.length > 0) {
      // Limiter pour éviter les chevauchements avec l'engrenage précédent
      const cMin = Math.max(position.x - width / 2, previousGear.center.x - previousGear.innerRadius - innerRadius);
      const cMax = Math.min(position.x + width / 2, previousGear.center.x + previousGear.innerRadius + innerRadius);
      centerX = Math.random() * (cMax - cMin) + cMin;

      const deltaY = Math.sqrt(Math.pow(previousGear.innerRadius + innerRadius, 2) - Math.pow(previousGear.center.x - centerX, 2));
      centerY = orientation === 'down' ? previousGear.center.y + deltaY : previousGear.center.y - deltaY;
      currentY = centerY + radius;
    } else {
      centerX = position.x;
      centerY = position.y + innerRadius;
    }

    // Création de l'engrenage
    const gear = new Gear(parent, {
      position: { x: centerX - radius, y: centerY - radius },
      radius,
      teeth: baseConfig.teeth,
      visual: baseConfig.visual,
      zIndex: zIndex + Math.round((20 * Math.random())) - 5,
    });

    if (gears.length > 0) {
      // Synchronisation mécanique avec l'engrenage précédent
      setPerfectRotateState(previousGear, gear);
    }

    gears.push(gear);
  }
  return gears;
}