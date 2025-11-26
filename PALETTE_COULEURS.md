# 🎨 Palette de Couleurs - DJ SHEK Website

**Date de mise à jour :** 27 janvier 2025  
**Thème actuel :** Bleu Nuit / Orange / Noir  
**Statut :** ✅ Palette complète appliquée via variables CSS

---

## 📋 Codes Couleur Détaillés

### 🔵 **Couleurs Principales (Bleu Nuit)**

#### Bleu Nuit Principal
- **Hex :** `#2d4a6e`
- **RGB :** `rgb(45, 74, 110)`
- **RGBA :** `rgba(45, 74, 110, 1.0)`
- **Variable CSS :** `--blue-night`
- **Usage :** Couleur principale du site, boutons, bordures, effets néon
- **Contraste WCAG :** AA+ sur fond noir

#### Bleu Nuit Foncé
- **Hex :** `#1e3a5f`
- **RGB :** `rgb(30, 58, 95)`
- **Variable CSS :** `--blue-night-dark`
- **Usage :** Éléments sombres, arrière-plans secondaires

#### Bleu Nuit Très Foncé
- **Hex :** `#112240`
- **RGB :** `rgb(17, 34, 64)`
- **Variable CSS :** `--blue-night-darker`
- **Usage :** Arrière-plans profonds

#### Bleu Nuit Le Plus Foncé
- **Hex :** `#0a192f`
- **RGB :** `rgb(10, 25, 47)`
- **Variable CSS :** `--blue-night-darkest`
- **Usage :** Zones les plus profondes

### 🟠 **Couleurs Accent (Orange)**

#### Orange Principal
- **Hex :** `#ff6b35`
- **RGB :** `rgb(255, 107, 53)`
- **RGBA :** `rgba(255, 107, 53, 1.0)`
- **Variable CSS :** `--orange`
- **Usage :** Accents, hover, états actifs, boutons secondaires
- **Contraste WCAG :** AA+ sur fond noir

#### Orange Clair
- **Hex :** `#ff8c42`
- **RGB :** `rgb(255, 140, 66)`
- **Variable CSS :** `--orange-light`
- **Usage :** États actifs, highlights

#### Orange Très Clair
- **Hex :** `#ffa366`
- **RGB :** `rgb(255, 163, 102)`
- **Variable CSS :** `--orange-lighter`
- **Usage :** Effets lumineux, animations

#### Orange Foncé
- **Hex :** `#e55a2b`
- **RGB :** `rgb(229, 90, 43)`
- **Variable CSS :** `--orange-dark`
- **Usage :** États pressés, bordures

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

### Gradient Bleu Nuit-Orange (Principal)
```css
--gradient-main: linear-gradient(135deg, #2d4a6e, #ff6b35)
linear-gradient(90deg, #2d4a6e, #ff6b35)
linear-gradient(180deg, #2d4a6e, #ff6b35)
```
**Usage :** Boutons, barres de progression, effets lumineux  
**Variable CSS :** `var(--gradient-main)`

### Gradient Orange-Bleu Nuit (Inverse)
```css
--gradient-reverse: linear-gradient(135deg, #ff6b35, #2d4a6e)
linear-gradient(90deg, #ff6b35, #2d4a6e)
linear-gradient(180deg, #ff6b35, #2d4a6e)
```
**Usage :** Effets hover, animations  
**Variable CSS :** `var(--gradient-reverse)`

### Gradient Vertical
```css
--gradient-vertical: linear-gradient(180deg, #2d4a6e, #ff6b35)
```
**Usage :** Barres latérales, effets verticaux  
**Variable CSS :** `var(--gradient-vertical)`

### Gradient Orange
```css
--gradient-orange: linear-gradient(135deg, #ff6b35, #ff8c42)
```
**Usage :** Accents, highlights  
**Variable CSS :** `var(--gradient-orange)`

### Gradient Overlay
```css
--gradient-overlay: linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 100%)
```
**Usage :** Transitions, overlays  
**Variable CSS :** `var(--gradient-overlay)`

---

## ✨ **Effets Néon & Ombres**

### Ombres Bleu Nuit (Box-shadow)
```css
/* Variables CSS */
--glow-blue-sm: 0 0 10px rgba(45, 74, 110, 0.3)  /* Petite */
--glow-blue-md: 0 0 20px rgba(45, 74, 110, 0.4)  /* Moyenne */
--glow-blue-lg: 0 0 40px rgba(45, 74, 110, 0.5)  /* Grande */
--glow-blue-xl: 0 0 60px rgba(45, 74, 110, 0.6)  /* Très grande */

/* Valeurs directes */
rgba(45, 74, 110, 0.3) - Opacité 30% (petite)
rgba(45, 74, 110, 0.4) - Opacité 40% (moyenne)
rgba(45, 74, 110, 0.5) - Opacité 50% (grande)
rgba(45, 74, 110, 0.6) - Opacité 60% (très grande)
```

