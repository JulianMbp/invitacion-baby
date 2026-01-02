'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface AudioPlayerProps {
  isMuted: boolean;
  isPlaying: boolean;
  audioSrc: string;
}

export interface AudioPlayerControls {
  play: () => void;
  pause: () => void;
  mute: () => void;
  unmute: () => void;
}

const AudioPlayer = forwardRef<AudioPlayerControls, AudioPlayerProps>(
  ({ isMuted, isPlaying, audioSrc }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    // Exponer métodos de control al componente padre
    useImperativeHandle(ref, () => ({
      play: () => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {
            // Error silencioso
          });
        }
      },
      pause: () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      },
      mute: () => {
        if (audioRef.current) {
          audioRef.current.muted = true;
        }
      },
      unmute: () => {
        if (audioRef.current) {
          audioRef.current.muted = false;
        }
      },
    }));

    // Controlar reproducción cuando cambia isPlaying
    useEffect(() => {
      if (!audioRef.current) return;

      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Error silencioso
        });
      } else {
        audioRef.current.pause();
      }
    }, [isPlaying]);

    // Controlar mute cuando cambia isMuted
    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.muted = isMuted;
      }
    }, [isMuted]);

    // Configurar el audio cuando se carga
    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0.7; // 70% de volumen
        audioRef.current.loop = true; // Repetir automáticamente
      }
    }, []);

    return (
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        style={{ display: 'none' }}
        onError={() => {
          // Error silencioso
        }}
      />
    );
  }
);

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;

