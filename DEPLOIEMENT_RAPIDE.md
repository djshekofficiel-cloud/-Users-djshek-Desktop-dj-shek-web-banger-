# 🚀 DÉPLOIEMENT RAPIDE - ÉTAPES SIMPLES

## ⚡ SOLUTION IMMÉDIATE (5 minutes)

### Étape 1 : Créer le Projet sur Vercel

1. **Allez sur** : https://vercel.com/new

2. **Cliquez sur** : **"Import Git Repository"**

3. **Sélectionnez GitHub** et autorisez si nécessaire

4. **Choisissez le dépôt** : `djshekofficiel-cloud/-Users-djshek-Desktop-dj-shek-web-banger-`

5. **Configuration** (Vercel détectera automatiquement) :
   - Framework Preset : **Other**
   - Root Directory : `./`
   - Build Command : (vide)
   - Output Directory : `./`
   - Install Command : (vide)

6. **Cliquez sur "Deploy"**

7. **Attendez 1-2 minutes** - Vercel va :
   - Cloner votre dépôt
   - Détecter la configuration
   - Déployer votre site

8. **✅ Votre site sera en ligne !**

---

## 🌐 ÉTAPE 2 : Ajouter le Domaine (Optionnel)

Une fois le déploiement réussi :

1. **Dans Vercel**, allez dans **Settings** > **Domains**

2. **Ajoutez** : `djshekofficiel.com`

3. **Vercel vous donnera des enregistrements DNS** à configurer

4. **Sur GoDaddy** :
   - Mes produits > Domaines > djshekofficiel.com
   - Gérer les DNS
   - Ajoutez les enregistrements selon Vercel

5. **Attendez la propagation DNS** (quelques minutes)

---

## 🔄 DÉPLOIEMENTS FUTURS

Une fois configuré, **chaque `git push`** déclenchera automatiquement un nouveau déploiement !

```bash
cd "/Users/djshek/Desktop/dj shek web banger"
./deploy.sh
```

Ou simplement :
```bash
git add .
git commit -m "Mise à jour"
git push origin main
```

---

## ✅ VÉRIFICATION

Après le déploiement, vérifiez :

- ✅ Le site se charge : https://[votre-url-vercel].vercel.app
- ✅ Les images s'affichent
- ✅ Le lecteur audio fonctionne
- ✅ Le formulaire fonctionne

---

## 🆘 PROBLÈME ?

Si vous avez toujours l'erreur 404 :

1. **Vérifiez** que le projet existe sur Vercel
2. **Vérifiez** que le déploiement est terminé (pas "Building")
3. **Consultez** les logs dans Vercel > Deployments

---

**C'est tout ! Votre site sera en ligne en quelques minutes 🎉**







