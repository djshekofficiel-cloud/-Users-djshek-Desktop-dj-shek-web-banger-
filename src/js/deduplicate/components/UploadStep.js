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
      <div class="deduplicate-step deduplicate-step-upload">
        <div class="deduplicate-step-icon">📤</div>
        <h3 class="deduplicate-step-title">Étape 1 : Téléverser votre ZIP</h3>
        <p class="deduplicate-step-description">
          Sélectionnez votre fichier ZIP à analyser. Le traitement se fait entièrement dans votre navigateur, vos fichiers ne quittent jamais votre ordinateur.
        </p>
        <label class="deduplicate-upload-zone" id="uploadZone">
          <input type="file" id="zipFileInput" accept=".zip" class="deduplicate-file-input">
          <div class="deduplicate-upload-box">
            <div class="deduplicate-upload-icon">📁</div>
            <div class="deduplicate-upload-text">
              <span class="deduplicate-upload-main">Cliquez pour sélectionner</span>
              <span class="deduplicate-upload-sub">ou glissez-déposez votre fichier ZIP</span>
            </div>
          </div>
        </label>
        <div id="deduplicate-status" class="deduplicate-status"></div>
      </div>
    `

    this.attachEvents()
  }

  attachEvents() {
    const input = document.getElementById('zipFileInput')
    input?.addEventListener('change', (e) => {
      const file = e.target.files[0]
      if (file && zipService.isValidZip(file)) {
        this.onFileSelected(file)
      } else {
        this.showError('Veuillez sélectionner un fichier ZIP valide')
      }
    })
  }

  setupDragAndDrop() {
    // Sera attaché après le render
    setTimeout(() => {
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
    }, 100)
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

