# 🚀 Étapes de déploiement sur GitHub Pages

## ✅ Configuration terminée

Votre projet est maintenant configuré pour Angular 20+ et GitHub Pages !

### 📋 Ce qui a été fait

1. ✅ **Angular 20.3.12** - Vous avez déjà la dernière version
2. ✅ **angular-cli-ghpages** installé
3. ✅ Fichier `.nojekyll` créé
4. ✅ GitHub Actions workflow configuré (`.github/workflows/deploy.yml`)
5. ✅ Scripts npm ajoutés dans `package.json`
6. ✅ Configuration `angular.json` mise à jour avec `baseHref` et builder de déploiement
7. ✅ Budgets de build ajustés pour éviter les warnings

---

## 📝 Prochaines étapes (à faire)

### 1️⃣ Initialiser Git (si ce n'est pas déjà fait)

```bash
cd /Users/akramboukhers/Desktop/plateforme-eduka

# Initialiser le repository
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "feat: Configure Angular 20+ and GitHub Pages deployment"

# Définir la branche principale
git branch -M main
```

### 2️⃣ Créer un repository sur GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
3. Nom du repository : `plateforme-eduka`
4. Description (optionnel) : "Plateforme de gestion Eduka"
5. **Important** : Ne cochez PAS "Initialize this repository with a README"
6. Cliquez sur **"Create repository"**

### 3️⃣ Lier votre projet local à GitHub

```bash
# Remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE-USERNAME/plateforme-eduka.git

# Pousser le code
git push -u origin main
```

### 4️⃣ Configurer GitHub Pages

1. Allez sur votre repository : `https://github.com/VOTRE-USERNAME/plateforme-eduka`
2. Cliquez sur **Settings** (en haut de la page)
3. Dans le menu de gauche, cliquez sur **Pages**
4. Sous **"Build and deployment"** → **"Source"**, sélectionnez **"GitHub Actions"**
5. C'est tout ! GitHub Actions va détecter le workflow automatiquement

### 5️⃣ Déclencher le premier déploiement

Le déploiement se fera automatiquement lors du premier push. Pour vérifier :

1. Allez dans l'onglet **Actions** de votre repository
2. Vous verrez le workflow **"Deploy to GitHub Pages"** en cours
3. Attendez que la coche verte ✓ apparaisse (2-5 minutes)
4. Votre site sera accessible à : `https://VOTRE-USERNAME.github.io/plateforme-eduka/`

---

## 🔄 Déploiements futurs

### Déploiement automatique (recommandé)

Chaque fois que vous faites un push sur la branche `main`, le site se déploie automatiquement :

```bash
git add .
git commit -m "feat: Nouvelle fonctionnalité"
git push origin main
```

### Déploiement manuel

Si vous préférez déployer manuellement :

```bash
npm run deploy
```

---

## 🧪 Tester localement avant de déployer

```bash
# Build de production
npm run build:prod

# Tester le build localement (installer http-server si nécessaire)
npx http-server dist/eduka-platform/browser -p 8080 -c-1

# Ouvrir http://localhost:8080/plateforme-eduka/ dans votre navigateur
```

---

## 📊 Structure du projet après configuration

```
plateforme-eduka/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← Workflow GitHub Actions
├── public/
│   └── .nojekyll               ← Important pour GitHub Pages
├── src/
│   └── ...
├── angular.json                ← Configuré avec baseHref et deploy builder
├── package.json                ← Scripts npm ajoutés
├── DEPLOY.md                   ← Guide détaillé de déploiement
└── DEPLOYMENT-STEPS.md         ← Ce fichier
```

---

## 🛠️ Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm start` | Lancer le serveur de développement |
| `npm run build` | Build de développement |
| `npm run build:prod` | Build de production |
| `npm run deploy` | Déployer manuellement sur GitHub Pages |
| `npm test` | Lancer les tests |

---

## 🔍 Vérifier le déploiement

1. **Onglet Actions** : `https://github.com/VOTRE-USERNAME/plateforme-eduka/actions`
   - ✓ Vert = Déploiement réussi
   - ✗ Rouge = Erreur (consultez les logs)

2. **Site déployé** : `https://VOTRE-USERNAME.github.io/plateforme-eduka/`
   - Peut prendre 2-5 minutes après le premier déploiement

3. **Paramètres Pages** : `https://github.com/VOTRE-USERNAME/plateforme-eduka/settings/pages`
   - Affiche l'URL du site et le statut du déploiement

---

## ⚠️ Résolution de problèmes

### Le site ne se charge pas (404)
- Vérifiez que GitHub Pages est configuré sur **"GitHub Actions"**
- Vérifiez que le `baseHref` dans `angular.json` correspond au nom du repository
- Attendez 2-5 minutes après le premier déploiement

### Les assets ne se chargent pas
- Vérifiez la présence du fichier `.nojekyll` dans `public/`
- Tous les chemins doivent être relatifs (pas de `/` au début)

### Erreur de build dans GitHub Actions
```bash
# Tester le build localement
npm run build:prod

# Si ça marche localement, vérifier les versions Node.js
# GitHub Actions utilise Node 20 (défini dans deploy.yml)
```

---

## 📞 Support

Pour plus de détails, consultez :
- [DEPLOY.md](./DEPLOY.md) - Guide complet de déploiement
- [Documentation Angular](https://angular.dev)
- [GitHub Pages Documentation](https://docs.github.com/pages)

---

## 🎉 Félicitations !

Votre application Angular 20+ est prête à être déployée sur GitHub Pages avec déploiement automatique via GitHub Actions ! 🚀
