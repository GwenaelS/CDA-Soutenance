# User Stories — Wystrelia's Bot

## Contexte

Wystrelia's Bot est un projet full-stack qui combine un bot Discord et un tableau de bord web. Le bot automatise la modération et l'animation de la communauté. Le dashboard permet aux administrateurs de configurer et piloter le bot sans compétences techniques.

## Acteurs

- **Administrateur** : accède au dashboard, configure le bot, modère via l'interface.
- **Modérateur** : utilise les commandes Discord pour sanctionner et gérer les membres.
- **Membre** : participe au serveur et bénéficie des fonctionnalités communautaires.
- **Bot** : exécute l'auto-modération, les annonces et les actions définies.


## Stories principales

### US-01 ⭐ — Filtrer les mots interdits
**En tant que** administrateur,
**Je veux** définir une liste de mots interdits depuis le dashboard,
**Afin de** supprimer automatiquement les messages qui les contiennent.

Critères d'acceptation
- Étant donné un mot ajouté à la liste depuis le dashboard,
- Quand un membre non exempté publie un message contenant ce mot,
- Alors le message est supprimé en moins de 2 secondes et l'action est journalisée en base et dans le salon de modération.

### US-02 ⭐ — Avertir un membre
**En tant que** modérateur,
**Je veux** avertir un membre avec `/warn @membre raison`,
**Afin de** tracer un comportement problématique.

Critères d'acceptation
- Étant donné un modérateur autorisé,
- Quand il exécute `/warn @membre raison`,
- Alors une entrée `Warning` est créée en base, le `warnCount` est mis à jour, et l'action est journalisée.

### US-03 ⭐ — Bannir un membre
**En tant que** modérateur,
**Je veux** bannir un membre avec `/ban @membre raison`,
**Afin de** retirer définitivement un perturbateur du serveur.

Critères d'acceptation
- Étant donné un modérateur autorisé,
- Quand il exécute `/ban @membre raison`,
- Alors le membre est banni, l'action est enregistrée en base et publiée dans le salon de modération.

### US-04 — Bloquer le spam
**En tant que** membre,
**Je veux** que le bot détecte et bloque le spam,
**Afin de** préserver la lisibilité des discussions.

Critères d'acceptation
- Étant donné les règles de spam définies,
- Quand un membre dépasse les seuils de fréquence ou de répétition,
- Alors les messages en cause sont supprimés et un avertissement automatique est journalisé.

### US-05 — Gagner de l'XP
**En tant que** membre,
**Je veux** gagner de l'XP en participant,
**Afin de** progresser en niveau et obtenir des récompenses.

Critères d'acceptation
- Étant donné que le cooldown d'XP est expiré,
- Quand j'envoie un message ou passe une minute en vocal actif,
- Alors mon XP augmente selon le multiplicateur configuré, et le rôle de palier est attribué si nécessaire.

### US-06 — Consulter mon rang
**En tant que** membre,
**Je veux** exécuter `/rank`,
**Afin de** voir mon niveau, mon XP et ma position dans le classement.

Critères d'acceptation
- Étant donné un membre ayant de l'XP,
- Quand il exécute `/rank`,
- Alors le bot répond avec son niveau actuel, l'XP accumulée et l'XP requise pour le niveau suivant.

### US-07 — Accueillir un nouveau membre
**En tant que** administrateur,
**Je veux** envoyer un message de bienvenue automatique et attribuer un rôle de départ,
**Afin de** accueillir les nouveaux arrivants et leur donner un statut initial.

Critères d'acceptation
- Étant donné un message et un rôle de bienvenue configurés,
- Quand un membre rejoint le serveur,
- Alors le message est publié et le rôle de départ est attribué automatiquement.

### US-08 ⭐ — Se connecter au dashboard
**En tant que** administrateur,
**Je veux** me connecter via OAuth2 Discord,
**Afin de** accéder au dashboard en toute sécurité.

Critères d'acceptation
- Étant donné un utilisateur qui tente de se connecter,
- Quand il s'authentifie via Discord,
- Alors l'accès est refusé s'il n'est pas administrateur du serveur sinon il accède au dashboard.

