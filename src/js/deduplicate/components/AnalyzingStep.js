/**
 * Composant d'analyse en cours
 */

export class AnalyzingStep {
  constructor(container) {
    this.container = container
  }

  render(progress = 0) {
    this.container.innerHTML = `
      <div class="deduplicate-step deduplicate-step-analyzing">
        <div class="deduplicate-step-icon deduplicate-spinning">⚙️</div>
        <h3 class="deduplicate-step-title">Étape 2 : Analyse en cours</h3>
        <p class="deduplicate-step-description">
          Détection des fichiers dupliqués en cours...
        </p>
        <div class="deduplicate-progress">
          <div class="deduplicate-progress-bar" style="width: ${progress}%"></div>
        </div>
        <div class="deduplicate-progress-text">${Math.round(progress)}%</div>
      </div>
    `
  }

  updateProgress(progress) {
    const bar = this.container.querySelector('.deduplicate-progress-bar')
    const text = this.container.querySelector('.deduplicate-progress-text')
    if (bar) bar.style.width = `${progress}%`
    if (text) text.textContent = `${Math.round(progress)}%`
  }
}

