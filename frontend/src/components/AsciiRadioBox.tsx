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
  Tv,
  AlignLeft,
  ListMusic,
} from 'lucide-react';
import { soundSynth } from '../utils/audio';

interface LyricLine {
  time: number; // in seconds
  text: string;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  file: string;
  durationApprox: number;
  asciiLine1: string; // 11 characters
  asciiLine2: string; // 11 characters
  lyrics: LyricLine[];
}

const TRACKS: Track[] = [
  {
    id: 'mystery-of-love',
    title: 'Mystery of Love',
    artist: 'Sufjan Stevens',
    album: 'Call Me By Your Name OST',
    file: '/Sufjan_Stevens_-_Mystery_of_Love_(mp3.pm).mp3',
    durationApprox: 248,
    asciiLine1: 'MYSTERY OF ',
    asciiLine2: 'LOVE-SUFJAN',
    lyrics: [
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
      { time: 135, text: '♪ [Lyrical acoustic guitar interlude] ♪' },
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
    ],
  },
  {
    id: 'nothing',
    title: 'Nothing',
    artist: 'Bruno Major',
    album: 'A Song for Every Moon',
    file: '/Bruno Major - Nothing (Lyrics) [frmal9gVzJw].mp3',
    durationApprox: 163,
    asciiLine1: 'NOTHING    ',
    asciiLine2: 'BRUNO MAJOR',
    lyrics: [
      { time: 0, text: '♪ [Soulful jazz guitar & Rhodes chords] ♪' },
      { time: 7, text: 'Tracksuits and red wine' },
      { time: 13, text: 'Movies for two' },
      { time: 18, text: "We'll take off our phones" },
      { time: 24, text: "And we'll turn off our shoes" },
      { time: 30, text: "We'll play Nintendo" },
      { time: 36, text: 'Though I always lose' },
      { time: 42, text: "'Cause you'll look at me and I'll look back at you" },
      { time: 51, text: 'Dumb conversations' },
      { time: 57, text: 'We lose track of time' },
      { time: 62, text: 'Have I told you lately' },
      { time: 67, text: "I'm grateful you're mine?" },
      { time: 74, text: 'Yeah, we could go nowhere' },
      { time: 80, text: 'And do nothing at all' },
      { time: 85, text: "And it'd still be the best day of all" },
      { time: 92, text: "There's nothing like doing nothing with you" },
      { time: 104, text: '♪ [Warm acoustic interlude] ♪' },
      { time: 112, text: 'Went to the grocery store' },
      { time: 118, text: 'Got something to eat' },
      { time: 124, text: 'Danced round the kitchen to the radio beat' },
      { time: 132, text: 'Yeah, we could go nowhere and do nothing at all' },
      { time: 140, text: "And it'd still be the best day of all" },
      { time: 148, text: "There's nothing, like doing nothing with you ♥" },
    ],
  },
  {
    id: 'those-eyes',
    title: 'Those Eyes',
    artist: 'New West',
    album: 'Based On A True Story',
    file: '/New West - Those Eyes (Lyrics).mp3',
    durationApprox: 220,
    asciiLine1: 'THOSE EYES ',
    asciiLine2: 'NEW WEST   ',
    lyrics: [
      { time: 0, text: '♪ [Gentle acoustic piano & strings intro] ♪' },
      { time: 12, text: "When we're done making love" },
      { time: 19, text: 'And you look up and smile' },
      { time: 25, text: 'Hold me close in your arms' },
      { time: 32, text: 'Let me stay for a while' },
      { time: 38, text: "'Cause all of the small things that you do" },
      { time: 45, text: 'Are what remind me why I fell for you' },
      { time: 51, text: "And when we're apart, and I'm missing you" },
      { time: 57, text: 'I close my eyes and all I see is you' },
      { time: 64, text: 'And the small things you do' },
      { time: 70, text: 'When you call me at night' },
      { time: 77, text: 'Just to hear how I am' },
      { time: 83, text: 'Singing in the morning light' },
      { time: 90, text: 'I can fall for those eyes' },
      { time: 96, text: "'Cause I could fall for those eyes" },
      { time: 104, text: 'Every single time' },
      { time: 115, text: "'Cause all of the small things that you do" },
      { time: 122, text: 'Are what remind me why I fell for you ♥' },
      { time: 135, text: '♪ [Strings swell with devotion & nostalgia] ♪' },
    ],
  },
  {
    id: 'maname',
    title: 'Maname',
    artist: 'Sarah Black & Sathyan Ilanko',
    album: 'Romantic Melody',
    file: '/Maname Lyrical Video Sarah Black Sathyan Ilanko.mp3',
    durationApprox: 146,
    asciiLine1: 'MANAME     ',
    asciiLine2: 'SARAH-SATHY',
    lyrics: [
      { time: 0, text: '♪ [Lyrical acoustic guitar & flute melody] ♪' },
      { time: 10, text: 'En maname... kan vizhithey' },
      { time: 18, text: 'Un ninaivil niram maaruthey' },
      { time: 26, text: 'Un viralgal korthu naan nadaka' },
      { time: 34, text: 'Kaatril kavidhai aaguthey' },
      { time: 42, text: 'Nee pesum ovvoru vaarthaiyum' },
      { time: 50, text: 'En nenjil thaalam aaguthey' },
      { time: 58, text: 'Azhagana nimidangal unnoduthaan' },
      { time: 66, text: 'En idhayam un vasamaagiradhey' },
      { time: 75, text: 'Neethane en vazhkaiyin vellicham' },
      { time: 85, text: 'Endrendrum un anbil naan vaazhven' },
      { time: 95, text: '♪ [Soft ambient instrumental interlude] ♪' },
      { time: 110, text: 'Un kaadhal en uyirai theendiduthey' },
      { time: 122, text: 'En anbe... en maname ♥' },
    ],
  },
];

