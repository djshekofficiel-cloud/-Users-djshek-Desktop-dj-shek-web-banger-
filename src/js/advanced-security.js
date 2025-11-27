/**
 * Module de sécurité avancée pour le formulaire
 * Protection anti-spam, anti-bots, et validation renforcée
 */

/**
 * Honeypot - Champ caché pour piéger les bots
 */
export class Honeypot {
    constructor() {
        this.fieldName = 'website_url'; // Nom qui attire les bots
        this.fieldId = 'website_url_field';
    }

    /**
     * Crée un champ honeypot caché dans le formulaire
     */
    createHoneypotField(form) {
        if (!form) return null;

        // Vérifier si le champ existe déjà
        const existing = form.querySelector(`#${this.fieldId}`);
        if (existing) return existing;

        // Créer le champ honeypot
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.id = this.fieldId;
        honeypot.name = this.fieldName;
        honeypot.value = '';
        honeypot.style.display = 'none';
        honeypot.style.position = 'absolute';
        honeypot.style.left = '-9999px';
        honeypot.setAttribute('tabindex', '-1');
        honeypot.setAttribute('autocomplete', 'off');
        honeypot.setAttribute('aria-hidden', 'true');

        // Ajouter au début du formulaire
        form.insertBefore(honeypot, form.firstChild);

        return honeypot;
    }

    /**
     * Vérifie si le honeypot a été rempli (indique un bot)
     */
    isBot(form) {
        if (!form) return false;

        const honeypotField = form.querySelector(`#${this.fieldId}`);
        if (!honeypotField) return false;

        // Si le champ est rempli, c'est probablement un bot
        return honeypotField.value.trim().length > 0;
    }
}

/**
 * Protection contre les soumissions trop rapides (human verification)
 */
export class TimingProtection {
    constructor(minTimeSeconds = 0.5) {
        // Délai réduit à 0.5 seconde pour éviter les blocages inutiles
        // L'objectif est de bloquer les bots, pas les utilisateurs légitimes
        this.minTimeSeconds = minTimeSeconds;
        this.startTimes = new Map();
    }

    /**
     * Marque le début du remplissage du formulaire
     */
    startTiming(formId) {
        this.startTimes.set(formId, Date.now());
    }

    /**
     * Vérifie si le formulaire a été rempli trop rapidement
     */
    isValidTiming(formId) {
        const startTime = this.startTimes.get(formId);
        if (!startTime) return false;

        const elapsed = (Date.now() - startTime) / 1000; // En secondes
        return elapsed >= this.minTimeSeconds;
    }

    /**
     * Retire le timing d'un formulaire
     */
    clearTiming(formId) {
        this.startTimes.delete(formId);
    }
}

/**
 * Protection contre les soumissions répétées
 */
export class SubmissionTracker {
    constructor() {
        this.key = 'djshek_form_submissions';
        this.maxSubmissions = 5; // Maximum 5 soumissions par heure
        this.timeWindow = 3600000; // 1 heure en millisecondes
    }

    /**
     * Enregistre une soumission
     */
    recordSubmission() {
        try {
            const stored = sessionStorage.getItem(this.key);
            let submissions = stored ? JSON.parse(stored) : [];

            const now = Date.now();

            // Nettoyer les soumissions anciennes
            submissions = submissions.filter(time => now - time < this.timeWindow);

            // Ajouter la nouvelle soumission
            submissions.push(now);

            // Stocker
            sessionStorage.setItem(this.key, JSON.stringify(submissions));

            return submissions.length;
        } catch (e) {
            console.error('Erreur lors de l\'enregistrement de soumission:', e);
            return 0;
        }
    }

    /**
     * Vérifie si l'utilisateur peut soumettre
     */
    canSubmit() {
        try {
            const stored = sessionStorage.getItem(this.key);
            if (!stored) return true;

            const submissions = JSON.parse(stored);
            const now = Date.now();

            // Nettoyer les soumissions anciennes
            const validSubmissions = submissions.filter(time => now - time < this.timeWindow);

            return validSubmissions.length < this.maxSubmissions;
        } catch (e) {
            console.error('Erreur lors de la vérification des soumissions:', e);
            return true; // En cas d'erreur, autoriser (pour ne pas bloquer les utilisateurs légitimes)
        }
    }

    /**
     * Retourne le nombre de soumissions restantes
     */
    getRemainingSubmissions() {
        try {
            const stored = sessionStorage.getItem(this.key);
            if (!stored) return this.maxSubmissions;

            const submissions = JSON.parse(stored);
            const now = Date.now();
            const validSubmissions = submissions.filter(time => now - time < this.timeWindow);

            return Math.max(0, this.maxSubmissions - validSubmissions.length);
        } catch (e) {
            return this.maxSubmissions;
        }
    }
}

/**
 * Validation avancée des URLs (protection contre les redirections malveillantes)
 */
