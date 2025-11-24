# Guide de déploiement GitHub Pages

## Configuration initiale

### 1. Vérifier la version Angular
Votre projet utilise **Angular 20.3.12** (la dernière version stable).

### 2. Configuration GitHub Pages

1. Allez sur votre repository GitHub
2. Accédez à **Settings** > **Pages**
3. Sous **Source**, sélectionnez **GitHub Actions**

### 3. Initialiser le repository Git (si pas déjà fait)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/plateforme-eduka.git
git push -u origin main
```

## Déploiement

### Méthode 1 : Déploiement automatique avec GitHub Actions

Une fois que vous poussez du code sur la branche `main`, le workflow GitHub Actions se déclenche automatiquement :

```bash
git add .
git commit -m "Votre message de commit"
git push origin main
```

Le site sera déployé automatiquement sur : `https://VOTRE-USERNAME.github.io/plateforme-eduka/`

### Méthode 2 : Déploiement manuel avec angular-cli-ghpages

Si vous préférez déployer manuellement :

```bash
# Build production
npm run build:prod

# Déployer sur GitHub Pages
npm run deploy
```

Ou en une seule commande :
```bash
ng deploy --base-href=/plateforme-eduka/
```

## Structure des fichiers de configuration

### angular.json
- Configuration du `baseHref` pour GitHub Pages : `/plateforme-eduka/`
- Builder de déploiement : `angular-cli-ghpages:deploy`

### package.json
Scripts ajoutés :
- `build:prod` : Build de production
- `deploy` : Déploiement sur GitHub Pages

### .github/workflows/deploy.yml
Workflow GitHub Actions qui :
1. Installe les dépendances
2. Build l'application en mode production
3. Déploie sur GitHub Pages

## Vérification du déploiement

1. Allez sur **Actions** dans votre repository GitHub
2. Vous verrez le workflow "Deploy to GitHub Pages" en cours d'exécution
3. Une fois terminé (avec une coche verte ✓), votre site est en ligne
4. URL de votre site : `https://VOTRE-USERNAME.github.io/plateforme-eduka/`

## Résolution de problèmes

### Erreur 404 après déploiement
- Vérifiez que le `baseHref` dans angular.json correspond au nom de votre repository
- Vérifiez que GitHub Pages est configuré pour utiliser GitHub Actions

### Les assets ne se chargent pas
- Vérifiez que tous les chemins dans votre code sont relatifs (pas de `/` au début)
- Le fichier `.nojekyll` dans le dossier public empêche Jekyll de traiter les fichiers

### Problèmes de build
```bash
# Nettoyer et réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Tester le build localement
npm run build:prod
```

## Commandes utiles

```bash
# Développement local
npm start

# Build de production local
npm run build:prod

# Tester le build de production localement
npx http-server dist/eduka-platform/browser -p 8080

# Déploiement manuel
npm run deploy
```

## Notes importantes

- Le fichier `.nojekyll` dans le dossier `public` est essentiel pour GitHub Pages
- La branche `gh-pages` est créée automatiquement lors du premier déploiement
- Chaque push sur `main` déclenche un nouveau déploiement automatique
- Le déploiement prend généralement 2-5 minutes
