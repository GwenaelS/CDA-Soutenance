## Exigences AJOUTÉES

### Exigence : Les utilisateurs gagnent de l'XP via les messages textuels
Le bot DOIT accorder de l'XP à l'auteur du message à chaque message qualifiant, sous réserve d'un cooldown par utilisateur pour prévenir le farming.

#### Scénario : Message gagnant de l'XP hors période de cooldown
- **QUAND** un utilisateur envoie un message et que sa dernière récompense XP remonte à plus de `messageCooldownSeconds`
- **ALORS** `xpPerMessage` est ajouté à `UserXp.xp` et `lastMessageAt` est mis à jour

#### Scénario : Message envoyé dans la fenêtre de cooldown
- **QUAND** un utilisateur envoie un message dans les `messageCooldownSeconds` suivant sa dernière récompense
- **ALORS** aucun XP n'est accordé et aucun retour n'est montré à l'utilisateur

#### Scénario : Les messages des bots sont ignorés
- **QUAND** un compte bot envoie un message
- **ALORS** aucun XP n'est accordé

---

### Exigence : Les utilisateurs gagnent de l'XP via l'activité en vocal
Le bot DOIT suivre le temps passé dans les salons vocaux et accorder de l'XP au taux configuré quand un utilisateur quitte le vocal.

#### Scénario : L'utilisateur quitte le vocal après un temps qualifiant
- **QUAND** un utilisateur quitte un salon vocal après y avoir passé au moins une minute complète
- **ALORS** `floor(minutesEnVocal) * xpPerVoiceMinute` est ajouté à `UserXp.xp`

#### Scénario : L'utilisateur rejoint puis quitte immédiatement le vocal
- **QUAND** un utilisateur quitte un salon vocal dans la première minute
- **ALORS** aucun XP n'est accordé

#### Scénario : Le salon AFK est exclu
- **QUAND** un utilisateur est dans le salon AFK du serveur
- **ALORS** aucun XP vocal n'est accordé pour le temps passé

---

### Exigence : L'XP texte et vocal alimentent un pool unique
L'XP textuel et vocal sont additionnés dans le même compteur `UserXp.xp`. Il n'y a pas de barres séparées texte et vocal.

#### Scénario : L'XP combiné déclenche un passage de niveau
- **QUAND** l'XP total d'un utilisateur (toutes sources confondues) franchit un palier de niveau
- **ALORS** `UserXp.level` est incrémenté et toute récompense de rôle configurée pour ce niveau est assignée

---

### Exigence : Les passages de niveau déclenchent des récompenses de rôles automatiques
Si `GuildXpConfig.levelRewards` contient une entrée pour le nouveau niveau, le bot DOIT assigner le rôle Discord correspondant à l'utilisateur.

#### Scénario : Récompense existante pour le nouveau niveau
- **QUAND** un utilisateur atteint le niveau 5 et que `levelRewards` contient `{ level: 5, roleId: "123456789" }`
- **ALORS** le bot assigne le rôle `123456789` à l'utilisateur dans ce serveur

#### Scénario : Aucune récompense configurée pour ce niveau
- **QUAND** un utilisateur atteint un niveau sans entrée dans `levelRewards`
- **ALORS** aucun rôle n'est assigné et aucune erreur n'est levée

#### Scénario : Le bot n'a pas la permission Manage Roles
- **QUAND** une récompense de rôle devrait être assignée mais que le bot n'a pas la permission Manage Roles
- **ALORS** le bot logue un avertissement et passe l'assignation sans crash

---

### Exigence : Les utilisateurs peuvent consulter leur classement
La commande slash `/rank` DOIT afficher l'XP courant, le niveau et la position dans le leaderboard du serveur de l'utilisateur appelant.

#### Scénario : L'utilisateur exécute /rank
- **QUAND** un utilisateur exécute `/rank` dans un serveur
- **ALORS** le bot répond avec un embed éphémère affichant son XP, son niveau et son classement (ex. "#3 sur 47 membres")

#### Scénario : L'utilisateur n'a pas encore d'XP
- **QUAND** un utilisateur exécute `/rank` mais n'a jamais gagné d'XP dans ce serveur
- **ALORS** le bot répond en affichant XP : 0, Niveau : 0, pas de classement

---

### Exigence : Les utilisateurs peuvent consulter le leaderboard du serveur
La commande slash `/top` DOIT afficher les 10 premiers membres par XP dans le serveur.

#### Scénario : Leaderboard avec suffisamment de membres
- **QUAND** un utilisateur exécute `/top` dans un serveur avec au moins 10 détenteurs d'XP
- **ALORS** le bot répond avec un embed listant classement, username (ou ID si indisponible), XP et niveau pour les 10 premiers

#### Scénario : Moins de 10 détenteurs d'XP
- **QUAND** moins de 10 utilisateurs ont gagné de l'XP
- **ALORS** tous les détenteurs d'XP sont affichés sans rembourrage

---

### Exigence : Les administrateurs peuvent modifier l'XP d'un utilisateur
Les commandes slash `/addxp`, `/setxp`, `/addlevels`, `/setlevels` et `/reset` DOIVENT permettre aux utilisateurs avec `MANAGE_GUILD` de modifier directement les données XP/niveau d'un membre.

#### Scénario : Ajout d'XP à un utilisateur
- **QUAND** un admin exécute `/addxp @utilisateur montant:500`
- **ALORS** 500 XP sont ajoutés à `UserXp.xp` de l'utilisateur ; le niveau est recalculé et les récompenses de rôles manquantes sont assignées si des paliers sont franchis

#### Scénario : Définir l'XP d'un utilisateur
- **QUAND** un admin exécute `/setxp @utilisateur montant:1000`
- **ALORS** `UserXp.xp` de l'utilisateur est défini exactement à 1000 ; le niveau est recalculé

#### Scénario : Ajout de niveaux à un utilisateur
- **QUAND** un admin exécute `/addlevels @utilisateur niveaux:3`
- **ALORS** 3 niveaux sont ajoutés au niveau courant de l'utilisateur ; l'XP est ajusté au minimum requis pour ce niveau

#### Scénario : Définir le niveau d'un utilisateur
- **QUAND** un admin exécute `/setlevels @utilisateur niveau:10`
- **ALORS** le niveau de l'utilisateur est défini à 10 et l'XP est ajusté au minimum requis pour ce niveau

#### Scénario : Réinitialiser l'XP d'un utilisateur
- **QUAND** un admin exécute `/reset @utilisateur`
- **ALORS** `UserXp.xp` et `UserXp.level` de l'utilisateur sont remis à 0 dans ce serveur ; aucun rôle de récompense n'est retiré automatiquement

#### Scénario : Permission insuffisante pour les commandes admin
- **QUAND** un utilisateur sans `MANAGE_GUILD` tente d'exécuter une commande admin XP
- **ALORS** le bot répond avec un message éphémère "Vous n'avez pas la permission d'utiliser cette commande"
