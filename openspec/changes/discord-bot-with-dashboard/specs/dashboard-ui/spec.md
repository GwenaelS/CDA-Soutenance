## Exigences AJOUTÉES

### Exigence : La page de sélection de serveur liste les serveurs gérables
Après connexion, le dashboard DOIT afficher la liste des serveurs où l'utilisateur a `MANAGE_GUILD` et où le bot est présent.

#### Scénario : L'utilisateur gère plusieurs serveurs
- **QUAND** un utilisateur authentifié visite `/dashboard`
- **ALORS** la page liste tous les serveurs qu'il administre et où le bot est membre, avec le nom et l'icône de chaque serveur

#### Scénario : Aucun serveur gérable avec le bot
- **QUAND** l'utilisateur est admin de serveurs où le bot n'est pas installé
- **ALORS** ces serveurs apparaissent dans une section séparée "Ajouter le bot" avec un lien d'invitation, distincte de la liste des serveurs actifs

---

### Exigence : La vue d'ensemble affiche les statistiques clés du serveur
La page de vue d'ensemble DOIT afficher les statistiques du serveur : membres actuels, arrivées/départs du jour, messages du jour, top 5 membres les plus actifs, et les 3 dernières entrées d'audit.

#### Scénario : Vue d'ensemble chargée avec données
- **QUAND** un admin navigue vers `/dashboard/{guildId}`
- **ALORS** la page affiche : nombre de membres, arrivées et départs du jour, messages envoyés aujourd'hui, top 5 membres (username, niveau, XP), et les 3 dernières lignes `AuditEntry`

#### Scénario : Aucune activité de modération récente
- **QUAND** aucune action de modération n'a eu lieu pour ce serveur
- **ALORS** la page affiche "Aucune action récente" à la place de la liste d'audit

---

### Exigence : La page des logs de modération affiche l'historique complet avec pagination
La page des logs DOIT afficher toutes les lignes `AuditEntry` d'un serveur, paginées à 25 par page, avec des filtres par type d'action et ID d'utilisateur cible.

#### Scénario : Vue par défaut des logs
- **QUAND** un admin navigue vers `/dashboard/{guildId}/audit-log`
- **ALORS** la page affiche les 25 entrées les plus récentes avec : tag du modérateur, ID de la cible, type d'action, raison et horodatage

#### Scénario : Filtrer par type d'action
- **QUAND** l'admin sélectionne "BAN" dans le menu déroulant de filtre
- **ALORS** seules les entrées BAN sont affichées et l'URL reflète le filtre (`?action=BAN`)

#### Scénario : Paginer vers les entrées plus anciennes
- **QUAND** l'admin clique sur "Page suivante"
- **ALORS** les 25 entrées suivantes (par `createdAt` décroissant) sont affichées

---

### Exigence : La page des paramètres généraux permet de modifier la configuration du serveur
La page des paramètres DOIT afficher un formulaire prérempli avec les valeurs `GuildConfig` courantes et soumettre les modifications via l'API.

#### Scénario : L'admin met à jour le salon de logs
- **QUAND** un admin saisit un ID de salon dans le champ "Salon de logs" et clique Enregistrer
- **ALORS** une requête PATCH est envoyée à `/api/guilds/{guildId}/config` et un toast de succès est affiché

#### Scénario : Erreur de validation de l'API
- **QUAND** l'admin soumet un ID de salon invalide et que l'API retourne 422
- **ALORS** le formulaire affiche un message d'erreur inline à côté du champ concerné sans effacer les autres saisies

---

### Exigence : La page d'auto-modération permet de configurer les filtres passifs
La page d'auto-modération DOIT permettre de gérer les mots interdits, les rôles exemptés et les toggles de filtres (spam, liens, invitations).

#### Scénario : L'admin ajoute un mot interdit
- **QUAND** un admin saisit un mot dans le champ "Ajouter un mot" et clique Ajouter
- **ALORS** le mot apparaît dans la liste et un PATCH est envoyé à `/api/guilds/{guildId}/auto-moderation`

#### Scénario : L'admin active le filtre de liens
- **QUAND** un admin active le toggle "Filtre de liens"
- **ALORS** `linkFilterEnabled` passe à `true`, un PATCH est envoyé et le bot commence à supprimer les messages contenant des liens

#### Scénario : L'admin ajoute un rôle exempté
- **QUAND** un admin saisit un ID de rôle dans "Rôles exemptés" et clique Ajouter
- **ALORS** le rôle est ajouté à `exemptRoleIds` et les membres possédant ce rôle ne seront plus soumis aux filtres

---

### Exigence : La page de configuration XP permet de modifier les taux et les paliers de niveau
La page XP DOIT afficher des champs pour tous les paramètres `GuildXpConfig`, une liste éditable de paliers niveau → rôle, et un tableau leaderboard.

#### Scénario : L'admin met à jour le taux XP par message
- **QUAND** un admin change `xpPerMessage` à 20 et clique Enregistrer
- **ALORS** une requête PATCH est envoyée à `/api/guilds/{guildId}/xp/config` et un toast de succès est affiché

