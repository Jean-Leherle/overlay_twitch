import { Panel } from '../component/Panel';
import '../style.css';
import { TwitchApiClient } from '../utils/followUtils';
import { createGearStructure } from '../utils/gearLine';

export class FollowOverlay {
  private container: HTMLElement | null;
  private followContainer: HTMLElement | null = null;
  private panelElement: Panel | null = null;
  private twitchApiClient = new TwitchApiClient();

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
    lineX[0].rotationSpeed = 0.5;


    this.startFollowDetection();
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

      return diffInSeconds <= 10; // Filtre ceux qui ont suivi dans les 10 dernières secondes
    });

    for (const follower of recentFollowers) {
      this.handleNewFollow(follower.username); // Appelez votre fonction existante ici
      await new Promise(resolve => setTimeout(resolve, 1000))
    };
  }

  private handleNewFollow = async (username: string): Promise<void> => {
    this.panelElement = this.panelElement ?? new Panel(this.followContainer!, {
      position: { x: this.container?.clientWidth ?? 1000, y: 0 },
      zIndex: 100,
    });
    const clientWidth = this.container?.clientWidth ?? 1000;

    this.panelElement.updateText(`Bienvenue ${username}`);

    await this.panelElement.moveTo({ x: (clientWidth - Panel.SIZE.width) / 2, y: 0 }, 5000)
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.panelElement.moveTo({ x: -Panel.SIZE.width, y: 0 }, 5000)
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