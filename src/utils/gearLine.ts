import { Gear } from '../component/Gear'; // Classe Gear
import { VisualConfig } from '../component/Component';
import { Position } from '../types/Position';
import { centerTocontactGear, setPerfectRotateState } from './gearUtils';

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

type Orientation = 'left' | 'right' | 'up' | 'down';

export function createGearStructure(config: GearLineConfig & { orientation: Orientation }): Gear[] {
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
  let currentPos = orientation === 'left' || 'right' ? position.x : position.y;

  while ((orientation === 'right' && currentPos < distance + position.x) ||
    (orientation === 'left' && currentPos > position.x - distance) ||
    (orientation === 'down' && currentPos < distance + position.y) ||
    (orientation === 'up' && currentPos > position.y - distance)) {
    const baseConfig = gearBases[Math.floor(Math.random() * gearBases.length)]; // Récupérer une config de base
    const radius = Math.round(Math.random() * (baseConfig.radius.max - baseConfig.radius.min) + baseConfig.radius.min);
    const innerRadius = radius * (1 - baseConfig.teeth.height / 100);
    let centerX = 0;
    let centerY = 0;
    const previousGear = gears[gears.length - 1];
    if (gears.length > 0) {
      if (orientation === 'left' || orientation === 'right') {
        const cMin = Math.max(position.y - width / 2, previousGear.center.y - previousGear.innerRadius - innerRadius);
        const cMax = Math.min(position.y + width / 2, previousGear.center.y + previousGear.innerRadius + innerRadius);
        centerY = Math.random() * (cMax - cMin) + cMin;
        centerX = centerTocontactGear(previousGear, { innerRadius, fixedCenter: { y: centerY }, orientation });
        currentPos = centerX + radius;
      } else {
        const cMin = Math.max(position.x - width / 2, previousGear.center.x - previousGear.innerRadius - innerRadius);
        const cMax = Math.min(position.x + width / 2, previousGear.center.x + previousGear.innerRadius + innerRadius);
        centerX = Math.random() * (cMax - cMin) + cMin;
        centerY = centerTocontactGear(previousGear, { innerRadius, fixedCenter: { x: centerX }, orientation });
        currentPos = centerY + radius;
      }
    } else {
      centerX = position.x;
      centerY = position.y;
      if (orientation === 'left' || orientation === 'right') {
        centerX += innerRadius;
      } else {
        centerY += innerRadius;
      }
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
