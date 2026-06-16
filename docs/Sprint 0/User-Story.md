# User Stories — Wystrelia's Bot

## Contexte

Wystrelia's Bot est un projet full-stack qui combine un bot Discord et un tableau de bord web. Le bot automatise la modération et l'animation de la communauté. Le dashboard permet aux administrateurs de configurer et piloter le bot sans compétences techniques.

## Acteurs

- **Administrateur** : accède au dashboard, configure le bot, modère via l'interface web. Doit posséder la permission `MANAGE_GUILD` sur le serveur.
- **Modérateur** : utilise les commandes slash Discord pour sanctionner et gérer les membres.
- **Membre** : participe au serveur et bénéficie des fonctionnalités communautaires (XP, classement, anniversaires).
- **Bot** : exécute l'auto-modération, les crons et les actions déclenchées par le backend.


## Stories principales

### US-01 ⭐ — Filtrer les mots interdits
**En tant que** administrateur,
**Je veux** définir une liste de mots interdits depuis le dashboard,
**Afin de** supprimer automatiquement les messages qui les contiennent.

Critères d'acceptation
- Étant donné un mot ajouté à la liste depuis le dashboard,
- Quand un membre non exempté publie un message contenant ce mot (insensible à la casse),
- Alors le message est supprimé, un embed de log est posté dans le salon de logs configuré, et l'action est journalisée.

### US-02 ⭐ — Avertir un membre
**En tant que** modérateur,
**Je veux** avertir un membre avec `/warn @membre raison`,
**Afin de** tracer un comportement problématique sans action Discord immédiate.

Critères d'acceptation
- Étant donné un modérateur possédant la permission `Kick Members`,
- Quand il exécute `/warn @membre raison`,
- Alors une entrée `AuditEntry` (WARN) est créée en base, le membre reçoit un DM avec la raison et le nom du serveur, et l'action est journalisée.
- Si le membre a les DMs désactivés, le warn est quand même enregistré et le modérateur en est informé.

### US-03 ⭐ — Bannir un membre
**En tant que** modérateur,
**Je veux** bannir un membre avec `/ban @membre raison`,
**Afin de** retirer définitivement un perturbateur du serveur.

Critères d'acceptation
- Étant donné un modérateur possédant la permission `Ban Members`,
- Quand il exécute `/ban @membre raison supprimer_messages:7`,
- Alors le membre est banni, les messages des 7 derniers jours sont optionnellement supprimés, et une entrée `AuditEntry` (BAN) est créée.
- Le ban par ID fonctionne même si l'utilisateur n'est plus dans le serveur.

### US-04 — Bloquer le spam
**En tant que** membre,
**Je veux** que le bot détecte et supprime les spams,
**Afin de** préserver la lisibilité des discussions.

Critères d'acceptation
- Étant donné que `spamDetectionEnabled` est activé dans la config,
- Quand un membre non exempté envoie plus de 5 messages en moins de 5 secondes dans le même salon,
- Alors les messages en excès sont supprimés et un embed de log est posté dans le salon de logs.

### US-05 — Gagner de l'XP
**En tant que** membre,
**Je veux** gagner de l'XP en participant (messages et activité vocale),
**Afin de** progresser en niveau et obtenir des récompenses de rôles.

Critères d'acceptation
- Étant donné que le cooldown d'XP (`messageCooldownSeconds`) est expiré,
- Quand j'envoie un message, j'obtiens `xpPerMessage` points d'XP.
- Quand je quitte un salon vocal après au moins 1 minute, j'obtiens `floor(minutes) × xpPerVoiceMinute` points d'XP.
- Si un palier de niveau est franchi et qu'une récompense de rôle est configurée, le rôle est automatiquement attribué.
- Le salon AFK et les messages de bots sont exclus du calcul.

### US-06 — Consulter mon rang
**En tant que** membre,
**Je veux** exécuter `/rank`,
**Afin de** voir mon niveau, mon XP et ma position dans le classement du serveur.

Critères d'acceptation
- Étant donné un membre ayant de l'XP,
- Quand il exécute `/rank`,
- Alors le bot répond en éphémère avec son niveau, son XP total et sa position (ex. "#3 sur 47 membres").
- Si le membre n'a aucun XP, le bot affiche XP : 0, Niveau : 0, sans classement.

### US-07 — Accueillir un nouveau membre
**En tant que** administrateur,
**Je veux** envoyer un message de bienvenue automatique et attribuer un rôle de départ,
**Afin de** accueillir les nouveaux arrivants et leur donner un statut initial.

