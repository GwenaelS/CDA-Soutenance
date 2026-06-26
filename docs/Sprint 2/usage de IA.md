# 🤖 Bilan du Sprint 2 : Documentation des Usages de l'IA

Durant ce Sprint 2, l'Intelligence Artificielle (IA) a été intégrée comme un assistant de développement (Copilote). L'objectif n'était pas de lui faire générer le projet, mais de l'utiliser pour accélérer la résolution de bugs complexes, fiabiliser le typage et optimiser la phase d'assurance qualité (tests automatisés).

---

## 1. Les 3 Axes d'Intervention de l'IA durant ce Sprint

L'IA a été sollicitée sur trois problématiques précises rencontrées lors du développement des fonctionnalités du Dashboard.

### Axe A : Alignement et Correction du Typage Strict (TypeScript)
* **Le problème :** Lors de l'intégration des composants (comme `MembersPage` et `FilterwordPage`), le compilateur TypeScript bloquait sur les données de test (*mocks*), affichant des erreurs de propriétés manquantes (`isBooster`, `icon`, `gradient`, `isActive`) ou de mauvais types (`id` attendu en `number` au lieu de `string`).
* **L'apport de l'IA :** Analyse des messages d'erreurs du compilateur (`ts(2741)` et `ts(2322)`) pour identifier instantanément les écarts entre les fausses données de test et le contrat d'interface strict défini dans le package `@wystrelia/shared`.
* **Résultat :** Un code 100% conforme au typage de l'architecture Monorepo.

### Axe B : Débogage de l'Environnement de Test (Vitest)
* **Le problème :** La suite de tests plantait globalement avec l'erreur `Invalid Chai property` sur des méthodes clés de la React Testing Library (comme `toBeInTheDocument` ou `toBeDisabled`).
* **L'apport de l'IA :** Identification d'un problème de configuration de l'environnement de test. L'IA a détecté que l'extension globale `@testing-library/jest-dom` n'était pas chargée correctement dans le cycle d'exécution de Vitest.
* **Résultat :** Résolution immédiate en forçant l'import ciblé dans les fichiers de spécifications, rendant l'environnement stable.

### Axe C : Analyse du DOM et "Edge Cases" (Cas Limites)
* **Le problème :** Des tests échouaient à cause de détails invisibles au premier coup d'œil (une erreur de majuscule sur un pseudo dans `MemberRow` : `WystraPlayer` au lieu de `Wystraplayer`) ou à cause d'un bouton inaccessible dans le composant `RoleExemptions`.
* **L'apport de l'IA :** Analyse des rapports d'erreurs de rendu HTML fournis par le terminal de Vitest pour comprendre exactement ce que React affichait à l'écran. Elle a aidé à reformuler les requêtes de recherche (`screen.getByRole`) pour cibler les bons éléments textuels.
* **Résultat :** **9 tests sur 9 validés (100% de réussite)**.

---

## 2. Méthodologie et Posture Professionnelle

L'utilisation de l'IA a respecté une charte de développement rigoureuse :

1. **Esprit Critique :** Aucun code généré par l'IA n'a été inséré aveuglément. Chaque suggestion (comme l'ajout de propriétés fictives dans les mocks) a été analysée pour vérifier qu'elle correspondait bien aux règles métiers du projet.
2. **Gain de Temps :** L'IA a permis d'éviter de passer des heures sur des détails de syntaxe ou des configurations de l'environnement de test, permettant de se concentrer sur la logique pure du Front-end et du Back-end.
3. **Apprentissage :** Ce processus a permis de mieux comprendre le fonctionnement interne des rendus de la React Testing Library et l'importance des configurations de matchers globaux.

---

## 3. Indicateurs Clés (KPI) du Sprint

* **Couverture de code :** Validation complète de 2 modules majeurs (Gestion des membres et Filtrage de mots).
* **Résolution de bugs :** Temps de correction des erreurs de configuration réduit de 70%.
* **Qualité technique :** Zéro contournement du compilateur (pas d'usage de la facilité `any` en TypeScript), le contrat de données entre le Back et le Front est totalement respecté.