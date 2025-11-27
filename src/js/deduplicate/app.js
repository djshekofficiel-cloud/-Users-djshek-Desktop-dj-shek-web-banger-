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
    this.components.upload = new UploadStep(this.container, (files, type) => this.handleFileUpload(files, type))
    this.components.analyzing = new AnalyzingStep(this.container)
    this.components.results = new ResultsStep(this.container, (action, data) => this.handleAction(action, data))
    this.components.download = new DownloadStep(this.container, (action) => this.handleAction(action))

    // S'abonner aux changements d'état
    this.store.subscribe((state) => this.render(state))

    // Empêcher le scroll lors des interactions dans l'application
    this.preventScrollOnInteraction()

    // Rendu initial
    this.render(this.store.state)
  }

  preventScrollOnInteraction() {
    // Empêcher le scroll automatique lors des clics dans l'application
    const section = document.getElementById('deduplicate')
    if (!section) return

    // Empêcher tous les scrolls non désirés dans la section
    section.addEventListener('click', (e) => {
      const target = e.target.closest('a, button, [role="button"], input, select, textarea')
      if (target) {
        // Empêcher le scroll si c'est un lien avec hash
        if (target.href && target.href.includes('#')) {
          e.preventDefault()
        }
        // Pour les autres éléments, on laisse le comportement normal mais on évite le scroll
        e.stopPropagation()
      }
    }, { capture: true })

    // Empêcher le scroll lors du drag & drop
    section.addEventListener('dragover', (e) => {
      e.preventDefault()
      e.stopPropagation()
    }, { passive: false })

    section.addEventListener('drop', (e) => {
      e.preventDefault()
      e.stopPropagation()
    }, { passive: false })

    // Empêcher le scroll lors des changements d'état (steps, résultats)
    const observer = new MutationObserver(() => {
      // Vérifier que la section est toujours visible
      const rect = section.getBoundingClientRect()
      const isPartiallyVisible = rect.top < window.innerHeight && rect.bottom > 0
      if (!isPartiallyVisible && rect.top > 0) {
        // Si la section est en dessous de la vue, scroller doucement vers elle
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })

    observer.observe(section, { childList: true, subtree: true })
  }

  async handleFileUpload(filesOrZip, type) {
    // S'assurer qu'on reste dans la section pendant le traitement
    const section = document.getElementById('deduplicate')
    if (section) {
      // Vérifier si la section est visible, sinon scroller vers elle
      const rect = section.getBoundingClientRect()
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight
      if (!isVisible) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // Attendre que le scroll soit terminé avant de continuer
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    // Track deduplicate tool usage
    if (typeof gtag !== 'undefined') {
      gtag('event', 'deduplicate_start', {
        'event_category': 'Stop Doublon',
        'event_label': type === 'zip' ? 'ZIP file' : 'Individual files'
      })
    }

    try {
      this.store.setStep('analyzing')
      this.store.setProcessing(true)
      this.store.setError(null)

      let files = []

      // Étape 1: Extraire le ZIP ou traiter les fichiers individuels
      this.components.analyzing.render(10)
      
      if (type === 'zip') {
        // Traiter comme ZIP
        files = await zipService.extractZip(filesOrZip)
      } else {
        // Traiter comme fichiers individuels
        files = await zipService.processFiles(filesOrZip)
      }

      if (files.length === 0) {
        throw new Error('Aucun fichier à analyser')
      }

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
      this.store.setStep('analyzing')
      this.components.analyzing.render(50)
      
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

      this.store.setState({ downloadStats: stats })
      this.store.setStep('download')
    } catch (error) {
      this.store.setError(error.message)
      console.error('Erreur lors de la génération:', error)
    }
  }

  render(state) {
    // Mettre à jour les steps
    this.updateSteps(state.currentStep)

    // Mettre à jour le status
    this.updateStatus(state.currentStep)

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
        this.components.download.render(state.downloadStats || { kept: state.selectedFiles.size, removed: state.stats.totalFiles - state.selectedFiles.size, savedPercentage: '0' })
        break

      default:
        this.components.upload.render()
    }

    // Afficher les erreurs
    if (state.error) {
      this.showError(state.error)
    }
  }

  updateSteps(currentStep) {
    const steps = document.querySelectorAll('.deduplicate-step-pill')
    steps.forEach((step, index) => {
      const stepNum = index + 1
      if (currentStep === 'upload' && stepNum === 1) {
        step.classList.add('deduplicate-step-active')
      } else if (currentStep === 'analyzing' && stepNum === 2) {
        step.classList.add('deduplicate-step-active')
      } else if (currentStep === 'results' && stepNum === 3) {
        step.classList.add('deduplicate-step-active')
      } else {
        step.classList.remove('deduplicate-step-active')
      }
    })
  }

  updateStatus(currentStep) {
    const statusPill = document.getElementById('deduplicateStatusPill')
    const statusText = document.getElementById('deduplicateStatusText')
    if (!statusPill || !statusText) return

    switch (currentStep) {
      case 'upload':
        statusText.textContent = 'Analyse prête'
        break
      case 'analyzing':
        statusText.textContent = 'Analyse en cours...'
        break
      case 'results':
        statusText.textContent = 'Résultats disponibles'
        break
      case 'download':
        statusText.textContent = 'Téléchargement réussi'
        break
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

