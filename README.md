# Plateforme Eduka

Plateforme de gestion de formations techniques pour écoles supérieures (L2 à M2).

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Lancement du serveur de développement

```bash
ng serve
```

L'application sera accessible sur `http://localhost:4200/`

## 👥 Comptes de test

La plateforme utilise des données JSON mockées. Voici les comptes disponibles :

### 🎓 Formateurs

| Email | Rôle | Profil |
|-------|------|--------|
| `sophie.martin@email.com` | Formateur | 45 missions, note 4.8/5 |
| `jean.dupont@email.com` | Formateur | 32 missions, note 4.6/5 |
| `marie.bernard@email.com` | Formateur | 28 missions, note 4.9/5 |

### 👨‍💼 Administrateur

| Email | Rôle |
|-------|------|
| `admin@eduka.fr` | Administrateur |

> **Note** : Il n'y a pas de mot de passe pour le moment (authentification simulée). Il suffit de saisir l'email pour se connecter.

## 🎯 Fonctionnalités

### Pour les Formateurs
- 📅 **Calendrier** : Vue d'ensemble des missions planifiées
- 📋 **Propositions** : Consulter et postuler aux missions disponibles
- 📝 **Missions** : Gérer ses missions en cours et à venir
- 💶 **Factures** : Créer et gérer ses factures
- 👤 **Profil** : Gérer ses informations, compétences et documents
- 📚 **Historique** : Consulter l'historique des missions terminées
- 💬 **Contact** : Contacter l'équipe support

### Pour les Administrateurs
- 📊 **Dashboard** : Vue d'ensemble avec KPIs et statistiques
- 👥 **Formateurs** : Gestion des formateurs
- 🏫 **Écoles** : Gestion des écoles partenaires
- 📢 **Propositions** : Création et gestion des propositions de missions

## 🛠️ Technologies

- **Angular 20** - Framework frontend (Standalone Components)
- **TypeScript** - Langage
- **Tailwind CSS v3** - Framework CSS
- **RxJS** - Gestion réactive
- **Signals** - Gestion d'état
- **jsPDF** - Génération de PDF


## 📁 Structure du projet

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Interfaces TypeScript
│   │   ├── services/        # Services (Mission, Proposition, Auth, etc.)
│   │   └── layout/          # Layout principal avec navigation
│   └── features/
│       ├── calendar/        # Page calendrier
│       ├── propositions/    # Page propositions
│       ├── missions/        # Page missions
│       ├── invoices/        # Page factures
│       ├── profile/         # Page profil
│       ├── history/         # Page historique
│       ├── contact/         # Page contact
│       └── admin/           # Pages admin
│           ├── dashboard/
│           ├── trainers/
│           ├── schools/
│           └── proposals/
└── public/
    └── assets/
        ├── data/            # Fichiers JSON mockés
        └── logos/           # Logos des écoles

```

## 📊 Données mockées

Les données sont stockées dans `/public/assets/data/` :
- `users.json` - Utilisateurs (formateurs et admin)
- `cours.json` - Cours techniques (Dev, Cybersécurité, DevOps, Cloud, Infrastructure)
- `missions.json` - Missions planifiées et terminées
- `propositions.json` - Propositions de missions disponibles
- `factures.json` - Factures des formateurs
- `ecoles.json` - Écoles partenaires
- `classes.json` - Classes (L2 à M2)
- `notifications.json` - Notifications

## 🎨 Thème et Design

La plateforme utilise :
- Couleur principale : Orange Eduka (`#FF6B35` / `eduka-orange`)
- Design moderne avec Tailwind CSS
- Interface responsive
- Icônes SVG Heroicons

## 📝 Développement

### Générer un composant

```bash
ng generate component features/nom-composant
```

### Build de production

```bash
ng build
```

Les fichiers de build seront dans le dossier `dist/`.

## 🔄 Changer d'utilisateur

Pour tester avec différents comptes :

1. Déconnectez-vous (si implémenté)
2. Utilisez l'un des emails listés ci-dessus
3. Chaque email donne accès à un profil différent avec ses propres données

**Exemples de test :**
- Testez avec `sophie.martin@email.com` pour voir un formateur expérimenté
- Testez avec `admin@eduka.fr` pour accéder au dashboard administrateur

## 🐛 Support

Pour toute question ou problème :
- Email : support@eduka.fr
- Téléphone : +33 1 42 42 42 42

## 📄 Licence

Projet éducatif - Tous droits réservés
