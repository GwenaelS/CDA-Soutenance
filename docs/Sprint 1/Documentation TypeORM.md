# Documentation du schéma relationnel et mapping TypeORM — Wystrelia's Bot

Ce document détaille les spécifications techniques du schéma relationnel issues du Modèle Physique des Données (MPD) et formalise leur implémentation logicielle à travers l'ORM TypeORM sous NestJS.

## 7.1 Principes Directeurs du Mapping Technique

Pour transcrire fidèlement le MPD au sein de l'architecture applicative, les règles de typage suivantes ont été appliquées de bout en bout :

* **Gestion des Identifiants Discord (`BigInt`)** : Dans MySQL, les *Snowflakes* de Discord sont stockés en `BigInt`. Afin d'éviter la perte de précision en JavaScript (limité à $2^{53}-1$), TypeORM est configuré avec l'option `type: 'bigint'`. Ces champs sont récupérés et manipulés sous forme de chaînes de caractères (`string`) au niveau du code pour sécuriser le transit JSON.
* **Clés Primaires Auto-Incrémentées (PK AI)** : Toutes les tables secondaires et de configuration possèdent une clé primaire technique standard gérée via le décorateur `@PrimaryGeneratedColumn()`.
* **Contraintes et Types Spécifiques** : Les indicateurs booléens du MPD sont mappés en `type: 'boolean'`. Les statuts fixes (tables `LOGS` et `CHANNEL_LOG`) utilisent les énumérations TypeScript natives mappées en `type: 'enum'` dans MySQL.

---

## 7.2 Spécifications Détaillées des Entités

### 7.2.1 Le Pivot Central : `Guild` (Table GUILD)

L'entité `Guild` représente le cœur de la structure en étoile. Sa clé primaire est le `guild_id` (identifiant unique fourni par Discord).

```typescript
@Entity('GUILD')
export class Guild {
    @PrimaryColumn({ type: 'bigint', unique: true })
    guild_id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    guild_name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    guild_picture: string;

    @OneToMany(() => Member, (member) => member.guild)
    members: Member[];

    @OneToMany(() => FilteredWord, (word) => word.guild)
    filteredWords: FilteredWord[];

    @OneToOne(() => GuildConfig, (config) => config.guild)
    config: GuildConfig;
}

```

### 7.2.2 Le Partitionnement Utilisateur : `Member` (Table MEMBER)

Matérialise la relation "CONTIENT". Elle utilise une clé primaire technique auto-incrémentée et isole la progression de l'utilisateur par serveur.

```typescript
@Entity('MEMBER')
export class Member {
    @PrimaryGeneratedColumn({ type: 'int' })
    member_id: number;

    @Column({ type: 'bigint', nullable: false })
    discord_user_id: string;

    @Column({ type: 'int', default: 0 })
    current_xp: number;

    @Column({ type: 'int', default: 1 })
    current_level: number;

    @ManyToOne(() => Guild, (guild) => guild.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'guild_id' })
    guild: Guild;
}

```

### 7.2.3 Auto-Modération : `FilteredWord` (Table FILTERED_WORD)

Exemple de table satellite de configuration avec suppression en cascade.

```typescript
@Entity('FILTERED_WORD')
export class FilteredWord {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    word: string;

    @ManyToOne(() => Guild, (guild) => guild.filteredWords, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'guild_id' })
    guild: Guild;
}

```

### 7.2.4 Historique : `Logs` (Table LOGS)

Utilisation conjointe de `BigInt` (pour les IDs Discord externes) et d'un `ENUM` physique pour le typage des actions.

```typescript
export enum LogType {
    MODERATION = 'MODERATION', AUTOMOD = 'AUTOMOD', XP = 'XP', SYSTEM = 'SYSTEM'
}

@Entity('LOGS')
export class Logs {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'enum', enum: LogType, nullable: false })
    type: LogType;

    @ManyToOne(() => Guild, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'guild_id' })
    guild: Guild;
}

```

### 7.2.5 Filtrage des Salons : `MocChannel` (Table MOC_CHANNEL)

Traduction des types `Bool` du MPD en colonnes `boolean` gérées par TypeORM.

```typescript
@Entity('MOC_CHANNEL')
export class MocChannel {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'boolean', default: false })
    allow_files: boolean;
    
    // ... autres colonnes boolean
}

```

---

## 7.3 Résumé de la Correspondance des Types

| Concept Métier | Type Physique (MySQL) | Type Applicatif (TS) | Rôle & Justification |
| --- | --- | --- | --- |
| **IDs Discord** | `BigInt` | `string` | Performance SQL sans perte de précision JS |
| **Clés Primaires** | `Int AUTO_INC` | `number` | Indexation automatisée |
| **Toggles** | `Bool` | `boolean` | Filtrage binaire léger |
| **Catégories** | `ENUM` | `enum` TS | Intégrité forcée par le SGBD |
| **Horodatages** | `Datetime` | `Date` | Précision temporelle native |