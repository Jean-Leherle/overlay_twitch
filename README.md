# projet Gear #

## Étape 1 : Créer un composant Engrenage ##

### Fonctionnalités ###

- [x] Afficher un engrenage (SVG ou image).
- [x] Gérer la rotation (sens, vitesse).
- [x] Permettre le style dynamique via des props ou des classes CSS.
- [ ] Créer des fonctions facilitant la gestion.

Étape 2 : Créer un composant Mécanisme
Fonctionnalités :

- [ ] Associer plusieurs engrenages.
- [ ] Gérer les interactions mécaniques entre engrenages (vitesses, sens opposés, alignement).
- [ ] Permettre des placements dynamiques (grille/axes).
- [ ] gérer l'unicité des gears (id)
- [ ] créer des fonction de déplacement controllé (translation, rotatation par nombre de dent) 

Actions :

- [ ] Crée un fichier mechanism.ts pour le mécanisme global.
- [ ] Définis une classe Mechanism avec :
- [ ] Une liste d'engrenages.
- [ ] Les relations entre engrenages (engrené ou sur le même axe).
- [ ] Ajoute une méthode pour positionner et calculer les vitesses de rotation.
- [ ] Implémente un rendu (SVG/CSS) des positions et rotations des engrenages.

Étape 3 : Ajouter des interactions (API Twitch plus tard)
Fonctionnalités :

- [ ] Associer des événements interactifs (exemple : clic pour changer le sens de rotation).
- [ ] Synchroniser les animations et données avec des messages Twitch.

Actions pour les interactions simples :

- [ ] Ajoute des listeners d'événements (clic ou survol) sur les engrenages pour changer leurs propriétés (vitesse, sens).
- [ ] Définis des styles CSS pour refléter visuellement les changements.

Étape 4 : Intégration dans l'application principale

- [ ] Modifie le fichier main.ts pour instancier un mécanisme avec des engrenages.
- [ ] Injecte le composant dans l'élément #app dans index.html.
- [ ] Teste les animations et comportements de base.
- [ ] 