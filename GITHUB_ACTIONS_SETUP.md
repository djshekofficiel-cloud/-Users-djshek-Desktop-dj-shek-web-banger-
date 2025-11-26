# 🔧 Configuration GitHub Actions (Optionnel)

GitHub nécessite des permissions spéciales pour créer des workflows. Voici comment l'ajouter manuellement :

---

## 📝 ÉTAPE 1 : Créer le Workflow

1. Allez sur GitHub : https://github.com/djshekofficiel-cloud/-Users-djshek-Desktop-dj-shek-web-banger-

2. Cliquez sur **"Add file"** > **"Create new file"**

3. Nommez le fichier : `.github/workflows/deploy.yml`

4. Collez ce contenu :

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Vercel CLI
        run: npm install -g vercel@latest
      
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }} --yes
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

5. Cliquez sur **"Commit new file"**

---

## 🔑 ÉTAPE 2 : Ajouter les Secrets

1. Allez sur : https://github.com/djshekofficiel-cloud/-Users-djshek-Desktop-dj-shek-web-banger-/settings/secrets/actions

2. Cliquez sur **"New repository secret"**

3. Ajoutez ces 3 secrets :

   **Secret 1 : VERCEL_TOKEN**
   - Name: `VERCEL_TOKEN`
   - Value: Obtenez-le sur https://vercel.com/account/tokens

   **Secret 2 : VERCEL_ORG_ID**
   - Name: `VERCEL_ORG_ID`
   - Value: Dans Vercel > Settings > General de votre projet

   **Secret 3 : VERCEL_PROJECT_ID**
   - Name: `VERCEL_PROJECT_ID`
   - Value: Dans Vercel > Settings > General de votre projet

---

## ✅ RÉSULTAT

Une fois configuré, chaque `git push` sur `main` déclenchera automatiquement un déploiement sur Vercel !

---

**Note** : Si vous préférez, vous pouvez simplement connecter Vercel directement à GitHub (plus simple, pas besoin de GitHub Actions).








