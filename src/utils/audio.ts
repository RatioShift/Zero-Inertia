/**
 * Audio Engine for Project: Zero Inertia
 * Handles playback of Gemini-generated TTS audio and browser Web Speech fallback.
 */

class AudioEngine {
  private currentAudio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;

  public async playGeminiTTS(text: string, speaker: string = 'Puck'): Promise<boolean> {
    this.stop();

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speaker }),
      });

      if (!response.ok) {
        throw new Error(`TTS server responded with ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.audio) {
        await this.playBase64Audio(data.audio);
        return true;
      } else {
        throw new Error(data.error || 'No audio returned');
      }
    } catch (err) {
      console.warn('Gemini TTS playback failed, invoking Web Speech API fallback:', err);
      return this.playWebSpeech(text);
    }
  }

  public playBase64Audio(base64: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const audioSrc = `data:audio/mp3;base64,${base64}`;
        const audio = new Audio(audioSrc);
        this.currentAudio = audio;

        audio.onended = () => {
          this.currentAudio = null;
          resolve();
        };

        audio.onerror = (e) => {
          this.currentAudio = null;
          reject(e);
        };

        audio.play().catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  public playWebSpeech(text: string): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported on this device.');
      return false;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => (v.name.includes('Daniel') || v.name.includes('Natural') || v.name.includes('Google UK English Male') || v.lang.startsWith('en')) && !v.name.includes('Whisper')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.error('Web Speech error:', e);
      return false;
    }
  }

  public playTone(freq: number = 440, type: OscillatorType = 'sine', duration: number = 0.15) {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // AudioContext could be blocked if no user gesture
    }
  }

  public playCountdownTick() {
    this.playTone(880, 'triangle', 0.05);
  }

  public playCompleteFanfare() {
    this.playTone(523.25, 'sine', 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.1), 100); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.25), 200); // G5
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioEngine = new AudioEngine();
