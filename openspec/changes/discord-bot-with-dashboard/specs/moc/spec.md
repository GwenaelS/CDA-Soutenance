## Exigences AJOUTÉES

> **Note MPD** : La table `MOC_CHANNEL` stocke une ligne par salon configuré avec les colonnes : `moc_channel_id` (PK), `guild_id` (FK), `allow_files`, `allow_images`, `allow_videos`, `allow_links`, `allow_text` (booléens). Par défaut, tous les types sont autorisés lors de l'ajout d'un salon (l'admin configure ensuite les restrictions).

---

### Exigence : Les messages ne respectant pas les types autorisés sont supprimés dans les salons MOC
Dans les salons configurés comme Média-Only-Channel, le bot DOIT supprimer automatiquement tout message dont le contenu ne correspond pas aux types autorisés par la configuration du salon (RG-20).

#### Scénario : Message texte seul dans un salon MOC sans texte autorisé
- **QUAND** un utilisateur envoie un message texte sans pièce jointe dans un salon MOC où `allow_text = false`
- **ALORS** le message est supprimé et l'auteur reçoit un message éphémère expliquant que seuls les médias autorisés sont acceptés dans ce salon

#### Scénario : Message avec image dans un salon MOC autorisant les images
- **QUAND** un utilisateur envoie un message avec une image attachée dans un salon MOC où `allow_images = true`
- **ALORS** le message est conservé, quelle que soit la présence de texte d'accompagnement

#### Scénario : Message avec fichier dans un salon MOC interdisant les fichiers
- **QUAND** un utilisateur envoie un fichier (non-image, non-vidéo) dans un salon MOC où `allow_files = false`
- **ALORS** le message est supprimé et l'auteur reçoit un message éphémère

#### Scénario : Message avec lien dans un salon MOC interdisant les liens
- **QUAND** un utilisateur envoie un message contenant une URL dans un salon MOC où `allow_links = false`
- **ALORS** le message est supprimé et l'auteur reçoit un message éphémère

#### Scénario : Message avec lien d'image/vidéo embed dans un salon MOC autorisant les vidéos
- **QUAND** un utilisateur envoie un lien qui génère un embed image ou vidéo (ex. lien YouTube, Imgur) dans un salon MOC où `allow_videos = true`
- **ALORS** le message est conservé

#### Scénario : Salon non configuré comme MOC
- **QUAND** un utilisateur envoie un message dans un salon non présent dans `MOC_CHANNEL`
- **ALORS** aucune action MOC n'est prise

#### Scénario : Les bots sont exemptés des règles MOC
- **QUAND** un bot envoie un message dans un salon MOC
- **ALORS** le message n'est pas supprimé

---

### Exigence : Les admins peuvent configurer les salons MOC et leurs permissions via l'API
L'API DOIT exposer des endpoints pour ajouter, modifier et supprimer des salons de la liste MOC, protégés par les guards d'authentification.

#### Scénario : Ajout d'un salon MOC avec permissions par défaut
- **QUAND** un admin envoie `POST /api/guilds/{guildId}/moc-channels` avec `{ "channelId": "123456789" }`
- **ALORS** une ligne `MOC_CHANNEL` est créée en base avec tous les types autorisés par défaut (`allow_images = true`, `allow_videos = true`, `allow_files = true`, `allow_links = true`, `allow_text = true`) et le salon est immédiatement soumis aux règles MOC

#### Scénario : Modification des permissions d'un salon MOC
- **QUAND** un admin envoie `PATCH /api/guilds/{guildId}/moc-channels/{channelId}` avec `{ "allowText": false, "allowFiles": false }`
- **ALORS** les colonnes `allow_text` et `allow_files` sont mises à jour ; les règles s'appliquent immédiatement

#### Scénario : Suppression d'un salon MOC
- **QUAND** un admin envoie `DELETE /api/guilds/{guildId}/moc-channels/{channelId}`
- **ALORS** la ligne `MOC_CHANNEL` correspondante est supprimée et le salon redevient un salon textuel normal

#### Scénario : Listage des salons MOC
- **QUAND** un admin envoie `GET /api/guilds/{guildId}/moc-channels`
- **ALORS** la réponse contient tous les salons MOC du serveur avec leurs permissions configurées (`channelId`, `allowFiles`, `allowImages`, `allowVideos`, `allowLinks`, `allowText`)

#### Scénario : Salon déjà dans la liste MOC
- **QUAND** un admin tente d'ajouter un salon déjà présent dans la liste MOC
- **ALORS** l'API retourne 409 Conflict avec le message "Ce salon est déjà configuré comme MOC"

---

### Exigence : La liste des salons MOC est mise en cache en mémoire
Le bot DOIT maintenir un cache en mémoire de la liste des salons MOC (avec leurs permissions) par serveur pour éviter une requête DB à chaque message.

#### Scénario : Cache invalidé après modification via l'API
- **QUAND** un admin ajoute, modifie ou supprime un salon MOC via l'API
- **ALORS** le cache MOC en mémoire du bot est invalidé pour ce serveur ; le prochain message déclenchera un rechargement depuis la base

#### Scénario : Cache absent au premier message dans un salon
- **QUAND** le bot reçoit un message et que le cache MOC du serveur n'est pas encore chargé
- **ALORS** le bot charge la liste MOC depuis la DB (avec toutes les permissions), la met en cache, puis applique les règles MOC si nécessaire
