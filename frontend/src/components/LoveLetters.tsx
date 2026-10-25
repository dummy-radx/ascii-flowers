import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Mail,
  Heart,
  Sparkles,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import {
  BotanicalCanvasRenderer,
  rasterizeBouquet,
  type AsciiPaletteMode,
  type AsciiGridResult,
} from '../utils/asciiEngine';
import { RealisticAsciiViewer } from './RealisticAsciiViewer';
import { PRESET_LOVE_LETTERS } from '../data/loveNotes';
import { soundSynth } from '../utils/audio';

export const LoveLetters: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState(PRESET_LOVE_LETTERS[0]);
  const [paletteMode, setPaletteMode] = useState<AsciiPaletteMode>('reference');
  const [charDensity, setCharDensity] = useState<'scanline' | 'fine' | 'matrix' | 'dense'>('scanline');
  const [openProgress, setOpenProgress] = useState<number>(1.0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [asciiData, setAsciiData] = useState<AsciiGridResult | null>(null);
  const [affirmation, setAffirmation] = useState('You are capable, radiant, and loved beyond measure. ✨');

  const animationFrameRef = useRef<number | null>(null);
  const renderer = useMemo(() => new BotanicalCanvasRenderer(520, 680), []);

  const gridCols = 155;
  const gridRows = 95;

  const affirmations = [
    'You are capable, radiant, and loved beyond measure. ✨',
    'Your smile is literally the cutest thing in the universe. 🌻',
    'Ishan is so proud of everything you do! 💖',
    'Take a deep breath and relax your shoulders, beautiful girl. 🌸',
    'Today is going to be wonderful because you are in it! 🌼',
    'You make ordinary moments feel like pure poetry. 🪻',
    'You are my favorite miracle in the entire universe. 💫',
  ];

  const currentIdx = PRESET_LOVE_LETTERS.findIndex((l) => l.id === selectedLetter.id);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < PRESET_LOVE_LETTERS.length - 1;

  // Render Love Letter onto Botanical Canvas & rasterize into ASCII matrix
  useEffect(() => {
    renderer.clear();
    const cx = 260;
    const cy = 340;

    renderer.drawLoveLetter(cx, cy, 1.0, openProgress, selectedLetter);

    const result = rasterizeBouquet(
      renderer.getCanvas(),
      {
        width: gridCols,
        height: gridRows,
        paletteMode,
        charDensity,
        glowIntensity: 0.85,
      },
      renderer.getTextOverlays()
    );

    setAsciiData(result);
  }, [selectedLetter, openProgress, paletteMode, charDensity, renderer]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Multi-phase Opening / Resealing Animation
  const toggleAnimation = () => {
    if (isAnimating) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setIsAnimating(false);
      return;
    }

    const isCurrentlyClosed = openProgress < 0.5;
    const targetProgress = isCurrentlyClosed ? 1.0 : 0.0;
    const startProgress = openProgress;
    const duration = 2400; // 2.4s for realistic folding motion
    const startTime = performance.now();

    setIsAnimating(true);

    if (isCurrentlyClosed) {
      soundSynth.playWaxCrack();
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.55 },
        colors: ['#f43f5e', '#fbbf24', '#ffffff', '#fb7185'],
      });
    } else {
      soundSynth.playPaperRustle();
    }

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1.0, elapsed / duration);
      // Smooth cubic ease in/out
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const current = startProgress + (targetProgress - startProgress) * ease;

      setOpenProgress(current);

      // Sound triggers at intermediate milestones
      if (isCurrentlyClosed) {
        if (t >= 0.45 && t <= 0.52) soundSynth.playPaperRustle();
        if (t >= 0.75 && t <= 0.82) soundSynth.playBloom(2);
      } else {
        if (t >= 0.5 && t <= 0.55) soundSynth.playPaperRustle();
      }

      if (t < 1.0) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsAnimating(false);
        setOpenProgress(targetProgress);

        if (isCurrentlyClosed) {
          soundSynth.playCelebration();
          confetti({
            particleCount: 85,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#f472b6', '#fbbf24', '#c084fc', '#38bdf8', '#ffffff'],
          });
        } else {
          soundSynth.playWaxCrack();
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  };

  const handleCopyLetter = () => {
    const textToCopy = `💌 ${selectedLetter.title.toUpperCase()}\n\n${selectedLetter.message}\n\nWith infinite love,\nIshan ♥\n\n${selectedLetter.ps || ''}`;
    navigator.clipboard.writeText(textToCopy);
    soundSynth.playSparkle();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNewAffirmation = () => {
    soundSynth.playBloom(2);
    const next = affirmations[Math.floor(Math.random() * affirmations.length)];
    setAffirmation(next);
  };

  const handlePrevLetter = () => {
    if (hasPrev) {
      soundSynth.playSparkle();
      setSelectedLetter(PRESET_LOVE_LETTERS[currentIdx - 1]);
    }
  };

  const handleNextLetter = () => {
    if (hasNext) {
      soundSynth.playSparkle();
      setSelectedLetter(PRESET_LOVE_LETTERS[currentIdx + 1]);
    }
  };

  return (
    <div className="space-y-6 font-mono pb-12">
      {/* Postal Header */}
      <div className="bg-[#080808] border border-[#222222] rounded-2xl p-5 sm:p-6 text-center shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141414] border border-[#262626] text-white text-xs mb-2">
          <Mail className="w-3.5 h-3.5 text-pink-400" />
          <span>VINTAGE POSTAL MEADOW • REALISTIC ASCII LETTERS</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          LOVE LETTERS & SWEET NOTES FOR SREEPARNA
        </h2>
        <p className="text-xs sm:text-sm text-[#888888] mt-1.5 max-w-lg mx-auto">
          Authentic folded airmail letters with wax seals and glowing ASCII romantic typography.
        </p>
      </div>

      {/* Daily Affirmation Banner */}
      <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="text-2xl">💌</span>
          <div>
            <div className="text-[10px] text-[#888888] uppercase tracking-wider">
              DAILY REMINDER FOR SREEPARNA:
            </div>
            <p className="text-xs sm:text-sm text-white font-medium">
              "{affirmation}"
            </p>
          </div>
        </div>
        <button
          onClick={handleNewAffirmation}
          className="px-3.5 py-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] text-white text-xs shrink-0 border border-[#262626] transition-all flex items-center gap-1.5 shadow"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Another Sweet Note 🌸</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Interactive Folding & Unfolding Physics Controller */}
          <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c1c1c]">
              <span className="text-[11px] tracking-wider uppercase text-white font-bold flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    openProgress >= 0.6 ? 'bg-pink-400' : 'bg-amber-400'
                  } animate-pulse`}
                />
                <span>Envelope & Letter Physics</span>
              </span>
              <span className="text-[10px] text-pink-400 font-bold px-2 py-0.5 rounded-full bg-pink-950/40 border border-pink-900/50">
                {openProgress >= 0.6 ? 'UNFOLDED LETTER (100%)' : 'SEALED ENVELOPE (0%)'}
              </span>
            </div>

            {/* Animation Toggle Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAnimation}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  openProgress >= 0.6
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-[#333333]'
                    : 'bg-white hover:bg-neutral-200 text-black border border-white'
                }`}
              >
                {isAnimating ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>{openProgress < 0.5 ? 'Unfolding...' : 'Resealing...'}</span>
                  </>
                ) : openProgress >= 0.6 ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Fold & Reseal Envelope ✉️</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Break Wax Seal & Unfold 💌</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  soundSynth.playSparkle();
                  setOpenProgress(openProgress >= 0.6 ? 0.0 : 1.0);
                }}
                className="p-2.5 rounded-lg bg-[#141414] hover:bg-[#202020] text-white border border-[#262626] transition-all"
                title={openProgress >= 0.6 ? 'Instant Seal' : 'Instant Unfold'}
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Real-Time Interactive Unfold Slider */}
            <div>
              <div className="flex justify-between text-[10px] text-[#888888] mb-1">
                <span>0% Sealed Wax</span>
                <span>50% Flap Lift</span>
                <span>100% Unfolded Letter</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={1.0}
                step={0.02}
                value={openProgress}
                onChange={(e) => {
                  setOpenProgress(parseFloat(e.target.value));
                }}
                className="w-full accent-white bg-[#222222]"
              />
            </div>
          </div>

          {/* Letter Selection Menu */}
          <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-2">
            <div className="pb-2 mb-2 border-b border-[#1c1c1c] flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#888888] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                <span>Select Love Letter</span>
              </span>
              <span className="text-[10px] text-[#666666]">
                {currentIdx + 1} of {PRESET_LOVE_LETTERS.length}
              </span>
            </div>

            <div className="space-y-1.5">
              {PRESET_LOVE_LETTERS.map((letter) => {
                const isSelected = selectedLetter.id === letter.id;
                return (
                  <button
                    key={letter.id}
                    onClick={() => {
                      setSelectedLetter(letter);
                      soundSynth.playSparkle();
                      // Auto unfold to reveal the letter
                      setOpenProgress(1.0);
                    }}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-white text-black border-white font-bold shadow-md'
                        : 'bg-[#101010] border-[#222222] text-[#888888] hover:border-[#333333] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className={isSelected ? 'text-black/70' : 'text-[#666666]'}>
                        {letter.badge}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-black text-white font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold truncate">
                      {letter.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Letter Prev/Next Controls */}
            <div className="pt-2 border-t border-[#1c1c1c] flex items-center justify-between gap-2">
              <button
                onClick={handlePrevLetter}
                disabled={!hasPrev}
                className={`flex-1 py-1.5 px-2 rounded-lg border text-xs flex items-center justify-center gap-1 transition-all ${
                  hasPrev
                    ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#262626]'
                    : 'bg-[#0a0a0a] border-[#181818] text-[#444444] cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous Letter</span>
              </button>
              <button
                onClick={handleNextLetter}
                disabled={!hasNext}
                className={`flex-1 py-1.5 px-2 rounded-lg border text-xs flex items-center justify-center gap-1 transition-all ${
                  hasNext
                    ? 'bg-[#141414] hover:bg-[#202020] text-white border-[#262626]'
                    : 'bg-[#0a0a0a] border-[#181818] text-[#444444] cursor-not-allowed'
                }`}
              >
                <span>Next Letter</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Copy & Audio Action Card */}
          <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c1c1c]">
              <span className="text-[11px] text-[#888888] uppercase font-bold">
                Letter Actions
              </span>
              <span className="text-[10px] text-amber-400">
                To Sreeparna With Love ♥
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={handleCopyLetter}
                className="p-2.5 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#262626] text-white flex items-center justify-center gap-1.5 transition-all"
                title="Copy full love letter text to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Letter</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  soundSynth.playCelebration();
                  confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.6 },
                    colors: ['#f472b6', '#fbbf24', '#ffffff'],
                  });
                }}
                className="p-2.5 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#262626] text-white flex items-center justify-center gap-1.5 transition-all"
                title="Play celebration audio & confetti"
              >
                <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Play Chime ✨</span>
              </button>
            </div>
          </div>

          {/* Chromatic Display Mode */}
          <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-2 text-xs">
            <span className="text-[11px] text-[#888888] uppercase block pb-1 border-b border-[#1c1c1c]">
              Chromatic Display Mode
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {[
                { id: 'reference', label: 'Reference Vivid' },
                { id: 'emerald', label: 'Emerald Glow' },
                { id: 'amber', label: 'Amber Gold CRT' },
                { id: 'monochrome', label: 'Silver Wireframe' },
                { id: 'amethyst', label: 'Pastel Lavender' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPaletteMode(p.id as AsciiPaletteMode);
                    soundSynth.playSparkle();
                  }}
                  className={`p-2 rounded border text-left transition-all ${
                    paletteMode === p.id
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-[#121212] border-[#222222] text-[#888888] hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Character Density */}
          <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-2 text-xs">
            <span className="text-[11px] text-[#888888] uppercase block pb-1 border-b border-[#1c1c1c]">
              Character Scanline Density
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {[
                { id: 'scanline', label: 'Scanline Ramps (Img 1)' },
                { id: 'matrix', label: 'Matrix Dot Grid' },
                { id: 'dense', label: 'High Density' },
                { id: 'fine', label: 'Micro Typo' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setCharDensity(d.id as 'scanline' | 'fine' | 'matrix' | 'dense');
                    soundSynth.playSparkle();
                  }}
                  className={`p-2 rounded border text-left transition-all ${
                    charDensity === d.id
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-[#121212] border-[#222222] text-[#888888] hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Canvas Column: Realistic Glowing ASCII Viewer (Matching Bouquet Page!) */}
        <div className="lg:col-span-7">
          <RealisticAsciiViewer
            asciiData={asciiData}
            paletteMode={paletteMode}
            title={
              openProgress >= 0.6
                ? `LOVE LETTER: ${selectedLetter.title.toUpperCase()}`
                : 'SEALED AIRMAIL ENVELOPE: FOR SREEPARNA'
            }
            glow={true}
          />
        </div>
      </div>
    </div>
  );
};
