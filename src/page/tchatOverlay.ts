import '../style.css';
import { connectToTwitchChat } from "../utils/connectTchat";
import { ParsedMessage } from '../utils/tchatUtils';

export class ChatOverlay {
  private container: HTMLElement | null;
  private chatContainer: HTMLElement | null = null;

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

    connectToTwitchChat(this.handleNewMessage.bind(this));
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
    const chatMessage = document.createElement("div");
    chatMessage.className = "chat-message";

    chatMessage.innerHTML = `<strong>${parsedMessage.username}:</strong> ${parsedMessage.message}`;
    this.chatContainer.appendChild(chatMessage);

    // Scroll to the latest message
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }
}