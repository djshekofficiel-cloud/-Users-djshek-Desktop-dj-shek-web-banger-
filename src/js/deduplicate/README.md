# Application de Dédoublonnage - Architecture

## 📁 Structure de l'application

```
deduplicate/
├── app.js                    # Application principale (orchestrateur)
├── store/
│   └── appStore.js          # Gestion d'état centralisée
├── services/
│   ├── zipService.js        # Gestion des fichiers ZIP
│   ├── hashService.js       # Calcul de hash et détection de doublons
│   └── resolutionService.js # Résolution des doublons (règles auto/manuelle)
└── components/
    ├── UploadStep.js        # Composant d'upload
    ├── AnalyzingStep.js     # Composant d'analyse
    ├── ResultsStep.js       # Composant de résultats
    └── DownloadStep.js      # Composant de téléchargement
```

## 🏗️ Architecture

### Pattern MVC-like
- **Model** : `appStore.js` - Gestion d'état
- **View** : `components/*` - Composants UI
- **Controller** : `app.js` - Orchestration

### Services
Chaque service a une responsabilité unique :
- **ZipService** : Extraction, création, téléchargement de ZIP
- **HashService** : Calcul SHA-256, groupement par hash
- **ResolutionService** : Règles de résolution, validation

### Store (State Management)
- État centralisé dans `appStore`
- Pattern Observer pour les mises à jour
- Actions claires et prévisibles

## 🔄 Flux de données

1. **Upload** → `UploadStep` → `app.handleFileUpload()`
2. **Analyse** → `zipService.extractZip()` → `hashService.computeHashes()` → `hashService.groupByHash()`
3. **Résultats** → `appStore.setAnalysisResult()` → `ResultsStep.render()`
4. **Sélection** → `appStore.selectFile()` ou `appStore.applyAutoRule()`
5. **Génération** → `zipService.createZip()` → `zipService.downloadFile()`

## 🎯 Avantages de cette architecture

- ✅ **Modulaire** : Chaque partie est indépendante
- ✅ **Testable** : Services isolés, faciles à tester
- ✅ **Maintenable** : Code organisé et documenté
- ✅ **Extensible** : Facile d'ajouter de nouvelles fonctionnalités
- ✅ **Réutilisable** : Services utilisables ailleurs

## 🚀 Utilisation

```javascript
import { initDeduplicate } from './js/deduplicate.js'

// Initialise l'application
initDeduplicate()
```

L'application se charge automatiquement dans `#deduplicate-section`.

## 📦 Dépendances

- `jszip` : Gestion des fichiers ZIP côté client
- `crypto.subtle` : API native pour le hash SHA-256

## 🔧 Extension future

Pour ajouter de nouvelles fonctionnalités :
1. Créer un nouveau service dans `services/`
2. Ajouter les actions dans `appStore.js`
3. Créer un composant dans `components/` si nécessaire
4. Intégrer dans `app.js`

