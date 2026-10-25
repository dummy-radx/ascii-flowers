import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, RotateCcw, X, ChevronLeft, ChevronRight, Award, Copy, Check } from 'lucide-react';
import { PETAL_REASONS } from '../data/loveNotes';
import { soundSynth } from '../utils/audio';

export const DaisyPetalGame: React.FC = () => {
  const [pluckedPetals, setPluckedPetals] = useState<number[]>([]);
  const [activePopupIndex, setActivePopupIndex] = useState<number | null>(null);
  const [copiedReason, setCopiedReason] = useState<boolean>(false);

  const totalPetals = PETAL_REASONS.length;
  const remainingPetals = totalPetals - pluckedPetals.length;
  const isFinished = remainingPetals === 0;

  // Handle keyboard navigation for modal (Escape to close, arrows to browse)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePopupIndex === null) return;

      if (e.key === 'Escape') {
        setActivePopupIndex(null);
      } else if (e.key === 'ArrowLeft') {
        const currentIdxInPlucked = pluckedPetals.indexOf(activePopupIndex);
        if (currentIdxInPlucked > 0) {
          setActivePopupIndex(pluckedPetals[currentIdxInPlucked - 1]);
          soundSynth.playSparkle();
        }
      } else if (e.key === 'ArrowRight') {
        const currentIdxInPlucked = pluckedPetals.indexOf(activePopupIndex);
        if (currentIdxInPlucked >= 0 && currentIdxInPlucked < pluckedPetals.length - 1) {
          setActivePopupIndex(pluckedPetals[currentIdxInPlucked + 1]);
          soundSynth.playSparkle();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePopupIndex, pluckedPetals]);

  const triggerCelebration = () => {
    soundSynth.playCelebration();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#facc15', '#f472b6', '#38bdf8', '#c084fc', '#4ade80', '#ffffff'],
    });
  };

  const handlePluckPetal = (petalIndex: number) => {
    if (pluckedPetals.includes(petalIndex)) {
      // Already plucked - show reason popup again
      setActivePopupIndex(petalIndex);
      soundSynth.playSparkle();
      return;
    }

    soundSynth.playPluck(1 + (petalIndex / totalPetals) * 0.5);

    const nextPlucked = [...pluckedPetals, petalIndex];
    setPluckedPetals(nextPlucked);
    setActivePopupIndex(petalIndex);

    if (nextPlucked.length === totalPetals) {
      setTimeout(() => {
        triggerCelebration();
      }, 350);
    }
  };

  const handleReset = () => {
    soundSynth.playSparkle();
    setPluckedPetals([]);
    setActivePopupIndex(null);
  };

  // Determine current romantic verdict using first-person "I"
  const currentVerdict =
    pluckedPetals.length === 0
      ? 'Click a petal to pluck! 🌼'
      : pluckedPetals.length % 2 === 1
      ? 'I love you... ♥'
      : 'I love you MORE! 💖';

  // Modal navigation helpers
  const currentReason = activePopupIndex !== null ? PETAL_REASONS[activePopupIndex] : null;
  const currentReasonPluckOrder = activePopupIndex !== null ? pluckedPetals.indexOf(activePopupIndex) + 1 : 0;
  const currentIdxInPlucked = activePopupIndex !== null ? pluckedPetals.indexOf(activePopupIndex) : -1;
  const hasPrev = currentIdxInPlucked > 0;
  const hasNext = currentIdxInPlucked >= 0 && currentIdxInPlucked < pluckedPetals.length - 1;

  const handlePrevReason = () => {
    if (hasPrev) {
      setActivePopupIndex(pluckedPetals[currentIdxInPlucked - 1]);
      soundSynth.playSparkle();
    }
  };

  const handleNextReason = () => {
    if (hasNext) {
      setActivePopupIndex(pluckedPetals[currentIdxInPlucked + 1]);
      soundSynth.playSparkle();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-mono pb-8">
      {/* Main Daisy Oracle Showcase Card */}
      <div className="bg-[#080808] border border-[#222222] rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center relative min-h-[480px]">
        {/* Status Verdict Header */}
        <div className="mb-4 text-center">
          <span
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-full inline-flex items-center gap-2 transition-all border shadow-lg ${
              isFinished
                ? 'bg-white text-black border-white font-extrabold animate-pulse'
                : 'bg-[#141414] text-white border-[#262626]'
            }`}
          >
            {isFinished ? 'VERDICT: I LOVE YOU INFINITELY ♥' : currentVerdict}
          </span>
        </div>

        {/* Interactive Radial Daisy Flower */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-4">
          {/* Center Golden Core */}
          <div
            className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center text-center transition-all z-20 shadow-2xl select-none ${
              isFinished
                ? 'bg-amber-400 border-amber-300 text-slate-950 scale-105 shadow-amber-400/50'
                : 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border-yellow-200 text-amber-950 shadow-amber-500/40'
            }`}
          >
            <span className="font-mono text-xs font-bold leading-tight">
              {isFinished ? 'S + I' : 'SREEPARNA'}
            </span>
            <span className="text-[11px] font-mono opacity-85 mt-0.5">
              {isFinished ? 'FOREVER' : `${remainingPetals} left`}
            </span>
            <Heart className="w-3.5 h-3.5 fill-current mt-0.5" />
          </div>

          {/* 10 Pluckable Radial Petals */}
          {PETAL_REASONS.map((petal, index) => {
            const angle = (index * 360) / totalPetals;
            const isPlucked = pluckedPetals.includes(index);
            const radius = 105; // px distance from center

            // Calculate polar coordinates
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;

            return (
              <button
                key={petal.id}
                onClick={() => handlePluckPetal(index)}
                title={isPlucked ? `Petal #${index + 1} revealed! Click to view message.` : `Pluck petal #${index + 1}`}
                style={{
                  transform: `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
                }}
                className={`absolute w-12 sm:w-14 h-20 sm:h-22 rounded-full flex flex-col items-center justify-start pt-2 font-mono text-xs font-bold transition-all duration-500 z-10 cursor-pointer ${
                  isPlucked
                    ? 'opacity-0 scale-50 pointer-events-none'
                    : 'bg-gradient-to-b from-white via-slate-100 to-slate-200 border-2 border-slate-300 text-slate-800 shadow-md hover:from-pink-100 hover:border-pink-300 hover:scale-110 active:scale-95'
                }`}
              >
                <span className="text-[11px] text-pink-500 font-bold">{index + 1}</span>
                <span className="text-[10px] text-slate-400 mt-1">❀</span>
              </button>
            );
          })}
        </div>

        {/* Daisy Stem in ASCII */}
        <div className="font-mono text-sm sm:text-base leading-snug text-center text-emerald-400 select-none my-2">
          <div>||</div>
          <div className="text-emerald-500 font-bold">~-(_ || _)~-</div>
          <div>||</div>
          <div className="text-slate-600">~~~~~~~~~~~~~~~~~~~~</div>
        </div>

        {/* Revealed Petals Tray (Quick Navigation & Overview) */}
        <div className="w-full mt-6 pt-5 border-t border-[#1a1a1a] flex flex-col items-center gap-3">
          <div className="flex items-center justify-between w-full text-xs text-[#888888] px-2">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-white">
              <Award className="w-3.5 h-3.5" />
              <span>Revealed Petals ({pluckedPetals.length} / {totalPetals})</span>
            </span>
            <span className="text-[11px] text-[#666666]">
              {pluckedPetals.length > 0 ? 'Click any petal to view popup' : 'Pluck petals above to reveal'}
            </span>
          </div>

          {/* 10 Petal Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full">
            {PETAL_REASONS.map((petal, index) => {
              const isPlucked = pluckedPetals.includes(index);
              return (
                <button
                  key={petal.id}
                  onClick={() => handlePluckPetal(index)}
                  title={
                    isPlucked
                      ? `View Reason #${index + 1}: ${petal.text}`
                      : `Pluck Petal #${index + 1}`
                  }
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border ${
                    isPlucked
                      ? 'bg-[#141414] border-[#333333] text-white hover:border-white hover:bg-[#1f1f1f] shadow-sm'
                      : 'bg-[#090909] border-[#1c1c1c] text-[#555555] hover:text-[#888888] hover:border-[#2a2a2a]'
                  }`}
                >
                  <span className={isPlucked ? 'text-pink-400' : 'text-[#444444]'}>
                    {isPlucked ? '❀' : '○'}
                  </span>
                  <span className="font-bold">#{index + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] text-white text-xs font-mono flex items-center gap-1.5 border border-[#262626] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regrow Daisy Petals</span>
            </button>

            {isFinished && (
              <button
                onClick={triggerCelebration}
                className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-mono font-bold flex items-center gap-1.5 border border-white transition-all shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Replay Celebration 🎉</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* POPUP MODAL DIALOG */}
      {currentReason && activePopupIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-backdrop-fade"
          onClick={() => setActivePopupIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#0d0d0d] border border-[#2e2e2e] rounded-2xl p-6 sm:p-7 shadow-[0_15px_60px_rgba(0,0,0,0.95)] max-w-lg w-full relative font-mono text-left animate-modal-pop"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setActivePopupIndex(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#181818] hover:bg-[#262626] border border-[#2e2e2e] text-[#a0a0a0] hover:text-white flex items-center justify-center transition-all"
              title="Close (Esc)"
              aria-label="Close message"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Badge & Verdict */}
            <div className="flex flex-wrap items-center gap-2 mb-4 pr-10">
              <span className="w-7 h-7 rounded bg-white text-black flex items-center justify-center text-xs font-bold font-mono">
                #{currentReason.id}
              </span>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#181818] border border-[#2e2e2e] text-white flex items-center gap-1.5">
                <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
                <span>
                  {currentReasonPluckOrder % 2 === 1 ? 'I love you... ♥' : 'I love you MORE! 💖'}
                </span>
              </span>
            </div>

            {/* Sub-label */}
            <div className="text-[10px] font-mono text-[#888888] uppercase tracking-wider mb-1">
              REASON WHY I LOVE YOU:
            </div>

            {/* Main Reason Text */}
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug mb-3">
              {currentReason.text}
            </h3>

            {/* Subtext Quote Container */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 text-xs sm:text-sm text-[#e0e0e0] leading-relaxed italic relative">
              <span className="text-xl leading-none text-[#555555] font-serif mr-1">“</span>
              {currentReason.subtext}
              <span className="text-xl leading-none text-[#555555] font-serif ml-1">”</span>
            </div>

            {/* ASCII Reason Card (Matching Gift & Flower Text ASCIIs) */}
            {currentReason.asciiArt && (
              <div className="bg-[#050505] border border-[#222222] rounded-xl p-3 sm:p-4 my-3 overflow-x-auto shadow-inner relative group">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1a1a1a] text-[10px] text-[#777777]">
                  <span className="uppercase font-bold tracking-wider text-pink-400">
                    ASCII Oracle Card
                  </span>
                  <button
                    onClick={() => {
                      if (currentReason.asciiArt) {
                        navigator.clipboard.writeText(currentReason.asciiArt);
                        soundSynth.playSparkle();
                        setCopiedReason(true);
                        setTimeout(() => setCopiedReason(false), 2000);
                      }
                    }}
                    className="px-2 py-0.5 rounded bg-[#141414] hover:bg-[#202020] border border-[#2a2a2a] text-white flex items-center gap-1 transition-all"
                    title="Copy ASCII card"
                  >
                    {copiedReason ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy ASCII</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[11.5px] sm:text-[12.5px] leading-[15px] sm:leading-[16.5px] font-mono text-amber-200 select-all whitespace-pre tracking-tight">
                  {currentReason.asciiArt}
                </pre>
              </div>
            )}

            {/* Modal Navigation & Actions Footer */}
            <div className="mt-5 pt-4 border-t border-[#222222] flex flex-wrap items-center justify-between gap-3">
              {/* Previous / Next Browsing Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevReason}
                  disabled={!hasPrev}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                    hasPrev
                      ? 'bg-[#181818] border-[#2e2e2e] text-white hover:bg-[#242424] hover:border-white'
                      : 'bg-[#101010] border-[#1c1c1c] text-[#444444] cursor-not-allowed'
                  }`}
                  title="Previous revealed reason (Left Arrow)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextReason}
                  disabled={!hasNext}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                    hasNext
                      ? 'bg-[#181818] border-[#2e2e2e] text-white hover:bg-[#242424] hover:border-white'
                      : 'bg-[#101010] border-[#1c1c1c] text-[#444444] cursor-not-allowed'
                  }`}
                  title="Next revealed reason (Right Arrow)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-[#777777] ml-1 font-mono">
                  {currentIdxInPlucked + 1} of {pluckedPetals.length} revealed
                </span>
              </div>

              {/* Primary Dismiss / Action Button */}
              <button
                onClick={() => setActivePopupIndex(null)}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow"
              >
                <span>{remainingPetals > 0 ? 'Pluck Another Petal 🌼' : 'Forever & Always ♥'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
