# projet Gear #

## Contexte ##

L'objectif de ce projet est de fournir quelques composants d'overlay de stream personnalisés pour mon frere (joyeux noel !)

L'environnement de fonctionnement est prévu pour windows 11 avec une intégration avec obs.

L'ensemble n'est pas prévu pour fonctionner sur serveur : tout gérer en local permet de réduire les besoins en cybersécu.

Le fonctionnement n'est pas optimisé pour des streamers de grande ampleur mais plutot pour des petits streamer (tout mignon)

## utilisation ##

L'objectif est de limiter le maximum les étapes nécessaires à son implémentation et utilisation.

- importer la collection de scene avec obs disponible dans le dossier config_obs
- dans l'onglet Outil/script appuyer sur le + et ajouter le script présent dans le dossier script (script.lua)
- Modifier le script (n'importe quel éditeur de texte brut fera l'affaire ) : corriger `local base_path = "C:/Users/louis/Documents/test2"` afin de faire correspondre à l'emplacement ou vous avez positionner le dossier `dist`
- raffaichir le script.
- raffraichir tous les composants navigateur sur obs.

OBS et les navigateurs bloquent au travers des CORS les page html ouvertes localement. Il est donc nécessaire de passer par une diffusion sur localhost afin que cela puisse être executé.

## Configuration ##

Voir avec le fichier `.env.example` pour créer votre propre `.env` avec les bon token et bon nom de chaine. L'id est donné lors de la création d'une app twitch. Le token est présent dans l'adresse aprés redirection.

## Pour dev ##

-> node 18 (utilisation de pkg bloqué à node 18)

Les maronniers : `git clone ...` `npm i` ...
`npm run dev` pour le preview.
`npm run dev:host` pour le preview diffusé en local (configurer un port pour le diffuser autrement qu'en local).
`npm run build` pour générer le dist.
`pkg server.cjs --targets win --output server.exe` pour générer le .exe

L'appli est dev en typescript, uniquement coté client. Quasi tout est natif.
Le code peut être uniformisé en particulier concernant l'utilisation des components

## Mettre à disposition de l'utilisateur ##

- dossier dist
- .env
- script.lua
- server.exe
- config_obs

## Probleme connu en cours ##

1_Immense consomation de ressources durant le traitement des "steam" NE PAS TROP EN METTRE
2_sub non pris en charge
3_pixel restant aprés l'animation steam
