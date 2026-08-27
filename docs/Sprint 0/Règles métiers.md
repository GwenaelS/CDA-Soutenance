# Règles métier — Wystrelia's Bot

Les règles métier (ou règles de gestion) sont les lois propres au fonctionnement du projet : elles définissent ce que l'application doit autoriser, interdire ou imposer, indépendamment de la manière dont elles sont programmées.

Là où une fonctionnalité décrit ce que fait l'outil, la règle métier précise selon quelles conditions : elle fixe la mécanique exacte et non négociable que le bot et le tableau de bord doivent toujours respecter.

Les règles suivantes constituent ainsi le socle logique du projet, sur lequel s'appuient aussi bien les fonctionnalités que la base de données.

## Accès & rôles

- **RG-01** — Seul un rôle doté de la permission Administrateur Discord donne accès au dashboard ; aucun autre rôle ne la possède. La qualité d'administrateur est revérifiée à chaque connexion (OAuth2 Discord).
- **RG-02** — Seul un administrateur peut consulter et modifier la configuration du bot.
- **RG-03** — Les sanctions respectent la hiérarchie Administrateur > Modérateur > Membre : un membre ne peut sanctionner un rôle de rang égal ou supérieur.

## Modération automatique

- **RG-04** — La liste des mots interdits est globale au serveur.
- **RG-05** — Tout message contenant un mot interdit est supprimé automatiquement, sauf si l'auteur porte un rôle exempté (modération + rôles « amis » configurables).
- **RG-06** — Par défaut tous les liens sont bloqués ; le droit d'en publier s'obtient en atteignant, par la montée en niveau, le rôle d'exemption.
- **RG-07** — Les invitations vers d'autres serveurs sont bloquées en permanence, sauf modération et rôles « amis ».
- **RG-08** — Le spam est détecté au-delà de 5 messages en 5 secondes, ou de 5 mentions dans un même message.
- **RG-09** — Face au spam, le bot supprime les messages, applique un timeout automatique et journalise l'action; il n'attribue jamais d'avertissement de lui-même.

## Sanctions

- **RG-10** — Seuls modérateurs et administrateurs peuvent exécuter les commandes de sanction.
- **RG-11** — Les avertissements sont créés et retirés manuellement ; il n'y a pas d'escalade automatique.
- **RG-12** — Les avertissements sont conservés indéfiniment (traçabilité) mais peuvent être supprimés manuellement ; chaque création ou suppression est journalisée.
- **RG-13** — Le timeout automatique anti-spam a une durée fixe configurable (défaut 1 h), distincte du timeout manuel dont la durée est fixée par le modérateur, dans la limite de 48 h.

## Journalisation

- **RG-14** — Toute action de modération — commande du bot ou action Discord native, automatique ou manuelle — génère un log unique (type, cible, auteur, motif, horodatage), consultable sur le dashboard et publié dans le salon de modération du type d'action concerné ainsi que dans le salon `all_logs`.

## Système de niveaux

- **RG-15** — L'XP est unifiée : messages et activité vocale alimentent une seule barre de progression par membre (un seul niveau, un seul jeu de paliers), afin que les rôles liés aux paliers restent accessibles quel que soit le mode de participation.
- **RG-16** — Un membre gagne de l'XP en publiant des messages, dans la limite d'un gain par cooldown (défaut 60 s).
- **RG-17** — Un membre gagne de l'XP par minute de présence en vocal.
- **RG-18** — Sont configurables depuis le dashboard : XP par message, XP par minute de vocal, cooldown, niveau maximum, paliers et rôles associés, et multiplicateur global.
- **RG-19** — Le passage d'un palier attribue le rôle associé et retire celui du palier précédent (rôles remplacés, non cumulés).

## Salons médias (MOC)

- **RG-20** — Chaque salon MOC déclare ses types de contenu autorisés (images, vidéos, fichiers, liens avec domaines autorisés, texte d'accompagnement). Tout message non conforme — type interdit, ou texte seul quand il n'est pas autorisé — est supprimé.

## Accueil, animations & communauté

- **RG-21** — À l'arrivée d'un membre, un ou plusieurs rôles de bienvenue (configurables) lui sont attribués automatiquement.
- **RG-22** — Le compteur ne comptabilise que les membres humains (hors bots) ; le nom du salon vocal est rafraîchi périodiquement (5-10 min) pour respecter les limites de l'API Discord.
- **RG-23** — Les anniversaires sont saisis dans le dashboard (réservé modération + amis) sous forme d'ID Discord + date ; un souhait est publié automatiquement le jour J à 10 h (Europe/Paris).
- **RG-24** — Pour chaque chaîne Twitch déclarée (par nom d'utilisateur), le bot détecte le passage en direct et publie une annonce avec les informations du stream dans un salon dédié.

## Données & cycle de vie

- **RG-25** — Les données d'un membre (XP, niveau, avertissements, logs) sont rattachées à son identifiant Discord et conservées même après son départ du serveur ; un retour ne réinitialise pas son historique.

## Animation — embeds

- **RG-26** — Les embeds sont composés et enregistrés depuis le dashboard, puis réutilisables et publiables à la demande par un administrateur.
