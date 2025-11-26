# 🌐 AJOUT DU SOUS-DOMAINE WWW
## djshekofficiel.com → www.djshekofficiel.com

**Date** : 27 janvier 2025

---

## 📊 DIAGNOSTIC

### Situation Actuelle
- ✅ Site accessible sur : `https://djshekofficiel.com`
- ❌ Site **NON** accessible sur : `https://www.djshekofficiel.com`
- **Cause** : Le sous-domaine `www` n'est pas configuré dans Vercel et/ou DNS

---

## 🔧 SOLUTION : AJOUTER WWW.DJSHEKOFFICIEL.COM

### Option 1 : Via Vercel (Recommandé)

#### Étape 1 : Ajouter le Domaine www dans Vercel

1. **Allez sur Vercel** : https://vercel.com/dashboard
2. **Sélectionnez votre projet** : `dj-shek-web-banger` (ou nom de votre projet)
3. **Allez dans** : **Settings** > **Domains**
4. **Cliquez sur** : **"Add Domain"**
5. **Entrez** : `www.djshekofficiel.com`
6. **Cliquez sur** : **"Add"**

#### Étape 2 : Vercel va Configurer Automatiquement

Vercel va :
- ✅ Créer automatiquement un enregistrement CNAME pour `www`
- ✅ Rediriger `www.djshekofficiel.com` vers votre site
- ✅ Gérer SSL automatiquement

**Aucune configuration DNS manuelle nécessaire !** Vercel s'en charge.

---

### Option 2 : Configuration DNS Manuelle (Si Option 1 ne fonctionne pas)

#### Sur GoDaddy :

1. **Allez sur** : https://www.godaddy.com
2. **Connectez-vous**
3. **Mes produits** > **Domaines** > **djshekofficiel.com**
4. **Gérer les DNS**
5. **Ajoutez un enregistrement CNAME** :
   - **Type** : `CNAME`
   - **Name** : `www`
   - **Value** : `cname.vercel-dns.com` (ou l'adresse fournie par Vercel)
   - **TTL** : `600` (ou par défaut)
6. **Sauvegardez**

#### Dans Vercel :

1. **Allez dans** : **Settings** > **Domains**
2. **Ajoutez** : `www.djshekofficiel.com`
3. **Vercel vous donnera l'enregistrement CNAME exact**

---

## 🔄 REDIRECTION WWW → NON-WWW (Recommandé pour SEO)

Pour éviter le contenu dupliqué, il est recommandé de rediriger `www.djshekofficiel.com` vers `djshekofficiel.com`.

### Configuration dans Vercel

Vercel gère automatiquement cette redirection si vous configurez les deux domaines. Sinon, ajoutez dans `vercel.json` :

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "www.djshekofficiel.com"
        }
      ],
      "destination": "https://djshekofficiel.com/:path*",
      "permanent": true
    }
  ]
}
```

---

## ✅ VÉRIFICATION

### Après Configuration

1. **Testez** : `https://www.djshekofficiel.com`
2. **Résultat attendu** :
   - ✅ Redirige vers `https://djshekofficiel.com` (si redirection configurée)
   - ✅ OU affiche le site directement (si pas de redirection)

### Test Rapide

```bash
curl -I https://www.djshekofficiel.com
```

**Résultat attendu** :
- Si redirection : `HTTP/2 301` ou `HTTP/2 308` → `Location: https://djshekofficiel.com`
- Si pas de redirection : `HTTP/2 200`

---

## 📋 CHECKLIST

- [ ] Domaine `www.djshekofficiel.com` ajouté dans Vercel
- [ ] DNS configurés (automatique via Vercel ou manuel sur GoDaddy)
- [ ] SSL activé automatiquement (Vercel)
- [ ] Redirection configurée (optionnel mais recommandé)
- [ ] Test de l'URL `www.djshekofficiel.com` réussi

---

## 🎯 RÉSUMÉ

**Pour avoir www.djshekofficiel.com** :

1. **Allez sur Vercel** : Settings > Domains
2. **Ajoutez** : `www.djshekofficiel.com`
3. **Vercel configure automatiquement** (DNS + SSL)
4. **Attendez 2-5 minutes**
5. **Testez** : `https://www.djshekofficiel.com`

**C'est tout !** 🎉

---

**Document créé le** : 27 janvier 2025







