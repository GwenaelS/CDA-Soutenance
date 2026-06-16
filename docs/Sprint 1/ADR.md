# Documentation des décisions techniques et d’architecture (ADR) — Wystrelia's Bot

Ce registre centralise, formalise et justifie l'ensemble des arbitrages technologiques et structurels retenus pour le projet Wystrelia. Il fait le lien direct entre les exigences métiers, l'architecture logicielle et le Modèle Physique des Données (MPD).

## 6.1 ADR-01 : Centralisation des configurations par Guilde (Structure Étoile)

* **Statut** : Accepté.
* **Contexte** : Le bot doit gérer plusieurs serveurs Discord de manière totalement étanche.
* **Décision** : Architecture de données en structure étoile où la table `GUILD` sert de pivot central. Toutes les tables de configuration gravitent autour d'elle via une clé étrangère `guild_id`.
* **Conséquences** :
* *Avantages* : Isolation parfaite entre les serveurs et chargement instantané de la configuration. Ajout simplifié de nouvelles fonctionnalités.
* *Inconvénients* : Nécessite des `ON DELETE CASCADE` rigoureux dans TypeORM pour éviter les données orphelines.

## 6.2 ADR-02 : Typage des Identifiants Discord (Le choix du BigInt)

* **Statut** : Accepté.
* **Contexte** : Nécessité de stocker les "Snowflakes" de Discord (64 bits) dans MySQL.
* **Décision** : Utilisation systématique du type `BIGINT` dans MySQL pour tous les identifiants natifs Discord.
* **Conséquences** :
* *Avantages* : Performances optimales d'indexation et de jointure.
* *Inconvénients* : Vigilance requise dans NestJS/TypeScript (manipulation via `BigInt` ou `string`) pour éviter les erreurs d'arrondi côté frontend.

## 6.3 ADR-03 : Clés Primaires Techniques vs Clés Composites (MEMBER)

* **Statut** : Accepté.
* **Contexte** : Gestion de la persistance des données membre malgré les départs du serveur (RG-25).
* **Décision** : Implémentation d'une clé primaire technique `member_id` (Auto-Increment) plutôt qu'une clé composite.
* **Conséquences** :
* *Avantages* : Schéma relationnel simplifié, facilitant le mapping TypeORM et les tables enfants (`MUTE`, `WARNING`, etc.).
* *Inconvénients* : Nécessité d'un index unique manuel sur le couple `(discord_user_id, guild_id)` pour garantir l'intégrité.

## 6.4 ADR-04 : Architecture de l'Auto-Modération (Mise en Cache Active)

* **Statut** : Accepté.
* **Contexte** : Respect de la contrainte de performance (analyse en moins de 2 secondes).
* **Décision** : Stratégie de mise en cache en mémoire vive (In-Memory) des configurations et des mots interdits.
* **Conséquences** :
* *Avantages* : Temps de réponse proche de 0 ms.
* *Inconvénients* : Consommation de RAM légèrement accrue sur le serveur.

## 6.5 ADR-05 : Typage strict et Intégrité des flux (L'usage des ENUM)

* **Statut** : Accepté.
* **Contexte** : Nécessité d'éviter les incohérences de données sur les types d'événements.
* **Décision** : Utilisation du type `ENUM` dans les tables `LOGS` et `CHANNEL_LOG`.
* **Conséquences** :
* *Avantages* : Intégrité des données garantie par le SGBD et optimisation de l'espace de stockage.
* *Inconvénients* : Toute nouvelle fonctionnalité nécessite une migration SQL (`ALTER TABLE`).

## 6.6 ADR-06 : Découplage de l'historique et du routage des Logs

* **Statut** : Accepté.
* **Contexte** : Besoin de flexibilité pour router les logs tout en conservant un historique immuable.
* **Décision** : Séparation entre la table `LOGS` (données immuables) et `CHANNEL_LOG` (liaison dynamique).
* **Conséquences** :
* *Avantages* : Modification des paramètres de salon sans altérer l'historique des actions passées.
* *Inconvénients* : Nécessite une double opération (écriture dans `LOGS` + lecture dans `CHANNEL_LOG`).

## 6.7 ADR-07 : Choix du Backend Unique (Monolithe Modulaire)

* **Statut** : Accepté.
* **Contexte** : Besoin de gérer simultanément une API REST et un flux WebSocket.
* **Décision** : Centralisation de la logique métier au sein d'une seule application NestJS structurée en modules.
* **Conséquences** :
* *Avantages* : Partage simplifié de la couche d'accès aux données et réduction de la complexité infrastructurelle.
* *Inconvénients* : Risque de propagation d'une erreur critique du bot vers l'API (nécessite une gestion rigoureuse des exceptions).