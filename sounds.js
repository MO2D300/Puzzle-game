class SoundManager {
    constructor() {
        this.sounds = {};
        this.muted = false;
        this.init();
    }

    init() {
        // إنشاء مؤثرات صوتية برمجياً (بدون ملفات خارجية)
        this.sounds = {
            correct: this.createSound(800, 0.3, 'sine', 0.2),
            wrong: this.createSound(300, 0.3, 'sawtooth', 0.2),
            levelup: this.createSound(1200, 0.5, 'sine', 0.3),
            click: this.createSound(600, 0.1, 'square', 0.1),
            success: this.createSound(1000, 0.4, 'sine', 0.2),
            fail: this.createSound(200, 0.5, 'square', 0.3)
        };
    }

    createSound(freq, duration, type, vol) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + duration);
            
            return { play: () => {
                if (!this.muted) this.createSound(freq, duration, type, vol);
            }};
        } catch (e) {
            return { play: () => {} }; // Fallback if audio fails
        }
    }

    play(soundName) {
        if (this.sounds[soundName] && !this.muted) {
            this.sounds[soundName].play();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
}

const soundManager = new SoundManager();
