/**
 * Système de dédoublonnage de fichiers ZIP
 * Fonctionne entièrement côté client, sans authentification
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
  // content peut être un ArrayBuffer, Uint8Array, ou string
  let data
  if (content instanceof ArrayBuffer) {
    data = new Uint8Array(content)
  } else if (content instanceof Uint8Array) {
    data = content
  } else if (typeof content === 'string') {
    const encoder = new TextEncoder()
    data = encoder.encode(content)
  } else {
    // Si c'est un Buffer (Node.js), convertir
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

    // Extraire tous les fichiers
    for (const [path, zipEntry] of Object.entries(zip.files)) {
      if (!zipEntry.dir) {
        const content = await zipEntry.async('arraybuffer')
        const file = new ExtractedFile(path, content, zipEntry._data.uncompressedSize || 0)
        
        // Calculer le hash
        const hash = await computeHash(content)
        file.hash = hash
        
        files.push(file)
        
        // Grouper par hash
        if (!hashMap.has(hash)) {
          hashMap.set(hash, [])
        }
        hashMap.get(hash).push(file)
      }
    }

    // Identifier les groupes de doublons
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

// Interface utilisateur
export function initDeduplicate() {
  const container = document.getElementById('deduplicate-section')
  if (!container) return

  let currentData = null
  let selectedFiles = new Set()

  // Rendu de l'interface
  function render() {
    if (!currentData) {
      container.innerHTML = `
        <div class="deduplicate-upload">
          <h2 class="deduplicate-title">🔍 Dédoublonnage de Fichiers ZIP</h2>
          <p class="deduplicate-description">
            Téléchargez un fichier ZIP et nous détecterons automatiquement les fichiers dupliqués.
            Vous pourrez ensuite choisir quels fichiers garder et télécharger un ZIP nettoyé.
          </p>
          <label class="deduplicate-upload-label">
            <input type="file" id="zipFileInput" accept=".zip" class="deduplicate-file-input">
            <span class="deduplicate-upload-button">📁 Choisir un fichier ZIP</span>
          </label>
          <div id="deduplicate-status" class="deduplicate-status"></div>
        </div>
      `

      const input = document.getElementById('zipFileInput')
      input?.addEventListener('change', handleFileSelect)
    } else {
      renderResults()
    }
  }

  async function handleFileSelect(e) {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.zip')) {
      showStatus('❌ Veuillez sélectionner un fichier ZIP', 'error')
      return
    }

    showStatus('⏳ Analyse en cours...', 'loading')

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

      render()
    } catch (error) {
      showStatus('❌ Erreur lors du traitement: ' + error.message, 'error')
    }
  }

  function renderResults() {
    const { files, duplicateGroups, totalFiles, totalDuplicates } = currentData

    let html = `
      <div class="deduplicate-results">
        <h2 class="deduplicate-title">📊 Résultats de l'analyse</h2>
        
        <div class="deduplicate-stats">
          <div class="deduplicate-stat">
            <span class="deduplicate-stat-label">Fichiers totaux</span>
            <span class="deduplicate-stat-value">${totalFiles}</span>
          </div>
          <div class="deduplicate-stat">
            <span class="deduplicate-stat-label">Groupes de doublons</span>
            <span class="deduplicate-stat-value">${duplicateGroups.length}</span>
          </div>
          <div class="deduplicate-stat">
            <span class="deduplicate-stat-label">Fichiers dupliqués</span>
            <span class="deduplicate-stat-value">${totalDuplicates}</span>
          </div>
          <div class="deduplicate-stat">
            <span class="deduplicate-stat-label">Fichiers sélectionnés</span>
            <span class="deduplicate-stat-value">${selectedFiles.size}</span>
          </div>
        </div>

        <div class="deduplicate-actions">
          <button id="autoKeepFirst" class="deduplicate-btn deduplicate-btn-secondary">Garder le premier</button>
          <button id="autoKeepLatest" class="deduplicate-btn deduplicate-btn-secondary">Garder le plus récent</button>
          <button id="autoKeepLargest" class="deduplicate-btn deduplicate-btn-secondary">Garder le plus lourd</button>
        </div>
    `

    if (duplicateGroups.length > 0) {
      html += `
        <div class="deduplicate-groups">
          <h3 class="deduplicate-subtitle">Groupes de fichiers dupliqués</h3>
      `

      duplicateGroups.forEach((group, groupIndex) => {
        html += `
          <div class="deduplicate-group">
            <h4 class="deduplicate-group-title">Groupe ${groupIndex + 1} (${group.files.length} fichiers identiques)</h4>
            <table class="deduplicate-table">
              <thead>
                <tr>
                  <th>Sélection</th>
                  <th>Chemin</th>
                  <th>Taille</th>
                </tr>
              </thead>
              <tbody>
        `

        group.files.forEach(file => {
          const isSelected = selectedFiles.has(file.path)
          html += `
            <tr class="${isSelected ? 'deduplicate-selected' : ''}">
              <td>
                <input type="radio" name="group-${groupIndex}" value="${file.path}" 
                  ${isSelected ? 'checked' : ''} 
                  onchange="window.deduplicateSelectFile('${file.path}', ${groupIndex})">
              </td>
              <td>${file.path}</td>
              <td>${formatSize(file.size)}</td>
            </tr>
          `
        })

        html += `
              </tbody>
            </table>
          </div>
        `
      })

      html += `</div>`
    } else {
      html += `
        <div class="deduplicate-no-duplicates">
          <p>✅ Aucun doublon détecté ! Tous les fichiers sont uniques.</p>
        </div>
      `
    }

    html += `
        <div class="deduplicate-download">
          <button id="generateZip" class="deduplicate-btn deduplicate-btn-primary">
            📥 Télécharger le ZIP nettoyé
          </button>
        </div>

        <div class="deduplicate-reset">
          <button id="resetAnalysis" class="deduplicate-btn deduplicate-btn-text">
            🔄 Analyser un autre fichier
          </button>
        </div>
      </div>
    `

    container.innerHTML = html

    // Event listeners
    document.getElementById('autoKeepFirst')?.addEventListener('click', () => applyAutoRule('first'))
    document.getElementById('autoKeepLatest')?.addEventListener('click', () => applyAutoRule('latest'))
    document.getElementById('autoKeepLargest')?.addEventListener('click', () => applyAutoRule('largest'))
    document.getElementById('generateZip')?.addEventListener('click', handleGenerateZip)
    document.getElementById('resetAnalysis')?.addEventListener('click', () => {
      currentData = null
      selectedFiles = new Set()
      render()
    })
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

    // Ajouter tous les fichiers non dupliqués
    currentData.files.forEach(file => {
      if (!currentData.duplicateGroups.some(g => g.files.some(f => f.path === file.path))) {
        selectedFiles.add(file.path)
      }
    })

    render()
  }

  // Exposer la fonction de sélection pour les radio buttons
  window.deduplicateSelectFile = (filePath, groupIndex) => {
    const group = currentData.duplicateGroups[groupIndex]
    // Désélectionner les autres fichiers du groupe
    group.files.forEach(f => selectedFiles.delete(f.path))
    // Sélectionner le fichier choisi
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
      showStatus('✅ ZIP nettoyé téléchargé avec succès !', 'success')
    } catch (error) {
      showStatus('❌ Erreur lors de la génération du ZIP: ' + error.message, 'error')
    }
  }

  function showStatus(message, type) {
    const statusEl = document.getElementById('deduplicate-status')
    if (statusEl) {
      statusEl.textContent = message
      statusEl.className = `deduplicate-status deduplicate-status-${type}`
    }
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  render()
}
