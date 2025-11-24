# ⚡ CONFIGURATION RAPIDE - EMAILS AUTOMATIQUES

## 🎯 OBJECTIF

Configurer l'envoi automatique des messages vers **djshekofficiel@gmail.com** en 5 minutes.

---

## 📋 ÉTAPES RAPIDES (EmailJS)

### 1. Créer un compte EmailJS (2 min)
👉 https://www.emailjs.com/sign-up

### 2. Ajouter Gmail comme service (1 min)
- Dashboard > Email Services > Add New Service
- Choisir "Gmail"
- Connecter djshekofficiel@gmail.com
- **Copier le Service ID** (ex: `service_abc123`)

### 3. Créer un template (1 min)
- Dashboard > Email Templates > Create New Template
- **Subject** : `Nouveau message - {{subject}}`
- **Content** :
```
Bonjour DJ SHEK,

Nouveau message depuis votre site web.

Nom : {{from_name}}
Email : {{from_email}}
Service : {{service_type}}

Message :
{{message}}
```
- **Save** et **copier le Template ID** (ex: `template_xyz789`)

### 4. Récupérer la Public Key (30 sec)
- Dashboard > Account > General
- **Copier la Public Key** (ex: `abcdefghijklmnop`)

### 5. Configurer dans le code (30 sec)

Ouvrez `index.html` et trouvez ces lignes (vers ligne 9720) :

```javascript
service_id: 'YOUR_SERVICE_ID',
template_id: 'YOUR_TEMPLATE_ID',
user_id: 'YOUR_USER_ID',
```

**Remplacez par vos valeurs** :
```javascript
service_id: 'service_abc123',      // Votre Service ID
template_id: 'template_xyz789',    // Votre Template ID
user_id: 'abcdefghijklmnop',       // Votre Public Key
```

### 6. Déployer (automatique)
```bash
cd "/Users/djshek/Desktop/dj shek web banger"
git add index.html
git commit -m "Configuration EmailJS"
git push origin main
```

**C'est tout !** Vercel déploiera automatiquement.

---

## ✅ TESTER

1. Allez sur https://djshekofficiel.com
2. Remplissez le formulaire de contact
3. Envoyez le message
4. Vérifiez djshekofficiel@gmail.com

---

## 🎉 RÉSULTAT

✅ Tous les messages arrivent automatiquement dans votre boîte mail
✅ Pas besoin d'ouvrir le client de messagerie
✅ Envoi instantané et professionnel

---

**Temps total : 5 minutes ! 🚀**

