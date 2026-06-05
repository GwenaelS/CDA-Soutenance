## Exigences AJOUTÉES

### Exigence : Les messages ne contenant pas de médias sont supprimés dans les salons MOC
Dans les salons configurés comme Média-Only-Channel, le bot DOIT supprimer automatiquement tout message ne contenant ni pièce jointe ni embed image/vidéo.

#### Scénario : Message texte seul dans un salon MOC
- **QUAND** un utilisateur envoie un message texte sans aucune pièce jointe dans un salon configuré comme MOC
- **ALORS** le message est supprimé et l'auteur reçoit un message éphémère expliquant que seuls les médias sont autorisés dans ce salon

#### Scénario : Message avec image dans un salon MOC
- **QUAND** un utilisateur envoie un message avec une image ou une vidéo attachée dans un salon MOC
- **ALORS** le message est conservé, quelle que soit la présence de texte

#### Scénario : Message avec lien d'image/vidéo embed dans un salon MOC
- **QUAND** un utilisateur envoie un lien qui génère un embed image ou vidéo (ex. lien YouTube, Imgur)
- **ALORS** le message est conservé

#### Scénario : Salon non configuré comme MOC
- **QUAND** un utilisateur envoie un message texte dans un salon non présent dans `MocChannel`
- **ALORS** aucune action MOC n'est prise

#### Scénario : Les bots sont exemptés des règles MOC
- **QUAND** un bot envoie un message texte dans un salon MOC
- **ALORS** le message n'est pas supprimé

---

### Exigence : Les admins peuvent configurer les salons MOC via l'API
L'API DOIT exposer des endpoints pour ajouter et supprimer des salons de la liste MOC, protégés par les guards d'authentification.

#### Scénario : Ajout d'un salon MOC
- **QUAND** un admin envoie `POST /api/guilds/{guildId}/moc-channels` avec `{ "channelId": "123456789" }`
- **ALORS** une ligne `MocChannel` est créée en base et le salon est immédiatement soumis aux règles MOC

#### Scénario : Suppression d'un salon MOC
- **QUAND** un admin envoie `DELETE /api/guilds/{guildId}/moc-channels/{channelId}`
- **ALORS** la ligne `MocChannel` correspondante est supprimée et le salon redevient un salon textuel normal

#### Scénario : Listage des salons MOC
- **QUAND** un admin envoie `GET /api/guilds/{guildId}/moc-channels`
- **ALORS** la réponse contient tous les `channelId` configurés comme MOC pour ce serveur

#### Scénario : Salon déjà dans la liste MOC
- **QUAND** un admin tente d'ajouter un salon déjà présent dans la liste MOC
- **ALORS** l'API retourne 409 Conflict avec le message "Ce salon est déjà configuré comme MOC"

---

### Exigence : La liste des salons MOC est mise en cache en mémoire
Le bot DOIT maintenir un cache en mémoire de la liste des salons MOC par serveur pour éviter une requête DB à chaque message.

#### Scénario : Cache invalidé après modification via l'API
- **QUAND** un admin ajoute ou supprime un salon MOC via l'API
- **ALORS** le cache MOC en mémoire du bot est invalidé pour ce serveur ; le prochain message déclenchera un rechargement depuis la base

#### Scénario : Cache absent au premier message dans un salon
- **QUAND** le bot reçoit un message et que le cache MOC du serveur n'est pas encore chargé
- **ALORS** le bot charge la liste MOC depuis la DB, la met en cache, puis applique les règles MOC si nécessaire
