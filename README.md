Étape 1 : Créer un composant Engrenage
Fonctionnalités :

    Afficher un engrenage (SVG ou image).
    Gérer la rotation (sens, vitesse).
    Permettre le style dynamique via des props ou des classes CSS.

Actions :

    Crée un fichier TypeScript dédié, par exemple gear.ts.
    Définis une classe Gear avec les propriétés suivantes :
        Nombre de dents (pour le calcul de la vitesse relative).
        Rayon ou taille (pour positionner d'autres éléments).
        Sens de rotation (horaire/antihoraire).
        Vitesse de rotation (en degrés par seconde ou similaire).
    Ajoute un rendu SVG pour représenter l’engrenage.
    Gère la rotation via du CSS ou des animations JS.

Étape 2 : Créer un composant Mécanisme
Fonctionnalités :

    Associer plusieurs engrenages.
    Gérer les interactions mécaniques entre engrenages (vitesses, sens opposés, alignement).
    Permettre des placements dynamiques (grille/axes).

Actions :

    Crée un fichier mechanism.ts pour le mécanisme global.
    Définis une classe Mechanism avec :
        Une liste d'engrenages.
        Les relations entre engrenages (engrené ou sur le même axe).
    Ajoute une méthode pour positionner et calculer les vitesses de rotation.
    Implémente un rendu (SVG/CSS) des positions et rotations des engrenages.

Étape 3 : Ajouter des interactions (API Twitch plus tard)
Fonctionnalités :

    Associer des événements interactifs (exemple : clic pour changer le sens de rotation).
    Synchroniser les animations et données avec des messages Twitch.

Actions pour les interactions simples :

    Ajoute des listeners d'événements (clic ou survol) sur les engrenages pour changer leurs propriétés (vitesse, sens).
    Définis des styles CSS pour refléter visuellement les changements.

Étape 4 : Intégration dans l'application principale

    Modifie le fichier main.ts pour instancier un mécanisme avec des engrenages.
    Injecte le composant dans l'élément #app dans index.html.
    Teste les animations et comportements de base.
    