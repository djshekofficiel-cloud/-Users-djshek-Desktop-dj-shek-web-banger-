/**
 * DJ SHEK Neon Horizontal Music Player
 * Player audio horizontal avec style néon
 */

class DJShekNeonPlayer {
    constructor(containerId, playlist) {
        this.container = document.getElementById(containerId);
        this.playlist = playlist || [];
        this.currentTrackIndex = -1;
        this.isPlaying = false;
        this.audio = null;
        this.volume = 0.7;
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error('Container not found');
            return;
        }
        
        this.createPlayerHTML();
        this.attachEventListeners();
        this.loadPlaylist();
    }
    
    createPlayerHTML() {
        if (!this.container) {
            console.error('Container not found for player HTML');
            return;
        }
        
        this.container.innerHTML = `
            <div class="neon-horizontal-player" id="neonPlayer">
                <div class="neon-player-container">
                    <!-- Logo Section -->
                    <div class="neon-player-logo">
                        <img src="images/Gemini_Generated_Image_exfw8sexfw8sexfw.png" alt="DJ SHEK Logo" id="neonPlayerLogo" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'color:#fff;font-size:2rem;\\'>🎵</div>';">
                    </div>
                    
                    <!-- Track Info -->
                    <div class="neon-player-info">
                        <div class="neon-player-title" id="neonPlayerTitle">Sélectionnez une piste</div>
                        <div class="neon-player-artist" id="neonPlayerArtist">DJ SHEK</div>
                    </div>
                    
                    <!-- Controls -->
                    <div class="neon-player-controls">
                        <button class="neon-control-btn" id="neonPrevBtn" aria-label="Précédent">⏮</button>
                        <button class="neon-play-pause-btn" id="neonPlayPauseBtn" aria-label="Play/Pause">▶</button>
                        <button class="neon-control-btn" id="neonNextBtn" aria-label="Suivant">⏭</button>
                    </div>
                    
                    <!-- Progress Section -->
                    <div class="neon-player-progress-section">
                        <div class="neon-progress-wrapper">
                            <span class="neon-time-display" id="neonCurrentTime">0:00</span>
                            <div class="neon-progress-container" id="neonProgressContainer">
                                <div class="neon-progress-buffer" id="neonProgressBuffer"></div>
                                <div class="neon-progress-bar" id="neonProgressBar">
                                    <div class="neon-progress-handle" id="neonProgressHandle"></div>
                                </div>
                            </div>
                            <span class="neon-time-display" id="neonDuration">0:00</span>
                        </div>
                    </div>
                </div>
                
                <!-- Audio Element -->
                <audio id="neonAudioElement" preload="metadata"></audio>
            </div>
        `;
        
        // Get audio element
        this.audio = document.getElementById('neonAudioElement');
        if (!this.audio) {
            console.error('Audio element not found');
            return;
        }
        
        // Set initial volume
        this.audio.volume = this.volume;
        
        // Get all UI elements
        this.elements = {
            title: document.getElementById('neonPlayerTitle'),
            artist: document.getElementById('neonPlayerArtist'),
            playPauseBtn: document.getElementById('neonPlayPauseBtn'),
            prevBtn: document.getElementById('neonPrevBtn'),
            nextBtn: document.getElementById('neonNextBtn'),
            progressContainer: document.getElementById('neonProgressContainer'),
            progressBar: document.getElementById('neonProgressBar'),
            progressHandle: document.getElementById('neonProgressHandle'),
            progressBuffer: document.getElementById('neonProgressBuffer'),
            currentTime: document.getElementById('neonCurrentTime'),
            duration: document.getElementById('neonDuration')
        };
        
        // Verify all elements are found
        const missingElements = Object.entries(this.elements)
            .filter(([key, value]) => !value)
            .map(([key]) => key);
        
        if (missingElements.length > 0) {
            console.warn('⚠️ Éléments manquants:', missingElements);
        } else {
            console.log('✅ Tous les éléments du player sont chargés');
        }
    }
    
    attachEventListeners() {
        // Play/Pause
        this.elements.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Previous/Next
        this.elements.prevBtn.addEventListener('click', () => this.playPrevious());
        this.elements.nextBtn.addEventListener('click', () => this.playNext());
        
        // Progress bar click
        this.elements.progressContainer.addEventListener('click', (e) => this.seek(e));
        
        // Progress bar drag
        let isDragging = false;
        this.elements.progressContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.seek(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                this.seek(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => {
            this.elements.duration.textContent = this.formatTime(this.audio.duration);
        });
        
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
        
        this.audio.addEventListener('ended', () => {
            this.playNext();
        });
        
        this.audio.addEventListener('progress', () => {
            this.updateBuffer();
        });
        
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.elements.playPauseBtn.textContent = '⏸';
            this.elements.playPauseBtn.classList.add('playing');
        });
        
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.elements.playPauseBtn.textContent = '▶';
            this.elements.playPauseBtn.classList.remove('playing');
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (e.key === ' ') {
                e.preventDefault();
                this.togglePlayPause();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.playPrevious();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.playNext();
            }
        });
    }
    
    loadPlaylist() {
        if (this.playlist.length === 0) {
            console.warn('⚠️ Playlist is empty');
            if (this.elements && this.elements.title) {
                this.elements.title.textContent = 'Aucune piste disponible';
            }
            return;
        }
        
        console.log('🎵 Chargement de la playlist:', this.playlist.length, 'pistes');
        
        // Load first track automatically
        this.loadTrack(0);
        
        // Update UI to show first track info
        if (this.playlist.length > 0) {
            const firstTrack = this.playlist[0];
            if (this.elements && this.elements.title) {
                this.elements.title.textContent = firstTrack.title || firstTrack.name || 'Sélectionnez une piste';
            }
            console.log('✅ Première piste chargée:', firstTrack.title || firstTrack.name);
        }
    }
    
    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) {
            return;
        }
        
        this.currentTrackIndex = index;
        const track = this.playlist[index];
        
        // Update UI
        this.elements.title.textContent = track.title || track.name || 'Titre inconnu';
        this.elements.artist.textContent = track.artist || 'DJ SHEK';
        
        // Load audio
        const audioPath = track.src || `audio/${encodeURIComponent(track.file)}`;
        this.audio.src = audioPath;
        this.audio.load();
        
        // Reset progress
        this.elements.progressBar.style.width = '0%';
        this.elements.currentTime.textContent = '0:00';
    }
    
    togglePlayPause() {
        if (this.currentTrackIndex === -1 && this.playlist.length > 0) {
            this.loadTrack(0);
        }
        
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play().catch(e => {
                console.error('Error playing audio:', e);
            });
        }
    }
    
    playPrevious() {
        if (this.playlist.length === 0) return;
        
        let prevIndex = this.currentTrackIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.playlist.length - 1;
        }
        
        this.loadTrack(prevIndex);
        if (this.isPlaying) {
            this.audio.play();
        }
    }
    
    playNext() {
        if (this.playlist.length === 0) return;
        
        let nextIndex = this.currentTrackIndex + 1;
        if (nextIndex >= this.playlist.length) {
            nextIndex = 0;
        }
        
        this.loadTrack(nextIndex);
        if (this.isPlaying) {
            this.audio.play();
        }
    }
    
    seek(e) {
        if (!this.audio.duration) return;
        
        const rect = this.elements.progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(1, clickX / width));
        
        this.audio.currentTime = percentage * this.audio.duration;
    }
    
    updateProgress() {
        if (!this.audio.duration) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.elements.progressBar.style.width = progress + '%';
        this.elements.currentTime.textContent = this.formatTime(this.audio.currentTime);
        
        // Update handle position
        if (this.elements.progressHandle) {
            this.elements.progressHandle.style.left = progress + '%';
        }
    }
    
    updateBuffer() {
        if (!this.audio.duration || !this.audio.buffered.length) return;
        
        const bufferedEnd = this.audio.buffered.end(this.audio.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / this.audio.duration) * 100;
        this.elements.progressBuffer.style.width = bufferedPercent + '%';
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DJShekNeonPlayer;
}