Critères d'acceptation
- Étant donné un `welcomeChannelId` et un `autoRoleId` configurés,
- Quand un membre rejoint le serveur,
- Alors un embed de bienvenue est publié dans le salon configuré et le rôle de départ est attribué dans les 5 secondes.
- Si `welcomeMessage` est défini, il est inclus dans l'embed ; sinon un message par défaut est utilisé.

### US-08 ⭐ — Se connecter au dashboard
**En tant que** administrateur,
**Je veux** me connecter via Discord OAuth2,
**Afin de** accéder au dashboard en toute sécurité.

Critères d'acceptation
- Quand un utilisateur clique sur "Se connecter avec Discord" et accorde les scopes `identify guilds`,
- Alors l'API échange le code, vérifie que l'utilisateur possède `MANAGE_GUILD` sur au moins un serveur où le bot est présent, et émet un JWT dans un cookie HttpOnly.
- Si l'utilisateur n'est admin d'aucun serveur éligible, l'accès est refusé.
- Si l'utilisateur annule la fenêtre OAuth, un message "Authentification annulée" est affiché.

### US-09 — Suivre l'activité du serveur
**En tant que** administrateur,
**Je veux** voir des statistiques d'activité sur le dashboard,
**Afin de** mesurer la santé de la communauté.

Critères d'acceptation
- Étant donné des données collectées par le bot,
- Quand j'ouvre la page d'accueil du dashboard,
- Alors je vois le nombre de membres, les arrivées/départs du jour, les messages du jour, le top 5 des membres les plus actifs (username, niveau, XP) et les 3 dernières entrées d'audit.

### US-10 — Modérer en un clic
**En tant que** administrateur,
**Je veux** déclencher des sanctions depuis le dashboard,
**Afin de** modérer sans taper de commande Discord.

Critères d'acceptation
- Étant donné un membre listé dans la page "Membres" du dashboard,
- Quand je clique sur une action (Avertir, Timeout, Expulser, Bannir),
- Alors une modale de confirmation s'ouvre avec un champ "Raison" ; à la validation, l'action est exécutée via l'API et journalisée.

---

## Stories complémentaires

### US-11 — Consulter les informations d'un membre
**En tant que** modérateur,
**Je veux** utiliser `/userinfo @membre`,
**Afin de** obtenir rapidement le profil complet d'un membre.

Critères d'acceptation
- Quand il exécute `/userinfo @membre`,
- Alors le bot affiche : avatar, username, date d'arrivée, rôles, niveau XP, XP total et nombre de warns actifs.
- Si le membre n'a aucun XP, niveau et XP s'affichent à 0.

### US-12 — Gérer les avertissements
**En tant que** modérateur,
**Je veux** utiliser `/unwarn` et `/warnings`,
**Afin de** corriger les avertissements et consulter l'historique.

