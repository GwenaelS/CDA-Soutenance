## Exigences AJOUTÉES

> **Note MPD** : Deux tables distinctes gèrent l'historique des actions :
> - `LOGS` : immuable, enregistre toutes les actions (KICK, BAN, TIMEOUT, WARN, UNWARN, LOCK, UNLOCK, CLEAR, SERVER_MUTE, SERVER_UNMUTE, AUTOMOD). Colonnes : `id`, `guild_id`, `target_id`, `author_id`, `type` (ENUM action-level), `reason`, `datetime`.
> - `WARNING` : mutable, gère uniquement les avertissements actifs/levés via `is_active`. Les lignes `WARNING` ne sont jamais supprimées mais leur statut peut changer.
>
> Le routing Discord des embeds de log est géré par la table `CHANNEL_LOG` (`type` catégorie-level : MODERATION / AUTOMOD / XP / SYSTEM) et par `GUILD_CONFIG.all_log_channel_id` (salon global tout-en-un).

---

### Exigence : Chaque action de modération écrit une entrée d'audit
Le système DOIT persister une ligne `LOGS` pour chaque action de modération (KICK, BAN, UNBAN, TIMEOUT, UNTIMEOUT, WARN, UNWARN, LOCK, UNLOCK, CLEAR) avant que l'action Discord ne se termine.

#### Scénario : Entrée créée sur un ban
- **QUAND** une commande `/ban` est exécutée avec succès
- **ALORS** une ligne `LOGS` existe avec `type = BAN`, `guild_id`, `author_id` (modérateur), `target_id`, `reason` et `datetime`

#### Scénario : L'API Discord échoue après l'écriture de l'entrée d'audit
- **QUAND** l'appel API Discord échoue après que l'entrée `LOGS` est déjà écrite
- **ALORS** la ligne `LOGS` reste en base et le modérateur est informé de l'échec côté Discord

---

### Exigence : Les server mutes manuels sont détectés et loggés
Le bot DOIT détecter les server mutes et unmutes appliqués manuellement via l'interface Discord et les enregistrer dans `LOGS`.

#### Scénario : Server mute détecté
- **QUAND** `voiceStateUpdate` est reçu avec `oldState.serverMute = false` et `newState.serverMute = true`
- **ALORS** une ligne `LOGS` de type `SERVER_MUTE` est écrite avec `author_id = null` (acteur inconnu) et un embed est posté dans le salon de catégorie MODERATION si configuré

#### Scénario : Server unmute détecté
- **QUAND** `voiceStateUpdate` est reçu avec `oldState.serverMute = true` et `newState.serverMute = false`
- **ALORS** une ligne `LOGS` de type `SERVER_UNMUTE` est écrite

---

### Exigence : L'audit log est queryable par serveur, acteur, cible et type d'action
L'API DOIT exposer un endpoint pour lister les entrées de `LOGS` d'un serveur, filtrables par `author_id`, `target_id` et `type`.

#### Scénario : Lister les entrées récentes d'un serveur
- **QUAND** une requête GET est envoyée à `/api/guilds/{guildId}/audit-log`
- **ALORS** la réponse contient les 25 lignes `LOGS` les plus récentes pour ce serveur, ordonnées par `datetime` décroissant

#### Scénario : Filtrer par utilisateur ciblé
- **QUAND** la requête inclut `?targetId=123456789`
- **ALORS** seules les entrées correspondant à ce `target_id` sont retournées

#### Scénario : Filtrer par type d'action
- **QUAND** la requête inclut `?action=BAN`
- **ALORS** seules les entrées de type BAN sont retournées

#### Scénario : Pagination
- **QUAND** la requête inclut `?page=2`
- **ALORS** les 25 entrées suivantes (décalage de 25) sont retournées

---

### Exigence : Les entrées de LOGS ne sont jamais supprimées ni modifiées
Le système DOIT traiter les entrées `LOGS` comme des enregistrements immuables en ajout uniquement ; aucune opération DELETE ou UPDATE n'est autorisée sur ces lignes (RG-12).

#### Scénario : Tentative de suppression d'une entrée
- **QUAND** un chemin de code tente de supprimer une ligne `LOGS`
- **ALORS** l'opération est rejetée — aucune route API DELETE n'existe pour les entrées individuelles

_Note : `/unwarn` ne supprime pas la ligne `LOGS` de type WARN. Il met `WARNING.is_active` à `false` et écrit une nouvelle ligne `LOGS` de type UNWARN. L'entrée WARN originale est conservée pour la traçabilité._

---

### Exigence : Les embeds de log sont postés dans les salons configurés
Pour chaque action de modération, le bot DOIT poster un embed dans deux salons si configurés : le salon de catégorie correspondant (via `CHANNEL_LOG`) et le salon global `all_log_channel_id` (RG-14).

#### Scénario : Salon de catégorie configuré
- **QUAND** une action de type MODERATION se produit et que `CHANNEL_LOG` a un `channel_id` pour la catégorie MODERATION
- **ALORS** le bot envoie un embed dans ce salon contenant : type d'action, auteur, cible, raison et horodatage

#### Scénario : Salon global all_logs configuré
- **QUAND** une action de modération se produit et que `GUILD_CONFIG.all_log_channel_id` est défini
- **ALORS** le bot envoie également un embed dans ce salon, quelle que soit la catégorie de l'action

#### Scénario : Aucun salon de logs configuré
- **QUAND** une action de modération se produit et qu'aucun salon n'est configuré (ni catégorie ni global)
- **ALORS** aucun message n'est envoyé et aucune erreur n'est levée
