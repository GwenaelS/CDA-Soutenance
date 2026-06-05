## Exigences AJOUTÉES

### Exigence : Les admins peuvent enregistrer les anniversaires des membres
Le système DOIT permettre d'enregistrer la date d'anniversaire (mois et jour) de chaque membre par serveur via l'API.

#### Scénario : Ajout d'un anniversaire
- **QUAND** un admin envoie `POST /api/guilds/{guildId}/birthdays` avec `{ "userId": "123456789", "month": 3, "day": 15 }`
- **ALORS** une ligne `Birthday` est créée en base ; si une entrée existe déjà pour cet utilisateur dans ce serveur, elle est mise à jour

#### Scénario : Suppression d'un anniversaire
- **QUAND** un admin envoie `DELETE /api/guilds/{guildId}/birthdays/{userId}`
- **ALORS** la ligne `Birthday` correspondante est supprimée

#### Scénario : Validation des dates
- **QUAND** un admin fournit un mois hors plage (< 1 ou > 12) ou un jour invalide pour le mois
- **ALORS** l'API retourne 422 Unprocessable Entity avec un message de validation explicite

#### Scénario : Listage des anniversaires du serveur
- **QUAND** un admin envoie `GET /api/guilds/{guildId}/birthdays`
- **ALORS** la réponse contient tous les anniversaires enregistrés pour ce serveur, ordonnés par mois puis jour

---

### Exigence : Le bot envoie automatiquement un message d'anniversaire chaque jour
Un job cron s'exécutant à minuit UTC DOIT vérifier les anniversaires du jour et envoyer un embed dans le salon configuré pour chaque serveur concerné.

#### Scénario : Anniversaire détecté le bon jour
- **QUAND** le cron s'exécute et que la date courante (UTC) correspond au `month` et `day` d'une entrée `Birthday`
- **ALORS** un embed d'anniversaire est envoyé dans `GuildConfig.birthdayChannelId` du serveur concerné, mentionnant le membre

#### Scénario : Plusieurs anniversaires le même jour
- **QUAND** plusieurs membres ont leur anniversaire le même jour dans le même serveur
- **ALORS** un message séparé est envoyé pour chaque membre (ou un message groupé si plusieurs membres partagent exactement la même date)

#### Scénario : Salon d'anniversaires non configuré
- **QUAND** le cron détecte un anniversaire mais que `GuildConfig.birthdayChannelId` est null
- **ALORS** aucun message n'est envoyé et aucune erreur n'est levée ; le bot logue un avertissement

#### Scénario : Le bot n'a pas la permission d'écrire dans le salon d'anniversaires
- **QUAND** le bot tente d'envoyer le message mais n'a pas la permission Send Messages dans `birthdayChannelId`
- **ALORS** l'erreur est loguée et le bot continue le cron pour les autres serveurs sans crash

---

### Exigence : Le cron quotidien démarre au lancement du bot
Le job cron d'anniversaires DOIT être initialisé dans `src/index.ts` et s'exécuter automatiquement chaque jour à minuit UTC sans intervention manuelle.

#### Scénario : Démarrage du bot
- **QUAND** le processus bot démarre avec succès
- **ALORS** le cron d'anniversaires est enregistré et le bot logue "Cron d'anniversaires initialisé (quotidien, 00:00 UTC)"

#### Scénario : Redémarrage du bot entre minuit et l'exécution du cron
- **QUAND** le bot redémarre après minuit UTC mais que le cron du jour n'a pas encore été exécuté
- **ALORS** le cron s'exécutera à la prochaine occurrence de minuit UTC ; les anniversaires du jour seront envoyés le lendemain
