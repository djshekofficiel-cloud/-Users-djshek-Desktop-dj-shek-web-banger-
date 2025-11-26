# 📸 Guide - Image de Partage Réseaux Sociaux

## ✅ Configuration Actuelle

Votre site est maintenant configuré pour afficher une image lors du partage sur :
- ✅ Facebook
- ✅ Instagram
- ✅ Snapchat
- ✅ Twitter/X
- ✅ LinkedIn
- ✅ WhatsApp
- ✅ Tous les autres réseaux sociaux

## 🖼️ Image Actuelle

**Fichier utilisé :** `images/Gemini_Generated_Image_exfw8sexfw8sexfw.png`

**URL complète :** `https://djshekofficiel.com/images/Gemini_Generated_Image_exfw8sexfw8sexfw.png`

## 📐 Dimensions Recommandées

Pour un affichage optimal sur tous les réseaux sociaux :
- **Largeur :** 1200px
- **Hauteur :** 630px
- **Format :** PNG ou JPG
- **Taille :** Moins de 5MB (recommandé : moins de 1MB)

## 🔄 Changer l'Image de Partage

Si vous voulez changer l'image :

1. **Préparez votre image :**
   - Dimensions : 1200x630px
   - Format : PNG ou JPG
   - Nom : `og-image.png` ou `og-image.jpg`

2. **Placez l'image :**
   - Dans le dossier `images/`
   - Exemple : `images/og-image.png`

3. **Mettez à jour les meta tags dans `index.html` :**
   - Ligne 25 : `<meta property="og:image" content="https://djshekofficiel.com/images/VOTRE_IMAGE.png">`
   - Ligne 35 : `<meta name="twitter:image" content="https://djshekofficiel.com/images/VOTRE_IMAGE.png">`
   - Ligne 52 : Dans le Schema.org JSON-LD : `"image": "https://djshekofficiel.com/images/VOTRE_IMAGE.png"`

4. **Poussez les modifications :**
   ```bash
   git add index.html images/VOTRE_IMAGE.png
   git commit -m "Mise à jour image partage réseaux sociaux"
   git push origin main
   ```

## 🧪 Tester le Partage

### Outils de Test :
1. **Facebook Debugger :** https://developers.facebook.com/tools/debug/
   - Entrez votre URL : `https://djshekofficiel.com`
   - Cliquez sur "Scraper" pour voir l'aperçu

2. **Twitter Card Validator :** https://cards-dev.twitter.com/validator
   - Entrez votre URL pour tester l'affichage Twitter

3. **LinkedIn Post Inspector :** https://www.linkedin.com/post-inspector/
   - Entrez votre URL pour tester l'affichage LinkedIn

### Test Rapide :
1. Partagez votre lien sur Facebook/Instagram/Snapchat
2. L'image devrait s'afficher automatiquement
3. Si l'image ne s'affiche pas, utilisez les outils de test ci-dessus pour forcer le rafraîchissement

## ⚠️ Important

- L'image doit être accessible publiquement (pas de protection par mot de passe)
- L'URL doit être absolue (commence par `https://`)
- L'image doit être en HTTPS
- Après modification, attendez quelques minutes pour que les réseaux sociaux mettent à jour le cache

## 🎨 Conseils pour l'Image

- **Contenu :** Logo DJ SHEK, photo de profil, ou visuel représentant votre univers
- **Texte :** Évitez trop de texte (lisible en petit format)
- **Couleurs :** Utilisez des couleurs contrastées
- **Branding :** Incluez votre nom "DJ SHEK" ou "djshekofficiel"








