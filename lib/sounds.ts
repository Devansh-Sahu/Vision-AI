// Soft alert sound (using Web Audio API for better control)
class AlertSound {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  
  constructor() {
    // Initialize audio context on user interaction
    if (typeof window !== 'undefined') {
      window.addEventListener('click', this.initAudio, { once: true });
    }
  }

  private initAudio = () => {
    if (this.audioContext) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 0.3; // 30% volume
      this.gainNode.connect(this.audioContext.destination);
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  };

  play() {
    if (!this.audioContext) this.initAudio();
    if (!this.audioContext || !this.gainNode) return;

    // Stop any existing sound
    if (this.oscillator) {
      this.oscillator.stop();
    }

    // Create oscillator for the alert sound
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5 note
    this.oscillator.frequency.exponentialRampToValueAtTime(
      440, 
      this.audioContext.currentTime + 0.5 // Ramp down to A4 over 0.5s
    );
    
    // Connect and play
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();
    this.oscillator.stop(this.audioContext.currentTime + 1); // Stop after 1 second
  }
}

export const alertSound = new AlertSound();