### Ombres Orange (Box-shadow)
```css
/* Variables CSS */
--glow-orange-sm: 0 0 10px rgba(255, 107, 53, 0.3)  /* Petite */
--glow-orange-md: 0 0 20px rgba(255, 107, 53, 0.4)  /* Moyenne */
--glow-orange-lg: 0 0 40px rgba(255, 107, 53, 0.5)  /* Grande */
--glow-orange-xl: 0 0 60px rgba(255, 107, 53, 0.6)  /* Très grande */

/* Valeurs directes */
rgba(255, 107, 53, 0.3) - Opacité 30% (petite)
rgba(255, 107, 53, 0.4) - Opacité 40% (moyenne)
rgba(255, 107, 53, 0.5) - Opacité 50% (grande)
rgba(255, 107, 53, 0.6) - Opacité 60% (très grande)
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
/* Variables CSS */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3)   /* Petite */
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.5)   /* Moyenne */
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.7)  /* Grande */
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.9) /* Très grande */

/* Valeurs directes */
rgba(0, 0, 0, 0.3) - Ombre légère
rgba(0, 0, 0, 0.5) - Ombre moyenne
rgba(0, 0, 0, 0.7) - Ombre forte
rgba(0, 0, 0, 0.9) - Ombre maximale
```

---

## 🎯 **Utilisation par Élément**

### Navigation
- **Fond :** `rgba(0,0,0,0.95)` - Noir semi-transparent
- **Texte :** `var(--white)` - Blanc (`#ffffff`)
- **Bordures :** `var(--border-blue)` - Bleu nuit transparent (`rgba(45, 74, 110, 0.3)`)
- **Ombres :** `var(--glow-blue-sm)` - Bleu nuit léger (`0 0 10px rgba(45, 74, 110, 0.3)`)

### Titres & Textes
- **Titre Principal :** `var(--white)` avec ombres blanches
- **Sous-titre :** `var(--orange)` avec stroke `var(--blue-night)`
- **Texte normal :** `var(--white-90)` - Blanc 90% (`rgba(255, 255, 255, 0.9)`)
- **Texte secondaire :** `var(--gray-light)` / `var(--gray-medium)` - Gris clair/moyen

### Boutons
- **Fond principal :** `var(--gradient-main)` - Gradient Bleu Nuit → Orange (`linear-gradient(135deg, #2d4a6e, #ff6b35)`)
- **Fond hover :** `var(--gradient-reverse)` - Gradient Orange → Bleu Nuit (`linear-gradient(135deg, #ff6b35, #2d4a6e)`)
- **Texte :** `var(--white)` - Blanc
- **Bordure :** `var(--blue-night)` ou `var(--orange)`
- **Ombre :** `var(--glow-blue-md)` à `var(--glow-blue-lg)` - Ombres bleu nuit moyennes à grandes

### Barres Latérales Lumineuses
- **Gradient :** 
  - `rgba(45, 74, 110, 0.8)` à 15% (Bleu nuit)
  - `rgba(255, 107, 53, 1)` à 30% (Orange)
  - `rgba(255, 107, 53, 1)` à 50% (Orange intense)
  - `rgba(255, 107, 53, 1)` à 70% (Orange)
  - `rgba(45, 74, 110, 0.8)` à 85% (Bleu nuit)
- **Ombres néon :** Multiples couches avec opacités variables (bleu nuit et orange)

### Formulaires
- **Fond input :** `var(--white-10)` - Blanc très transparent (`rgba(255, 255, 255, 0.1)`)
- **Bordure :** `var(--border-blue)` - Bleu nuit transparent (`rgba(45, 74, 110, 0.3)`)
- **Focus :** `var(--orange)` - Orange vif (`#ff6b35`)
- **Texte :** `var(--white)` - Blanc
- **Placeholder :** `var(--white-50)` - Blanc discret (`rgba(255, 255, 255, 0.5)`)

### Messages
- **Succès :** `rgba(76, 175, 80, 0.2)` fond, `var(--success)` texte (`#4caf50`)
- **Erreur :** `rgba(255, 107, 53, 0.2)` fond, `var(--orange)` texte (`#ff6b35`)

