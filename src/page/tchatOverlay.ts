import { Component } from '../component/Component';
import { Gear } from '../component/Gear';
import { Missive } from '../component/Missive';
import { Movable } from '../component/MovableComponent';
import { SteamComponent } from '../component/steam';
import '../style.css';
import { connectToTwitchChat } from "../utils/connectTchat";
import { ParsedMessage } from '../utils/tchatUtils';

export class ChatOverlay {
  private container: HTMLElement | null;
  private chatContainer: HTMLElement | null = null;
  private steamElement: SteamComponent[] = [];
  private machineDisplay: HTMLElement | null = null

  private missiveList: Missive[] = [];


  private readonly TOTAL_HEIGHT = 4000;
  private readonly MAXMESSAGECOUNT = 20;

  private readonly fallingSpeed: number = 1000
  constructor(containerId: string) {
    this.container = document.getElementById(containerId);

    if (!this.container) {
      console.error(`Container avec l'ID '${containerId}' introuvable.`);
      return;
    }

    this.initialize();
  }

  get inputHeight(): number {
    return this.TOTAL_HEIGHT + 450;
  }


  private initialize(): void {
    this.render();
    this.chatContainer = document.getElementById("chat-overlay");

    if (!this.chatContainer) {
      console.error("Le conteneur de chat n'a pas pu être initialisé.");
      return;
    }

    this.createMachineElement();

    this.initiMissiveTreatement()
    connectToTwitchChat(this.handleNewMessage.bind(this));
  }


  private createMachineElement() {
    const machineComponent = new (Movable(Component))(this.chatContainer!,
      {
        size: { width: 800, height: 1000 },
        position: { x: Missive.SIZE.width, y: this.TOTAL_HEIGHT },
        visual: { maskPath: '', texturePath: '' },
        zIndex: 100
      })
    machineComponent.parentElement.classList.add('machine')
    this.steamElement.push(new SteamComponent(machineComponent.parentElement, {
      size: { width: 600, height: 300 },
      position: { x: machineComponent.size.width / 16, y: -300 },
      zIndex: 100,
      rotateState: 270
    }))

    this.steamElement.push(new SteamComponent(machineComponent.parentElement, {
      size: { width: 600, height: 300 },
      position: { x: machineComponent.size.width - 150, y: 550 },
      zIndex: 100,
      rotateState: 40
    }))

    this.machineDisplay = document.createElement('div');
    machineComponent.childElement.appendChild(this.machineDisplay);
    this.machineDisplay.classList.add('machine_display')
    this.machineDisplay.innerText = ''
    this.fillbackSize()
    machineComponent.stopRealTimeUpdate()
  }

  private fillbackSize() {
    if (!this.chatContainer) return;
    new Gear(this.chatContainer, {
      position: { x: 500, y: this.TOTAL_HEIGHT + 300 },
      radius: 200,
      teeth: { count: 30, height: 2.5 },
      visual: { maskPath: '/mask/gear-big-30.svg', texturePath: '/texture/copper-rusty.jpg' },
      zIndex: 70
    }).rotationSpeed = 1

    new Gear(this.chatContainer, {
      position: { x: 350, y: this.TOTAL_HEIGHT + 400 },
      radius: 80,
      teeth: { count: 8, height: 10 },
      visual: { maskPath: '/mask/gear-basic-8.svg', texturePath: '/texture/copper.jpg' },
      zIndex: 60
    }).rotationSpeed = 3

    const gear1 = new Gear(this.chatContainer, {
      position: { x: 380, y: this.TOTAL_HEIGHT + 500 },
      radius: 80,
      teeth: { count: 8, height: 10 },
      visual: { maskPath: '/mask/gear-basic-8.svg', texturePath: '/texture/copper.jpg' },
      zIndex: 75
    })
    gear1.rotationSpeed = 3
    gear1.clockwise = -1
  }


  private async showNameOnDisplay(name: string): Promise<void> {
    if (!this.machineDisplay) return
    this.machineDisplay.innerText = ''
    for (const letter of name) {
      this.machineDisplay.innerText += letter;
      await new Promise(resolve => setTimeout(resolve, 150))
    }
  }

