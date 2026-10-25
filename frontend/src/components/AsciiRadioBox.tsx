import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Volume1,
  Radio,
  Music,
  Heart,
  Sparkles,
  Sliders,
  Disc,
  SkipBack,
  SkipForward,
  Copy,
  Check,
  Tv,
  AlignLeft,
} from 'lucide-react';
import { soundSynth } from '../utils/audio';

// Path to the song in public/
const SONG_URL = '/Sufjan_Stevens_-_Mystery_of_Love_(mp3.pm).mp3';

interface RadioStation {
  id: string;
  freq: string;
  freqNum: number;
  name: string;
  tagline: string;
  artist: string;
  album: string;
  type: 'song' | 'synth-rain' | 'synth-lofi' | 'synth-musicbox';
}

const STATIONS: RadioStation[] = [
  {
    id: 'sufjan',
    freq: '104.3 FM',
    freqNum: 104.3,
    name: 'Mystery of Love',
    tagline: "Sreeparna's Dedication Station",
    artist: 'Sufjan Stevens',
    album: 'Call Me By Your Name OST',
    type: 'song',
  },
  {
    id: 'lofi',
    freq: '98.5 FM',
    freqNum: 98.5,
    name: 'Meadow Breeze & Acoustic Chimes',
    tagline: 'Soft Ambient Pentatonic Flowers',
    artist: 'Botanical Radio Lab',
    album: 'S+I Meadow Whispers',
    type: 'synth-lofi',
  },
  {
    id: 'rain',
    freq: '91.2 FM',
    freqNum: 91.2,
    name: 'Late Night Rain & Analog Hiss',
    tagline: 'Cozy Nostalgia Frequency',
    artist: 'Vintage Tube Broadcast',
    album: 'Tape Loop Archive',
    type: 'synth-rain',
  },
  {
    id: 'musicbox',
    freq: '88.0 FM',
    freqNum: 88.0,
    name: 'Starlight Celestial Music Box',
    tagline: 'Gentle Music Box for Sweet Dreams',
    artist: 'Midnight Echoes',
    album: 'Lullabies for Cutu',
    type: 'synth-musicbox',
  },
];

interface LyricLine {
  time: number; // in seconds
  text: string;
}

// Synced lyrics for Sufjan Stevens - Mystery of Love
const LYRICS: LyricLine[] = [
  { time: 0, text: '♪ [Gentle acoustic guitar & mandolin intro] ♪' },
  { time: 15, text: 'Oh, to see without my eyes' },
  { time: 22, text: 'The first time that you kissed me' },
  { time: 29, text: 'Boundless by the time I cried' },
  { time: 36, text: 'One thousand nights, I built your walls around me' },
  { time: 44, text: 'White feather down onto your shoulder' },
  { time: 51, text: 'Running out of sighs, I see the wind blows' },
  { time: 58, text: 'How much sorrow can I take?' },
  { time: 65, text: 'Blackbird on my shoulder' },
  { time: 72, text: 'And what difference does it make' },
  { time: 79, text: 'When this love is over?' },
  { time: 86, text: 'Shall I write this in a letter?' },
  { time: 94, text: 'Shall I push you from my heart?' },
  { time: 101, text: 'Brother, will you hold me?' },
  { time: 114, text: 'Oh, will wonders ever cease?' },
  { time: 121, text: 'Blessed be the mystery of love' },
  { time: 135, text: '♪ [Lyrical acoustic interlude] ♪' },
  { time: 150, text: 'Lord, I no longer believe' },
  { time: 157, text: 'Drowned in living waters' },
  { time: 164, text: 'Cursed by the love that I received' },
  { time: 171, text: 'From Rogue River and its daughter' },
  { time: 178, text: 'How much sorrow can I take?' },
  { time: 185, text: 'Blackbird on my shoulder' },
  { time: 192, text: 'And what difference does it make' },
  { time: 199, text: 'When this love is over?' },
  { time: 206, text: 'Shall I write this in a letter?' },
  { time: 213, text: 'Shall I push you from my heart?' },
  { time: 220, text: 'Brother, will you hold me?' },
  { time: 232, text: 'Oh, will wonders ever cease?' },
  { time: 239, text: 'Blessed be the mystery of love' },
  { time: 254, text: 'Blessed be the mystery of love' },
  { time: 268, text: 'Blessed be the mystery of love' },
  { time: 285, text: 'The first time that you kissed me' },
  { time: 298, text: 'Oh, will wonders ever cease?' },
  { time: 305, text: 'Blessed be the mystery of love' },
  { time: 318, text: '♪ [Acoustic fade out into wildflower serenity] ♪' },
];