### US-09 — Suivre l'activité du serveur
**En tant que** administrateur,
**Je veux** voir des statistiques d'activité sur le dashboard,
**Afin de** mesurer la santé de la communauté.

Critères d'acceptation
- Étant donné des données collectées,
- Quand j'ouvre la page d'accueil du dashboard,
- Alors je vois le nombre de membres, les arrivées/départs, les messages par jour et les membres les plus actifs.

### US-10 — Modérer en un clic
**En tant que** administrateur,
**Je veux** déclencher des sanctions depuis le dashboard,
**Afin de** modérer sans taper de commande Discord.

Critères d'acceptation
- Étant donné un membre listé dans le dashboard,
- Quand je clique sur une action de modération,
- Alors l'action est exécutée par le bot et journalisée comme une commande équivalente.

---

## Stories complémentaires

### US-11 — Consulter les informations d'un membre
**En tant que** modérateur,
**Je veux** utiliser `/userinfo @membre`,
**Afin de** obtenir rapidement le profil et l'historique d'un membre.

Critères d'acceptation
- Étant donné un modérateur autorisé,
- Quand il exécute `/userinfo @membre`,
- Alors le bot affiche les informations de profil, les avertissements et le niveau.

### US-12 — Gérer les avertissements
**En tant que** modérateur,
**Je veux** utiliser `/unwarn` et `/warnings`,
**Afin de** corriger les avertissements et consulter l'historique.

Critères d'acceptation
- Étant donné un modérateur autorisé,
- Quand il exécute `/unwarn @membre` ou `/warnings @membre`,
- Alors le bot met à jour le compteur d'avertissements ou affiche la liste des warnings.

### US-13 — Muter et unmuter
**En tant que** modérateur,
**Je veux** utiliser `/mute` et `/unmute`,
**Afin de** réduire temporairement un membre au silence.

Critères d'acceptation
- Étant donné un modérateur autorisé,
- Quand il exécute `/mute @membre` ou `/unmute @membre`,
- Alors le rôle de silence est appliqué ou retiré correctement.

### US-14 — Appliquer un timeout Discord
**En tant que** modérateur,
**Je veux** utiliser `/timeout` et `/untimeout`,
**Afin de** restreindre temporairement un membre via Discord.

Critères d'acceptation
- Étant donné un modérateur autorisé,
- Quand il exécute `/timeout @membre durée raison` ou `/untimeout @membre`,
- Alors le timeout est appliqué ou levé et l'action est journalisée.

### US-15 — Verrouiller et déverrouiller un salon
**En tant que** modérateur,
**Je veux** utiliser `/lock` et `/unlock`,
**Afin de** contrôler l'accès à un salon en cas de dérive.

Critères d'acceptation
- Étant donné un modérateur autorisé,
- Quand il exécute `/lock` ou `/unlock` sur un salon,
- Alors les permissions du salon sont modifiées en conséquence.

### US-16 — Effacer des messages en bloc
**En tant que** modérateur,
**Je veux** utiliser `/clear`,
**Afin de** nettoyer rapidement un salon.

Critères d'acceptation
- Étant donné un modérateur autorisé,
- Quand il exécute `/clear nombre`,
- Alors le nombre de messages spécifié est supprimé et l'action est journalisée.

### US-17 — Vérifier la disponibilité du bot
**En tant que** modérateur,
**Je veux** utiliser `/ping`,
**Afin de** vérifier la latence et l'état du bot.

Critères d'acceptation
- Étant donné le bot en ligne,
- Quand je tape `/ping`,
- Alors le bot répond avec la latence et la disponibilité.

### US-18 — Afficher l'aide de modération
**En tant que** modérateur,
**Je veux** utiliser `/modhelp`,
**Afin de** voir rapidement les commandes de modération disponibles.

Critères d'acceptation
- Étant donné un utilisateur autorisé,
- Quand il exécute `/modhelp`,
- Alors le bot affiche la liste des commandes et leur usage.

### US-19 — Filtrer les liens et invitations
**En tant que** membre,
**Je veux** que le bot bloque les liens et invitations indésirables,
**Afin de** préserver la sécurité du serveur.

Critères d'acceptation
- Étant donné un membre non exempté,
- Quand il publie un lien ou une invitation Discord,
- Alors le message est supprimé et l'action est journalisée.

