# Documentation du schéma relationnel et mapping TypeORM — Wystrelia's Bot

Ce document détaille les spécifications techniques du schéma relationnel issues du Modèle Physique des Données (MPD) et formalise leur implémentation logicielle à travers l'ORM TypeORM sous NestJS.

## 7.1 Principes Directeurs du Mapping Technique

Pour transcrire fidèlement le MPD au sein de l'architecture applicative, les règles de typage suivantes ont été appliquées de bout en bout :

- **Gestion des Identifiants Discord (`BigInt`)** : Dans MySQL, les _Snowflakes_ de Discord sont stockés en `BigInt`. Afin d'éviter la perte de précision en JavaScript (limité à $2^{53}-1$), TypeORM est configuré avec l'option `type: 'bigint'`. Ces champs sont récupérés et manipulés sous forme de chaînes de caractères (`string`) au niveau du code pour sécuriser le transit JSON.
- **Clés Primaires Auto-Incrémentées (PK AI)** : Toutes les tables secondaires et de configuration possèdent une clé primaire technique standard gérée via le décorateur `@PrimaryGeneratedColumn()`.
- **Contraintes et Types Spécifiques** : Les indicateurs booléens du MPD sont mappés en `type: 'boolean'`. Les statuts fixes (tables `LOGS` et `CHANNEL_LOG`) utilisent les énumérations TypeScript natives mappées en `type: 'enum'` dans MySQL.

---

## 7.2 Spécifications Détaillées des Entités

### 7.2.1 Le Pivot Central : `Guild` (Table GUILD)

L'entité `Guild` représente le cœur de la structure en étoile. Sa clé primaire est le `guild_id` (identifiant unique fourni par Discord).

```typescript
@Entity("guild")
export class Guild {
  // Snowflake Discord = clé naturelle, fournie par Discord (pas auto-générée)
  @PrimaryColumn({ type: "bigint", unsigned: true })
  guild_id!: string;

  @Column({ type: "varchar", length: 100 })
  guild_name!: string;

  // ------------- Relations 1,1 -------------
  @OneToOne(() => Guild_config, (guildConfig) => guildConfig.guild)
  guild_config!: Guild_config;

  @OneToOne(() => Level_config, (levelConfig) => levelConfig.guild)
  level_config!: Level_config;

  // ------------- Relations 1,n -------------
  @OneToMany(() => Level_reward, (levelReward) => levelReward.guild)
  level_rewards!: Level_reward[];

  @OneToMany(() => Member, (member) => member.guild)
  members!: Member[];

  @OneToMany(() => Log, (log) => log.guild)
  logs!: Log[];

  @OneToMany(() => Channel_log, (channelLog) => channelLog.guild)
  channelLogs!: Channel_log[];

  @OneToMany(() => Filtered_word, (filteredWord) => filteredWord.guild)
  filtered_words!: Filtered_word[];

  @OneToMany(() => Exempted_role, (exemptedRole) => exemptedRole.guild)
  exempted_roles!: Exempted_role[];

  @OneToMany(() => Automatic_role, (automaticRole) => automaticRole.guild)
  automatic_roles!: Automatic_role[];

  @OneToMany(() => Moc_channel, (mocChannel) => mocChannel.guild)
  moc_channels!: Moc_channel[];

  @OneToMany(() => Embed, (embed) => embed.guild)
  embeds!: Embed[];

  @OneToMany(() => Twitch, (twitch) => twitch.guild)
  twitch_channels!: Twitch[];
}
```

### 7.2.2 Le Partitionnement Utilisateur : `Member` (Table MEMBER)

Matérialise la relation "CONTIENT". Elle utilise une clé primaire technique auto-incrémentée et isole la progression de l'utilisateur par serveur.

```typescript
@Entity("member")
export class Member {
  @PrimaryGeneratedColumn()
  member_id!: number;

  @Column({ type: "bigint", unsigned: true })
  discord_user_id!: string;

  @Column({ type: "int", default: 0 })
  current_xp!: number;

  @Column({ type: "int", default: 0 })
  current_level!: number;

  @Column({ type: "datetime", nullable: true })
  last_xp_at!: Date;

  @Column({ type: "datetime" })
  joined_at!: Date;

  @Column({ type: "datetime", nullable: true })
  left_at!: Date;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.members)
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;

  // ------------- Relations X,X -------------
  @OneToMany(() => Mute, (mute) => mute.member)
  mutes!: Mute[];

  @OneToMany(() => Warning, (warning) => warning.member)
  warnings!: Warning[];

  @OneToMany(() => Birthday, (birthday) => birthday.member)
  birthdays!: Mute[] | null;
}
```

### 7.2.3 Auto-Modération : `FilteredWord` (Table FILTERED_WORD)

Exemple de table satellite de configuration avec suppression en cascade.

```typescript
@Entity("filtered_word")
export class Filtered_word {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  word!: string;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.filtered_words)
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
```

### 7.2.4 Historique : `Logs` (Table LOGS)

Utilisation conjointe de `BigInt` (pour les IDs Discord externes) et d'un `ENUM` physique pour le typage des actions.

```typescript
export enum LogType {
  WARN = "warn",
  UNWARN = "unwarn",
  MUTE = "mute",
  UNMUTE = "unmute",
  TIMEOUT = "timeout",
  UNTIMEOUT = "untimeout",
  KICK = "kick",
  BAN = "ban",
  UNBAN = "unban",
  CLEAR = "clear",
  LOCK = "lock",
  UNLOCK = "unlock",
}

@Entity("log")
export class Log {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "bigint", unsigned: true })
  target_id!: string;

  @Column({ type: "bigint", unsigned: true })
  author_id!: string;

  @Column({ type: "enum", enum: LogType })
  type!: LogType;

  @Column({ type: "varchar", length: 255 })
  reason!: string;

  @Column({ type: "datetime" })
  datetime!: Date;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.logs)
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
```

### 7.2.5 Filtrage des Salons : `MocChannel` (Table MOC_CHANNEL)

Traduction des types `Bool` du MPD en colonnes `boolean` gérées par TypeORM.

```typescript
@Entity("moc_channel")
export class Moc_channel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "bigint", unsigned: true })
  moc_channel_id!: string;

  @Column({ type: "boolean" })
  allow_files!: boolean;

  @Column({ type: "boolean" })
  allow_images!: boolean;

  @Column({ type: "boolean" })
  allow_videos!: boolean;

  @Column({ type: "boolean" })
  allow_links!: boolean;

  @Column({ type: "boolean" })
  allow_text!: boolean;

  // ------------- Relations n,1 -------------
  @ManyToOne(() => Guild, (guild) => guild.moc_channels)
  @JoinColumn({ name: "guild_id" })
  guild!: Guild;
}
```

---

## 7.3 Résumé de la Correspondance des Types

| Concept Métier     | Type Physique (MySQL) | Type Applicatif (TS) | Rôle & Justification                       |
| ------------------ | --------------------- | -------------------- | ------------------------------------------ |
| **IDs Discord**    | `BigInt`              | `string`             | Performance SQL sans perte de précision JS |
| **Clés Primaires** | `Int AUTO_INC`        | `number`             | Indexation automatisée                     |
| **Toggles**        | `Bool`                | `boolean`            | Filtrage binaire léger                     |
| **Catégories**     | `ENUM`                | `enum` TS            | Intégrité forcée par le SGBD               |
| **Horodatages**    | `Datetime`            | `Date`               | Précision temporelle native                |
