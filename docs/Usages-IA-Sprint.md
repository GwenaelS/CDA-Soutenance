# Usages de l'IA dans le sprint — Wystrelia's Bot

## Ce que j'attends de l'IA

J'utilise un assistant de code (LLM) tout au long du projet, mais avec une règle simple : **l'IA propose, je décide.** Rien n'entre dans le code sans que je l'aie lu, compris et testé. L'IA me fait gagner du temps sur le code répétitif et la doc, pas sur les choix qui engagent le projet.

Elle n'a aucun accès aux secrets (`.env`), à la base de données ni à l'API Discord de prod. Elle travaille sur le code et les fichiers de specs, sous mon contrôle.

## Comment ça s'intègre au workflow

Je travaille en Spec-Driven Development avec OpenSpec, donc l'IA intervient à des moments précis plutôt qu'au fil de l'eau :

- **Explore** — je réfléchis avec elle, je compare des options (par ex. NestJS vs Express), sans écrire de code. Les choix vont dans `design.md`.
- **Propose** — elle rédige un premier jet des specs (`proposal`, `design`, `tasks`), que je relis et corrige.
- **Apply** — elle implémente les tâches une par une ; je relis et teste chaque incrément avant de continuer.
- **Sync / Archive** — on remet les specs à jour et on clôture le changement.

L'idée, c'est que la spec passe toujours avant le code : l'IA implémente quelque chose de validé, elle n'improvise pas.

## Un exemple concret : l'auto-modération

Pour la capacité `auto-moderation` (suppression auto de mots interdits, spam, liens, invitations), voilà comment ça s'est passé.

En phase d'exploration, je lui ai demandé dans quel ordre évaluer les règles sur un handler `messageCreate`. Elle a proposé de vérifier les rôles exemptés en premier et m'a alerté sur le coût d'un rechargement de config à chaque message — d'où l'idée d'un cache par serveur, que j'ai retenue.

À l'implémentation, j'ai dû corriger deux choses qu'elle avait laissées passer : le filtre de mots interdits déclenchait sur « class » à cause du mot « ass » (j'ai documenté la limite), et l'anti-spam laissait fuir de la mémoire. Au départ elle voulait aussi recharger la config depuis MySQL à chaque message — j'ai imposé le cache et fait régénérer le code. Sans la relecture, ça serait passé tel quel avec un vrai impact perf.

## Ce que je retiens

L'IA est rapide mais le code généré *semble* toujours correct : seuls les tests et la relecture révèlent les défauts. Elle pousse aussi vers des solutions « standard » parfois surdimensionnées (multi-tenant, temps réel) alors que mon bot est mono-serveur auto-hébergé — d'où l'importance d'écrire les non-objectifs noir sur blanc.

Au final je la vois comme un assistant encadré par une méthode, pas comme un générateur de code. Je reste l'auteur et le responsable du projet ; son usage est documenté, relu et réversible.
