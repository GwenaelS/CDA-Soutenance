## Exigences AJOUTÉES

### Exigence : Le bot s'initialise et se connecte à Discord
Le processus bot DOIT se connecter à la gateway Discord avec un token valide au démarrage et émettre un événement ready une fois tous les serveurs mis en cache.

#### Scénario : Démarrage réussi
- **QUAND** le processus bot démarre avec une variable d'environnement `DISCORD_TOKEN` valide
- **ALORS** le bot logue "Prêt en tant que <NomBot>#<discriminator>" et commence à traiter les événements

#### Scénario : Token invalide
- **QUAND** le processus bot démarre avec un `DISCORD_TOKEN` invalide ou manquant
- **ALORS** le processus se termine avec un code non-zéro et logue "Token Discord invalide"

### Exigence : Les commandes slash sont enregistrées via un script dédié
Le bot DOIT enregistrer toutes les commandes slash auprès de l'API Discord via le script `deploy-commands`, pas à chaque démarrage. En développement, les commandes sont enregistrées par serveur (instantané) ; en production, globalement (jusqu'à 1 heure de propagation).

#### Scénario : Enregistrement des commandes réussi
- **QUAND** le script `deploy-commands` s'exécute avec des identifiants valides et une variable `GUILD_ID` définie
- **ALORS** toutes les commandes d'application apparaissent immédiatement dans ce serveur

#### Scénario : Enregistrement des commandes idempotent
- **QUAND** `deploy-commands` s'exécute deux fois avec les mêmes définitions de commandes
- **ALORS** Discord déduplique et aucune commande en double n'apparaît

### Exigence : Le bot gère les événements de join et leave de serveur
Le bot DOIT créer un enregistrement de serveur en base quand il rejoint un nouveau serveur, et marquer l'enregistrement comme inactif quand il en est retiré. Des lignes `GuildConfig`, `GuildXpConfig` et `AutoModerationConfig` par défaut sont également créées au join.

#### Scénario : Le bot rejoint un nouveau serveur
- **QUAND** le bot est ajouté à un serveur Discord
- **ALORS** une ligne `Guild` est upsertée avec `active = true`, une ligne `GuildConfig` est créée avec des valeurs null par défaut, une ligne `GuildXpConfig` est créée avec les taux XP par défaut, et une ligne `AutoModerationConfig` est créée avec tous les filtres désactivés et listes vides

#### Scénario : Le bot est retiré d'un serveur
- **QUAND** le bot est expulsé ou le serveur est supprimé
- **ALORS** la ligne `Guild` correspondante est mise à jour avec `active = false` ; les lignes de config sont conservées

### Exigence : Le bot met à jour le cache des membres sur leur arrivée
Quand un membre rejoint, le bot DOIT créer ou mettre à jour sa ligne `UserXp` avec `username`, `avatarUrl` et `joinedAt`, assigner l'auto-rôle si configuré, envoyer un message de bienvenue si configuré, et incrémenter `GuildStatEntry.joins` du jour.

#### Scénario : Nouveau membre avec auto-rôle et salon de bienvenue configurés
- **QUAND** un nouveau membre rejoint un serveur avec `autoRoleId` et `welcomeChannelId` définis
- **ALORS** le rôle est assigné, un embed de bienvenue est envoyé dans `welcomeChannelId`, et la ligne `GuildStatEntry` du jour est créée ou mise à jour avec `joins` incrémenté

#### Scénario : Départ d'un membre
- **QUAND** un membre quitte le serveur
- **ALORS** `GuildStatEntry.leaves` du jour est incrémenté

### Exigence : Le server mute manuel est détecté et loggé
Le bot DOIT détecter quand un modérateur mute ou démute manuellement un membre via l'interface Discord, et enregistrer l'action dans l'audit log.

#### Scénario : Server mute détecté
- **QUAND** `voiceStateUpdate` est reçu avec `oldState.serverMute = false` et `newState.serverMute = true`
- **ALORS** une `AuditEntry` de type `SERVER_MUTE` est écrite avec `actorId = null` (acteur inconnu depuis l'event) et un embed est posté dans `logChannelId` si configuré

#### Scénario : Server unmute détecté
- **QUAND** `voiceStateUpdate` est reçu avec `oldState.serverMute = true` et `newState.serverMute = false`
- **ALORS** une `AuditEntry` de type `SERVER_UNMUTE` est écrite

### Exigence : Les erreurs non gérées sont loguées sans crash
Le processus bot DOIT capturer les rejets de promesses non gérés et les exceptions non capturées, les loguer, et continuer à fonctionner.

#### Scénario : Rejet non géré dans un handler de commande
- **QUAND** un handler de commande slash lève une erreur non gérée
- **ALORS** le bot logue l'erreur avec la stack trace et répond à l'interaction avec un message éphémère "Une erreur est survenue"
