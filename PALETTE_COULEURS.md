# 🎨 Palette de Couleurs - DJ SHEK Website

## 📋 Codes Couleur Détaillés

### 🔴 **Couleurs Principales (Rouge/Orange)**

#### Rouge Principal
- **Hex :** `#d32f2f`
- **RGB :** `rgb(211, 47, 47)`
- **RGBA :** `rgba(211, 47, 47, 1.0)`
- **Usage :** Couleur principale du site, boutons, bordures, effets néon
- **Équivalent Material Design :** Red 700

#### Orange/Red-Orange
- **Hex :** `#ff5722`
- **RGB :** `rgb(255, 87, 34)`
- **RGBA :** `rgba(255, 87, 34, 1.0)`
- **Usage :** Accents, gradients, effets lumineux
- **Équivalent Material Design :** Deep Orange 500

#### Rouge Vif
- **Hex :** `#ff0000` ou `#ff1744`
- **RGB :** `rgb(255, 0, 0)` / `rgb(255, 23, 68)`
- **Usage :** Effets néon intenses, gradients
- **Équivalent Material Design :** Red 500 / Red A400

---

### ⚫ **Couleurs Neutres (Noir/Blanc/Gris)**

#### Noir Principal
- **Hex :** `#000000` ou `#000`
- **RGB :** `rgb(0, 0, 0)`
- **Usage :** Fond principal du site, arrière-plans
- **Theme Color :** `#000000` (meta tag)

#### Noir Foncé
- **Hex :** `#0a0a0a`
- **RGB :** `rgb(10, 10, 10)`
- **Usage :** Sections sombres, modals

#### Blanc
- **Hex :** `#ffffff` ou `#fff`
- **RGB :** `rgb(255, 255, 255)`
- **RGBA :** `rgba(255, 255, 255, 1.0)`
- **Usage :** Texte principal, titres, éléments clairs

#### Gris Clairs
- **Hex :** `#ccc` / `#aaa` / `#999` / `#888` / `#666`
- **RGB :** 
  - `rgb(204, 204, 204)` - Texte secondaire
  - `rgb(170, 170, 170)` - Texte tertiaire
  - `rgb(153, 153, 153)` - Texte désactivé
  - `rgb(136, 136, 136)` - Texte très discret
  - `rgb(102, 102, 102)` - Texte sombre
- **Usage :** Textes secondaires, placeholders, éléments discrets

---

### 🟢 **Couleurs Accent (Vert - Succès)**

#### Vert Succès
- **Hex :** `#4caf50`
- **RGB :** `rgb(76, 175, 80)`
- **RGBA :** `rgba(76, 175, 80, 0.2)`
- **Usage :** Messages de succès, validations
- **Équivalent Material Design :** Green 500

---

## 🌈 **Gradients Principaux**

### Gradient Rouge-Orange (Principal)
```css
linear-gradient(90deg, #d32f2f, #ff5722)
linear-gradient(135deg, #d32f2f, #ff5722)
linear-gradient(180deg, #d32f2f, #ff5722)
```
**Usage :** Boutons, barres de progression, effets lumineux

### Gradient Orange-Rouge (Inverse)
```css
linear-gradient(90deg, #ff5722, #d32f2f)
linear-gradient(135deg, #ff5722, #d32f2f)
linear-gradient(180deg, #ff5722, #d32f2f)
```
**Usage :** Effets hover, animations

### Gradient Blanc-Rouge
```css
linear-gradient(135deg, #fff, #d32f2f)
linear-gradient(135deg, #fff, #d32f2f, #ff5722)
```
**Usage :** Titres, textes avec effet dégradé

### Gradient Rouge-Orange-Rouge (Complexe)
```css
linear-gradient(135deg, #d32f2f, #ff5722, #ff1744)
linear-gradient(90deg, #d32f2f, #ff5722, #ff1744)
```
**Usage :** Effets spéciaux, animations

### Gradient Rouge-Noir
```css
linear-gradient(135deg, #d32f2f, #000)
```
**Usage :** Transitions, overlays

---

## ✨ **Effets Néon & Ombres**

### Ombres Rouges (Box-shadow)
```css
/* Ombres légères */
rgba(211, 47, 47, 0.1) - Opacité 10%
rgba(211, 47, 47, 0.2) - Opacité 20%
rgba(211, 47, 47, 0.3) - Opacité 30%
rgba(211, 47, 47, 0.4) - Opacité 40%
rgba(211, 47, 47, 0.5) - Opacité 50%

/* Ombres moyennes */
rgba(211, 47, 47, 0.6) - Opacité 60%
rgba(211, 47, 47, 0.8) - Opacité 80%
rgba(211, 47, 47, 1.0) - Opacité 100%

/* Ombres Orange */
rgba(255, 87, 34, 0.1) à rgba(255, 87, 34, 1.0)

/* Ombres Rouges vifs */
rgba(255, 0, 0, 0.4) à rgba(255, 0, 0, 1.0)
```

### Ombres Blanches (Text-shadow)
```css
rgba(255, 255, 255, 0.4) - Texte discret
rgba(255, 255, 255, 0.5) - Texte moyen
rgba(255, 255, 255, 0.6) - Texte visible
rgba(255, 255, 255, 0.8) - Texte lumineux
rgba(255, 255, 255, 0.9) - Texte très lumineux
```