type RadioColorTheme = 'monochrome' | 'amber' | 'emerald' | 'rose';

export const AsciiRadioBox: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<RadioStation>(STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [colorTheme, setColorTheme] = useState<RadioColorTheme>('monochrome');
  const [hasScanlines, setHasScanlines] = useState<boolean>(false);
  const [showLyrics, setShowLyrics] = useState<boolean>(true);
  const [tapeFrame, setTapeFrame] = useState<number>(0);
  const [vuLevels, setVuLevels] = useState<number[]>([1, 2, 4, 3, 5, 2, 6, 4, 3, 5, 2, 4]);
  const [copiedNote, setCopiedNote] = useState<boolean>(false);
  const [isTuning, setIsTuning] = useState<boolean>(false);

  // Audio refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const synthNodesRef = useRef<{
    oscs: OscillatorNode[];
    gain: GainNode | null;
    intervalId?: number;
  }>({ oscs: [], gain: null });
  const animFrameRef = useRef<number | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  // Tape reel animation frames
  const SPOOL_SYMBOLS = ['◐', '◓', '◑', '◒'];

  // Initialize Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.src = SONG_URL;
    audio.loop = isLooping;
    audio.volume = volume;
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 248); // ~4m 08s fallback
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (!audio.loop) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      stopSynthStation();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Web Audio Context setup for real frequency visualizer
  const initWebAudio = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        if (audioRef.current) {
          try {
            const source = ctx.createMediaElementSource(audioRef.current);
            source.connect(analyser);
            analyser.connect(ctx.destination);
          } catch {
            // Already connected or cross-origin safe fallback
          }
        }
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Tape Spool Animation Loop & VU Meter
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setTapeFrame((prev) => (prev + 1) % SPOOL_SYMBOLS.length);
      }, 180);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Visualizer render loop
  useEffect(() => {
    let isCancelled = false;

    const updateVisualizer = () => {
      if (isPlaying) {
        if (analyserRef.current) {
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(dataArray);

          // Downsample to 16 bars
          const bars: number[] = [];
          const step = Math.max(1, Math.floor(bufferLength / 16));
          for (let i = 0; i < 16; i++) {
            const val = dataArray[i * step] || 0;
            // Scale 0-255 to 0-8 block height
            const level = Math.min(8, Math.floor((val / 255) * 8.5));
            bars.push(level);
          }
          setVuLevels(bars);
        } else {
          // Dynamic simulated rhythmic VU meter
          const time = Date.now() / 200;
          const bars = Array.from({ length: 16 }, (_, i) => {
            const wave = Math.sin(time + i * 0.7) * 3 + Math.cos(time * 0.5 + i) * 2 + 4;
            return Math.max(1, Math.min(8, Math.round(wave)));
          });
          setVuLevels(bars);
        }
      } else {
        setVuLevels((prev) => prev.map((v) => Math.max(0, v - 1)));
      }

      if (!isCancelled) {
        animFrameRef.current = requestAnimationFrame(updateVisualizer);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateVisualizer);
    return () => {
      isCancelled = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Handle Station Switching
  const handleSelectStation = (station: RadioStation) => {
    if (station.id === selectedStation.id) return;

    soundSynth.playSparkle();
    setIsTuning(true);

    // Play analog tuning static sound
    playTuningClick();

    setTimeout(() => {
      setSelectedStation(station);
      setIsTuning(false);

      if (station.type === 'song') {
        stopSynthStation();
        if (audioRef.current && isPlaying) {
          initWebAudio();
          audioRef.current.play().catch(() => {});
        }
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        if (isPlaying) {
          startSynthStation(station.type);
        }
      }
    }, 280);
  };

  // Synthesizer Stations (Rain, Meadow Lofi, Music Box)
  const stopSynthStation = () => {
    if (synthNodesRef.current.intervalId) {
      window.clearInterval(synthNodesRef.current.intervalId);
      synthNodesRef.current.intervalId = undefined;
    }
    synthNodesRef.current.oscs.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignored
      }
    });
    synthNodesRef.current.oscs = [];
    if (synthNodesRef.current.gain) {
      synthNodesRef.current.gain.disconnect();
      synthNodesRef.current.gain = null;
    }
  };

  const startSynthStation = (type: RadioStation['type']) => {
    stopSynthStation();
    initWebAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.45, ctx.currentTime);
    if (analyserRef.current) {
      masterGain.connect(analyserRef.current);
      analyserRef.current.connect(ctx.destination);
    } else {
      masterGain.connect(ctx.destination);
    }
    synthNodesRef.current.gain = masterGain;

    if (type === 'synth-musicbox') {
      const melody = [523.25, 659.25, 783.99, 1046.5, 880.0, 659.25, 783.99, 587.33];
      let step = 0;
      const intervalId = window.setInterval(() => {
        if (!audioCtxRef.current) return;
        const osc = audioCtxRef.current.createOscillator();
        const noteGain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.value = melody[step % melody.length];
        step++;

        noteGain.gain.setValueAtTime(0.001, audioCtxRef.current.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.3, audioCtxRef.current.currentTime + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.8);

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.85);
      }, 400);
      synthNodesRef.current.intervalId = intervalId;
    } else if (type === 'synth-lofi') {
      // Warm pentatonic ambient pads
      const chords = [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0],  // Am7
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [196.0, 246.94, 293.66, 392.0],  // G7
      ];
      let chordIdx = 0;
      const intervalId = window.setInterval(() => {
        if (!audioCtxRef.current) return;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;
        currentChord.forEach((freq) => {
          const osc = audioCtxRef.current!.createOscillator();
          const chordGain = audioCtxRef.current!.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;

          chordGain.gain.setValueAtTime(0.001, audioCtxRef.current!.currentTime);
          chordGain.gain.exponentialRampToValueAtTime(0.12, audioCtxRef.current!.currentTime + 0.6);
          chordGain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current!.currentTime + 2.2);

          osc.connect(chordGain);
          chordGain.connect(masterGain);
          osc.start();
          osc.stop(audioCtxRef.current!.currentTime + 2.3);
        });
      }, 2000);
      synthNodesRef.current.intervalId = intervalId;
    } else if (type === 'synth-rain') {
      // White/pink noise generator for rain & tape hiss
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 850;

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();
      synthNodesRef.current.oscs = [whiteNoise as unknown as OscillatorNode];
    }
  };

  // Radio tuning static click sound
  const playTuningClick = () => {
    initWebAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.08);

    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  };

  // Play / Pause toggle
  const togglePlay = () => {
    initWebAudio();
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);

    if (selectedStation.type === 'song') {
      if (audioRef.current) {
        if (nextPlay) {
          audioRef.current.play().catch((err) => {
            console.error('Audio playback failed', err);
            setIsPlaying(false);
          });
        } else {
          audioRef.current.pause();
        }
      }
    } else {
      if (nextPlay) {
        startSynthStation(selectedStation.type);
      } else {
        stopSynthStation();
      }
    }
  };

  // Seek bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current && selectedStation.type === 'song') {
      audioRef.current.currentTime = newTime;
    }
  };

  // Skip -10s / +10s
  const skip = (seconds: number) => {
    if (audioRef.current && selectedStation.type === 'song') {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
      soundSynth.playBloom(2);
    }
  };

  // Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : val;
    }
    if (synthNodesRef.current.gain && audioCtxRef.current) {
      synthNodesRef.current.gain.gain.setValueAtTime(isMuted ? 0 : val * 0.45, audioCtxRef.current.currentTime);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.volume = nextMute ? 0 : volume;
    }
    if (synthNodesRef.current.gain && audioCtxRef.current) {
      synthNodesRef.current.gain.gain.setValueAtTime(nextMute ? 0 : volume * 0.45, audioCtxRef.current.currentTime);
    }
  };

  // Copy dedication text
  const handleCopyDedication = () => {
    navigator.clipboard.writeText(
      `"Blessed be the mystery of love..." 📻 Sufjan Stevens - Mystery of Love. Dedicated with endless love to Sreeparna from Ishan ♥`
    );
    setCopiedNote(true);
    soundSynth.playSparkle();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#f472b6', '#38bdf8', '#facc15'],
    });
    setTimeout(() => setCopiedNote(false), 2500);
  };

  // Format time (mm:ss)
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Current active lyric line index
  const activeLyricIndex = useMemo(() => {
    if (selectedStation.type !== 'song') return -1;
    for (let i = LYRICS.length - 1; i >= 0; i--) {
      if (currentTime >= LYRICS[i].time) {
        return i;
      }
    }
    return 0;
  }, [currentTime, selectedStation.type]);

  // Auto-scroll lyrics
  useEffect(() => {
    if (showLyrics && lyricsContainerRef.current && activeLyricIndex >= 0) {
      const activeEl = lyricsContainerRef.current.children[activeLyricIndex] as HTMLElement | undefined;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeLyricIndex, showLyrics]);

  // Color themes config
  const themeStyles = {
    monochrome: {
      text: 'text-white',
      accent: 'text-white',
      badge: 'bg-white text-black',
      border: 'border-[#2a2a2a]',
      panel: 'bg-[#0d0d0d]',
      meterActive: 'text-white',
      glow: '',
    },
    amber: {
      text: 'text-amber-200',
      accent: 'text-amber-400',
      badge: 'bg-amber-400 text-black',
      border: 'border-amber-900/60',
      panel: 'bg-[#181106]',
      meterActive: 'text-amber-400',
      glow: 'shadow-[0_0_30px_rgba(251,191,36,0.15)]',
    },
    emerald: {
      text: 'text-emerald-200',
      accent: 'text-emerald-400',
      badge: 'bg-emerald-400 text-black',
      border: 'border-emerald-900/60',
      panel: 'bg-[#05170f]',
      meterActive: 'text-emerald-400',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    },
    rose: {
      text: 'text-pink-200',
      accent: 'text-pink-400',
      badge: 'bg-pink-400 text-black',
      border: 'border-pink-900/60',
      panel: 'bg-[#170810]',
      meterActive: 'text-pink-400',
      glow: 'shadow-[0_0_30px_rgba(244,114,182,0.15)]',
    },
  }[colorTheme];

  // Visualizer blocks
  const VU_CHARS = [' ', ' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
  const spoolChar = SPOOL_SYMBOLS[tapeFrame];

  return (
    <div className={`space-y-6 ${themeStyles.text} transition-colors duration-300`}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] tracking-widest uppercase text-[#888888] font-mono">
              RETRO SOUND TRANSMISSION
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] text-pink-400 font-mono tracking-wider">
              ✦ SREPARNA'S CASSETTE BOX ✦
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-wide flex items-center gap-2">
            <Radio className="w-5 h-5 text-white" />
            <span>VINTAGE ASCII RADIO BOX</span>
          </h2>
          <p className="text-xs text-[#888888] font-mono mt-0.5">
            Tuned to Sufjan Stevens' “Mystery of Love” — broadcast live for Sreeparna
          </p>
        </div>

        {/* Theme & Display Options */}
        <div className="flex flex-wrap items-center gap-2">
          {/* CRT Scanline Toggle */}
          <button
            onClick={() => setHasScanlines(!hasScanlines)}
            className={`px-2.5 py-1 text-[11px] font-mono rounded border flex items-center gap-1.5 transition-all ${
              hasScanlines
                ? 'bg-white text-black border-white font-bold'
                : 'bg-[#121212] border-[#2a2a2a] text-[#888888] hover:text-white'
            }`}
            title="Toggle CRT Screen Lines"
          >
            <Tv className="w-3 h-3" />
            <span>CRT: {hasScanlines ? 'ON' : 'OFF'}</span>
          </button>

          {/* Color Palettes */}
          <div className="flex items-center bg-[#101010] p-1 rounded border border-[#2a2a2a] gap-1">
            {(['monochrome', 'amber', 'emerald', 'rose'] as RadioColorTheme[]).map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  setColorTheme(theme);
                  soundSynth.playBloom(2);
                }}
                className={`w-5 h-5 rounded-sm text-[9px] font-mono flex items-center justify-center transition-all ${
                  colorTheme === theme ? 'ring-2 ring-white scale-110 font-bold' : 'opacity-60 hover:opacity-100'
                } ${
                  theme === 'monochrome'
                    ? 'bg-zinc-800 text-white'
                    : theme === 'amber'
                    ? 'bg-amber-600 text-black'
                    : theme === 'emerald'
                    ? 'bg-emerald-600 text-black'
                    : 'bg-pink-600 text-white'
                }`}
                title={`Color: ${theme}`}
              >
                {theme[0].toUpperCase()}
              </button>
            ))}
          </div>

          {/* Copy Dedication Button */}
          <button
            onClick={handleCopyDedication}
            className="px-2.5 py-1 text-[11px] font-mono rounded border border-[#2a2a2a] bg-[#141414] hover:bg-[#202020] text-white flex items-center gap-1.5 transition-all"
          >
            {copiedNote ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedNote ? 'COPIED!' : 'SHARE DEDICATION'}</span>
          </button>
        </div>
      </div>

      {/* Main Radio Box Chassis */}
      <div
        className={`relative overflow-hidden rounded-xl border ${themeStyles.border} ${themeStyles.panel} ${themeStyles.glow} p-4 sm:p-6 transition-all duration-300`}
      >
        {/* CRT Scanline Overlay Effect */}
        {hasScanlines && (
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.85) 0px, rgba(0,0,0,0.85) 1px, transparent 1px, transparent 2px)',
            }}
          />
        )}

        {/* Radio Top: Antenna & Branding Plate */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 font-mono text-xs border-b border-[#222222]/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[#666666]">ANTENNA:</span>
            <span className="text-white font-bold animate-pulse">
              {isPlaying ? '▲ ▲ ▲ [SIGNAL LOCKED: 100%]' : '△ [STANDBY]'}
            </span>
            {isPlaying && (
              <span className="text-[11px] tracking-widest text-pink-400 animate-bounce ml-2">
                ((( ♪ ♫ ♬ ♪ )))
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#888888]">
            <span>MODEL: S+I-1989-STEREO</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">SOLID STATE TRANSISTOR</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-white font-semibold">24-BIT HI-FI CASSETTE</span>
          </div>
        </div>

        {/* ASCII MASTER RADIO CHASSIS DISPLAY */}
        <div className="bg-[#050505] border border-[#222222] rounded-lg p-3 sm:p-5 overflow-x-auto select-none shadow-inner">
          <pre
            className="ascii-art text-[10px] sm:text-xs md:text-[13px] leading-tight font-mono text-center tracking-normal whitespace-pre block"
            style={{ textShadow: colorTheme !== 'monochrome' ? '0 0 6px currentColor' : 'none' }}
          >
{`
               ._____________________________________________________________.
              /                                                             / |
             |   .=======================================================.  | |
             |  /                                                       /|  | |
   \\         | |   [●] POWER    [●] STEREO    [●] ON-AIR    [●] DOLBY  | |  | |
    \\        | |=======================================================| |  | |
     \\       | |  DIAL: 88.0 ··· 91.2 ··· 98.5 ··· [104.3] ··· 108 MHz | |  | |
      \\      | |--------|---------|---------|--------▲--------|--------| |  | |
       \\     | '-------------------------------------------------------' |  | |
        \\    |                                                           |  | |
         \\   |   .-----------------------.           .---------------.   |  | |
          \\  |  /  LEFT STEREO SPEAKER  /|          / CASSETTE DECK /|   |  | |
           \\ | |  .-------------------.  | |         |  .-----------.  | |   |  | |
             | |  | / / / / / / / / / |  | |         |  | ( ${spoolChar} )===( ${spoolChar} ) |  | |   |  | |
             | |  | \\ \\ \\ \\ \\ \\ \\ \\ \\ |  | |         |  | SREEPARNA  |  | |   |  | |
             | |  | / / / / / / / / / |  | |         |  | MIXTAPE #1 |  | |   |  | |
             | |  | \\ \\ \\ \\ \\ \\ \\ \\ \\ |  | |         |  | ( ${spoolChar} )===( ${spoolChar} ) |  | |   |  | |
             | |  '-------------------'  | |         |  '-----------'  | |   |  | |
             | '-------------------------' '---------'-----------------' |  | |
             |                                                           |  | |
             |   EQUALIZER SPECTRUM:                                     |  | |
             |   L [ ${vuLevels.slice(0, 8).map((l) => VU_CHARS[l]).join('')} ]          R [ ${vuLevels.slice(8, 16).map((l) => VU_CHARS[l]).join('')} ]             |  | |
             '-----------------------------------------------------------'  |/
              '-------------------------------------------------------------'
`}
          </pre>
        </div>

        {/* Real-time Visualizer Spectrum Bar */}
        <div className="mt-4 p-3 bg-[#0a0a0a] rounded-lg border border-[#222222] font-mono">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#888888] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-white" />
              <span>REAL-TIME 16-BAND FREQUENCY SPECTRUM</span>
            </span>
            <span className="text-[11px] text-[#666666]">
              {isPlaying ? 'STATUS: BROADCASTING' : 'STATUS: IDLE'}
            </span>
          </div>
          <div className="grid grid-cols-16 gap-1 sm:gap-1.5 h-12 items-end bg-[#050505] p-2 rounded border border-[#1a1a1a]">
            {vuLevels.map((lvl, idx) => (
              <div key={idx} className="flex flex-col items-center h-full justify-end">
                <div
                  className={`w-full rounded-xs transition-all duration-75 ${
                    lvl > 0 ? (colorTheme === 'monochrome' ? 'bg-white' : 'bg-current') : 'bg-[#1a1a1a]'
                  }`}
                  style={{
                    height: `${Math.max(8, (lvl / 8) * 100)}%`,
                    opacity: lvl > 0 ? 0.3 + (lvl / 8) * 0.7 : 0.2,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Station Selection Dial Grid */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#888888] uppercase tracking-wider">
              ✦ FREQUENCY TUNER (CLICK TO TUNE)
            </span>
            {isTuning && (
              <span className="text-amber-400 animate-pulse text-[11px]">
                TUNING FREQUENCY... ⚡
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono">
            {STATIONS.map((st) => {
              const isSelected = selectedStation.id === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => handleSelectStation(st)}
                  className={`text-left p-3 rounded-lg border transition-all relative overflow-hidden group ${
                    isSelected
                      ? `${themeStyles.badge} border-white shadow-md font-bold scale-[1.01]`
                      : 'bg-[#0f0f0f] border-[#262626] text-[#888888] hover:text-white hover:border-[#444444]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-wider">{st.freq}</span>
                    {isSelected && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider bg-black text-white">
                        TUNED
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold truncate mt-1">{st.name}</div>
                  <div className="text-[10px] opacity-75 truncate">{st.artist}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Song Info & Interactive Playback Deck */}
        <div className="mt-6 p-4 sm:p-5 bg-[#0a0a0a] rounded-xl border border-[#262626]">
          {/* Track Details Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#222222]">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-lg border border-[#333333] flex items-center justify-center ${
                  isPlaying ? 'bg-white text-black animate-spin' : 'bg-[#141414] text-white'
                }`}
                style={{ animationDuration: '8s' }}
              >
                <Disc className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#888888]">
                    {selectedStation.freq} • {selectedStation.tagline}
                  </span>
                  {selectedStation.type === 'song' && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-pink-400 font-mono">
                      <Heart className="w-3 h-3 fill-pink-400" /> FOR SREEPARNA
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold font-mono text-white flex items-center gap-2">
                  <span>{selectedStation.name}</span>
                </h3>
                <div className="text-xs text-[#888888] font-mono">
                  {selectedStation.artist} — {selectedStation.album}
                </div>
              </div>
            </div>

            {/* Lyrics / Notes Toggle */}
            {selectedStation.type === 'song' && (
              <button
                onClick={() => setShowLyrics(!showLyrics)}
                className={`px-3 py-1.5 text-xs font-mono rounded-md border flex items-center gap-1.5 transition-all self-start sm:self-auto ${
                  showLyrics
                    ? 'bg-white text-black font-semibold border-white'
                    : 'bg-[#141414] border-[#2e2e2e] text-[#888888] hover:text-white'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>{showLyrics ? 'HIDE LYRICS' : 'VIEW LYRICS'}</span>
              </button>
            )}
          </div>

          {/* Time Scrubber (Only for actual song) */}
          {selectedStation.type === 'song' && (
            <div className="pt-4 space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-xs text-[#888888]">
                <span>{formatTime(currentTime)}</span>
                <span className="text-white text-[11px]">
                  {isPlaying ? '● PLAYING' : '❚❚ PAUSED'}
                </span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.5}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 font-mono">
            {/* Playback Buttons */}
            <div className="flex items-center gap-2">
              {selectedStation.type === 'song' && (
                <button
                  onClick={() => skip(-10)}
                  title="Rewind 10 seconds"
                  className="p-2 rounded-md border border-[#2a2a2a] bg-[#121212] hover:bg-[#1f1f1f] text-white transition-all text-xs flex items-center gap-1"
                >
                  <SkipBack className="w-4 h-4" />
                  <span className="text-[10px] hidden sm:inline">-10s</span>
                </button>
              )}

              {/* Master Play/Pause Button */}
              <button
                onClick={togglePlay}
                className={`px-5 py-2.5 rounded-lg border font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
                  isPlaying
                    ? 'bg-white text-black border-white hover:bg-zinc-200'
                    : 'bg-white text-black border-white hover:bg-zinc-200'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                <span>{isPlaying ? 'PAUSE RADIO' : 'PLAY RADIO'}</span>
              </button>

              {selectedStation.type === 'song' && (
                <button
                  onClick={() => skip(10)}
                  title="Fast forward 10 seconds"
                  className="p-2 rounded-md border border-[#2a2a2a] bg-[#121212] hover:bg-[#1f1f1f] text-white transition-all text-xs flex items-center gap-1"
                >
                  <SkipForward className="w-4 h-4" />
                  <span className="text-[10px] hidden sm:inline">+10s</span>
                </button>
              )}

              {selectedStation.type === 'song' && (
                <button
                  onClick={() => {
                    const nextLoop = !isLooping;
                    setIsLooping(nextLoop);
                    if (audioRef.current) audioRef.current.loop = nextLoop;
                    soundSynth.playBloom(1);
                  }}
                  title={isLooping ? 'Loop is ON' : 'Loop is OFF'}
                  className={`p-2 rounded-md border transition-all text-xs flex items-center gap-1 ${
                    isLooping
                      ? 'bg-white text-black font-semibold border-white'
                      : 'bg-[#121212] border-[#2a2a2a] text-[#666666]'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">LOOP</span>
                </button>
              )}
            </div>

            {/* Volume & Sound Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleMute}
                className="text-white hover:text-zinc-300 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 sm:w-28 h-1.5 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-white"
              />
              <span className="text-[11px] text-[#888888] w-9 text-right font-mono">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Synchronized Lyrics Display for "Mystery of Love" */}
        {showLyrics && selectedStation.type === 'song' && (
          <div className="mt-4 p-4 bg-[#080808] border border-[#222222] rounded-xl font-mono">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-[#1c1c1c] mb-3">
              <span className="text-[#888888] flex items-center gap-1.5 uppercase tracking-wider">
                <Music className="w-3.5 h-3.5 text-white" />
                <span>SYNCHRONIZED LYRICS — MYSTERY OF LOVE</span>
              </span>
              <span className="text-[10px] text-[#666666]">
                Click any line to jump to that moment
              </span>
            </div>
            <div
              ref={lyricsContainerRef}
              className="max-h-60 overflow-y-auto space-y-2 pr-2 scrollbar-thin"
            >
              {LYRICS.map((line, idx) => {
                const isActive = activeLyricIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = line.time;
                        setCurrentTime(line.time);
                        if (!isPlaying) togglePlay();
                      }
                    }}
                    className={`p-2 rounded-md transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isActive
                        ? 'bg-white text-black font-bold shadow scale-[1.01]'
                        : 'text-[#777777] hover:text-white hover:bg-[#141414]'
                    }`}
                  >
                    <span>{line.text}</span>
                    <span className="text-[10px] opacity-60 font-mono ml-2 shrink-0">
                      {formatTime(line.time)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Love Dedication Card */}
        <div className="mt-6 p-4 rounded-xl border border-[#222222] bg-[#0c0c0c] font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            </div>
            <div>
              <div className="text-white font-bold">A Song for Sreeparna</div>
              <div className="text-[#888888] text-[11px]">
                “Blessed be the mystery of love” — like an eternal garden in full bloom.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundSynth.playCelebration();
                confetti({
                  particleCount: 100,
                  spread: 80,
                  origin: { y: 0.7 },
                  colors: ['#f472b6', '#ffffff', '#facc15', '#38bdf8'],
                });
              }}
              className="px-3 py-1.5 rounded-md border border-[#2a2a2a] bg-[#161616] hover:bg-white hover:text-black text-white text-xs transition-all flex items-center gap-1.5 font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SEND LOVE ♥</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsciiRadioBox;
