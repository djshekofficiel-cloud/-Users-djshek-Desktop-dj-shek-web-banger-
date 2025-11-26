/**
 * Protection CSRF (Cross-Site Request Forgery)
 * Génère et valide des tokens CSRF pour les formulaires
 */

class CSRFProtection {
    constructor() {
        this.tokenKey = 'djshek_csrf_token';
        this.tokenExpiry = 3600000; // 1 heure en millisecondes
    }

    /**
     * Génère un token CSRF sécurisé
     */
    generateToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        const timestamp = Date.now();
        
        return {
            token: token,
            timestamp: timestamp,
            expires: timestamp + this.tokenExpiry
        };
    }

    /**
     * Stocke le token CSRF de manière sécurisée
     */
    storeToken() {
        const tokenData = this.generateToken();
        try {
            sessionStorage.setItem(this.tokenKey, JSON.stringify(tokenData));
            return tokenData.token;
        } catch (e) {
            console.error('Erreur lors du stockage du token CSRF:', e);
            return null;
        }
    }

    /**
     * Récupère le token CSRF valide
     */
    getToken() {
        try {
            const stored = sessionStorage.getItem(this.tokenKey);
            if (!stored) {
                return this.storeToken();
            }

            const tokenData = JSON.parse(stored);
            const now = Date.now();

            // Vérifier l'expiration
            if (now > tokenData.expires) {
                // Token expiré, générer un nouveau
                return this.storeToken();
            }

            return tokenData.token;
        } catch (e) {
            console.error('Erreur lors de la récupération du token CSRF:', e);
            return this.storeToken();
        }
    }

    /**
     * Valide un token CSRF
     */
    validateToken(token) {
        try {
            const stored = sessionStorage.getItem(this.tokenKey);
            if (!stored) {
                return false;
            }

            const tokenData = JSON.parse(stored);
            const now = Date.now();

            // Vérifier l'expiration
            if (now > tokenData.expires) {
                return false;
            }

            // Vérifier le token
            return token === tokenData.token;
        } catch (e) {
            console.error('Erreur lors de la validation du token CSRF:', e);
            return false;
        }
    }

    /**
     * Génère un champ caché avec le token CSRF
     */
    createHiddenField() {
        const token = this.getToken();
        if (!token) return null;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'csrf_token';
        input.value = token;
        input.setAttribute('data-csrf', 'true');

        return input;
    }

    /**
     * Ajoute le token CSRF à un formulaire
     */
    addTokenToForm(form) {
        if (!form) return false;

        // Vérifier si le token existe déjà
        const existingToken = form.querySelector('[data-csrf="true"]');
        if (existingToken) {
            // Mettre à jour le token existant
            existingToken.value = this.getToken();
            return true;
        }

        // Ajouter un nouveau token
        const tokenField = this.createHiddenField();
        if (tokenField) {
            form.appendChild(tokenField);
            return true;
        }

        return false;
    }

    /**
     * Valide le token d'un formulaire avant soumission
     */
    validateFormToken(form) {
        if (!form) return false;

        const tokenField = form.querySelector('[data-csrf="true"]');
        if (!tokenField) {
            return false;
        }

        return this.validateToken(tokenField.value);
    }
}

// Instance globale
export const csrfProtection = new CSRFProtection();

// Initialiser le token au chargement
if (typeof window !== 'undefined') {
    csrfProtection.getToken();
}