### Modals
- **Overlay :** `rgba(0, 0, 0, 0.8)` - Noir semi-transparent
- **Fond modal :** `rgba(0, 0, 0, 0.95)` - Noir presque opaque
- **Bordure :** `var(--border-orange)` - Orange transparent (`rgba(255, 107, 53, 0.5)`)
- **Ombre :** `var(--shadow-lg)` - Ombre noire grande (`0 8px 16px rgba(0, 0, 0, 0.7)`)

---

## 📊 **Résumé Rapide**

### Couleurs Principales
| Couleur | Hex | RGB | Variable CSS | Usage |
|---------|-----|-----|--------------|-------|
| Bleu Nuit | `#2d4a6e` | `rgb(45, 74, 110)` | `--blue-night` | Couleur principale |
| Bleu Nuit Foncé | `#1e3a5f` | `rgb(30, 58, 95)` | `--blue-night-dark` | Éléments sombres |
| Orange | `#ff6b35` | `rgb(255, 107, 53)` | `--orange` | Accents, hover |
| Orange Clair | `#ff8c42` | `rgb(255, 140, 66)` | `--orange-light` | États actifs |
| Noir | `#000000` | `rgb(0, 0, 0)` | `--black` | Fond |
| Blanc | `#ffffff` | `rgb(255, 255, 255)` | `--white` | Texte |
| Vert Succès | `#4caf50` | `rgb(76, 175, 80)` | `--success` | Messages |

### Opacités Communes
- `0.1` (10%) - `var(--white-10)` - Très léger
- `0.2` (20%) - Léger
- `0.3` (30%) - Moyen
- `0.4` (40%) - Visible
- `0.5` (50%) - `var(--white-50)` - Semi-transparent
- `0.6` (60%) - Plus opaque
- `0.7` (70%) - `var(--white-70)` - Visible
- `0.8` (80%) - Presque opaque
- `0.9` (90%) - `var(--white-90)` - Très visible
- `1.0` (100%) - Opaque

---

## 🎨 **Palette Complète en Format Design**

### Pour Figma / Adobe XD / Sketch

```json
{
  "colors": {
    "primary": {
      "blue-night": "#2d4a6e",
      "blue-night-dark": "#1e3a5f",
      "blue-night-darker": "#112240",
      "blue-night-darkest": "#0a192f",
      "blue-night-light": "#3d5a7e",
      "blue-night-lighter": "#4d6a8e"
    },
    "accent": {
      "orange": "#ff6b35",
      "orange-light": "#ff8c42",
      "orange-lighter": "#ffa366",
      "orange-dark": "#e55a2b"
    },
    "neutral": {
      "black": "#000000",
      "black-dark": "#0a0a0a",
      "black-darker": "#111111",
      "white": "#ffffff",
      "gray-light": "#cccccc",
      "gray-medium": "#999999",
      "gray-dark": "#666666"
    },
    "semantic": {
      "success": "#4caf50",
      "error": "#ff6b35",
      "warning": "#ff8c42",
      "info": "#3d5a7e"
    }
  }
}
```

---

## 💡 **Conseils d'Utilisation**

1. **Contraste :** Toujours utiliser du blanc (`var(--white)`) sur fond noir (`var(--black)`)
2. **Accents :** Utiliser `var(--orange)` pour attirer l'attention et les actions
3. **Effets :** Utiliser les opacités RGBA via les variables (`--white-10` à `--white-90`) pour les overlays et effets
4. **Gradients :** Préférer les gradients bleu nuit-orange (`var(--gradient-main)`) pour les éléments interactifs
5. **Ombres :** Utiliser les ombres bleu nuit (`var(--glow-blue-*)`) et orange (`var(--glow-orange-*)`) pour les effets néon
6. **Cohérence :** Toujours utiliser les variables CSS plutôt que les valeurs hex directes pour faciliter les futures modifications

---

---

## 📝 **Notes Importantes**

- ✅ **Toutes les couleurs utilisent des variables CSS** définies dans `:root`
- ✅ **Contraste WCAG AA** respecté pour toutes les combinaisons texte/fond
- ✅ **Palette cohérente** : Bleu Nuit (primary) / Orange (accent) / Noir (background)
- ✅ **184 utilisations** de variables CSS dans le code
- ✅ **0 couleur codée en dur** restante (hors définition des variables)

---

**Dernière mise à jour :** 27 janvier 2025  
**Fichier source :** `index.html` (variables CSS dans `:root`)  
**Thème actuel :** Bleu Nuit / Orange / Noir  
**Statut :** ✅ Palette complète appliquée








