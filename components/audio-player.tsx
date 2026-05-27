'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  onPlay?: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioPlayer({ src, title, onPlay }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoading(false);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      if (onPlay) onPlay();
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audio.currentTime = pct * duration;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col gap-4">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play Button */}
      <div className="flex items-center justify-center">
        <button
          id="audio-play-btn"
          onClick={togglePlay}
          disabled={loading}
          className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-brand-gold to-brand-goldDark flex items-center justify-center shadow-lg shadow-brand-gold/30 transition-all duration-200 active:scale-[0.94] disabled:opacity-50"
        >
          {isPlaying
            ? <Pause className="w-7 h-7 text-brand-bg fill-brand-bg" />
            : <Play className="w-7 h-7 text-brand-bg fill-brand-bg ml-1" />
          }
        </button>
      </div>

      {/* Progress Bar */}
      <div
        className="h-2 bg-brand-bg/50 rounded-full cursor-pointer overflow-hidden"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-gradient-to-r from-brand-gold to-brand-goldDark rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time Display */}
      <div className="flex items-center justify-between text-brand-muted text-xs">
        <span>{formatTime(currentTime)}</span>
        <div className="flex items-center gap-1 text-brand-dim">
          <Volume2 className="w-3.5 h-3.5" />
          <span className="text-[10px]">Audio de apoyo</span>
        </div>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
