/**
 * Composant d'affichage des résultats
 */

import { zipService } from '../services/zipService.js'

export class ResultsStep {
  constructor(container, onAction) {
    this.container = container
    this.onAction = onAction
  }

  render(state) {
    const { stats, duplicateGroups, uniqueFiles, selectedFiles } = state

    this.container.innerHTML = `
      <div class="deduplicate-step deduplicate-step-results">
        <div class="deduplicate-step-header">
          <div class="deduplicate-step-icon">✅</div>
          <h3 class="deduplicate-step-title">Étape 3 : Résultats de l'analyse</h3>
        </div>

        <div class="deduplicate-summary">
          <div class="deduplicate-summary-item">
            <div class="deduplicate-summary-value">${stats.totalFiles}</div>
            <div class="deduplicate-summary-label">Fichiers totaux</div>
          </div>
          <div class="deduplicate-summary-item">
            <div class="deduplicate-summary-value">${stats.totalGroups}</div>
            <div class="deduplicate-summary-label">Groupes de doublons</div>
          </div>
          <div class="deduplicate-summary-item">
            <div class="deduplicate-summary-value">${stats.totalDuplicates}</div>
            <div class="deduplicate-summary-label">Fichiers dupliqués</div>
          </div>
          <div class="deduplicate-summary-item deduplicate-summary-selected">
            <div class="deduplicate-summary-value">${selectedFiles.size}</div>
            <div class="deduplicate-summary-label">Fichiers à conserver</div>
          </div>
        </div>

        ${duplicateGroups.length > 0 ? this.renderGroups(duplicateGroups, selectedFiles) : this.renderNoDuplicates()}

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

    this.attachEvents(state)
  }

  renderGroups(groups, selectedFiles) {
    return `
      <div class="deduplicate-quick-actions">
        <span class="deduplicate-quick-label">Résolution rapide :</span>
        <button class="deduplicate-quick-btn" data-rule="first">Garder le premier</button>
        <button class="deduplicate-quick-btn" data-rule="latest">Garder le plus récent</button>
        <button class="deduplicate-quick-btn" data-rule="largest">Garder le plus lourd</button>
      </div>

      <div class="deduplicate-groups-container">
        ${groups.map((group, index) => this.renderGroup(group, index, selectedFiles)).join('')}
      </div>
    `
  }

  renderGroup(group, index, selectedFiles) {
    return `
      <div class="deduplicate-group-card">
        <div class="deduplicate-group-header">
          <span class="deduplicate-group-badge">Groupe ${index + 1}</span>
          <span class="deduplicate-group-count">${group.files.length} fichiers identiques</span>
        </div>
        <div class="deduplicate-group-files">
          ${group.files.map(file => this.renderFile(file, group.id, selectedFiles.has(file.path))).join('')}
        </div>
      </div>
    `
  }

  renderFile(file, groupId, isSelected) {
    return `
      <label class="deduplicate-file-item ${isSelected ? 'deduplicate-file-selected' : ''}">
        <input type="radio" name="group-${groupId}" value="${file.path}" 
          ${isSelected ? 'checked' : ''} 
          data-group="${groupId}">
        <div class="deduplicate-file-info">
          <div class="deduplicate-file-path">${file.path}</div>
          <div class="deduplicate-file-size">${zipService.formatFileSize(file.size)}</div>
        </div>
        ${isSelected ? '<div class="deduplicate-file-check">✓</div>' : ''}
      </label>
    `
  }

  renderNoDuplicates() {
    return `
      <div class="deduplicate-no-duplicates">
        <div class="deduplicate-no-duplicates-icon">🎉</div>
        <p>Aucun doublon détecté ! Tous vos fichiers sont uniques.</p>
      </div>
    `
  }

  attachEvents(state) {
    // Quick actions
    document.querySelectorAll('.deduplicate-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rule = btn.dataset.rule
        this.onAction('applyRule', { rule })
      })
    })

    // File selection via radio buttons
    document.querySelectorAll('.deduplicate-results-table input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.onAction('selectFile', {
            path: e.target.value,
            groupId: e.target.dataset.group
          })
        }
      })
    })

    // Action buttons in table
    document.querySelectorAll('.deduplicate-action-btn-small').forEach(btn => {
      btn.addEventListener('click', () => {
        this.onAction('selectFile', {
          path: btn.dataset.path,
          groupId: btn.dataset.group
        })
      })
    })

    // Generate ZIP
    document.getElementById('generateZip')?.addEventListener('click', () => {
      this.onAction('generateZip')
    })

    // Reset
    document.getElementById('resetAnalysis')?.addEventListener('click', () => {
      this.onAction('reset')
    })
  }
}

