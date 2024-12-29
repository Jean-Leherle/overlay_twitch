import { Missive } from '../component/Missive';
import '../style.css';
import { connectToTwitchChat } from "../utils/connectTchat";
import { ParsedMessage } from '../utils/tchatUtils';

export class ChatOverlay {
  private container: HTMLElement | null;
  private chatContainer: HTMLElement | null = null;

  private missiveList: Missive[] = [];

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);

    if (!this.container) {
      console.error(`Container avec l'ID '${containerId}' introuvable.`);
      return;
    }

    this.initialize();
  }

  private initialize(): void {
    this.render();
    this.chatContainer = document.getElementById("chat-overlay");

    if (!this.chatContainer) {
      console.error("Le conteneur de chat n'a pas pu être initialisé.");
      return;
    }

    this.chatContainer.addEventListener('missiveOpened', async (event) => {
      const missive = (event as CustomEvent).detail as Missive;
      await this.showMessage(missive.parsedMessage.message)
      missive.close()
    });
    this.chatContainer.addEventListener('missiveClosed', (event) => {
      const missive = (event as CustomEvent).detail as Missive;
      this.scheduleMissiveDeletion(missive);
    });
    this.initiMissiveTreatement()
    connectToTwitchChat(this.handleNewMessage.bind(this));
  }

  private async showMessage(message: string): Promise<void> {
    console.log(`Message : ${message}`);

    // Créer un conteneur pour le message
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');

    // Créer un élément pour le texte du message
    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    messageText.textContent = message;

    // Ajouter le texte au conteneur du message
    messageContainer.appendChild(messageText);

    // Ajouter le conteneur du message à chatOverlay
    if (this.chatContainer) {
      this.chatContainer.appendChild(messageContainer);
    }

    // Démarrer l'animation du texte qui défile
    messageText.style.animation = 'roll-out 5s forwards';

    // Attendre la fin de l'animation pour supprimer le message
    await new Promise(resolve => setTimeout(resolve, 5000)); // Attendre la durée de l'animation

    // Supprimer le message une fois l'animation terminée
    if (this.chatContainer) {
      this.chatContainer.removeChild(messageContainer);
    }

    console.log('Message supprimé après l\'animation.');
  }

  private render(): void {
    if (this.container) {
      this.container.innerHTML = this.generateChatOverlayHTML();
    }
  }

  private generateChatOverlayHTML(): string {
    return `
      <div id="chat-overlay">
      </div>
    `;
  }

  private handleNewMessage(parsedMessage: ParsedMessage): void {
    if (!this.chatContainer) return;

    console.log('New message:', parsedMessage);
    parsedMessage.username = parsedMessage.username.toUpperCase();
    console.log()
    this.missiveList.push(new Missive(this.chatContainer,
      {
        position: { x: 100, y: 400 - this.missiveList.length * 100 },
        zIndex: 1,
        message: parsedMessage
      }))
  }

  private initiMissiveTreatement() {
    setInterval(() => {
      console.log('ouverture de la missive');

      if (this.missiveList[0]) this.missiveList[0].open()
    }, 10000)
  }

  private scheduleMissiveDeletion(missive: Missive): void {
    setTimeout(async () => {
      // Supprime la missive de la liste et du DOM
      this.missiveList = this.missiveList.filter(m => m.uuid !== missive.uuid);

      console.log('Missive supprimée:', missive);
    }, 2000); // Attendre 2 secondes
  }
}