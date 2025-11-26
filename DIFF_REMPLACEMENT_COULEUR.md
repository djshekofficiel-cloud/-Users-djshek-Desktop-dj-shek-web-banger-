# 🔄 DIFFÉRENCES - REMPLACEMENT #AABBCC → #FF8844

**Date** : 27 janvier 2025  
**Couleur source** : `#AABBCC`  
**Couleur cible** : `#FF8844`

---

## 📊 RÉSULTAT

### ❌ Couleur #AABBCC non trouvée dans le projet

La couleur `#AABBCC` n'existe pas dans les fichiers de code du projet.

---

## 📝 EXEMPLE DE DIFFÉRENCES (Si la couleur existait)

### Fichier CSS Exemple

#### 🔴 AVANT
```css
/* Exemple de fichier avec #AABBCC */
.header {
    background-color: #AABBCC;
    color: #ffffff;
}

.button {
    border: 2px solid #AABBCC;
    background: linear-gradient(135deg, #AABBCC, #ffffff);
}

.link {
    color: #AABBCC;
}

.link:hover {
    background-color: #AABBCC;
    box-shadow: 0 0 10px #AABBCC;
}
```

#### 🟢 APRÈS
```css
/* Exemple de fichier avec #FF8844 */
.header {
    background-color: #FF8844;
    color: #ffffff;
}

.button {
    border: 2px solid #FF8844;
    background: linear-gradient(135deg, #FF8844, #ffffff);
}

.link {
    color: #FF8844;
}

.link:hover {
    background-color: #FF8844;
    box-shadow: 0 0 10px #FF8844;
}
```

### Diff Unified Format

```diff
--- avant.css
+++ après.css
@@ -1,15 +1,15 @@
 /* Exemple de fichier avec #AABBCC */
 .header {
-    background-color: #AABBCC;
+    background-color: #FF8844;
     color: #ffffff;
 }
 
 .button {
-    border: 2px solid #AABBCC;
-    background: linear-gradient(135deg, #AABBCC, #ffffff);
+    border: 2px solid #FF8844;
+    background: linear-gradient(135deg, #FF8844, #ffffff);
 }
 
 .link {
-    color: #AABBCC;
+    color: #FF8844;
 }
 
 .link:hover {
-    background-color: #AABBCC;
-    box-shadow: 0 0 10px #AABBCC;
+    background-color: #FF8844;
+    box-shadow: 0 0 10px #FF8844;
 }
```

---

## 🎯 COULEURS DISPONIBLES DANS LE PROJET

Si vous souhaitez remplacer une couleur existante, voici les couleurs principales :

| Couleur | Hex | Occurrences | Usage |
|---------|-----|-------------|-------|
| Bleu Nuit | `#2d4a6e` | ~68 | Couleur principale |
| Orange | `#ff6b35` | ~56 | Accents, hover |
| Bleu Nuit Foncé | `#1e3a5f` | Plusieurs | Éléments sombres |
| Orange Clair | `#ff8c42` | Plusieurs | États actifs |
| Vert Succès | `#4caf50` | ~3 | Messages succès |

---

## 🛠️ POUR REMPLACER UNE COULEUR EXISTANTE

Utilisez le script créé :

```bash
./SCRIPT_REMPLACEMENT_COULEUR.sh "#2d4a6e" "#FF8844"
```

Ou manuellement :

```bash
# Rechercher
grep -r "#2d4a6e" .

# Remplacer
find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \) \
  -exec sed -i '' 's/#2d4a6e/#FF8844/g' {} \;
```

---

## 📋 RÉSUMÉ

- **Couleur recherchée** : `#AABBCC`
- **Couleur de remplacement** : `#FF8844`
- **Fichiers modifiés** : 0 (couleur non trouvée)
- **Occurrences remplacées** : 0

---

**Note** : Le projet utilise maintenant des variables CSS. Pour changer une couleur, modifiez simplement la variable dans `:root` du fichier `index.html`.

