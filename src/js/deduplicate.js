/**
 * Système de dédoublonnage de fichiers ZIP - Architecture refaite
 * Interface en étapes (wizard) avec meilleure organisation
 */

import JSZip from 'jszip'

// Interface pour les fichiers extraits
class ExtractedFile {
  constructor(path, content, size) {
    this.path = path
    this.content = content
    this.size = size
    this.hash = null
  }
}

// Calcul du hash SHA-256
async function computeHash(content) {
  let data
  if (content instanceof ArrayBuffer) {
    data = new Uint8Array(content)
  } else if (content instanceof Uint8Array) {
    data = content
  } else if (typeof content === 'string') {
    const encoder = new TextEncoder()
    data = encoder.encode(content)
  } else {
    data = new Uint8Array(content)
  }
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Extraction et analyse d'un ZIP
async function processZip(file) {
  try {
    const zip = await JSZip.loadAsync(file)
    const files = []
    const hashMap = new Map()

    for (const [path, zipEntry] of Object.entries(zip.files)) {
      if (!zipEntry.dir) {
        const content = await zipEntry.async('arraybuffer')
        const file = new ExtractedFile(path, content, zipEntry._data.uncompressedSize || 0)
        
        const hash = await computeHash(content)
        file.hash = hash
        
        files.push(file)
        
        if (!hashMap.has(hash)) {
          hashMap.set(hash, [])
        }
        hashMap.get(hash).push(file)
      }
    }

    const duplicateGroups = []
    for (const [hash, fileList] of hashMap.entries()) {
      if (fileList.length > 1) {
        duplicateGroups.push({
          hash,
          files: fileList
        })
      }
    }

    return {
      files,
      duplicateGroups,
      totalFiles: files.length,
      totalDuplicates: duplicateGroups.reduce((sum, group) => sum + group.files.length - 1, 0)
    }
  } catch (error) {
    throw new Error('Erreur lors du traitement du ZIP: ' + error.message)
  }
}

// Générer un ZIP nettoyé
async function generateCleanZip(files, keptFileIds) {
  const zip = new JSZip()
  
  for (const file of files) {
    if (keptFileIds.has(file.path)) {
      zip.file(file.path, file.content)
    }
  }

  return await zip.generateAsync({ type: 'arraybuffer' })
}

// Télécharger un fichier
function downloadFile(buffer, filename) {
  const blob = new Blob([buffer], { type: 'application/zip' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Interface utilisateur - Architecture en étapes
export function initDeduplicate() {
  const container = document.getElementById('deduplicate-section')
  if (!container) return

  let currentData = null
  let selectedFiles = new Set()
  let currentStep = 'upload' // upload, analyzing, results, download

  // Rendu principal
  function render() {
    switch (currentStep) {
      case 'upload':
        renderUploadStep()
        break
      case 'analyzing':
        renderAnalyzingStep()
        break
      case 'results':
        renderResultsStep()
        break
      case 'download':
        renderDownloadStep()
        break
    }
  }

  // Étape 1: Upload
  function renderUploadStep() {
    container.innerHTML = `
      <div class="deduplicate-step deduplicate-step-upload">
        <div class="deduplicate-step-icon">📤</div>
        <h3 class="deduplicate-step-title">Étape 1 : Téléverser votre ZIP</h3>
        <p class="deduplicate-step-description">
          Sélectionnez votre fichier ZIP à analyser. Le traitement se fait entièrement dans votre navigateur, vos fichiers ne quittent jamais votre ordinateur.
        </p>
        <label class="deduplicate-upload-zone">
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

    const input = document.getElementById('zipFileInput')
    const uploadZone = container.querySelector('.deduplicate-upload-zone')
    
    input?.addEventListener('change', handleFileSelect)
    
    // Drag & Drop
    uploadZone?.addEventListener('dragover', (e) => {
      e.preventDefault()
      uploadZone.classList.add('deduplicate-drag-over')
    })
    
    uploadZone?.addEventListener('dragleave', () => {
      uploadZone.classList.remove('deduplicate-drag-over')
    })
    
    uploadZone?.addEventListener('drop', (e) => {
      e.preventDefault()
      uploadZone.classList.remove('deduplicate-drag-over')
      const file = e.dataTransfer.files[0]
      if (file && file.name.endsWith('.zip')) {
        handleFile(file)
      } else {
        showStatus('❌ Veuillez déposer un fichier ZIP', 'error')
      }
    })
  }

  // Étape 2: Analyse en cours
  function renderAnalyzingStep() {
    container.innerHTML = `
      <div class="deduplicate-step deduplicate-step-analyzing">
        <div class="deduplicate-step-icon deduplicate-spinning">⚙️</div>
        <h3 class="deduplicate-step-title">Étape 2 : Analyse en cours</h3>
        <p class="deduplicate-step-description">
          Détection des fichiers dupliqués en cours...
        </p>
        <div class="deduplicate-progress">
          <div class="deduplicate-progress-bar"></div>
        </div>
      </div>
    `
  }

  // Étape 3: Résultats et sélection
  function renderResultsStep() {
    const { files, duplicateGroups, totalFiles, totalDuplicates } = currentData
    const uniqueFiles = totalFiles - totalDuplicates - duplicateGroups.length

    container.innerHTML = `
      <div class="deduplicate-step deduplicate-step-results">
        <div class="deduplicate-step-header">
          <div class="deduplicate-step-icon">✅</div>
          <h3 class="deduplicate-step-title">Étape 3 : Résultats de l'analyse</h3>
        </div>

        <div class="deduplicate-summary">
          <div class="deduplicate-summary-item">
            <div class="deduplicate-summary-value">${totalFiles}</div>
            <div class="deduplicate-summary-label">Fichiers totaux</div>
          </div>
          <div class="deduplicate-summary-item">
            <div class="deduplicate-summary-value">${duplicateGroups.length}</div>
            <div class="deduplicate-summary-label">Groupes de doublons</div>
          </div>
          <div class="deduplicate-summary-item">
            <div class="deduplicate-summary-value">${totalDuplicates}</div>
            <div class="deduplicate-summary-label">Fichiers dupliqués</div>
          </div>
          <div class="deduplicate-summary-item deduplicate-summary-selected">
            <div class="deduplicate-summary-value">${selectedFiles.size}</div>
            <div class="deduplicate-summary-label">Fichiers à conserver</div>
          </div>
        </div>

        ${duplicateGroups.length > 0 ? `
          <div class="deduplicate-quick-actions">
            <span class="deduplicate-quick-label">Résolution rapide :</span>
            <button id="autoKeepFirst" class="deduplicate-quick-btn">Garder le premier</button>
            <button id="autoKeepLatest" class="deduplicate-quick-btn">Garder le plus récent</button>
            <button id="autoKeepLargest" class="deduplicate-quick-btn">Garder le plus lourd</button>
          </div>

          <div class="deduplicate-groups-container">
            ${duplicateGroups.map((group, groupIndex) => `
              <div class="deduplicate-group-card">
                <div class="deduplicate-group-header">
                  <span class="deduplicate-group-badge">Groupe ${groupIndex + 1}</span>
                  <span class="deduplicate-group-count">${group.files.length} fichiers identiques</span>
                </div>
                <div class="deduplicate-group-files">
                  ${group.files.map((file, fileIndex) => {
                    const isSelected = selectedFiles.has(file.path)
                    return `
                      <label class="deduplicate-file-item ${isSelected ? 'deduplicate-file-selected' : ''}">
                        <input type="radio" name="group-${groupIndex}" value="${file.path}" 
                          ${isSelected ? 'checked' : ''} 
                          onchange="window.deduplicateSelectFile('${file.path}', ${groupIndex})">
                        <div class="deduplicate-file-info">
                          <div class="deduplicate-file-path">${file.path}</div>
                          <div class="deduplicate-file-size">${formatSize(file.size)}</div>
                        </div>
                        ${isSelected ? '<div class="deduplicate-file-check">✓</div>' : ''}
                      </label>
                    `
                  }).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="deduplicate-no-duplicates">
            <div class="deduplicate-no-duplicates-icon">🎉</div>
            <p>Aucun doublon détecté ! Tous vos fichiers sont uniques.</p>
          </div>
        `}

        <div class="deduplicate-step-actions">
          <button id="generateZip" class="deduplicate-action-btn deduplicate-action-primary">
            📥 Générer le ZIP nettoyé
          </button>
          <button id="resetAnalysis" class="deduplicate-action-btn deduplicate-action-secondary">
            🔄 Analyser un autre fichier
          </button>
        </div>
      </div>
    `

    // Event listeners
    document.getElementById('autoKeepFirst')?.addEventListener('click', () => applyAutoRule('first'))
    document.getElementById('autoKeepLatest')?.addEventListener('click', () => applyAutoRule('latest'))
    document.getElementById('autoKeepLargest')?.addEventListener('click', () => applyAutoRule('largest'))
    document.getElementById('generateZip')?.addEventListener('click', handleGenerateZip)
    document.getElementById('resetAnalysis')?.addEventListener('click', () => {
      currentData = null
      selectedFiles = new Set()
      currentStep = 'upload'
      render()
    })
  }

  // Étape 4: Téléchargement
  function renderDownloadStep() {
    container.innerHTML = `
      <div class="deduplicate-step deduplicate-step-download">
        <div class="deduplicate-step-icon">🎉</div>
        <h3 class="deduplicate-step-title">Étape 4 : Téléchargement réussi</h3>
        <p class="deduplicate-step-description">
          Votre ZIP nettoyé a été généré avec succès !
        </p>
        <div class="deduplicate-download-info">
          <div class="deduplicate-download-stats">
            <div class="deduplicate-download-stat">
              <span class="deduplicate-download-stat-value">${selectedFiles.size}</span>
              <span class="deduplicate-download-stat-label">fichiers conservés</span>
            </div>
            <div class="deduplicate-download-stat">
              <span class="deduplicate-download-stat-value">${currentData.totalFiles - selectedFiles.size}</span>
              <span class="deduplicate-download-stat-label">doublons supprimés</span>
            </div>
          </div>
        </div>
        <div class="deduplicate-step-actions">
          <button id="newAnalysis" class="deduplicate-action-btn deduplicate-action-primary">
            🔄 Nouvelle analyse
          </button>
        </div>
      </div>
    `

    document.getElementById('newAnalysis')?.addEventListener('click', () => {
      currentData = null
      selectedFiles = new Set()
      currentStep = 'upload'
      render()
    })
  }

  async function handleFileSelect(e) {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  async function handleFile(file) {
    if (!file.name.endsWith('.zip')) {
      showStatus('❌ Veuillez sélectionner un fichier ZIP', 'error')
      return
    }

    currentStep = 'analyzing'
    render()

    try {
      const data = await processZip(file)
      currentData = data
      
      // Pré-sélectionner le premier fichier de chaque groupe
      selectedFiles = new Set()
      data.duplicateGroups.forEach(group => {
        if (group.files.length > 0) {
          selectedFiles.add(group.files[0].path)
        }
      })
      // Ajouter tous les fichiers non dupliqués
      data.files.forEach(file => {
        if (!data.duplicateGroups.some(g => g.files.some(f => f.path === file.path))) {
          selectedFiles.add(file.path)
        }
      })

      currentStep = 'results'
      render()
    } catch (error) {
      currentStep = 'upload'
      render()
      showStatus('❌ Erreur: ' + error.message, 'error')
    }
  }

  function applyAutoRule(rule) {
    selectedFiles = new Set()
    
    currentData.duplicateGroups.forEach(group => {
      let fileToKeep
      if (rule === 'first') {
        fileToKeep = group.files[0]
      } else if (rule === 'latest') {
        fileToKeep = group.files[group.files.length - 1]
      } else if (rule === 'largest') {
        fileToKeep = group.files.reduce((max, f) => f.size > max.size ? f : max, group.files[0])
      }
      if (fileToKeep) {
        selectedFiles.add(fileToKeep.path)
      }
    })

    currentData.files.forEach(file => {
      if (!currentData.duplicateGroups.some(g => g.files.some(f => f.path === file.path))) {
        selectedFiles.add(file.path)
      }
    })

    render()
  }

  window.deduplicateSelectFile = (filePath, groupIndex) => {
    const group = currentData.duplicateGroups[groupIndex]
    group.files.forEach(f => selectedFiles.delete(f.path))
    selectedFiles.add(filePath)
    render()
  }

  async function handleGenerateZip() {
    if (selectedFiles.size === 0) {
      alert('Veuillez sélectionner au moins un fichier à garder')
      return
    }

    try {
      const zipBuffer = await generateCleanZip(currentData.files, selectedFiles)
      const filename = `clean_${Date.now()}.zip`
      downloadFile(zipBuffer, filename)
      currentStep = 'download'
      render()
    } catch (error) {
      showStatus('❌ Erreur lors de la génération: ' + error.message, 'error')
    }
  }

  function showStatus(message, type) {
    const statusEl = document.getElementById('deduplicate-status')
    if (statusEl) {
      statusEl.textContent = message
      statusEl.className = `deduplicate-status deduplicate-status-${type}`
      setTimeout(() => {
        statusEl.textContent = ''
        statusEl.className = 'deduplicate-status'
      }, 5000)
    }
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  render()
}
