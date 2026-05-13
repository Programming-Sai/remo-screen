"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon/Icon";
import styles from "./AudioPlayer.module.css";

interface AudioPlayerProps {
  hasAudio?: boolean;
}

export default function AudioPlayer({
  hasAudio = false,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 132; // 2:12 in seconds (mock)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          const newProgress = prev + 1;
          setCurrentTime(Math.floor((newProgress / 100) * duration));
          return newProgress;
        });
      }, 660); // ~1% per 0.66s
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    const newTime = Math.floor((newProgress / 100) * duration);
    setCurrentTime(newTime);
  };

  if (!hasAudio) {
    return (
      <div className={styles.audioRow}>
        <div className={styles.audioPlaceholder}>
          <Icon name="mic_off" size={16} />
          <span>No audio recording available</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.audioRow}>
      <button className={styles.audioButton} onClick={togglePlay} type="button">
        <Icon name={isPlaying ? "pause" : "play_arrow"} size={16} />
      </button>
      <div className={styles.audioTrack}>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={progress}
          onChange={handleSeek}
          className={styles.audioSlider}
          style={{
            background: `linear-gradient(to right, var(--primary-container) 0%, var(--primary-container) ${progress}%, var(--surface-variant) ${progress}%, var(--surface-variant) 100%)`,
          }}
        />
      </div>
      <span className={styles.audioTime}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}
