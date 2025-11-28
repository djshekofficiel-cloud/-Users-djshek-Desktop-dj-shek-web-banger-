import './css/style.css'; // Importation du CSS pour que Vite le traite

import { audioTracks } from './data/tracks.js';

import { validateForm, prepareFormData, rateLimiter } from './js/form-security.js';

import { csrfProtection } from './js/csrf-protection.js';

import { 
    honeypot, 
    timingProtection, 
    submissionTracker,
    validateUrlStrict,
    detectSuspiciousPatterns,
    isSpamContent
} from './js/advanced-security.js';

import { initDeduplicate } from './js/deduplicate.js';



// --- CONFIGURATION ---

const DEBUG = import.meta.env.MODE === 'development';

const log = DEBUG ? console.log.bind(console) : () => {};

// --- GOOGLE ANALYTICS TRACKING ---

function trackEvent(category, action, label = '', value = 0) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }
}

function trackPageView(path) {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'G-XXXXXXXXXX', {
            'page_path': path
        });
    }
}



// --- GLOBAL VARIABLES ---

let currentTrackIndex = -1;

let isPlaying = false;



// --- DOM ELEMENTS ---

const elements = {

    player: document.getElementById('audioPlayerElement'),

    playBtn: document.getElementById('audioPlayPauseBtn'),

    prevBtn: document.getElementById('audioPrevBtn'),

    nextBtn: document.getElementById('audioNextBtn'),

    progressContainer: document.getElementById('audioProgressContainer'),

    progressBar: document.getElementById('audioProgressBar'),

    currentTime: document.getElementById('audioCurrentTime'),

    duration: document.getElementById('audioDuration'),

    trackTitle: document.getElementById('audioCurrentTrack'),

    artist: document.getElementById('audioCurrentArtist'),

    volumeContainer: document.getElementById('audioVolumeContainer'),

    volumeBar: document.getElementById('audioVolumeBar'),

    playlist: document.getElementById('audioPlaylist'),

    particlesBg: document.getElementById('particlesBg'),

    navBar: document.getElementById('navbar'),

    navMenu: document.getElementById('navMenu'),

    navToggle: document.getElementById('navMenuToggle'),

    loader: document.getElementById('pageLoader'),

    modalOverlay: document.getElementById('emailModalOverlay'),

    modalForm: document.getElementById('emailModalForm'),

    contactForm: document.getElementById('contactForm')

};



