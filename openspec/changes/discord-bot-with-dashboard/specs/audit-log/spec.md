## Exigences AJOUTÉES

### Exigence : Chaque action de modération écrit une entrée d'audit
Le système DOIT persister une ligne `AuditEntry` pour chaque commande de modération (kick, ban, unban, timeout, untimeout, warn, unwarn, lock, unlock, clear) avant que l'appel API Discord ne se termine.

#### Scénario : Entrée créée sur un ban
- **QUAND** une commande `/ban` est exécutée avec succès
- **ALORS** une ligne `AuditEntry` existe avec `action = BAN`, `guildId`, `actorId` (modérateur), `targetId`, `reason` et `createdAt`

#### Scénario : L'API Discord échoue après l'écriture de l'entrée d'audit
- **QUAND** l'appel API Discord échoue après que l'entrée d'audit est déjà écrite
- **ALORS** l'entrée d'audit reste en base de données et le modérateur est informé de l'échec côté Discord

---

### Exigence : Les server mutes manuels sont détectés et loggés
Le bot DOIT détecter les server mutes et unmutes appliqués manuellement via l'interface Discord et les enregistrer automatiquement dans l'audit log.

#### Scénario : Server mute détecté
- **QUAND** `voiceStateUpdate` est reçu avec `oldState.serverMute = false` et `newState.serverMute = true`
- **ALORS** une `AuditEntry` de type `SERVER_MUTE` est écrite avec `actorId = null` et un embed est posté dans `logChannelId` si configuré

#### Scénario : Server unmute détecté
- **QUAND** `voiceStateUpdate` est reçu avec `oldState.serverMute = true` et `newState.serverMute = false`
- **ALORS** une `AuditEntry` de type `SERVER_UNMUTE` est écrite

---

### Exigence : L'audit log est queryable par serveur, acteur, cible et type d'action
L'API DOIT exposer un endpoint pour lister les entrées d'audit d'un serveur, filtrables par `actorId`, `targetId` et `action`.

#### Scénario : Lister les entrées récentes d'un serveur
- **QUAND** une requête GET est envoyée à `/api/guilds/{guildId}/audit-log`
- **ALORS** la réponse contient les 25 lignes `AuditEntry` les plus récentes pour ce serveur, ordonnées par `createdAt` décroissant

#### Scénario : Filtrer par utilisateur ciblé
- **QUAND** la requête inclut `?targetId=123456789`
- **ALORS** seules les entrées correspondant à ce `targetId` sont retournées

#### Scénario : Filtrer par type d'action
- **QUAND** la requête inclut `?action=BAN`
- **ALORS** seules les entrées BAN sont retournées

#### Scénario : Pagination
- **QUAND** la requête inclut `?page=2`
- **ALORS** les 25 entrées suivantes (décalage de 25) sont retournées

---

### Exigence : Les entrées d'audit log ne sont jamais supprimées
Le système DOIT traiter les entrées d'audit comme des enregistrements immuables en ajout uniquement ; aucune opération DELETE ou UPDATE n'est autorisée sur les lignes `AuditEntry`.

#### Scénario : Tentative de suppression d'une entrée
- **QUAND** un chemin de code tente de supprimer une `AuditEntry`
- **ALORS** l'opération est rejetée — aucune route API DELETE n'existe pour les entrées individuelles

_Note : `/unwarn` ne supprime pas la ligne `AuditEntry` de type WARN. Il écrit une nouvelle entrée de type `UNWARN` pour traçabilité._

---

### Exigence : L'audit log poste dans un salon Discord configurable
Si un serveur a configuré un `logChannelId`, le bot DOIT poster un embed dans ce salon pour chaque action de modération.

#### Scénario : Salon de logs configuré
- **QUAND** une action de modération se produit et que le `logChannelId` du serveur est défini
- **ALORS** le bot envoie un embed dans ce salon contenant : type d'action, acteur, cible, raison et horodatage

#### Scénario : Salon de logs non configuré
- **QUAND** une action de modération se produit et qu'aucun `logChannelId` n'est défini
- **ALORS** aucun message n'est envoyé et aucune erreur n'est levée
