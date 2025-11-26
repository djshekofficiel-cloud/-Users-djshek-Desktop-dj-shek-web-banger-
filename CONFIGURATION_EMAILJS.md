# 📧 CONFIGURATION EMAILJS - ENVOI AUTOMATIQUE DES EMAILS

## 🎯 OBJECTIF

Configurer EmailJS pour que tous les messages du formulaire de contact soient automatiquement envoyés à **djshekofficiel@gmail.com**.

---

## 📋 ÉTAPES DE CONFIGURATION

### Étape 1 : Créer un compte EmailJS

1. **Allez sur** : https://www.emailjs.com/
2. **Cliquez sur "Sign Up"** (gratuit)
3. **Créez un compte** avec votre email

---

### Étape 2 : Créer un Service Email

1. **Dans EmailJS**, allez dans **"Email Services"**
2. **Cliquez sur "Add New Service"**
3. **Sélectionnez "Gmail"** (ou votre service email)
4. **Connectez votre compte Gmail** (djshekofficiel@gmail.com)
5. **Notez le "Service ID"** (ex: `service_xxxxx`)

---

### Étape 3 : Créer un Template Email

1. **Allez dans "Email Templates"**
2. **Cliquez sur "Create New Template"**
3. **Configurez le template** :

   **Subject (Sujet)** :
   ```
   Nouveau message depuis djshekofficiel.com - {{subject}}
   ```

   **Content (Contenu)** :
   ```
   Bonjour DJ SHEK,
   
   Vous avez reçu un nouveau message depuis votre site web.
   
   ---
   Nom : {{from_name}}
   Email : {{from_email}}
   Type de service : {{service_type}}
   
   Message :
   {{message}}
   
   ---
   Ce message a été envoyé depuis le formulaire de contact de djshekofficiel.com
   ```

4. **Cliquez sur "Save"**
5. **Notez le "Template ID"** (ex: `template_xxxxx`)

---

### Étape 4 : Récupérer votre Public Key

1. **Allez dans "Account"** > **"General"**
2. **Trouvez "Public Key"**
3. **Copiez la clé** (ex: `xxxxxxxxxxxxx`)

---

### Étape 5 : Configurer dans le Code

1. **Ouvrez** `index.html`
2. **Trouvez** ces lignes (vers la ligne 9718) :
   ```javascript
   service_id: 'YOUR_SERVICE_ID',
   template_id: 'YOUR_TEMPLATE_ID',
   user_id: 'YOUR_USER_ID',
   ```

3. **Remplacez** par vos valeurs :
   ```javascript
   service_id: 'service_xxxxx',        // Votre Service ID
   template_id: 'template_xxxxx',     // Votre Template ID
   user_id: 'xxxxxxxxxxxxx',          // Votre Public Key
   ```

4. **Sauvegardez** le fichier

---

## 🚀 DÉPLOIEMENT

Après configuration :

```bash
cd "/Users/djshek/Desktop/dj shek web banger"
git add index.html
git commit -m "Configuration EmailJS pour envoi automatique des emails"
git push origin main
```

Vercel déploiera automatiquement !

---

## ✅ VÉRIFICATION

1. **Testez le formulaire** sur https://djshekofficiel.com
2. **Remplissez** tous les champs
3. **Envoyez** le message
4. **Vérifiez** votre boîte mail : djshekofficiel@gmail.com

---

## 🔒 SÉCURITÉ

- ✅ EmailJS est gratuit jusqu'à 200 emails/mois
- ✅ Les emails sont envoyés directement depuis votre compte Gmail
- ✅ Pas besoin de serveur backend
- ✅ Configuration simple et rapide

---

## 🆘 PROBLÈMES COURANTS

### Les emails ne sont pas envoyés
- Vérifiez que les IDs sont corrects dans le code
- Vérifiez que le service Gmail est bien connecté
- Vérifiez les logs dans EmailJS Dashboard

### Erreur "EmailJS not defined"
- Vérifiez que le script EmailJS est bien chargé dans le `<head>`
- Vérifiez votre connexion internet

### Fallback vers mailto
- Si EmailJS échoue, le formulaire utilisera automatiquement mailto
- C'est normal, cela garantit que le message peut toujours être envoyé

---

## 📊 LIMITES GRATUITES

- **200 emails/mois** avec le plan gratuit
- **Plus que suffisant** pour un site personnel
- **Upgrade possible** si besoin

---

## 🎉 RÉSULTAT

Une fois configuré :
- ✅ Tous les messages arrivent directement dans djshekofficiel@gmail.com
- ✅ Pas besoin d'ouvrir le client de messagerie
- ✅ Envoi automatique et instantané
- ✅ Format professionnel

---

**Suivez ces étapes et vos emails seront automatiquement envoyés ! 📧**








