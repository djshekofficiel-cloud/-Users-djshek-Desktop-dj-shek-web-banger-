# 🔧 GUIDE DE RÉSOLUTION - Erreur de Configuration Serveur

## ❌ Problème

Vous voyez le message d'erreur :
> "Erreur de configuration serveur. Veuillez réessayer dans quelques instants."

## 🔍 Cause

Cette erreur se produit quand :
1. **En développement local** : L'API `/api/contact` n'est pas correctement configurée
2. **Variable d'environnement manquante** : `WEB3FORMS_ACCESS_KEY` n'est pas définie
3. **Serveur de développement** : Le serveur Vite ne gère pas les routes API

## ✅ Solution

### Option 1 : Configuration pour le développement local (RECOMMANDÉ)

1. **Créer un fichier `.env`** à la racine du projet :
   ```bash
   cd "/Users/djshek/Desktop/dj shek web banger"
   cp .env.example .env
   ```

2. **Vérifier que la clé Web3Forms est dans `.env`** :
   ```
   WEB3FORMS_ACCESS_KEY=4650301f-d665-4ddc-b4d3-9bbefff2e801
   ```

3. **Redémarrer le serveur de développement** :
   ```bash
   npm run dev
   ```

### Option 2 : Vérifier la configuration Vercel (Production)

Si l'erreur se produit en production sur Vercel :

1. **Allez sur Vercel** : https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger/settings/environment-variables

2. **Vérifiez que `WEB3FORMS_ACCESS_KEY` est configurée** :
   - Key: `WEB3FORMS_ACCESS_KEY`
   - Value: `4650301f-d665-4ddc-b4d3-9bbefff2e801`
   - Environment: Production, Preview, Development (tous cochés)

3. **Redéployez** le projet si nécessaire

## 🧪 Tester la correction

1. **Démarrez le serveur** :
   ```bash
   npm run dev
   ```

2. **Ouvrez** http://localhost:3000

3. **Remplissez le formulaire de contact**

4. **Envoyez le message**

5. **Vérifiez** :
   - ✅ Le message de succès s'affiche
   - ✅ Vous recevez l'email sur djshekofficiel@gmail.com

## 🔍 Vérification du problème

### En développement local

Ouvrez la console du navigateur (F12) et regardez les erreurs :
- Si vous voyez `404` sur `/api/contact` → Le plugin Vite n'est pas actif
- Si vous voyez `500` avec "Configuration manquante" → La variable d'environnement n'est pas chargée

### En production

Vérifiez les logs Vercel :
1. Allez sur https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger
2. Cliquez sur "Functions" → `/api/contact`
3. Regardez les logs pour voir l'erreur exacte

## 📝 Notes

- Le plugin `vite-plugin-api.js` a été créé pour gérer les routes API en développement local
- Les variables d'environnement sont chargées automatiquement par Node.js
- En production, Vercel charge automatiquement les variables d'environnement configurées

## 🆘 Si le problème persiste

1. **Vérifiez que le plugin est bien chargé** dans `vite.config.js`
2. **Vérifiez que le fichier `api/contact.js` existe**
3. **Vérifiez les logs du serveur** pour voir les erreurs détaillées
4. **Testez l'API directement** avec curl :
   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{"nom":"Test","email":"test@test.com","type_prestation":"Remix","instructions":"Test","gdpr":true}'
   ```

