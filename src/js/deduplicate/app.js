/**
 * Application principale de dédoublonnage
 * Orchestre tous les services et composants
 */

import { appStore } from './store/appStore.js'
import { zipService } from './services/zipService.js'
import { hashService } from './services/hashService.js'
import { resolutionService } from './services/resolutionService.js'
import { UploadStep } from './components/UploadStep.js'
import { AnalyzingStep } from './components/AnalyzingStep.js'
import { ResultsStep } from './components/ResultsStep.js'
import { DownloadStep } from './components/DownloadStep.js'

export class DeduplicateApp {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    if (!this.container) {
      console.error(`Container #${containerId} not found`)
      return
    }

    this.store = appStore
    this.components = {
      upload: null,
      analyzing: null,
      results: null,
      download: null
    }

    this.init()
  }

  init() {
    // Initialiser les composants
    this.components.upload = new UploadStep(this.container, (file) => this.handleFileUpload(file))
    this.components.analyzing = new AnalyzingStep(this.container)
    this.components.results = new ResultsStep(this.container, (action, data) => this.handleAction(action, data))
    this.components.download = new DownloadStep(this.container, (action) => this.handleAction(action))

    // S'abonner aux changements d'état
    this.store.subscribe((state) => this.render(state))

    // Rendu initial
    this.render(this.store.state)
  }

  async handleFileUpload(file) {
    try {
      this.store.setStep('analyzing')
      this.store.setProcessing(true)
      this.store.setError(null)

      // Étape 1: Extraire le ZIP
      this.components.analyzing.render(10)
      const files = await zipService.extractZip(file)

      // Étape 2: Calculer les hashs
      this.components.analyzing.render(30)
      const filesWithHash = await hashService.computeHashes(
        files,
        (current, total) => {
          const progress = 30 + (current / total) * 50
          this.components.analyzing.updateProgress(progress)
        }
      )

      // Étape 3: Grouper les doublons
      this.components.analyzing.render(90)
      const result = hashService.groupByHash(filesWithHash)

      // Finaliser
      this.components.analyzing.render(100)
      await new Promise(resolve => setTimeout(resolve, 500))

      this.store.setAnalysisResult(result)
    } catch (error) {
      this.store.setError(error.message)
      console.error('Erreur lors du traitement:', error)
    } finally {
      this.store.setProcessing(false)
    }
  }

  handleAction(action, data) {
    switch (action) {
      case 'applyRule':
        this.store.applyAutoRule(data.rule, resolutionService)
        break

      case 'selectFile':
        this.store.selectFile(data.path, data.groupId)
        break

      case 'generateZip':
        this.generateCleanZip()
        break

      case 'reset':
        this.store.reset()
        break

      default:
        console.warn('Action inconnue:', action)
    }
  }

  async generateCleanZip() {
    try {
      const state = this.store.state
      
      // Valider la sélection
      const validation = resolutionService.validateSelection(
        state.selectedFiles,
        state.files,
        state.duplicateGroups
      )

      if (!validation.valid) {
        alert(validation.errors.join('\n'))
        return
      }

      this.store.setStep('analyzing')
      this.components.analyzing.render(50)

      // Générer le ZIP
      const zipBuffer = await zipService.createZip(state.files, state.selectedFiles)
      
      this.components.analyzing.render(100)
      await new Promise(resolve => setTimeout(resolve, 300))

      // Télécharger
      const filename = `clean_${Date.now()}.zip`
      zipService.downloadFile(zipBuffer, filename)

      // Calculer les stats
      const stats = resolutionService.calculateStats(
        state.selectedFiles,
        state.stats.totalFiles
      )

      this.store.setStep('download')
      this.components.download.render(stats)
    } catch (error) {
      this.store.setError(error.message)
      console.error('Erreur lors de la génération:', error)
    }
  }

  render(state) {
    switch (state.currentStep) {
      case 'upload':
        this.components.upload.render()
        break

      case 'analyzing':
        this.components.analyzing.render(state.progress)
        break

      case 'results':
        this.components.results.render(state)
        break

      case 'download':
        // Déjà rendu par generateCleanZip
        break

      default:
        this.components.upload.render()
    }

    // Afficher les erreurs
    if (state.error) {
      this.showError(state.error)
    }
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