#### Scénario : L'admin ajoute une récompense de niveau
- **QUAND** un admin saisit le niveau 5 et un ID de rôle puis clique "Ajouter une récompense"
- **ALORS** la nouvelle ligne apparaît dans la liste ; à la sauvegarde, le tableau complet `levelRewards` est envoyé à l'API

#### Scénario : Chargement du leaderboard
- **QUAND** un admin navigue vers `/dashboard/{guildId}/xp`
- **ALORS** le tableau leaderboard affiche classement, username, XP courant et niveau pour les 50 premiers utilisateurs, ordonnés par XP décroissant

---

### Exigence : La page des annonces permet de gérer et envoyer des embeds sauvegardés
La page des annonces DOIT permettre de créer, modifier, sauvegarder et envoyer des templates d'embeds, avec une prévisualisation live.

#### Scénario : L'admin crée un nouvel embed
- **QUAND** un admin remplit le formulaire (titre, description, couleur) et clique "Sauvegarder"
- **ALORS** un POST est envoyé à `/api/guilds/{guildId}/embeds`, l'embed apparaît dans la liste des templates sauvegardés

#### Scénario : L'admin envoie un embed sauvegardé
- **QUAND** un admin sélectionne un embed dans la liste, saisit un ID de salon cible et clique "Envoyer"
- **ALORS** un POST est envoyé à `/api/guilds/{guildId}/embeds/{embedId}/send`, l'embed est posté dans le salon Discord spécifié, et un message de succès est affiché

#### Scénario : Prévisualisation live de l'embed
- **QUAND** l'admin saisit ou modifie le titre, la description ou la couleur
- **ALORS** le panneau de prévisualisation se met à jour en temps réel pour refléter l'apparence de l'embed

---

### Exigence : La page des anniversaires permet de gérer la liste des membres
La page des anniversaires DOIT permettre d'ajouter et supprimer des anniversaires de membres, et d'afficher la liste complète.

#### Scénario : L'admin ajoute un anniversaire
- **QUAND** un admin saisit un ID Discord, un mois et un jour puis clique Ajouter
- **ALORS** un POST est envoyé à `/api/guilds/{guildId}/birthdays` et le membre apparaît dans la liste avec sa date d'anniversaire

#### Scénario : L'admin supprime un anniversaire
- **QUAND** un admin clique sur le bouton Supprimer à côté d'un membre
- **ALORS** un DELETE est envoyé à `/api/guilds/{guildId}/birthdays/{userId}` et le membre est retiré de la liste

---

### Exigence : La page MOC permet de configurer les salons Média-Only
La page MOC DOIT permettre d'ajouter et supprimer des salons de la liste Média-Only-Channels.

#### Scénario : L'admin ajoute un salon MOC
- **QUAND** un admin saisit un ID de salon et clique Ajouter
- **ALORS** un POST est envoyé à `/api/guilds/{guildId}/moc-channels` et le salon apparaît dans la liste MOC

#### Scénario : L'admin supprime un salon MOC
- **QUAND** un admin clique sur Supprimer à côté d'un salon
- **ALORS** un DELETE est envoyé à `/api/guilds/{guildId}/moc-channels/{channelId}` et le salon n'est plus soumis aux règles MOC

---

### Exigence : La page de gestion des membres liste les membres avec actions en 1 clic
La page des membres DOIT afficher une liste paginée des membres avec leurs infos et des boutons d'action de modération directe.

#### Scénario : Affichage de la liste des membres
- **QUAND** un admin navigue vers `/dashboard/{guildId}/members`
- **ALORS** la page affiche une liste paginée avec pour chaque membre : avatar, username, date d'arrivée, niveau, XP et nombre de warns actifs

#### Scénario : L'admin effectue une action en 1 clic
- **QUAND** un admin clique sur un bouton d'action (Avertir, Timeout, Expulser, Bannir) à côté d'un membre
- **ALORS** une modale de confirmation s'ouvre avec un champ "Raison" ; à la validation, la requête correspondante est envoyée à l'API (`POST /guilds/{guildId}/members/{userId}/{action}`) et la liste est actualisée

#### Scénario : Aucune donnée XP pour un membre
- **QUAND** un membre n'a jamais envoyé de message ni été en vocal
- **ALORS** niveau et XP s'affichent à 0 ; le membre apparaît quand même dans la liste si son entrée `UserXp` existe (créée au join)

---

### Exigence : Le dashboard est responsive et accessible
Toutes les pages du dashboard DOIVENT être utilisables sur des largeurs de viewport de 375px (mobile) à 1440px (desktop) et DOIVENT satisfaire les exigences de contraste WCAG 2.1 AA.

#### Scénario : Navigation sidebar sur mobile
- **QUAND** un utilisateur consulte le dashboard sur un viewport de 375px de large
- **ALORS** la sidebar se replie en menu hamburger et tout le contenu reste accessible sans défilement horizontal
