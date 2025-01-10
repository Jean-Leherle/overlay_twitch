import { Gear } from '../component/Gear';
import { Panel } from '../component/Panel';
import { SteamComponent } from '../component/steam';
import '../style.css';
import { TwitchApiClient } from '../utils/followUtils';
import { createGearStructure } from '../utils/gearLine';

export class FollowOverlay {
  private container: HTMLElement | null;
  private followContainer: HTMLElement | null = null;
  private panelElement: Panel | null = null;
  private twitchApiClient = new TwitchApiClient();
  private steamElement: SteamComponent[] = [];
  private firstElement: Gear | null = null;
  private pannelNumber: number = 0;
  private readonly rotationSpeed: { base: number, max: number } = { base: 0.2, max: 2 }
  // private followList: string[] = []; // Liste des utilisateurs qui suivent

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);

    if (!this.container) {
      console.error(`Container avec l'ID '${containerId}' introuvable.`);
      return;
    }
    this.twitchApiClient = new TwitchApiClient();

    this.initialize();
  }

  private initialize(): void {
    this.render();
    this.followContainer = document.getElementById("follow-overlay");

    if (!this.followContainer) {
      console.error("Le conteneur de follow n'a pas pu être initialisé.");
      return;
    }

    const pageWidth = window.innerWidth;
    const lineX = createGearStructure({
      distance: pageWidth,
      parent: this.container!,
      position: { x: 0, y: 0 },
      width: 10,
      zIndex: 50,
      gearBases: [
        {
          radius: { min: 60, max: 80 }, teeth: { count: 8, height: 10 },
          visual: { maskPath: '/mask/gear-basic-8.svg', texturePath: '/texture/copper.jpg' }
        },
        {
          radius: { min: 120, max: 160 }, teeth: { count: 20, height: 4.5 },
          visual: { maskPath: '/mask/gear-big-20.svg', texturePath: '/texture/copper.jpg' }
        }
      ],
      orientation: 'right'
    });
    this.firstElement = lineX[0]
    this.firstElement.rotationSpeed = this.rotationSpeed.base;

    this.generateSteamOnCorner(pageWidth)
    this.generateSteamOnBorder()
    this.startFollowDetection();

    setInterval(() => {
      const index = Math.floor(Math.random() * this.steamElement.length)
      this.steamElement[index].play(1)
    }, 15000 / this.steamElement.length)
  }

  private generateSteamOnCorner(pageWidth: number): void {
    this.steamElement.push(new SteamComponent(this.container!, {
      size: { width: 300, height: 150 },
      position: { x: 0, y: 100 },
      zIndex: 100,
      rotateState: 45
    }
    ))
    this.steamElement.push(new SteamComponent(this.container!, {
      size: { width: 300, height: 150 },
      position: { x: pageWidth - 300, y: 100 },
      zIndex: 100,
      rotateState: 115
    }
    ))
  }

  private generateSteamOnBorder(): void {
    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth
    const spacing = 600;
    const numberOfSteams = Math.floor(pageHeight / spacing);

    console.log({ numberOfSteams, pageHeight, spacing });


    for (let i = 0; i < numberOfSteams; i++) {
      const randomOffset = Math.random() * 100 - 50; // Random offset between -50 and 50
      const yPosition = (i + 1) * spacing + Math.round(randomOffset);

      this.steamElement.push(new SteamComponent(this.container!, {
        size: { width: 300, height: 150 },
        position: { x: 0, y: yPosition },
        zIndex: 100,
        rotateState: (360 - 45) + Math.round(Math.random() * 90) % 360
      }));
    }

    for (let i = 0; i < numberOfSteams; i++) {
      const randomOffset = Math.random() * 100 - 50; // Random offset between -50 and 50
      const yPosition = (i + 1) * spacing + Math.round(randomOffset);

      this.steamElement.push(new SteamComponent(this.container!, {
        size: { width: 300, height: 150 },
        position: { x: pageWidth - 300, y: yPosition },
        zIndex: 100,
        rotateState: (180 - 45) + Math.round(Math.random() * 90) % 360
      }));
    }
  }


  private startFollowDetection(): void {
    const checkInterval = 1000; // Vérifie toutes les secondes

    const scheduleCheck = () => {
      const now = new Date();
      const seconds = now.getSeconds();

      // Vérifie si les secondes actuelles sont un multiple de 10
      if (seconds % 10 === 0) {
        this.fetchAndProcessFollowers();
      }

      // Re-planifie l'exécution pour la prochaine seconde
      setTimeout(scheduleCheck, checkInterval);
    };

    scheduleCheck(); // Démarre la planification
  }

  private async fetchAndProcessFollowers() {
    const followers = await this.twitchApiClient.fetchNewFollowers();

    const now = new Date();
    const recentFollowers = followers.filter((follow) => {
      const followedAt = new Date(follow.followedAt);
      const diffInSeconds = (now.getTime() - followedAt.getTime()) / 1000;

      return diffInSeconds <= 10;
    });

    for (const follower of recentFollowers) {
      this.handleNewFollow(follower.username);
      await new Promise(resolve => setTimeout(resolve, 2000))
    };
  }

  private handleNewFollow = async (username: string): Promise<void> => {
    if (this.firstElement) this.firstElement.rotationSpeed = this.rotationSpeed.max;
    this.pannelNumber++;
    this.panelElement = new Panel(this.followContainer!, {
      position: { x: this.container?.clientWidth ?? 1000, y: 0 },
      zIndex: 100,
    });
    const clientWidth = this.container?.clientWidth ?? 1000;

    this.panelElement.updateText(`Bienvenue ${username}`);
    this.panelElement
    await this.panelElement.moveTo({ x: (clientWidth - Panel.SIZE.width) / 2, y: 0 }, 5000)
    this.steamElement.forEach(el => el.play(2))
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.panelElement.moveTo({ x: -Panel.SIZE.width, y: 0 }, 5000)

    this.pannelNumber--;
    if (this.pannelNumber === 0) {
      if (this.firstElement) this.firstElement.rotationSpeed = this.rotationSpeed.base;
    }

  }


  private render(): void {
    if (this.container) {
      this.container.innerHTML = this.generateFollowOverlayHTML();
    }
  }

  private generateFollowOverlayHTML(): string {
    return `
      <div id="follow-overlay"></div>
    `;
  }
}