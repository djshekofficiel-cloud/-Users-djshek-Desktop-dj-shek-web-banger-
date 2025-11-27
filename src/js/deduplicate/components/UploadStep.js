/**
 * Composant d'upload de fichier ZIP
 */

import { zipService } from '../services/zipService.js'

export { zipService }

export class UploadStep {
  constructor(container, onFileSelected) {
    this.container = container
    this.onFileSelected = onFileSelected
  }

  render() {
    this.container.innerHTML = `
      <section class="deduplicate-app-body">
        <div class="deduplicate-app-card">
          <h3>Espace d'import</h3>
          <div class="deduplicate-dropzone" id="uploadZone">
            <p>Glissez-déposez vos fichiers (ZIP ou fichiers individuels) ici ou sélectionnez-les depuis votre appareil.</p>
            <label for="fileInput">
              <button class="deduplicate-primary-btn" type="button">Importer des fichiers</button>
            </label>
            <input type="file" id="fileInput" multiple class="deduplicate-file-input">
            <p class="deduplicate-hint">
              Formats acceptés : <code>.ZIP</code> ou <code>fichiers individuels</code>
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
    const input = document.getElementById('fileInput')
    const label = document.querySelector('label[for="fileInput"]')
    
    input?.addEventListener('change', (e) => {
      const files = Array.from(e.target.files)
      if (files.length === 0) {
        this.showError('Veuillez sélectionner au moins un fichier')
        return
      }

      // Si un seul fichier ZIP est sélectionné, traiter comme ZIP
      if (files.length === 1 && zipService.isValidZip(files[0])) {
        this.onFileSelected(files[0], 'zip')
      } else {
        // Sinon, traiter comme fichiers individuels
        this.onFileSelected(files, 'files')
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
      const files = Array.from(e.dataTransfer.files)
      
      if (files.length === 0) {
        this.showError('Veuillez déposer au moins un fichier')
        return
      }

      // Si un seul fichier ZIP est déposé, traiter comme ZIP
      if (files.length === 1 && zipService.isValidZip(files[0])) {
        this.onFileSelected(files[0], 'zip')
      } else {
        // Sinon, traiter comme fichiers individuels
        this.onFileSelected(files, 'files')
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

