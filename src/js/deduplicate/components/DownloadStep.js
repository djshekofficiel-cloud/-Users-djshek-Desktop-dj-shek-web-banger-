/**
 * Composant de confirmation de téléchargement
 */

export class DownloadStep {
  constructor(container, onAction) {
    this.container = container
    this.onAction = onAction
  }

  render(stats) {
    this.container.innerHTML = `
      <div class="deduplicate-step deduplicate-step-download">
        <div class="deduplicate-step-icon">🎉</div>
        <h3 class="deduplicate-step-title">Étape 4 : Téléchargement réussi</h3>
        <p class="deduplicate-step-description">
          Votre ZIP nettoyé a été généré avec succès !
        </p>
        <div class="deduplicate-download-info">
          <div class="deduplicate-download-stats">
            <div class="deduplicate-download-stat">
              <span class="deduplicate-download-stat-value">${stats.kept}</span>
              <span class="deduplicate-download-stat-label">fichiers conservés</span>
            </div>
            <div class="deduplicate-download-stat">
              <span class="deduplicate-download-stat-value">${stats.removed}</span>
              <span class="deduplicate-download-stat-label">doublons supprimés</span>
            </div>
            <div class="deduplicate-download-stat">
              <span class="deduplicate-download-stat-value">${stats.savedPercentage}%</span>
              <span class="deduplicate-download-stat-label">espace économisé</span>
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

    document.getElementById('newAnalysis')?.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.onAction('reset')
    })
  }
}

