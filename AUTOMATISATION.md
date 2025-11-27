# 🤖 AUTOMATISATION DU DÉPLOIEMENT

Ce guide explique comment automatiser complètement le déploiement de votre site.

---

## 🚀 MÉTHODE 1 : Script de Déploiement Git (Recommandé)

### Utilisation
```bash
cd "/Users/djshek/Desktop/dj shek web banger"
./deploy.sh
```

Ce script :
- ✅ Vérifie tous les fichiers
- ✅ Ajoute les modifications à Git
- ✅ Crée un commit
- ✅ Push vers GitHub
- ✅ Si Vercel est connecté, le déploiement se fait automatiquement

---

## 🚀 MÉTHODE 2 : Déploiement Direct Vercel

### Prérequis
```bash
npm install -g vercel
```

### Utilisation
```bash
cd "/Users/djshek/Desktop/dj shek web banger"
node vercel-deploy.js
```

Ou directement :
```bash
vercel --prod
```

---

## 🔄 DÉPLOIEMENT AUTOMATIQUE AVEC GITHUB ACTIONS

### Créer le workflow GitHub Actions

Créez le fichier `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Configuration des Secrets GitHub

1. Allez sur : https://github.com/djshekofficiel-cloud/-Users-djshek-Desktop-dj-shek-web-banger-/settings/secrets/actions

2. Ajoutez ces secrets :
   - `VERCEL_TOKEN` : Token Vercel (Settings > Tokens dans Vercel)
   - `VERCEL_ORG_ID` : ID de votre organisation Vercel
   - `VERCEL_PROJECT_ID` : ID de votre projet Vercel

---

## 🔑 OBTENIR LES TOKENS VERCEL

### 1. Token Vercel
1. Allez sur : https://vercel.com/account/tokens
2. Cliquez sur "Create Token"
3. Donnez un nom (ex: "GitHub Actions")
4. Copiez le token

### 2. Org ID et Project ID
1. Allez sur votre projet Vercel
2. Settings > General
3. Vous trouverez :
   - **Team ID** (c'est l'Org ID)
   - **Project ID**

---

## 📋 CHECKLIST D'AUTOMATISATION COMPLÈTE

### ✅ Configuration Initiale (Une seule fois)

- [ ] Vercel CLI installé : `npm install -g vercel`
- [ ] Connecté à Vercel : `vercel login`
- [ ] Dépôt GitHub connecté à Vercel
- [ ] Domaine `djshekofficiel.com` configuré dans Vercel
- [ ] DNS configurés sur GoDaddy

### ✅ Déploiement Automatique

Une fois configuré, chaque `git push` déclenchera automatiquement :
1. ✅ GitHub Actions (si configuré)
2. ✅ Vercel détecte le push
3. ✅ Déploiement automatique
4. ✅ Site mis à jour en quelques secondes

---

## 🎯 COMMANDES RAPIDES

### Déploiement manuel rapide
```bash
cd "/Users/djshek/Desktop/dj shek web banger"
./deploy.sh
```

### Déploiement Vercel direct
```bash
vercel --prod
```

### Vérifier le statut
```bash
vercel ls
```

---

## 🔧 DÉPANNAGE

### Le script ne fonctionne pas
```bash
chmod +x deploy.sh
./deploy.sh
```

### Vercel CLI non trouvé
```bash
npm install -g vercel
```

### Erreur de permissions Git
```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
```

---

## ✅ RÉSULTAT

Une fois tout configuré :
- ✅ Push vers GitHub = Déploiement automatique
- ✅ Site mis à jour en quelques secondes
- ✅ Aucune intervention manuelle nécessaire

**Votre site sera toujours à jour ! 🎉**









