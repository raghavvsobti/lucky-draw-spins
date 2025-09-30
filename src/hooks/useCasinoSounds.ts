import { useCallback, useRef } from 'react';

export const useCasinoSounds = () => {
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winnerSoundRef = useRef<HTMLAudioElement | null>(null);

  const playSpinSound = useCallback(() => {
    try {
      if (!spinSoundRef.current) {
        spinSoundRef.current = new Audio('/sounds/spin.mp3');
        spinSoundRef.current.loop = true;
        spinSoundRef.current.volume = 0.3;
      }
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play spin sound:', error);
    }
  }, []);

  const stopSpinSound = useCallback(() => {
    try {
      if (spinSoundRef.current) {
        spinSoundRef.current.pause();
        spinSoundRef.current.currentTime = 0;
      }
    } catch (error) {
      console.warn('Could not stop spin sound:', error);
    }
  }, []);

  const playWinnerSound = useCallback(() => {
    try {
      if (!winnerSoundRef.current) {
        winnerSoundRef.current = new Audio('/sounds/winner.mp3');
        winnerSoundRef.current.volume = 0.5;
      }
      winnerSoundRef.current.currentTime = 0;
      winnerSoundRef.current.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play winner sound:', error);
    }
  }, []);

  return {
    playSpinSound,
    stopSpinSound,
    playWinnerSound,
  };
};