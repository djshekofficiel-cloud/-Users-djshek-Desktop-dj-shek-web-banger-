/**
 * Composant d'upload de fichier ZIP
 */

import { zipService } from '../services/zipService.js'

export { zipService }

export class UploadStep {
  constructor(container, onFileSelected) {
    this.container = container
    this.onFileSelected = onFileSelected
    this.setupDragAndDrop()
  }

  render() {
    this.container.innerHTML = `
      <section class="deduplicate-app-body">
        <div class="deduplicate-app-card">
          <h3>Espace d'import</h3>
          <div class="deduplicate-dropzone" id="uploadZone">
            <p>Glissez-déposez votre fichier ZIP ici ou sélectionnez-le depuis votre appareil.</p>
            <label for="zipFileInput">
              <button class="deduplicate-primary-btn" type="button">Importer un fichier ZIP</button>
            </label>
            <input type="file" id="zipFileInput" accept=".zip" class="deduplicate-file-input">
            <p class="deduplicate-hint">
              Format accepté : <code>.ZIP</code>
            </p>
          </div>
          <div class="deduplicate-stats-row" id="uploadStats" style="display: none;">
            <div class="deduplicate-stat-chip">
              <span class="deduplicate-stat-value">0</span>
              <span><span class="deduplicate-stat-dot"></span>Fichiers analysés</span>
            </div>
            <div class="deduplicate-stat-chip">
              <span class="deduplicate-stat-value">0</span>
              <span><span class="deduplicate-stat-dot"></span>Doublons trouvés</span>
            </div>
          </div>
        </div>
        <div class="deduplicate-app-card" id="resultsCard" style="display: none;">
          <div class="deduplicate-results-header">
            <div>
              <h3>Doublons détectés</h3>
              <span class="deduplicate-results-meta">Prévisualisez et choisissez les fichiers à conserver.</span>
            </div>
            <span class="deduplicate-results-badge">Tri intelligent activé</span>
          </div>
          <div id="resultsContent"></div>
        </div>
      </section>
      <div id="deduplicate-status" class="deduplicate-status"></div>
    `

    this.attachEvents()
    this.setupDragAndDrop()
  }

  attachEvents() {
    const input = document.getElementById('zipFileInput')
    const label = document.querySelector('label[for="zipFileInput"]')
    
    input?.addEventListener('change', (e) => {
      const file = e.target.files[0]
      if (file && zipService.isValidZip(file)) {
        this.onFileSelected(file)
      } else {
        this.showError('Veuillez sélectionner un fichier ZIP valide')
      }
    })

    label?.addEventListener('click', (e) => {
      e.preventDefault()
      input?.click()
    })
  }

  setupDragAndDrop() {
    const uploadZone = document.getElementById('uploadZone')
    if (!uploadZone) return

    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault()
      uploadZone.classList.add('deduplicate-drag-over')
    })

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('deduplicate-drag-over')
    })

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault()
      uploadZone.classList.remove('deduplicate-drag-over')
      const file = e.dataTransfer.files[0]
      if (file && zipService.isValidZip(file)) {
        this.onFileSelected(file)
      } else {
        this.showError('Veuillez déposer un fichier ZIP valide')
      }
    })
  }

  showError(message) {
    const status = document.getElementById('deduplicate-status')
    if (status) {
      status.textContent = `❌ ${message}`
      status.className = 'deduplicate-status deduplicate-status-error'
      setTimeout(() => {
        status.textContent = ''
        status.className = 'deduplicate-status'
      }, 5000)
    }
  }
}