Critères d'acceptation
- Quand il exécute `/warnings @membre`, le bot affiche tous les warns actifs (ID, raison, modérateur, date).
- Quand il exécute `/unwarn @membre warn_id:42`, une entrée UNWARN est créée pour traçabilité (la ligne WARN originale n'est pas supprimée).
- Si l'ID de warn est invalide, le bot répond en éphémère "Aucun avertissement trouvé avec cet ID".

### US-13 — Appliquer un timeout Discord
**En tant que** modérateur,
**Je veux** utiliser `/timeout` et `/untimeout`,
**Afin de** restreindre temporairement un membre.

Critères d'acceptation
- Quand il exécute `/timeout @membre durée:60 raison`, le timeout est appliqué pour 60 minutes et une entrée TIMEOUT est journalisée.
- La durée doit être comprise entre 1 et 40 320 minutes ; hors plage, une erreur éphémère est retournée.
- Quand il exécute `/untimeout @membre`, le timeout est levé et une entrée UNTIMEOUT est journalisée.

### US-14 — Verrouiller et déverrouiller un salon
**En tant que** modérateur,
**Je veux** utiliser `/lock` et `/unlock`,
**Afin de** contrôler l'accès à un salon en cas de dérive.

Critères d'acceptation
- Quand il exécute `/lock`, la permission `SendMessages` de `@everyone` est retirée et une entrée LOCK est journalisée.
- Quand il exécute `/unlock`, la permission est rétablie et une entrée UNLOCK est journalisée.
- Si le salon est déjà verrouillé, le bot répond "Ce salon est déjà verrouillé".

### US-15 — Effacer des messages en bloc
**En tant que** modérateur,
**Je veux** utiliser `/clear`,
**Afin de** nettoyer rapidement un salon.

Critères d'acceptation
- Quand il exécute `/clear nombre:20`, les 20 messages les plus récents sont supprimés via `bulkDelete` et une entrée CLEAR est journalisée.
- Les messages de plus de 14 jours (limite Discord) sont ignorés ; le bot indique combien ont réellement été supprimés.

### US-16 — Vérifier la disponibilité du bot
**En tant que** modérateur,
**Je veux** utiliser `/ping`,
**Afin de** vérifier la latence et l'état du bot.

Critères d'acceptation
- Étant donné le bot en ligne,
- Quand je tape `/ping`,
- Alors le bot répond avec la latence WebSocket et le round-trip de l'API Discord (en ms).

### US-17 — Afficher l'aide de modération
**En tant que** modérateur,
**Je veux** utiliser `/modhelp`,
**Afin de** voir rapidement les commandes de modération disponibles.

Critères d'acceptation
- Quand il exécute `/modhelp`,
- Alors le bot envoie un embed éphémère listant chaque commande avec sa syntaxe, sa description et la permission requise.

### US-18 — Filtrer les liens et invitations
**En tant que** membre,
**Je veux** que le bot bloque les liens et invitations indésirables,
**Afin de** préserver la sécurité du serveur.

Critères d'acceptation
- Si `linkFilterEnabled` est actif et qu'un membre non exempté publie un message contenant `http://`, `https://` ou `www.`, le message est supprimé.
- Si `inviteFilterEnabled` est actif et qu'un membre publie `discord.gg/` ou `discord.com/invite/`, le message est supprimé.
- Dans les deux cas, un embed de log est posté dans le salon de logs si configuré.

### US-19 — Exemption de filtres
**En tant que** administrateur,
**Je veux** définir des rôles exemptés des filtres d'auto-modération,
**Afin de** éviter que certains membres (staff, bots) ne soient soumis aux règles.

Critères d'acceptation
- Étant donné un rôle ajouté aux exemptions (`exemptRoleIds`),
- Quand un membre portant ce rôle publie un contenu normalement filtré,
- Alors aucun filtre d'auto-modération ne s'applique et aucun log n'est posté.

### US-20 — Gérer le système de niveaux
**En tant que** administrateur,
**Je veux** configurer les taux XP, le cooldown et les paliers de récompenses depuis le dashboard,
**Afin de** personnaliser le système de progression.

Critères d'acceptation
- Étant donné des paramètres de niveau modifiés dans le dashboard,
- Quand je clique Enregistrer, un PATCH est envoyé à `/api/guilds/:guildId/xp/config` et un toast de succès est affiché.
- Quand j'ajoute un palier niveau → rôle, le tableau `levelRewards` complet est envoyé ; le bot utilise les nouveaux paliers immédiatement.

### US-21 — Classement des membres actifs
**En tant que** membre,
**Je veux** utiliser `/top`,
**Afin de** voir le classement des membres les plus actifs.

Critères d'acceptation
- Quand j'exécute `/top`, le bot affiche les 10 premiers membres par XP (classement, username, XP, niveau).
- Si moins de 10 membres ont de l'XP, tous sont affichés sans rembourrage.

### US-22 — Ajuster l'XP et le niveau
**En tant que** administrateur,
**Je veux** utiliser `/addxp`, `/setxp`, `/addlevels`, `/setlevels`,
**Afin de** corriger ou récompenser manuellement les membres.

Critères d'acceptation
- Étant donné un administrateur possédant `MANAGE_GUILD`,
- Quand il exécute une commande d'ajustement, le bot met à jour les valeurs en base, recalcule le niveau et assigne les rôles de récompense manquants si des paliers sont franchis.

### US-23 — Réinitialiser les points
**En tant que** administrateur,
**Je veux** utiliser `/reset @membre`,
**Afin de** remettre à zéro les points d'un membre.

Critères d'acceptation
- Étant donné un administrateur possédant `MANAGE_GUILD`,
- Quand il exécute `/reset @membre`, l'XP et le niveau du membre sont remis à 0 (les rôles de récompense acquis ne sont pas retirés automatiquement).

### US-24 — Média-Only Channel (MOC)
**En tant que** administrateur,
**Je veux** définir des salons réservés aux médias,
**Afin de** faire respecter un canal images/vidéos uniquement.

Critères d'acceptation
- Étant donné un salon configuré en MOC,
- Quand un membre envoie un message sans pièce jointe ni embed image/vidéo,
- Alors le message est supprimé et l'auteur reçoit un message éphémère expliquant la règle.
- Les messages de bots ne sont pas supprimés.
- Un salon déjà dans la liste MOC retourne une erreur 409 si on tente de l'ajouter à nouveau.

### US-25 — Envoyer un embed enregistré
**En tant que** administrateur,
**Je veux** créer, enregistrer et envoyer des embeds depuis le dashboard,
**Afin de** produire des messages enrichis plus facilement.

Critères d'acceptation
- Je peux créer un embed (nom, titre, description, couleur), le sauvegarder et le modifier ultérieurement.
- Le panneau de prévisualisation se met à jour en temps réel pendant la saisie.
- Je peux envoyer un embed sauvegardé dans un salon Discord en saisissant l'ID du salon cible.
- La commande slash `/announce titre description couleur salon` permet aussi d'envoyer un embed ponctuel directement depuis Discord (nécessite `MANAGE_GUILD`).

### US-26 — Réponse aléatoire au ping du bot *(bonus)*
**En tant que** membre,
**Je veux** que le bot réponde de façon personnalisée quand on le mentionne,
**Afin de** rendre l'expérience plus vivante.

Critères d'acceptation
- Étant donné un message mentionnant le bot,
- Quand il reçoit un ping,
- Alors il répond avec un message aléatoire issu de la banque configurée.

### US-27 — Annoncer les anniversaires
**En tant que** administrateur,
**Je veux** enregistrer les dates d'anniversaire des membres et recevoir un message automatique chaque année,
**Afin de** célébrer les membres à leur date spéciale.

Critères d'acceptation
- Je peux ajouter, modifier et supprimer des anniversaires (userId, mois, jour) depuis le dashboard.
- Un mois hors plage ou un jour invalide retourne une erreur 422.
- Chaque jour à minuit UTC, le bot envoie un embed dans `birthdayChannelId` pour les anniversaires du jour.
- Si aucun salon n'est configuré, aucun message n'est envoyé et aucune erreur n'est levée.

### US-28 — Suivi des streams Twitch *(hors périmètre v1)*
**En tant que** administrateur,
**Je veux** détecter et annoncer les streams Twitch des membres suivis,
**Afin de** promouvoir les diffusions en direct.

### US-29 — Afficher l'historique des actions
**En tant que** administrateur,
**Je veux** consulter l'historique complet des actions de modération,
**Afin de** avoir une traçabilité complète.

Critères d'acceptation
- La page affiche les 25 entrées les plus récentes (triées par date décroissante) avec : type d'action, modérateur, cible, raison et horodatage.
- Je peux filtrer par type d'action (`?action=BAN`) et par utilisateur cible (`?targetId=XXX`).
- La pagination permet de naviguer vers les entrées plus anciennes.
- Les entrées d'audit sont immuables : aucune suppression ou modification n'est possible.

---

## Stories ajoutées

### US-30 — Expulser un membre
**En tant que** modérateur,
**Je veux** expulser un membre avec `/kick @membre raison`,
**Afin de** retirer temporairement un perturbateur sans le bannir définitivement.

Critères d'acceptation
- Quand il exécute `/kick @membre raison`, la cible est expulsée, une entrée KICK est créée et une confirmation éphémère est envoyée.
- Si la cible a un rôle supérieur ou égal à celui du modérateur, le bot retourne une erreur éphémère.

### US-31 — Lever un bannissement
**En tant que** modérateur,
**Je veux** utiliser `/unban user_id raison`,
**Afin de** réintégrer un membre banni après révision.

Critères d'acceptation
- Quand il exécute `/unban user_id:123456789 raison:"Appel accepté"`, le ban est levé et une entrée UNBAN est créée.
- Si l'utilisateur n'est pas banni, le bot répond "Cet utilisateur n'est pas banni".

### US-32 — Se déconnecter du dashboard
**En tant que** administrateur,
**Je veux** me déconnecter du dashboard,
**Afin de** sécuriser mon accès sur un poste partagé.

Critères d'acceptation
- Quand je clique sur "Se déconnecter", `POST /auth/logout` est appelé, le cookie JWT est effacé côté serveur, et je suis redirigé vers la page d'accueil.
- Si mon JWT expire, je suis automatiquement redirigé vers la page de connexion à la prochaine requête.

### US-33 — Configurer les paramètres généraux du serveur
**En tant que** administrateur,
**Je veux** modifier les paramètres généraux depuis le dashboard (salon de logs, salon de bienvenue, auto-rôle, salon d'anniversaires),
**Afin de** personnaliser le comportement du bot sur mon serveur.

Critères d'acceptation
- Quand je soumets le formulaire avec un champ modifié, un PATCH est envoyé à `/api/guilds/:guildId/config` et un toast de succès est affiché.
- Un ID de salon invalide retourne une erreur 422 avec un message inline sur le champ concerné.