// Gérer le bouton CTA flottant
function initFloatingCTA() {
    const floatingCTA = document.getElementById('floatingCTA');
    const contactSection = document.getElementById('contact');
    
    if (!floatingCTA || !contactSection) return;
    
    // Cacher le bouton quand on est sur la section contact
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                floatingCTA.style.opacity = '0';
                floatingCTA.style.pointerEvents = 'none';
            } else {
                floatingCTA.style.opacity = '1';
                floatingCTA.style.pointerEvents = 'auto';
            }
        });
    }, {
        threshold: 0.3
    });
    
    observer.observe(contactSection);
    
    // Smooth scroll vers le formulaire
    floatingCTA.addEventListener('click', (e) => {
        e.preventDefault();
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {

    initLoader();

    initParticles();

    initNavigation();

    initPlayer();

    initPartenaires();

    initForms();

    initVideo();

    initSectionGlow();

    initDeduplicate();

    initFloatingCTA();

    log('System initialized');

});



function initLoader() {

    window.addEventListener('load', () => {

        if (elements.loader) {

            setTimeout(() => {

                elements.loader.classList.add('hidden');

                setTimeout(() => elements.loader.style.display = 'none', 500);

            }, 300);

        }

    });

}



// --- AUDIO PLAYER LOGIC ---

function initPlayer() {

    if (!elements.player) return;



    // Build Playlist

    elements.playlist.innerHTML = '';

    audioTracks.forEach((track, index) => {

        const item = document.createElement('div');

        item.className = 'audio-playlist-item';

        item.tabIndex = 0;

        // Sécurisé : utilisation de createElement au lieu de innerHTML
        const numberDiv = document.createElement('div');
        numberDiv.className = 'audio-playlist-number';
        numberDiv.textContent = String(index + 1).padStart(2, '0');

        const nameDiv = document.createElement('div');
        nameDiv.className = 'audio-playlist-name';
        nameDiv.textContent = track.name; // track.name est déjà dans les données statiques, sécurisé

        const durationDiv = document.createElement('div');
        durationDiv.className = 'audio-playlist-duration';
        durationDiv.textContent = '--:--';

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'audio-playlist-download';
        downloadBtn.setAttribute('aria-label', 'Télécharger');
        downloadBtn.textContent = '⬇';

        item.appendChild(numberDiv);
        item.appendChild(nameDiv);
        item.appendChild(durationDiv);
        item.appendChild(downloadBtn);

        

        // Click on track

        item.addEventListener('click', (e) => {

            if (e.target.classList.contains('audio-playlist-download')) {

                handleDownload(track);

            } else {

                loadTrack(index);

                playAudio();

            }

        });



        elements.playlist.appendChild(item);

    });



    // Event Listeners

    elements.playBtn.addEventListener('click', togglePlay);

    elements.prevBtn.addEventListener('click', playPrev);

    elements.nextBtn.addEventListener('click', playNext);

    

    elements.player.addEventListener('timeupdate', updateProgress);

    elements.player.addEventListener('loadedmetadata', () => {

        elements.duration.textContent = formatTime(elements.player.duration);

    });

    elements.player.addEventListener('ended', playNext);

    

    // Volume

    elements.volumeContainer.addEventListener('click', (e) => {

        const rect = elements.volumeContainer.getBoundingClientRect();

        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

        elements.player.volume = pct;

        elements.volumeBar.style.width = (pct * 100) + '%';

    });



    // Progress Click

    elements.progressContainer.addEventListener('click', (e) => {

        if (!elements.player.duration) return;

        const rect = elements.progressContainer.getBoundingClientRect();

        const pct = (e.clientX - rect.left) / rect.width;

        elements.player.currentTime = pct * elements.player.duration;

    });

}

// --- VIDEO INITIALIZATION ---

function initVideo() {

    const video = document.getElementById('djshekVideo');

    if (!video) return;

    // Configurer la vitesse de lecture (plus rapide)

    video.playbackRate = 1.5; // 1.5x la vitesse normale

    // S'assurer que la vidéo est muette

    video.muted = true;

    // Activer la boucle

    video.loop = true;

    // Forcer la lecture automatique

    const playVideo = async () => {

        try {

            await video.play();

            log('Vidéo démarrée automatiquement');

        } catch (error) {

            log('Erreur lecture automatique vidéo:', error);

            // Retenter après interaction utilisateur

            document.addEventListener('click', playVideo, { once: true });

            document.addEventListener('touchstart', playVideo, { once: true });

        }

    };

    // Démarrer la vidéo dès que possible

    if (video.readyState >= 3) { // HAVE_FUTURE_DATA

        playVideo();

    } else {

        video.addEventListener('loadeddata', playVideo, { once: true });

        video.addEventListener('canplay', playVideo, { once: true });

    }

    // S'assurer que la boucle fonctionne

    video.addEventListener('ended', () => {

        video.currentTime = 0;

        video.play().catch(() => {});

    });

    // Maintenir la vitesse même après chargement

    video.addEventListener('loadedmetadata', () => {

        video.playbackRate = 1.5;

    });

    // Empêcher l'affichage des contrôles

    video.controls = false;

    // Ajouter un style pour cacher complètement les contrôles

    video.style.pointerEvents = 'none'; // Empêche les interactions avec la vidéo

}



function loadTrack(index) {

    if (index < 0 || index >= audioTracks.length) return;

    currentTrackIndex = index;

    const track = audioTracks[index];

    

    // Correction des chemins pour l'architecture publique

    elements.player.src = `/audio/${track.file}`; 

    elements.trackTitle.textContent = track.name;

    

    // Update UI Active State

    const items = elements.playlist.querySelectorAll('.audio-playlist-item');

    items.forEach(i => i.classList.remove('active'));

    items[index].classList.add('active');

}



function togglePlay() {

    if (currentTrackIndex === -1) loadTrack(0);

    if (elements.player.paused) playAudio();

    else pauseAudio();

}



function playAudio() {
    // Track audio play event
    if (currentTrackIndex >= 0 && audioTracks[currentTrackIndex]) {
        trackEvent('Audio Player', 'play', audioTracks[currentTrackIndex].name);
    }

    elements.player.play()

        .then(() => {

            isPlaying = true;

            elements.playBtn.textContent = '⏸';

            elements.playBtn.classList.add('playing');

        })

        .catch(err => console.error("Audio playback failed", err));

}



function pauseAudio() {
    // Track audio pause event
    if (currentTrackIndex >= 0 && audioTracks[currentTrackIndex]) {
        trackEvent('Audio Player', 'pause', audioTracks[currentTrackIndex].name);
    }

    elements.player.pause();

    isPlaying = false;

    elements.playBtn.textContent = '▶';

    elements.playBtn.classList.remove('playing');

}



function playNext() {

    if (currentTrackIndex < audioTracks.length - 1) {

        loadTrack(currentTrackIndex + 1);

        playAudio();

    }

}



function playPrev() {

    if (currentTrackIndex > 0) {

        loadTrack(currentTrackIndex - 1);

        playAudio();

    }

}



function updateProgress() {

    if (!elements.player.duration) return;

    const pct = (elements.player.currentTime / elements.player.duration) * 100;

    elements.progressBar.style.width = `${pct}%`;

    elements.currentTime.textContent = formatTime(elements.player.currentTime);

}



function formatTime(s) {

    if (isNaN(s)) return '0:00';

    const m = Math.floor(s / 60);

    const sec = Math.floor(s % 60);

    return `${m}:${sec.toString().padStart(2, '0')}`;

}



// --- UI & UTILS ---

function initParticles() {

    if (!elements.particlesBg) return;

    const isMobile = window.innerWidth <= 768;

    const count = isMobile ? 40 : 80;

    

    for (let i = 0; i < count; i++) {

        const p = document.createElement('div');

        p.className = 'particle';

        p.style.left = Math.random() * 100 + '%';

        p.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');

        p.style.animationDelay = Math.random() * 15 + 's';

        p.style.animationDuration = (Math.random() * 10 + 10) + 's';

        elements.particlesBg.appendChild(p);

    }

}



function initNavigation() {

    // Scroll effect

    window.addEventListener('scroll', () => {

        if (window.scrollY > 100) elements.navBar.classList.add('scrolled');

        else elements.navBar.classList.remove('scrolled');

        

        // Scroll progress

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        const scrolled = (winScroll / height) * 100;

        document.getElementById("scrollProgress").style.width = scrolled + "%";

    });



    // Mobile menu

    if (elements.navToggle) {

        elements.navToggle.addEventListener('click', () => {

            elements.navMenu.classList.toggle('active');

            elements.navToggle.classList.toggle('active');

        });

    }

    // Smooth scroll pour les liens de navigation
    if (elements.navMenu) {
        const navLinks = elements.navMenu.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
                        // Fermer le menu mobile si ouvert
                        if (elements.navMenu.classList.contains('active')) {
                            elements.navMenu.classList.remove('active');
                            elements.navToggle.classList.remove('active');
                        }
                        
                        // Smooth scroll vers la section
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

}



function initPartenaires() {

    const grid = document.getElementById('partenairesGrid');

    if (!grid) return;

    // Liste des images de partenaires dans le dossier
    // Actualisation automatique de toutes les images disponibles
    const images = [
        'images.png',
        'IMG_1073.JPG',
        'hjhjhj.png',
        'ggggh.png',
        'téléchargement.jpeg',
        'téléchargement.png'
    ];

    grid.innerHTML = '';

    images.forEach(imgName => {

        const div = document.createElement('div');

        div.className = 'partenaire-item';

        // Sécurisé : utilisation de createElement au lieu de innerHTML
        const img = document.createElement('img');
        // Sanitize le nom de fichier pour éviter directory traversal
        // Préserver les accents et caractères spéciaux pour les noms de fichiers
        const sanitizedImgName = encodeURIComponent(imgName).replace(/%2F/g, '/');
        img.src = `/images/partenaire/${sanitizedImgName}`;
        img.alt = `Partenaire DJ SHEK - ${imgName.replace(/\.(png|jpg|jpeg|JPG|PNG|JPEG)$/i, '').replace(/[_-]/g, ' ')}`;
        img.loading = 'lazy';
        
        // Gestion des erreurs de chargement d'image
        img.onerror = function() {
            console.warn(`Image partenaire non trouvée ou erreur de chargement: ${imgName}`);
            // Ne pas cacher l'image, mais la marquer comme en erreur
            this.style.opacity = '0.3';
        };
        
        img.onload = function() {
            // S'assurer que l'image est bien chargée et visible
            this.style.opacity = '1';
        };

        div.appendChild(img);

        grid.appendChild(div);

    });

}



// Fonction utilitaire pour gérer le localStorage de manière sécurisée
function getStoredEmail() {
    try {
        const stored = localStorage.getItem('djshek_user_email');
        if (!stored) return null;

        const data = JSON.parse(stored);
        const now = Date.now();

        // Vérifier l'expiration (30 jours)
        if (data.expires && now > data.expires) {
            localStorage.removeItem('djshek_user_email');
            return null;
        }

        // Valider l'email stocké
        if (data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            return data.email;
        }

        return null;
    } catch (e) {
        console.error('Erreur lors de la récupération de l\'email:', e);
        localStorage.removeItem('djshek_user_email');
        return null;
    }
}

function setStoredEmail(email) {
    try {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return false;
        }

        const data = {
            email: email,
            expires: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 jours
        };

        localStorage.setItem('djshek_user_email', JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Erreur lors du stockage de l\'email:', e);
        return false;
    }
}

function handleDownload(track) {

    const email = getStoredEmail();

    if (!email) {

        // Show modal logic

        elements.modalOverlay.classList.add('active');

        return;

    }

    // Track download event
    trackEvent('Audio Download', 'download', track.name);

    // Trigger download

    const link = document.createElement('a');

    link.href = `/audio/${track.file}`;

    link.download = `${track.name}.mp3`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}



function initForms() {

    // Gestion sécurisée du formulaire contact

    if (elements.contactForm) {

        // Ajouter le token CSRF au formulaire
        csrfProtection.addTokenToForm(elements.contactForm);

        // Ajouter le champ honeypot (protection anti-bots)
        honeypot.createHoneypotField(elements.contactForm);

        // Démarrer le chronomètre de timing SEULEMENT quand l'utilisateur commence à remplir
        // Timing très court (0.5s) pour bloquer uniquement les bots, pas les utilisateurs
        let timingStarted = false;
        const startTimingOnInteraction = () => {
            if (!timingStarted) {
                timingProtection.startTiming('contactForm');
                timingStarted = true;
            }
        };
        
        // Démarrer le timing au focus sur n'importe quel champ OU dès que l'utilisateur tape
        const allFormFields = elements.contactForm.querySelectorAll('input, textarea, select');
        allFormFields.forEach(field => {
            field.addEventListener('focus', startTimingOnInteraction, { once: true });
            field.addEventListener('input', startTimingOnInteraction, { once: true });
            field.addEventListener('click', startTimingOnInteraction, { once: true });
        });

        // Progress bar du formulaire
        const progressBar = document.getElementById('formProgressBar');
        const progressText = document.getElementById('formProgressText');
        const updateProgress = () => {
            if (!progressBar || !progressText) return;
            const requiredFields = elements.contactForm.querySelectorAll('input[required], textarea[required], select[required]');
            const filledFields = Array.from(requiredFields).filter(field => {
                if (field.type === 'checkbox') return field.checked;
                return field.value.trim() !== '';
            });
            const progress = requiredFields.length > 0 ? (filledFields.length / requiredFields.length) * 100 : 0;
            // Mettre à jour la barre de progression via CSS variable
            progressBar.style.setProperty('--progress-width', `${progress}%`);
            // Mettre à jour le texte
            const step = requiredFields.length > 0 ? Math.ceil((filledFields.length / requiredFields.length) * 5) : 0;
            progressText.textContent = `Étape ${Math.min(step, 5)} sur 5`;
        };
        
        // Mettre à jour la progress bar lors des changements
        allFormFields.forEach(field => {
            field.addEventListener('input', updateProgress);
            field.addEventListener('change', updateProgress);
        });
        updateProgress(); // Initialiser

        // Compteur de caractères pour les instructions
        const instructionsTextarea = document.getElementById('instructions');
        const charCount = document.getElementById('charCount');

        if (instructionsTextarea && charCount) {
            instructionsTextarea.addEventListener('input', () => {
                const length = instructionsTextarea.value.length;
                charCount.textContent = length;
                if (length > 4500) {
                    charCount.style.color = 'var(--orange)';
                } else {
                    charCount.style.color = 'rgba(255, 255, 255, 0.7)';
                }
            });
        }

        elements.contactForm.addEventListener('submit', async (e) => {

            e.preventDefault();

            // Réinitialiser les erreurs

            clearFormErrors();

            // Valider le token CSRF
            if (!csrfProtection.validateFormToken(elements.contactForm)) {
                showFormMessage('Erreur de sécurité. Veuillez rafraîchir la page et réessayer.', 'error');
                // Régénérer le token
                csrfProtection.addTokenToForm(elements.contactForm);
                return;
            }

            // Vérifier le honeypot (détection de bots)
            if (honeypot.isBot(elements.contactForm)) {
                showFormMessage('Spam détecté. Si vous êtes humain, réessayez.', 'error');
                return;
            }

            // Vérifier le timing (protection contre soumissions trop rapides)
            // Utiliser la valeur de la classe TimingProtection au lieu d'un hardcode
            const minTimeSeconds = timingProtection.minTimeSeconds || 1;
            
            // Si le timing n'a pas été démarré, le démarrer maintenant (cas où l'utilisateur n'a pas focus sur un champ)
            if (!timingProtection.startTimes.has('contactForm')) {
                timingProtection.startTiming('contactForm');
                // Permettre la soumission même si le timing vient de démarrer
                // L'utilisateur a probablement pris le temps de remplir le formulaire
            } else if (!timingProtection.isValidTiming('contactForm')) {
                const elapsed = (Date.now() - timingProtection.startTimes.get('contactForm')) / 1000;
                const remaining = Math.max(0, Math.ceil(minTimeSeconds - elapsed));
                
                if (remaining > 0) {
                    showFormMessage(`⏳ Veuillez patienter encore ${remaining} seconde${remaining > 1 ? 's' : ''} avant de soumettre le formulaire.`, 'error');
                    return;
                }
                // Si remaining <= 0, on continue (timing suffisant)
            }

            // Vérifier le nombre de soumissions
            if (!submissionTracker.canSubmit()) {
                const remaining = submissionTracker.getRemainingSubmissions();
                showFormMessage(`Trop de soumissions. Vous pouvez envoyer ${remaining} demande(s) par heure maximum.`, 'error');
                return;
            }

            // Récupérer les valeurs (formulaire simplifié)
            const rawData = {
                nom: document.getElementById('nom')?.value || '',
                email: document.getElementById('email')?.value || '',
                type_prestation: document.getElementById('type_prestation')?.value || '',
                style: document.getElementById('style')?.value || '',
                instructions: document.getElementById('instructions')?.value || '',
                fichiers: document.getElementById('fichiers')?.value || '',
                bpm: document.getElementById('bpm')?.value || '',
                delai: document.getElementById('delai')?.value || '',
                gdpr: document.getElementById('gdpr')?.checked || false
            };

            // Sanitization et validation

            const sanitizedData = prepareFormData(rawData);

            const validation = validateForm(sanitizedData);

            if (!validation.isValid) {

                // Afficher les erreurs

                displayFormErrors(validation.errors);

                return;

            }

            // Désactiver le bouton pour éviter les doubles soumissions

            const submitBtn = document.getElementById('submitBtn');

            const btnText = submitBtn?.querySelector('.btn-text');

            const btnLoader = submitBtn?.querySelector('.btn-loader');

            if (submitBtn) {

                submitBtn.disabled = true;

                if (btnText) btnText.style.opacity = '0';

                if (btnLoader) btnLoader.classList.remove('hidden');

            }

            // Vérifications de sécurité supplémentaires avant l'envoi
            // Vérifier les patterns suspects dans les instructions
            if (detectSuspiciousPatterns(sanitizedData.instructions)) {
                showFormMessage('Le contenu contient des éléments suspects. Veuillez corriger votre message.', 'error');
                // Réactiver le bouton
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (btnText) btnText.style.opacity = '1';
                    if (btnLoader) btnLoader.classList.add('hidden');
                }
                return;
            }

            // Vérifier le spam dans les instructions
            if (isSpamContent(sanitizedData.instructions)) {
                showFormMessage('Le contenu semble être du spam. Veuillez corriger votre message.', 'error');
                // Réactiver le bouton
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (btnText) btnText.style.opacity = '1';
                    if (btnLoader) btnLoader.classList.add('hidden');
                }
                return;
            }

            // Valider l'URL des fichiers si présente
            if (sanitizedData.fichiers && sanitizedData.fichiers.trim().length > 0) {
                if (!validateUrlStrict(sanitizedData.fichiers)) {
                    showFormMessage('Le lien fourni n\'est pas valide. Veuillez vérifier l\'URL (doit commencer par https://).', 'error');
                    // Réactiver le bouton
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        if (btnText) btnText.style.opacity = '1';
                        if (btnLoader) btnLoader.classList.add('hidden');
                    }
                    return;
                }
            }
            
            // Vérification finale : s'assurer que toutes les données sont présentes
            if (!sanitizedData.nom || !sanitizedData.email || !sanitizedData.type_prestation || !sanitizedData.instructions) {
                showFormMessage('❌ Erreur : Certaines données sont manquantes. Veuillez remplir tous les champs obligatoires.', 'error');
                // Réactiver le bouton
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (btnText) btnText.style.opacity = '1';
                    if (btnLoader) btnLoader.classList.add('hidden');
                }
                return;
            }

            // Enregistrer la soumission (rate limiting avancé)
            submissionTracker.recordSubmission();

            // Track form submission
            trackEvent('Contact Form', 'submit', sanitizedData.type_prestation || 'contact');

            // Envoyer les données à l'API
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nom: sanitizedData.nom,
                        email: sanitizedData.email,
                        type_prestation: sanitizedData.type_prestation,
                        style: sanitizedData.style || '',
                        instructions: sanitizedData.instructions,
                        fichiers: sanitizedData.fichiers || '',
                        bpm: sanitizedData.bpm || '',
                        delai: sanitizedData.delai || '',
                        gdpr: sanitizedData.gdpr
                    })
                });

                // Vérifier le type de contenu de la réponse
                const contentType = response.headers.get('content-type');
                let data;

                if (contentType && contentType.includes('application/json')) {
                    data = await response.json();
                } else {
                    // Si ce n'est pas du JSON, lire le texte pour le debug
                    const text = await response.text();
                    console.error('❌ Réponse non-JSON reçue:', text.substring(0, 200));
                    throw new Error(`Erreur serveur (${response.status}): La réponse n'est pas au format JSON. Vérifiez la configuration de l'API.`);
                }

                if (response.ok && data.success) {
                    showFormMessage('🎉 Parfait ! Votre demande a été envoyée avec succès. Je vous répondrai sous 24h maximum. Merci pour votre confiance !', 'success');
                    
                    // Réinitialiser le formulaire après un court délai
                    setTimeout(() => {
                        elements.contactForm.reset();
                        if (charCount) charCount.textContent = '0';
                        // Régénérer le token CSRF
                        csrfProtection.addTokenToForm(elements.contactForm);
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            if (btnText) btnText.style.opacity = '1';
                            if (btnLoader) btnLoader.classList.add('hidden');
                        }
                    }, 2000);
                } else {
                    throw new Error(data.error || data.message || 'Erreur lors de l\'envoi');
                }
            } catch (error) {
                console.error('❌ Erreur lors de l\'envoi du formulaire:', error);
                
                // Message d'erreur plus clair
                let errorMessage = error.message;
                if (error.message.includes('JSON')) {
                    errorMessage = 'Erreur de configuration serveur. Veuillez contacter le support ou réessayer plus tard.';
                }
                
                showFormMessage(`❌ Erreur lors de l'envoi : ${errorMessage}`, 'error');
                
                // Réactiver le bouton en cas d'erreur
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (btnText) btnText.style.opacity = '1';
                    if (btnLoader) btnLoader.classList.add('hidden');
                }
                return;
            }


        });

    }

    

    // Gestion Modal Email

    if (elements.modalForm) {

        // Ajouter le token CSRF au formulaire modal
        csrfProtection.addTokenToForm(elements.modalForm);

        elements.modalForm.addEventListener('submit', (e) => {

            e.preventDefault();

            // Valider le token CSRF
            if (!csrfProtection.validateFormToken(elements.modalForm)) {
                alert('Erreur de sécurité. Veuillez rafraîchir la page et réessayer.');
                csrfProtection.addTokenToForm(elements.modalForm);
                return;
            }

            const email = document.getElementById('emailInput').value;

            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

                if (setStoredEmail(email)) {
                elements.modalOverlay.classList.remove('active');
                alert("Email enregistré ! Vous pouvez maintenant télécharger.");
                } else {
                    alert("Erreur lors de l'enregistrement de l'email. Veuillez réessayer.");
                }

            } else {

                alert("Veuillez entrer une adresse email valide.");

            }

        });

    }

    

    // Close modal btn

    const closeBtn = elements.modalOverlay.querySelector('.email-modal-btn-secondary');

    if(closeBtn) closeBtn.addEventListener('click', () => elements.modalOverlay.classList.remove('active'));

}

