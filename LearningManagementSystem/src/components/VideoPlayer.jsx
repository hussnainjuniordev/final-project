import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";

function VideoPlayer({ url, title, onEnded }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef(null);

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(cur);
    setProgress(dur ? (cur / dur) * 100 : 0);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * (videoRef.current.duration || 0);
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) videoRef.current.volume = v;
    setMuted(v === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !muted;
    setMuted(next);
    videoRef.current.muted = next;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const volumeIcon = muted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊";

  return (
    <div
      ref={containerRef}
      style={{
        background: "#000",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        position: "relative",
      }}
    >
      {/* Video */}
      <div
        style={{ position: "relative", cursor: "pointer", background: "#000" }}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={url}
          style={{
            width: "100%",
            display: "block",
            maxHeight: "480px",
            background: "#000",
          }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setIsPlaying(false);
            if (onEnded) onEnded();
          }}
        />

        {/* Play overlay */}
        {!isPlaying && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(20,184,166,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 32px rgba(20,184,166,0.5)",
                fontSize: "1.5rem",
                paddingLeft: "4px",
              }}
            >
              <Play size={32} color="#fff" />
            </div>
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div
        style={{
          background:
            "linear-gradient(0deg, #0d1117 0%, rgba(13,17,23,0.95) 100%)",
          padding: "0.6rem 1rem 0.75rem",
        }}
      >
        {/* Progress bar */}
        <div
          onClick={handleSeek}
          style={{
            height: "4px",
            background: "rgba(255,255,255,0.12)",
            borderRadius: "999px",
            cursor: "pointer",
            marginBottom: "0.65rem",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "var(--brand, #14b8a6)",
              borderRadius: "999px",
              transition: "width 0.1s linear",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: "-6px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "var(--brand, #14b8a6)",
                boxShadow: "0 0 6px rgba(20,184,166,0.8)",
              }}
            />
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Play/Pause */}
          <button onClick={togglePlay} style={btnStyle}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* Time */}
          <span
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.78rem",
              whiteSpace: "nowrap",
            }}
          >
            {fmt(currentTime)} / {fmt(duration)}
          </span>

          {/* Title */}
          <span
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.78rem",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>

          {/* Volume */}
          <button onClick={toggleMute} style={btnStyle}>
            {volumeIcon}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={handleVolume}
            style={{
              width: "70px",
              accentColor: "var(--brand, #14b8a6)",
              cursor: "pointer",
            }}
          />

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} style={btnStyle}>
            {fullscreen ? "⛶" : "⛶"}
          </button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.75)",
  cursor: "pointer",
  fontSize: "1rem",
  padding: "0.2rem 0.3rem",
  borderRadius: "4px",
  transition: "color 0.15s",
  lineHeight: 1,
};

export default VideoPlayer;