  private async showMessage(message: string): Promise<void> {
    if (!this.chatContainer) return;
    // Créer un conteneur pour le message
    const messageContainer = this.createMessageContainer()

    // Créer un élément pour le texte du message
    const messageText = this.createMessageText(message)

    messageContainer.appendChild(messageText);
    messageContainer.style.width = '0px';
    // Ajouter le texte au conteneur du message

    // Ajouter le conteneur du message à chatOverlay
    this.chatContainer.appendChild(messageContainer);

    await new Promise(resolve => setTimeout(resolve, 0)); // Attendre un cycle pour que le DOM soit mis à jour
    const totalWidth = messageText.offsetWidth;
    for (let i = 0; i < totalWidth + 110; i += 15) {
      messageContainer.style.width = `${i}px`;
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    // Attendre la fin de l'animation pour supprimer le message
    this.steamElement[0].play(1)
    setTimeout(() => this.steamElement[1].play(1), 500)
    await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre la durée de l'animation

    // Supprimer le message une fois l'animation terminée
    this.chatContainer.removeChild(messageContainer);

  }



  private createMessageText(message: string): HTMLElement {
    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    messageText.textContent = message;
    return messageText
  }

  private createMessageContainer(): HTMLElement {
    const messageContainer = document.createElement('div');
    messageContainer.style.top = `${this.TOTAL_HEIGHT + 450 - Missive.SIZE.height / 2}px`;
    messageContainer.classList.add('message-container');
    return messageContainer
  }

  private async handleNewMessage(parsedMessage: ParsedMessage): Promise<void> {
    if (!this.chatContainer) return;

    parsedMessage.username = parsedMessage.username.toUpperCase();
    const missive = new Missive(this.chatContainer,
      {
        position: { x: 0, y: -100 },
        zIndex: 80,
        message: parsedMessage
      })
    this.missiveList.push(missive);
    this.goDown(missive, this.missiveList.length - 1)
  }


  private async initiMissiveTreatement() {
    while (true) {
      if (this.missiveList.length > this.MAXMESSAGECOUNT) {
        this.triggerOverload()
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      else {
        const firstMissive = this.missiveList[0]
        if (firstMissive && firstMissive.position.y === this.inputHeight) {
          await firstMissive.moveTo({ x: firstMissive.position.x + 400, y: firstMissive.position.y }, 400)
          this.missiveList.shift()
          this.allGoDown()
          this.showNameOnDisplay(firstMissive.parsedMessage.username)
          await firstMissive.moveTo({ x: firstMissive.position.x, y: firstMissive.position.y + 80 }, 400)
          await firstMissive.open()

          await this.showMessage(firstMissive.parsedMessage.message)
          firstMissive.close()
        }
        else await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
  }


  private allGoDown() {
    this.missiveList.forEach(this.goDown.bind(this))
  }

  private async goDown(missive: Missive, index: number) {
    while (missive.position.y < (this.inputHeight - index * Missive.SIZE.height)) {
      missive.position.y += this.fallingSpeed / 100;
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    missive.position.y = this.inputHeight - index * Missive.SIZE.height;
  }

  private render(): void {
    if (this.container) {
      this.container.innerHTML = this.generateChatOverlayHTML();
    }
  }

  private async triggerOverload(): Promise<void> {
    // Faire trembler tous les éléments
    this.chatContainer?.classList.add('shake');
    this.steamElement.forEach(steam => steam.parentElement?.classList.add('shake'));

    // Attendre un moment pour le tremblement
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.missiveList.forEach((missive, index) => {
      missive.moveTo({ x: -400, y: missive.position.y - index * 100 }, 500)
    })
    // Attendre la fin de l'animation d'explosion
    await new Promise(resolve => setTimeout(resolve, 500));

    // Réinitialiser les états
    this.chatContainer?.classList.remove('shake', 'explode');

    // Vider la liste et l'affichage
    this.missiveList.forEach(missive => {
      missive.parentElement.innerHTML = ''
      missive.stopRealTimeUpdate()
    });
    this.missiveList = [];
  }

  private generateChatOverlayHTML(): string {
    return `
      <div id="chat-overlay">
      </div>
    `;
  }
}