type RadioColorTheme = 'monochrome' | 'amber' | 'emerald' | 'rose';

export const AsciiRadioBox: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(TRACKS[0].durationApprox);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [colorTheme, setColorTheme] = useState<RadioColorTheme>('monochrome');
  const [hasScanlines, setHasScanlines] = useState<boolean>(false);
  const [showLyrics, setShowLyrics] = useState<boolean>(true);
  const [tapeFrame, setTapeFrame] = useState<number>(0);
  const [vuLevels, setVuLevels] = useState<number[]>([1, 2, 4, 3, 5, 2, 6, 4, 3, 5, 2, 4, 3, 5, 2, 1]);

  const activeTrack = TRACKS[currentTrackIndex];

  // Audio refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const handleNextTrackRef = useRef<() => void>(() => {});
  const isLoopingRef = useRef<boolean>(isLooping);

  useEffect(() => {
    isLoopingRef.current = isLooping;
  }, [isLooping]);

  // Rotating spools symbols
  const SPOOL_SYMBOLS = ['◐', '◓', '◑', '◒'];

  // Initialize single Audio element and listen to its native events
  useEffect(() => {
    const audio = new Audio();
    audio.src = encodeURI(TRACKS[0].file);
    audio.loop = false;
    audio.volume = volume;
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      if (isLoopingRef.current) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        handleNextTrackRef.current();
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('playing', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('playing', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      audio.src = '';
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
            // Already connected
          }
        }
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Tape spool rotation loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setTapeFrame((prev) => (prev + 1) % SPOOL_SYMBOLS.length);
      }, 160);
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

          const bars: number[] = [];
          const step = Math.max(1, Math.floor(bufferLength / 16));
          for (let i = 0; i < 16; i++) {
            const val = dataArray[i * step] || 0;
            const level = Math.min(8, Math.floor((val / 255) * 8.5));
            bars.push(level);
          }
          setVuLevels(bars);
        } else {
          // Dynamic rhythmic equalizer simulation
          const time = Date.now() / 180;
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

  // Change Track (Guaranteed single active song & seamless play/pause toggle)
  const playTrack = (index: number) => {
    const track = TRACKS[index];
    if (!track) return;

    const audio = audioRef.current;
    if (!audio) return;

    // If clicking on the currently active track: toggle play/pause!
    if (index === currentTrackIndex) {
      if (!audio.paused) {
        audio.pause();
        soundSynth.playPluck(1);
      } else {
        initWebAudio();
        audio.play().catch(console.error);
        soundSynth.playSparkle();
      }
      return;
    }

    // Switching to a different track: immediately stop previous song to prevent overlapping
    audio.pause();
    audio.currentTime = 0;

    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setDuration(track.durationApprox);

    audio.src = encodeURI(track.file);
    audio.load();
    initWebAudio();
    audio.play().catch((err) => {
      console.error('Play track failed', err);
      setIsPlaying(false);
    });

    soundSynth.playBloom(2);
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length;
    playTrack(nextIdx);
  };

  const handlePrevTrack = () => {
    const audio = audioRef.current;
    if (currentTime > 3 && audio) {
      audio.currentTime = 0;
      setCurrentTime(0);
      soundSynth.playPluck(1);
      return;
    }
    const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    playTrack(prevIdx);
  };

  useEffect(() => {
    handleNextTrackRef.current = handleNextTrack;
  });

  // Play / Pause toggle
  const togglePlay = () => {
    initWebAudio();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch((err) => {
        console.error('Playback error:', err);
        setIsPlaying(false);
      });
      soundSynth.playSparkle();
    } else {
      audio.pause();
      soundSynth.playPluck(1);
    }
  };

  // Seek bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Skip -10s / +10s
  const skip = (seconds: number) => {
    if (audioRef.current) {
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
  };

  // Mute toggle
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.volume = nextMute ? 0 : volume;
    }
    soundSynth.playBloom(1);
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
    const currentLyrics = activeTrack.lyrics;
    for (let i = currentLyrics.length - 1; i >= 0; i--) {
      if (currentTime >= currentLyrics[i].time) {
        return i;
      }
    }
    return 0;
  }, [currentTime, activeTrack]);

  // Auto-scroll lyrics
  useEffect(() => {
    if (showLyrics && lyricsContainerRef.current && activeLyricIndex >= 0) {
      const activeEl = lyricsContainerRef.current.children[activeLyricIndex] as HTMLElement | undefined;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeLyricIndex, showLyrics]);

  // Color theme styles
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

  const VU_CHARS = [' ', ' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
  const spoolChar = SPOOL_SYMBOLS[tapeFrame];

  const leftVUStr = vuLevels.slice(0, 8).map((l) => VU_CHARS[l]).join('');
  const rightVUStr = vuLevels.slice(8, 16).map((l) => VU_CHARS[l]).join('');

  return (
    <div className={`space-y-6 ${themeStyles.text} transition-colors duration-300 font-mono`}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] tracking-widest uppercase text-[#888888] font-mono">
              RETRO SOUND TRANSMISSION
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] text-pink-400 font-mono tracking-wider">
              ✦ SREEPARNA'S CASSETTE BOX • 4 DEDICATED TRACKS ✦
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-wide flex items-center gap-2">
            <Radio className="w-5 h-5 text-white" />
            <span>VINTAGE ASCII RADIO BOX</span>
          </h2>
          <p className="text-xs text-[#888888] font-mono mt-0.5">
            Broadcasting live: <span className="text-white font-semibold">{activeTrack.title}</span> — {activeTrack.artist}
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
        </div>
      </div>

      {/* Main Radio Box Chassis */}
      <div
        className={`relative overflow-hidden rounded-xl border ${themeStyles.border} ${themeStyles.panel} ${themeStyles.glow} p-4 sm:p-6 transition-all duration-300`}
      >
        {/* CRT Scanline Overlay */}
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
              {isPlaying ? '▲ ▲ ▲ [BROADCAST LOCKED: 104.3 MHz]' : '△ [STANDBY]'}
            </span>
            {isPlaying && (
              <span className="text-[11px] tracking-widest text-pink-400 animate-bounce ml-2">
                ((( ♪ ♫ {activeTrack.title} ♫ ♪ )))
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#888888]">
            <span>MODEL: S+I-1989-STEREO</span>
            <span className="hidden sm:inline">|</span>
            <span>TRACK {currentTrackIndex + 1} OF {TRACKS.length}</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-white font-semibold">24-BIT HI-FI CASSETTE</span>
          </div>
        </div>

        {/* THE BELOVED CLASSIC ISOMETRIC ASCII BOOMBOX ART */}
        <div className="bg-[#050505] border border-[#222222] rounded-lg p-3 sm:p-5 overflow-x-auto select-none shadow-inner flex justify-center">
          <pre
            className="ascii-art text-[10px] sm:text-xs md:text-[13px] leading-tight font-mono tracking-normal whitespace-pre text-left inline-block"
            style={{ textShadow: colorTheme !== 'monochrome' ? '0 0 6px currentColor' : 'none' }}
          >
{`               ._____________________________________________________________.
              /                                                             / |
             |   .=======================================================.  | |
             |  /                                                       /|  | |
   \\         | |   [●] POWER    [●] STEREO    [●] ON-AIR    [●] DOLBY  | |  | |
    \\        | |=======================================================| |  | |
     \\       | |  DIAL: 88.0 ··· 92.0 ··· 98.0 ··· [104.3] ··· 108 MHz  | |  | |
      \\      | |--------|---------|---------|--------▲--------|--------| |  | |
       \\     | '-------------------------------------------------------' |  | |
        \\    |                                                           |  | |
         \\   |   .-----------------------.           .---------------.   |  | |
          \\  |  /  LEFT STEREO SPEAKER  /|          / CASSETTE DECK /|   |  | |
           \\ | |  .-------------------.  | |         |  .-----------.  | |   |  | |
             | |  | / / / / / / / / / |  | |         |  | ( ${spoolChar} )===( ${spoolChar} ) |  | |   |  | |
             | |  | \\ \\ \\ \\ \\ \\ \\ \\ \\ |  | |         |  | SREEPARNA  |  | |   |  | |
             | |  | / / / / / / / / / |  | |         |  | ${activeTrack.asciiLine1} |  | |   |  | |
             | |  | \\ \\ \\ \\ \\ \\ \\ \\ \\ |  | |         |  | ${activeTrack.asciiLine2} |  | |   |  | |
             | |  | / / / / / / / / / |  | |         |  | ( ${spoolChar} )===( ${spoolChar} ) |  | |   |  | |
             | |  '-------------------'  | |         |  '-----------'  | |   |  | |
             | '-------------------------' '---------'-----------------' |  | |
             |                                                           |  | |
             |   EQUALIZER SPECTRUM:                                     |  | |
             |   L [ ${leftVUStr} ]                        R [ ${rightVUStr} ]      |  | |
             '-----------------------------------------------------------'  |/
              '-------------------------------------------------------------' `}
          </pre>
        </div>

        {/* Real-time 16-Band Visualizer Spectrum Bar */}
        <div className="mt-4 p-3 bg-[#0a0a0a] rounded-lg border border-[#222222] font-mono">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#888888] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-white" />
              <span>REAL-TIME 16-BAND FREQUENCY SPECTRUM</span>
            </span>
            <span className="text-[11px] text-[#666666]">
              {isPlaying ? `PLAYING: ${activeTrack.title}` : 'STATUS: IDLE'}
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

        {/* Track Details & Playback Deck */}
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
                    TRACK {currentTrackIndex + 1} OF {TRACKS.length} • {activeTrack.album}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-pink-400 font-mono">
                    <Heart className="w-3 h-3 fill-pink-400" /> FOR SREEPARNA
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-mono text-white flex items-center gap-2">
                  <span>{activeTrack.title}</span>
                </h3>
                <div className="text-xs text-[#888888] font-mono">
                  {activeTrack.artist}
                </div>
              </div>
            </div>

            {/* Lyrics Toggle */}
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
          </div>

          {/* Time Scrubber */}
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

          {/* Controls Bar: Prev, Rewind, Play, Forward, Next, Loop, Volume */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 font-mono">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Prev Track in Queue */}
              <button
                onClick={handlePrevTrack}
                title="Previous Song in Queue"
                className="p-2 rounded-md border border-[#2a2a2a] bg-[#121212] hover:bg-[#1f1f1f] text-white transition-all text-xs flex items-center gap-1"
              >
                <span className="text-xs font-bold">|◀◀</span>
                <span className="text-[10px] hidden md:inline">PREV</span>
              </button>

              <button
                onClick={() => skip(-10)}
                title="Rewind 10 seconds"
                className="p-2 rounded-md border border-[#2a2a2a] bg-[#121212] hover:bg-[#1f1f1f] text-white transition-all text-xs flex items-center gap-1"
              >
                <SkipBack className="w-4 h-4" />
                <span className="text-[10px] hidden sm:inline">-10s</span>
              </button>

              {/* Master Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="px-5 py-2.5 rounded-lg border font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md bg-white text-black border-white hover:bg-zinc-200"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={() => skip(10)}
                title="Fast forward 10 seconds"
                className="p-2 rounded-md border border-[#2a2a2a] bg-[#121212] hover:bg-[#1f1f1f] text-white transition-all text-xs flex items-center gap-1"
              >
                <SkipForward className="w-4 h-4" />
                <span className="text-[10px] hidden sm:inline">+10s</span>
              </button>

              {/* Next Track in Queue */}
              <button
                onClick={handleNextTrack}
                title="Next Song in Queue"
                className="p-2 rounded-md border border-[#2a2a2a] bg-[#121212] hover:bg-[#1f1f1f] text-white transition-all text-xs flex items-center gap-1"
              >
                <span className="text-[10px] hidden md:inline">NEXT</span>
                <span className="text-xs font-bold">▶▶|</span>
              </button>

              {/* Loop / Repeat Button */}
              <button
                onClick={() => {
                  const nextLoop = !isLooping;
                  setIsLooping(nextLoop);
                  if (audioRef.current) audioRef.current.loop = nextLoop;
                  soundSynth.playBloom(1);
                }}
                title={isLooping ? 'Repeat current song ON' : 'Auto-advance to next song in queue'}
                className={`p-2 rounded-md border transition-all text-xs flex items-center gap-1 ${
                  isLooping
                    ? 'bg-white text-black font-semibold border-white'
                    : 'bg-[#121212] border-[#2a2a2a] text-[#666666]'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">{isLooping ? 'REPEAT 1' : 'AUTO-QUEUE'}</span>
              </button>
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

        {/* SONG QUEUE / CASSETTE PLAYLIST (CLICK TO PLAY ANY TRACK) */}
        <div className="mt-4 p-4 bg-[#0a0a0a] rounded-xl border border-[#222222] font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f1f1f] mb-3">
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white tracking-wider">
                RADIO CASSETTE QUEUE ({TRACKS.length} SONGS)
              </span>
            </div>
            <span className="text-[10px] text-[#777777]">
              Click any song below to play immediately
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {TRACKS.map((track, idx) => {
              const isCurrent = currentTrackIndex === idx;
              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(idx)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-3 group ${
                    isCurrent
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-[#101010] border-[#222222] text-[#888888] hover:text-white hover:border-[#444444] hover:bg-[#161616]'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Track Number / Play Badge */}
                    <div
                      className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCurrent
                          ? 'bg-black text-white'
                          : 'bg-[#181818] text-[#888888] group-hover:text-white'
                      }`}
                    >
                      {isCurrent ? (
                        isPlaying ? '❚❚' : '▶'
                      ) : (
                        `0${idx + 1}`
                      )}
                    </div>

                    <div className="truncate">
                      <div className="text-xs font-bold truncate flex items-center gap-1.5">
                        <span className={isCurrent ? 'text-black' : 'text-white'}>
                          {track.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] px-1 rounded bg-black text-white font-mono">
                            {isPlaying ? 'PLAYING' : 'PAUSED'}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] opacity-75 truncate">
                        {track.artist} • {track.album}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 font-mono">
                    <span className="text-[11px] opacity-70 hidden sm:inline">
                      {formatTime(track.durationApprox)}
                    </span>
                    {isCurrent ? (
                      isPlaying ? (
                        <span className="text-[10px] px-2 py-1 rounded font-bold bg-black text-emerald-400 border border-emerald-500/50 flex items-center gap-1 shadow-sm">
                          ❚❚ PAUSE
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-1 rounded font-bold bg-black text-amber-300 border border-amber-400/50 flex items-center gap-1 shadow-sm">
                          ▶ RESUME
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] px-2 py-1 rounded text-[#888888] bg-[#1a1a1a] border border-[#2a2a2a] group-hover:text-white group-hover:bg-[#282828] group-hover:border-[#444444] transition-all flex items-center gap-1">
                        ▶ PLAY
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Synchronized Lyrics Display for Currently Active Track */}
        {showLyrics && (
          <div className="mt-4 p-4 bg-[#080808] border border-[#222222] rounded-xl font-mono">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-[#1c1c1c] mb-3">
              <span className="text-[#888888] flex items-center gap-1.5 uppercase tracking-wider">
                <Music className="w-3.5 h-3.5 text-white" />
                <span>SYNCHRONIZED LYRICS — {activeTrack.title}</span>
              </span>
              <span className="text-[10px] text-[#666666]">
                Click any line to jump to that moment
              </span>
            </div>
            <div
              ref={lyricsContainerRef}
              className="max-h-60 overflow-y-auto space-y-2 pr-2 scrollbar-thin"
            >
              {activeTrack.lyrics.map((line, idx) => {
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
                “Blessed be the mystery of love” — sweet melodies dedicated with everlasting warmth.
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