export function validateUrlStrict(url) {
    if (!url || typeof url !== 'string') return false;

    try {
        const urlObj = new URL(url);

        // Vérifier le protocole (seulement HTTPS, sauf localhost pour dev)
        if (urlObj.protocol !== 'https:' && urlObj.hostname !== 'localhost' && urlObj.hostname !== '127.0.0.1') {
            return false;
        }

        // Vérifier qu'il n'y a pas de caractères suspects
        if (/[<>\"'`]/.test(url)) {
            return false;
        }

        // Vérifier que l'URL n'est pas trop longue
        if (url.length > 500) {
            return false;
        }

        // Liste noire de domaines suspects (peut être étendue)
        const blacklistedDomains = ['malicious-site.com', 'phishing-example.com'];
        const domain = urlObj.hostname.toLowerCase();
        
        if (blacklistedDomains.some(blacklisted => domain.includes(blacklisted))) {
            return false;
        }

        return true;
    } catch (e) {
        // URL invalide
        return false;
    }
}

/**
 * Détection de patterns suspects dans le texte
 */
export function detectSuspiciousPatterns(text) {
    if (!text || typeof text !== 'string') return false;

    const suspiciousPatterns = [
        /<script[^>]*>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi, // onclick=, onerror=, etc.
        /<iframe/gi,
        /<object/gi,
        /<embed/gi,
        /data:text\/html/gi,
        /vbscript:/gi,
        /expression\s*\(/gi, // CSS expressions
        /@import/gi,
        /url\s*\(/gi, // URLs dans CSS suspectes
    ];

    for (const pattern of suspiciousPatterns) {
        if (pattern.test(text)) {
            return true;
        }
    }

    return false;
}

/**
 * Validation du contenu du message (détection de spam)
 */
export function isSpamContent(text) {
    if (!text || typeof text !== 'string') return false;

    const spamIndicators = [
        /(viagra|cialis|casino|poker|lottery|winner|prize|free money)/gi,
        /(click here|buy now|limited time|act now|urgent)/gi,
        /(http[s]?:\/\/){3,}/gi, // Plusieurs URLs répétées
        /(.)\1{10,}/g, // Caractères répétés (ex: aaaaaaaaaaa)
        /[A-Z]{20,}/g, // TROP DE MAJUSCULES
    ];

    let spamScore = 0;
    for (const pattern of spamIndicators) {
        const matches = text.match(pattern);
        if (matches) {
            spamScore += matches.length;
        }
    }

    // Si le score de spam est trop élevé
    return spamScore >= 3;
}

/**
 * Vérification de la complexité du mot de passe (si jamais utilisé)
 */
export function isStrongPassword(password) {
    if (!password || typeof password !== 'string') return false;

    // Au moins 8 caractères
    if (password.length < 8) return false;

    // Au moins une majuscule
    if (!/[A-Z]/.test(password)) return false;

    // Au moins une minuscule
    if (!/[a-z]/.test(password)) return false;

    // Au moins un chiffre
    if (!/[0-9]/.test(password)) return false;

    // Au moins un caractère spécial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

    return true;
}

/**
 * Protection contre les attaques de force brute sur les champs
 */
export class FieldBruteForceProtection {
    constructor(fieldId, maxAttempts = 10, timeWindow = 300000) { // 5 minutes
        this.fieldId = fieldId;
        this.maxAttempts = maxAttempts;
        this.timeWindow = timeWindow;
        this.key = `djshek_bf_${fieldId}`;
    }

    /**
     * Enregistre une tentative de validation échouée
     */
    recordFailedAttempt() {
        try {
            const stored = sessionStorage.getItem(this.key);
            let attempts = stored ? JSON.parse(stored) : [];

            const now = Date.now();

            // Nettoyer les tentatives anciennes
            attempts = attempts.filter(time => now - time < this.timeWindow);

            // Ajouter la nouvelle tentative
            attempts.push(now);

            // Stocker
            sessionStorage.setItem(this.key, JSON.stringify(attempts));

            return attempts.length;
        } catch (e) {
            console.error('Erreur lors de l\'enregistrement de tentative:', e);
            return 0;
        }
    }

    /**
     * Vérifie si le champ est bloqué
     */
    isBlocked() {
        try {
            const stored = sessionStorage.getItem(this.key);
            if (!stored) return false;

            const attempts = JSON.parse(stored);
            const now = Date.now();

            // Nettoyer les tentatives anciennes
            const validAttempts = attempts.filter(time => now - time < this.timeWindow);

            return validAttempts.length >= this.maxAttempts;
        } catch (e) {
            return false;
        }
    }

    /**
     * Réinitialise les tentatives (en cas de succès)
     */
    reset() {
        try {
            sessionStorage.removeItem(this.key);
        } catch (e) {
            console.error('Erreur lors de la réinitialisation:', e);
        }
    }
}

// Instances globales
export const honeypot = new Honeypot();
export const timingProtection = new TimingProtection(3); // Minimum 3 secondes
export const submissionTracker = new SubmissionTracker();

