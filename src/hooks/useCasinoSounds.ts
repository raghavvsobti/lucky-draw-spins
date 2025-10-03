import { useCallback, useRef } from 'react';

export const useCasinoSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSpinSound = useCallback(() => {
    try {
      const audioContext = getAudioContext();
      
      // Stop any existing sound
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start(audioContext.currentTime);
      
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
    } catch (error) {
      console.warn('Could not play spin sound:', error);
    }
  }, [getAudioContext]);

  const stopSpinSound = useCallback(() => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
    } catch (error) {
      console.warn('Could not stop spin sound:', error);
    }
  }, []);

  const playWinnerSound = useCallback(() => {
    try {
      const audioContext = getAudioContext();
      
      // Play a celebratory sequence
      const playNote = (freq: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, startTime);
        
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      const now = audioContext.currentTime;
      // Play a victory fanfare
      playNote(523.25, now, 0.2); // C5
      playNote(659.25, now + 0.15, 0.2); // E5
      playNote(783.99, now + 0.3, 0.3); // G5
      playNote(1046.50, now + 0.5, 0.4); // C6
    } catch (error) {
      console.warn('Could not play winner sound:', error);
    }
  }, [getAudioContext]);

  return {
    playSpinSound,
    stopSpinSound,
    playWinnerSound,
  };
};