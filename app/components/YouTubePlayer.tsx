'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import ReactPlayer from 'react-player';
import { YOUTUBE_MUSIC_URL } from '../lib/constants';

interface YouTubePlayerProps {
  isMuted: boolean;
  isPlaying: boolean;
}

export interface YouTubePlayerControls {
  play: () => void;
  pause: () => void;
  mute: () => void;
  unmute: () => void;
}

const YouTubePlayer = forwardRef<YouTubePlayerControls, YouTubePlayerProps>(
  ({ isMuted, isPlaying }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);

    // Exponer métodos de control al componente padre
    useImperativeHandle(ref, () => ({
      play: () => {
        try {
          const internalPlayer = playerRef.current?.getInternalPlayer?.();
          if (internalPlayer && typeof internalPlayer.playVideo === 'function') {
            internalPlayer.playVideo();
            console.log('▶️ Play ejecutado desde ref');
          }
        } catch (error) {
          console.log('⚠️ Error al ejecutar play:', error);
        }
      },
      pause: () => {
        try {
          const internalPlayer = playerRef.current?.getInternalPlayer?.();
          if (internalPlayer && typeof internalPlayer.pauseVideo === 'function') {
            internalPlayer.pauseVideo();
            console.log('⏸️ Pause ejecutado desde ref');
          }
        } catch (error) {
          console.log('⚠️ Error al ejecutar pause:', error);
        }
      },
      mute: () => {
        try {
          const internalPlayer = playerRef.current?.getInternalPlayer?.();
          if (internalPlayer && typeof internalPlayer.mute === 'function') {
            internalPlayer.mute();
            console.log('🔇 Mute ejecutado desde ref');
          }
        } catch (error) {
          console.log('⚠️ Error al ejecutar mute:', error);
        }
      },
      unmute: () => {
        try {
          const internalPlayer = playerRef.current?.getInternalPlayer?.();
          if (internalPlayer && typeof internalPlayer.unMute === 'function') {
            internalPlayer.unMute();
            console.log('🔊 Unmute ejecutado desde ref');
          }
        } catch (error) {
          console.log('⚠️ Error al ejecutar unmute:', error);
        }
      },
    }));

    return (
      <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
          overflow: 'hidden',
        }}
      >
        <ReactPlayer
          ref={playerRef}
          url={YOUTUBE_MUSIC_URL}
          playing={isPlaying}
          loop={true}
          volume={0.7}
          muted={isMuted}
          width="1px"
          height="1px"
          controls={false}
          playsinline={true}
          config={{
            youtube: {
              playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                playsinline: 1,
                enablejsapi: 1,
              },
            },
          }}
          onReady={(player) => {
            console.log('✅ Reproductor de música listo');
            console.log('🎵 URL:', YOUTUBE_MUSIC_URL);
            console.log('▶️ Reproduciendo:', isPlaying);
            console.log('🔇 Muteado:', isMuted);
            
            // Intentar obtener información del volumen y forzar reproducción
            setTimeout(() => {
              try {
                if (typeof player.getInternalPlayer === 'function') {
                  const internalPlayer = player.getInternalPlayer();
                  if (internalPlayer) {
                    console.log('🎯 Reproductor interno obtenido');
                    console.log('📊 Tipo de reproductor:', internalPlayer.constructor.name);
                    
                    // Unmute explícitamente
                    if (typeof internalPlayer.unMute === 'function') {
                      internalPlayer.unMute();
                      console.log('🔊 Unmute aplicado');
                    }
                    
                    // Establecer volumen
                    if (typeof internalPlayer.setVolume === 'function') {
                      internalPlayer.setVolume(70);
                      console.log('🔊 Volumen establecido a 70');
                    }
                    
                    // Verificar estado
                    if (typeof internalPlayer.getPlayerState === 'function') {
                      const state = internalPlayer.getPlayerState();
                      console.log('📊 Estado del reproductor:', state, '(1=playing, 2=paused, 3=buffering)');
                    }
                    
                    // Si debe estar reproduciendo, forzar play
                    if (isPlaying && typeof internalPlayer.playVideo === 'function') {
                      setTimeout(() => {
                        internalPlayer.playVideo();
                        console.log('🎬 Forzando reproducción...');
                      }, 300);
                    }
                  } else {
                    console.warn('⚠️ No se pudo obtener el reproductor interno');
                  }
                } else {
                  console.warn('⚠️ player.getInternalPlayer no es una función');
                }
              } catch (error) {
                console.error('❌ Error al acceder al reproductor:', error);
              }
            }, 1000);
          }}
          onPlay={() => {
            console.log('▶️ Música comenzó a reproducirse');
            console.log('🔊 Verificar: isMuted =', isMuted, ', volume = 0.7');
            
            // Verificar que no esté muteado después de un momento
            setTimeout(() => {
              try {
                if (playerRef.current && typeof playerRef.current.getInternalPlayer === 'function') {
                  const internalPlayer = playerRef.current.getInternalPlayer();
                  if (internalPlayer && typeof internalPlayer.isMuted === 'function') {
                    const muted = internalPlayer.isMuted();
                    console.log('🔊 Estado de mute del reproductor:', muted);
                    
                    if (muted && !isMuted) {
                      console.warn('⚠️ ADVERTENCIA: El reproductor está muteado internamente, forzando unmute...');
                      internalPlayer.unMute();
                      internalPlayer.setVolume(70);
                      console.log('✅ Unmute y volumen aplicados');
                    }
                  }
                }
              } catch (error) {
                console.log('⚠️ Error al verificar mute:', error);
              }
            }, 1000);
          }}
          onPause={() => {
            console.log('⏸️ Música pausada');
          }}
          onError={(error: unknown) => {
            console.error('❌ Error en el reproductor de música:', error);
            console.error('El video puede que no permita reproducción embebida.');
            console.error('Intenta con otro video de YouTube que permita embed.');
          }}
        />
      </div>
    );
  }
);

YouTubePlayer.displayName = 'YouTubePlayer';

export default YouTubePlayer;
