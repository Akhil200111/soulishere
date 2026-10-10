'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    FaPlay, 
    FaPause, 
    FaVolumeUp, 
    FaVolumeDown, 
    FaVolumeMute, 
    FaExpand, 
    FaCompress,
    FaRedo
} from 'react-icons/fa';

export default function MemorialVideoPlayer({ videoId, title = 'Video Memory' }) {
    const containerRef = useRef(null);
    const iframeRef = useRef(null);
    const playerRef = useRef(null);
    const iframeIdRef = useRef(`yt-player-${videoId || 'default'}-${Math.random().toString(36).substring(2, 7)}`);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(100);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const hideTimeoutRef = useRef(null);

    // Format seconds into mm:ss
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Helper to send command to YouTube player via API or postMessage
    const sendCommand = (func, args = []) => {
        if (playerRef.current && typeof playerRef.current[func] === 'function') {
            try {
                playerRef.current[func](...args);
                return;
            } catch (e) {}
        }
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func,
                args
            }), '*');
        }
    };

    // Load YouTube IFrame API script once globally
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (!window.YT) {
            const existingScript = document.getElementById('youtube-iframe-api-script');
            if (!existingScript) {
                const tag = document.createElement('script');
                tag.id = 'youtube-iframe-api-script';
                tag.src = 'https://www.youtube.com/iframe_api';
                const firstScript = document.getElementsByTagName('script')[0];
                if (firstScript && firstScript.parentNode) {
                    firstScript.parentNode.insertBefore(tag, firstScript);
                } else {
                    document.body.appendChild(tag);
                }
            }
        }
    }, []);

    // Initialize or update YouTube Player for the active video
    useEffect(() => {
        if (!videoId || typeof window === 'undefined') return;

        let isMounted = true;
        let pollTimer = null;

        // Reset state for new video
        setIsPlaying(false);
        setIsEnded(false);
        setCurrentTime(0);
        setDuration(0);

        // If player instance already exists and has cueVideoById, simply load/cue the new video!
        if (playerRef.current && typeof playerRef.current.cueVideoById === 'function') {
            try {
                playerRef.current.cueVideoById(videoId);
                return;
            } catch (e) {
                console.warn('Error cueing video:', e);
            }
        }

        const initPlayer = () => {
            if (!window.YT || !window.YT.Player || !iframeRef.current) return;

            try {
                playerRef.current = new window.YT.Player(iframeRef.current, {
                    events: {
                        onReady: (event) => {
                            if (!isMounted) return;
                            try {
                                const dur = event.target.getDuration() || 0;
                                if (dur) setDuration(dur);
                                setVolume(event.target.getVolume() || 100);
                                setIsMuted(event.target.isMuted() || false);
                            } catch (e) {}
                        },
                        onStateChange: (event) => {
                            if (!isMounted) return;
                            // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
                            if (event.data === 1) {
                                setIsPlaying(true);
                                setIsEnded(false);
                            } else if (event.data === 2) {
                                setIsPlaying(false);
                            } else if (event.data === 0) {
                                // Ended: reset to beginning to prevent YouTube's "More videos" endscreen!
                                setIsPlaying(false);
                                setIsEnded(true);
                                setCurrentTime(0);
                                try {
                                    event.target.seekTo(0);
                                    event.target.pauseVideo();
                                } catch (e) {}
                            }
                        }
                    }
                });
            } catch (err) {
                console.error('Error attaching YouTube player:', err);
            }
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            pollTimer = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    clearInterval(pollTimer);
                    initPlayer();
                }
            }, 100);
        }

        // Window message listener for postMessage events from YouTube iframe
        const handleMessage = (e) => {
            if (!isMounted || typeof e.data !== 'string') return;
            try {
                const data = JSON.parse(e.data);
                if (data.event === 'onStateChange') {
                    if (data.info === 1) {
                        setIsPlaying(true);
                        setIsEnded(false);
                    } else if (data.info === 2) {
                        setIsPlaying(false);
                    } else if (data.info === 0) {
                        setIsPlaying(false);
                        setIsEnded(true);
                        setCurrentTime(0);
                        sendCommand('seekTo', [0, true]);
                        sendCommand('pauseVideo');
                    }
                } else if (data.event === 'infoDelivery' && data.info) {
                    if (typeof data.info.currentTime === 'number') {
                        setCurrentTime(data.info.currentTime);
                    }
                    if (typeof data.info.duration === 'number' && data.info.duration > 0) {
                        setDuration(data.info.duration);
                    }
                    if (typeof data.info.volume === 'number') {
                        setVolume(data.info.volume);
                    }
                    if (typeof data.info.muted === 'boolean') {
                        setIsMuted(data.info.muted);
                    }
                }
            } catch (err) {}
        };

        window.addEventListener('message', handleMessage);

        return () => {
            isMounted = false;
            if (pollTimer) clearInterval(pollTimer);
            window.removeEventListener('message', handleMessage);
            // We do NOT call player.destroy() because YouTube API's destroy() removes the iframe DOM element.
            playerRef.current = null;
        };
    }, [videoId]);

    // Timer to update current time during playback
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                    try {
                        const cur = playerRef.current.getCurrentTime() || 0;
                        setCurrentTime(cur);
                        const dur = playerRef.current.getDuration() || 0;
                        if (dur > 0 && duration === 0) {
                            setDuration(dur);
                        }
                    } catch (e) {}
                }
            }, 300);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, duration]);

    // Auto-hide controls during playback after 2.5 seconds
    const resetControlsTimeout = () => {
        setShowControls(true);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        if (isPlaying) {
            hideTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 2500);
        }
    };

    useEffect(() => {
        if (!isPlaying) {
            setShowControls(true);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        } else {
            resetControlsTimeout();
        }
        return () => {
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, [isPlaying]);

    // Fullscreen listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Actions
    const handleTogglePlay = (e) => {
        if (e) e.stopPropagation();
        if (isEnded) {
            sendCommand('seekTo', [0, true]);
            sendCommand('playVideo');
            setIsEnded(false);
            setIsPlaying(true);
        } else if (isPlaying) {
            sendCommand('pauseVideo');
            setIsPlaying(false);
        } else {
            sendCommand('playVideo');
            setIsPlaying(true);
        }
    };

    const handleToggleMute = (e) => {
        if (e) e.stopPropagation();
        if (isMuted) {
            sendCommand('unMute');
            setIsMuted(false);
            if (volume === 0) {
                setVolume(50);
                sendCommand('setVolume', [50]);
            }
        } else {
            sendCommand('mute');
            setIsMuted(true);
        }
    };

    const handleVolumeSlider = (e) => {
        e.stopPropagation();
        const val = Number(e.target.value);
        setVolume(val);
        sendCommand('setVolume', [val]);
        if (val === 0) {
            sendCommand('mute');
            setIsMuted(true);
        } else if (isMuted) {
            sendCommand('unMute');
            setIsMuted(false);
        }
    };

    const handleSeek = (e) => {
        e.stopPropagation();
        if (!duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = percentage * duration;
        sendCommand('seekTo', [newTime, true]);
        setCurrentTime(newTime);
        if (isEnded) setIsEnded(false);
    };

    const handleToggleFullscreen = (e) => {
        if (e) e.stopPropagation();
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen?.().catch(err => console.error(err));
        } else {
            document.exitFullscreen?.().catch(err => console.error(err));
        }
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div 
            ref={containerRef}
            onMouseMove={resetControlsTimeout}
            onClick={resetControlsTimeout}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
                overflow: 'hidden',
                userSelect: 'none'
            }}
        >
            {/* Cropped YouTube Player Viewport */}
            {/* 
                1. top: -60px & height: calc(100% + 115px) clips off the YouTube top bar 
                   (Title, Channel Avatar, Watch Later time icon, Share button).
                2. pointerEvents: 'none' prevents any clicks on YouTube external links, 
                   watermarks, or recommendation overlays.
                3. controls=0 removes YouTube's native control bar (including Watch on YouTube).
            */}
            <div 
                style={{
                    position: 'absolute',
                    top: '-60px',
                    left: 0,
                    width: '100%',
                    height: 'calc(100% + 115px)',
                    pointerEvents: 'none'
                }}
            >
                <iframe
                    ref={iframeRef}
                    id={iframeIdRef.current}
                    key={videoId}
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&fs=0&disablekb=1`}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', display: 'block', border: 'none' }}
                />
            </div>

            {/* Clickable Overlay to toggle play/pause when clicking the screen */}
            <div 
                onClick={handleTogglePlay}
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10,
                    cursor: 'pointer'
                }}
            />

            {/* Big Center Play/Replay Button when Paused or Ended */}
            {(!isPlaying || isEnded) && (
                <div 
                    onClick={handleTogglePlay}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 15,
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'rgba(30, 20, 25, 0.8)',
                        border: '2px solid rgba(214, 174, 116, 0.85)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, background 0.2s ease',
                        backdropFilter: 'blur(6px)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                        e.currentTarget.style.background = 'rgba(45, 25, 35, 0.95)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                        e.currentTarget.style.background = 'rgba(30, 20, 25, 0.8)';
                    }}
                    title={isEnded ? "Replay Video" : "Play Video"}
                >
                    {isEnded ? (
                        <FaRedo style={{ color: '#d6ae74', fontSize: '1.5rem' }} />
                    ) : (
                        <FaPlay style={{ color: '#d6ae74', fontSize: '1.5rem', marginLeft: '4px' }} />
                    )}
                </div>
            )}

            {/* Bottom Custom Control Bar: Provides Play & Volume controls, hiding all YouTube UI */}
            <div 
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    background: 'linear-gradient(to top, rgba(15, 10, 18, 0.92) 0%, rgba(15, 10, 18, 0.7) 65%, transparent 100%)',
                    padding: '24px 16px 12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    opacity: showControls || !isPlaying ? 1 : 0,
                    transform: showControls || !isPlaying ? 'translateY(0)' : 'translateY(8px)',
                    pointerEvents: showControls || !isPlaying ? 'auto' : 'none'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Timeline Progress Bar */}
                <div 
                    onClick={handleSeek}
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        transition: 'height 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.height = '8px'}
                    onMouseLeave={(e) => e.currentTarget.style.height = '6px'}
                    title="Seek"
                >
                    {/* Played Progress */}
                    <div 
                        style={{
                            height: '100%',
                            width: `${progressPercent}%`,
                            backgroundColor: '#c48f95',
                            borderRadius: '3px',
                            background: 'linear-gradient(90deg, #d6ae74, #c48f95)',
                            position: 'relative'
                        }}
                    >
                        {/* Scrubber Knob */}
                        <div 
                            style={{
                                position: 'absolute',
                                right: '-5px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: '#fff',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.5)'
                            }}
                        />
                    </div>
                </div>

                {/* Control Buttons Row */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                }}>
                    {/* Left: Play/Pause Button, Volume Control & Timestamp */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {/* Play / Pause Button */}
                        <button
                            type="button"
                            onClick={handleTogglePlay}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#f5efe6',
                                fontSize: '1.15rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '6px',
                                borderRadius: '6px',
                                transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#d6ae74'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#f5efe6'}
                            title={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isEnded ? <FaRedo /> : isPlaying ? <FaPause /> : <FaPlay />}
                        </button>

                        {/* Volume Control Button & Slider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                type="button"
                                onClick={handleToggleMute}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#f5efe6',
                                    fontSize: '1.15rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '6px',
                                    borderRadius: '6px',
                                    transition: 'color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#d6ae74'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#f5efe6'}
                                title={isMuted ? 'Unmute' : 'Mute'}
                            >
                                {isMuted || volume === 0 ? (
                                    <FaVolumeMute />
                                ) : volume < 50 ? (
                                    <FaVolumeDown />
                                ) : (
                                    <FaVolumeUp />
                                )}
                            </button>

                            {/* Volume Slider */}
                            <input 
                                type="range"
                                min="0"
                                max="100"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeSlider}
                                style={{
                                    width: '75px',
                                    height: '4px',
                                    cursor: 'pointer',
                                    accentColor: '#c48f95'
                                }}
                                title={`Volume: ${isMuted ? 0 : volume}%`}
                            />
                        </div>

                        {/* Timestamp */}
                        <span style={{
                            color: '#d4c7b3',
                            fontSize: '0.85rem',
                            fontFamily: 'monospace',
                            marginLeft: '4px'
                        }}>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    {/* Right: Fullscreen Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            type="button"
                            onClick={handleToggleFullscreen}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#f5efe6',
                                fontSize: '1.05rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '6px',
                                borderRadius: '6px',
                                transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#d6ae74'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#f5efe6'}
                            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        >
                            {isFullscreen ? <FaCompress /> : <FaExpand />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