### US-20 — Exemption de filtres
**En tant que** administrateur,
**Je veux** définir des rôles exemptés des filtres,
**Afin de** éviter qu'une catégorie de membres ne soit soumise à l'auto-modération.

Critères d'acceptation
- Étant donné un rôle ajouté aux exemptions,
- Quand un membre portant ce rôle publie un message interdit,
- Alors le filtre d'auto-modération ne s'applique pas.

### US-21 — Gérer le système de niveaux
**En tant que** administrateur,
**Je veux** configurer les paliers de niveaux et le multiplicateur d'XP,
**Afin de** personnaliser le système de progression.

Critères d'acceptation
- Étant donné des paramètres de niveau modifiés dans le dashboard,
- Quand un membre gagne de l'XP,
- Alors l'XP et les niveaux sont calculés selon les nouveaux paramètres.

### US-22 — Classement des membres actifs
**En tant que** membre,
**Je veux** utiliser `/top`,
**Afin de** voir le classement des membres les plus actifs.

Critères d'acceptation
- Étant donné des données d'activité,
- Quand j'exécute `/top`,
- Alors le bot affiche le classement des membres par XP ou niveau.

### US-23 — Ajuster l'XP et le niveau
**En tant que** administrateur,
**Je veux** utiliser `/addxp`, `/setxp`, `/addlevels`, `/setlevels`,
**Afin de** corriger ou récompenser manuellement les membres.

Critères d'acceptation
- Étant donné un administrateur autorisé,
- Quand il exécute une commande d'ajustement,
- Alors le bot met à jour les valeurs en base et journalise l'action.

### US-24 — Réinitialiser les points
**En tant que** administrateur,
**Je veux** utiliser `/reset`,
**Afin de** remettre à zéro les points d'un membre ou d'un groupe.

Critères d'acceptation
- Étant donné un administrateur autorisé,
- Quand il exécute `/reset @membre`,
- Alors l'XP et le niveau du membre sont réinitialisés.

### US-25 — Média-Only Channel (MOC)
**En tant que** administrateur,
**Je veux** définir des salons réservés aux médias,
**Afin de** faire respecter un canal images/vidéos uniquement.

Critères d'acceptation
- Étant donné un salon configuré en MOC,
- Quand un membre y envoie un message sans média,
- Alors le message est supprimé.

### US-26 — Envoyer un embed enregistré
**En tant que** administrateur,
**Je veux** créer, enregistrer et envoyer des embeds depuis le dashboard,
**Afin de** produire des messages enrichis plus facilement.

Critères d'acceptation
- Étant donné un embed configuré et sauvegardé,
- Quand j'ordonne son envoi,
- Alors le bot publie l'embed dans le salon choisi.

### US-27 — Réponse aléatoire au ping du bot
**En tant que** membre,
**Je veux** que le bot réponde de façon personnalisée quand on le mentionne,
**Afin de** rendre l'expérience plus vivante.

Critères d'acceptation
- Étant donné un message mentionnant le bot,
- Quand il reçoit un ping,
- Alors il répond avec un message aléatoire issu de la banque configurée.

### US-28 — Annoncer les anniversaires
**En tant que** administrateur,
**Je veux** envoyer un message d'anniversaire automatique,
**Afin de** célébrer les membres à leur date spéciale.

Critères d'acceptation
- Étant donné une date d'anniversaire enregistrée pour un membre,
- Quand la date arrive,
- Alors le bot publie un message d'anniversaire.

### US-29 — Suivi des streams Twitch
**En tant que** administrateur,
**Je veux** détecter et annoncer les streams Twitch des membres suivis,
**Afin de** promouvoir les diffusions en direct.

Critères d'acceptation
- Étant donné un membre Twitch suivi et la détection activée,
- Quand il commence un stream,
- Alors le bot publie une notification dans le salon défini.

### US-30 — Afficher l'historique des actions
**En tant que** administrateur,
**Je veux** consulter l'historique des actions de modération,
**Afin de** avoir une traçabilité complète.

Critères d'acceptation
- Étant donné des actions de modération enregistrées,
- Quand je consulte l'historique dans le dashboard,
- Alors je vois les sanctions, auteurs, cibles, raisons et dates.

