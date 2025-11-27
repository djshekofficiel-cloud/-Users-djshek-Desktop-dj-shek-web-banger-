/**
 * Service de calcul de hash pour détection de doublons
 * Utilise SHA-256 pour identifier les fichiers identiques
 */

export class HashService {
  /**
   * Calcule le hash SHA-256 d'un fichier
   * @param {ArrayBuffer|Uint8Array|string} content - Contenu du fichier
   * @returns {Promise<string>} Hash hexadécimal
   */
  async computeHash(content) {
    try {
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
    } catch (error) {
      throw new Error(`Erreur lors du calcul du hash: ${error.message}`)
    }
  }

  /**
   * Calcule les hashs pour une liste de fichiers
   * @param {Array} files - Liste des fichiers
   * @param {Function} onProgress - Callback de progression
   * @returns {Promise<Array>} Fichiers avec leurs hashs
   */
  async computeHashes(files, onProgress) {
    const filesWithHash = []
    const total = files.length

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const hash = await this.computeHash(file.content)
      
      filesWithHash.push({
        ...file,
        hash
      })

      if (onProgress) {
        onProgress(i + 1, total)
      }
    }

    return filesWithHash
  }

  /**
   * Groupe les fichiers par hash (détection de doublons)
   * @param {Array} files - Liste des fichiers avec hash
   * @returns {Object} { files, duplicateGroups, stats }
   */
  groupByHash(files) {
    const hashMap = new Map()
    const duplicateGroups = []
    const uniqueFiles = []

    // Grouper par hash
    for (const file of files) {
      if (!hashMap.has(file.hash)) {
        hashMap.set(file.hash, [])
      }
      hashMap.get(file.hash).push(file)
    }

    // Identifier les doublons
    for (const [hash, fileList] of hashMap.entries()) {
      if (fileList.length > 1) {
        duplicateGroups.push({
          hash,
          files: fileList,
          id: `group-${duplicateGroups.length + 1}`
        })
      } else {
        uniqueFiles.push(fileList[0])
      }
    }

    const totalDuplicates = duplicateGroups.reduce(
      (sum, group) => sum + group.files.length - 1,
      0
    )

    return {
      files: files,
      duplicateGroups,
      uniqueFiles,
      stats: {
        totalFiles: files.length,
        totalDuplicates,
        totalGroups: duplicateGroups.length,
        uniqueCount: uniqueFiles.length
      }
    }
  }
}

export const hashService = new HashService()

