# 🎵 GUIDE - MISE À JOUR AUTOMATIQUE DES MUSIQUES

## ⚡ MISE À JOUR EN UNE COMMANDE

```bash
cd "/Users/djshek/Desktop/dj shek web banger"
python3 update-music.py
```

**C'est tout !** Le script fait :
- ✅ Scanne automatiquement le dossier `audio/`
- ✅ Détecte tous les fichiers MP3
- ✅ Met à jour `index.html` automatiquement
- ✅ Commit et push vers GitHub
- ✅ Vercel déploie automatiquement

---

## 📋 UTILISATION

### Ajouter de nouvelles musiques

1. **Ajoutez vos fichiers MP3** dans le dossier `audio/`
2. **Lancez le script** :
   ```bash
   python3 update-music.py
   ```
3. **C'est tout !** Le site sera mis à jour automatiquement

### Mettre à jour les musiques existantes

1. **Remplacez les fichiers** dans `audio/` (même nom de fichier)
2. **Lancez le script** :
   ```bash
   python3 update-music.py
   ```

---

## 🔄 DÉPLOIEMENT AUTOMATIQUE

### Comment ça fonctionne

1. **Vous lancez** `python3 update-music.py`
2. **Le script** :
   - Scanne `audio/`
   - Met à jour `index.html`
   - Commit vers Git
   - Push vers GitHub
3. **Vercel détecte** le push GitHub
4. **Vercel déploie** automatiquement
5. **Votre site** est mis à jour en 1-2 minutes

---

## ✅ VÉRIFICATIONS

Après la mise à jour :

- [ ] Vérifiez sur GitHub que les changements sont poussés
- [ ] Vérifiez sur Vercel que le déploiement est en cours
- [ ] Testez le site : https://djshekofficiel.com
- [ ] Vérifiez que toutes les musiques apparaissent

---

## 🆘 PROBLÈMES COURANTS

### Le script ne trouve pas les fichiers
- Vérifiez que vous êtes dans le bon dossier
- Vérifiez que le dossier `audio/` existe
- Vérifiez que les fichiers sont en `.mp3`

### Git ne fonctionne pas
- Vérifiez que Git est configuré
- Vérifiez que vous êtes connecté à GitHub

### Vercel ne déploie pas
- Vérifiez que Vercel est connecté à GitHub
- Vérifiez les logs sur Vercel

---

## 📊 STATISTIQUES

Le script affiche :
- Nombre de pistes détectées
- Fichiers mis à jour
- Statut du commit Git
- Statut du push GitHub

---

## 🎯 RÉSULTAT

**En 30 secondes, vos musiques sont en ligne ! 🎉**

---

## 🔗 LIENS

- **Site** : https://djshekofficiel.com
- **GitHub** : https://github.com/djshekofficiel-cloud/-Users-djshek-Desktop-dj-shek-web-banger-
- **Vercel** : https://vercel.com/djshekofficiel-9102s-projects/dj-shek-web-banger

---

**Tout est automatique ! Ajoutez vos musiques et lancez le script ! 🚀**