### Ombres Noires (Profondeur)
```css
rgba(0, 0, 0, 0.3) - Ombre légère
rgba(0, 0, 0, 0.5) - Ombre moyenne
rgba(0, 0, 0, 0.6) - Ombre forte
rgba(0, 0, 0, 0.7) - Ombre très forte
rgba(0, 0, 0, 0.8) - Ombre intense
rgba(0, 0, 0, 0.9) - Ombre maximale
```

---

## 🎯 **Utilisation par Élément**

### Navigation
- **Fond :** `rgba(0,0,0,0.95)` - Noir semi-transparent
- **Texte :** `#ffffff` - Blanc
- **Bordures :** `rgba(211, 47, 47, 0.3)` - Rouge transparent
- **Ombres :** `rgba(211, 47, 47, 0.3)` - Rouge léger

### Titres & Textes
- **Titre Principal :** `#ffffff` avec ombres blanches
- **Sous-titre :** `#ff5722` avec stroke `#d32f2f`
- **Texte normal :** `rgba(255, 255, 255, 0.9)`
- **Texte secondaire :** `#ccc` / `#aaa`

### Boutons
- **Fond principal :** `linear-gradient(135deg, #d32f2f, #ff5722)`
- **Fond hover :** `linear-gradient(135deg, #ff5722, #d32f2f)`
- **Texte :** `#fff`
- **Bordure :** `#d32f2f` ou `#ff5722`
- **Ombre :** `rgba(211, 47, 47, 0.3)` à `rgba(211, 47, 47, 0.6)`

### Barres Latérales Lumineuses
- **Gradient :** 
  - `rgba(211, 47, 47, 0.8)` à 15%
  - `rgba(255, 87, 34, 1)` à 30%
  - `rgba(255, 0, 0, 1)` à 50%
  - `rgba(255, 87, 34, 1)` à 70%
  - `rgba(211, 47, 47, 0.8)` à 85%
- **Ombres néon :** Multiples couches avec opacités variables

### Formulaires
- **Fond input :** `rgba(255, 255, 255, 0.05)` - Blanc très transparent
- **Bordure :** `rgba(211, 47, 47, 0.3)` - Rouge transparent
- **Focus :** `#d32f2f` - Rouge vif
- **Texte :** `#fff` - Blanc
- **Placeholder :** `rgba(255, 255, 255, 0.4)` - Blanc discret

### Messages
- **Succès :** `rgba(76, 175, 80, 0.2)` fond, `#4caf50` texte
- **Erreur :** `rgba(211, 47, 47, 0.2)` fond, `#d32f2f` texte

### Modals
- **Overlay :** `rgba(0, 0, 0, 0.8)` - Noir semi-transparent
- **Fond modal :** `rgba(0, 0, 0, 0.95)` - Noir presque opaque
- **Bordure :** `rgba(211, 47, 47, 0.4)` - Rouge transparent
- **Ombre :** `rgba(0, 0, 0, 0.5)` - Noir pour profondeur

---

## 📊 **Résumé Rapide**

### Couleurs Principales
| Couleur | Hex | RGB | Usage |
|---------|-----|-----|-------|
| Rouge Principal | `#d32f2f` | `rgb(211, 47, 47)` | Couleur principale |
| Orange | `#ff5722` | `rgb(255, 87, 34)` | Accents |
| Rouge Vif | `#ff0000` | `rgb(255, 0, 0)` | Effets néon |
| Noir | `#000000` | `rgb(0, 0, 0)` | Fond |
| Blanc | `#ffffff` | `rgb(255, 255, 255)` | Texte |
| Vert Succès | `#4caf50` | `rgb(76, 175, 80)` | Messages |

### Opacités Communes
- `0.1` - Très léger (10%)
- `0.2` - Léger (20%)
- `0.3` - Moyen (30%)
- `0.4` - Visible (40%)
- `0.5` - Semi-transparent (50%)
- `0.6` - Plus opaque (60%)
- `0.8` - Presque opaque (80%)
- `1.0` - Opaque (100%)

---

## 🎨 **Palette Complète en Format Design**

### Pour Figma / Adobe XD / Sketch

```json
{
  "colors": {
    "primary": {
      "red": "#d32f2f",
      "orange": "#ff5722",
      "red-bright": "#ff0000"
    },
    "neutral": {
      "black": "#000000",
      "black-dark": "#0a0a0a",
      "white": "#ffffff",
      "gray-light": "#ccc",
      "gray-medium": "#aaa",
      "gray-dark": "#666"
    },
    "accent": {
      "green": "#4caf50"
    }
  }
}
```

---

## 💡 **Conseils d'Utilisation**

1. **Contraste :** Toujours utiliser du blanc (`#fff`) sur fond noir (`#000`)
2. **Accents :** Utiliser `#ff5722` pour attirer l'attention
3. **Effets :** Utiliser les opacités RGBA pour les overlays et effets
4. **Gradients :** Préférer les gradients rouge-orange pour les éléments interactifs
5. **Ombres :** Utiliser les ombres rouges pour les effets néon

---

**Dernière mise à jour :** $(date)
**Fichier source :** index.html