// Fonctions utilitaires pour le formulaire

function clearFormErrors() {

    document.querySelectorAll('.error-message').forEach(el => {

        el.textContent = '';

        el.style.display = 'none';

    });

    document.querySelectorAll('.form-group').forEach(group => {

        group.classList.remove('error');

    });

    const formMessage = document.getElementById('formMessage');

    if (formMessage) {

        formMessage.style.display = 'none';

        formMessage.className = 'form-message';

    }

}

function displayFormErrors(errors) {

    Object.keys(errors).forEach(field => {

        if (field === 'rateLimit') {

            showFormMessage(errors[field], 'error');

            return;

        }

        const errorEl = document.getElementById(`${field}Error`);

        const inputEl = document.getElementById(field);

        const formGroup = inputEl?.closest('.form-group');

        if (errorEl) {

            errorEl.textContent = errors[field];

            errorEl.style.display = 'block';

        }

        if (formGroup) {

            formGroup.classList.add('error');

        }

        if (inputEl) {

            inputEl.focus();

        }

    });

}

function showFormMessage(message, type = 'success') {

    const formMessage = document.getElementById('formMessage');

    if (formMessage) {

        formMessage.textContent = message;

        formMessage.className = `form-message ${type}`;

        formMessage.style.display = 'block';

        // Auto-hide après 5 secondes

        setTimeout(() => {

            formMessage.style.display = 'none';

        }, 5000);

    }

}

// --- Section Glow Effect ---

function initSectionGlow() {

    const sections = document.querySelectorAll('.section-glow');

    if (sections.length === 0) return;

    // Configuration de l'Intersection Observer

    const observerOptions = {

        root: null, // viewport

        rootMargin: '-10% 0px -10% 0px', // Déclenche quand 10% de la section est visible

        threshold: 0.1 // Déclenche quand 10% de la section est visible

    };

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                // Ajouter la classe active pour activer l'animation

                entry.target.classList.add('section-glow--active');

            } else {

                // Optionnel : retirer la classe pour réactiver l'animation au prochain scroll

                // entry.target.classList.remove('section-glow--active');

            }

        });

    }, observerOptions);

    // Observer chaque section

    sections.forEach(section => {

        observer.observe(section);

    });

    log('Section glow effect initialized');

}

