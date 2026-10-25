import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, RotateCcw, Award } from 'lucide-react';
import { PETAL_REASONS } from '../data/loveNotes';
import { soundSynth } from '../utils/audio';

export const DaisyPetalGame: React.FC = () => {
  const [pluckedPetals, setPluckedPetals] = useState<number[]>([]);
  const [currentReason, setCurrentReason] = useState<typeof PETAL_REASONS[0] | null>(null);

  const totalPetals = PETAL_REASONS.length;
  const remainingPetals = totalPetals - pluckedPetals.length;
  const isFinished = remainingPetals === 0;

  const handlePluckPetal = (petalIndex: number) => {
    if (pluckedPetals.includes(petalIndex)) return;

    soundSynth.playPluck(1 + (petalIndex / totalPetals) * 0.5);

    const nextPlucked = [...pluckedPetals, petalIndex];
    setPluckedPetals(nextPlucked);
    setCurrentReason(PETAL_REASONS[petalIndex]);

    if (nextPlucked.length === totalPetals) {
      setTimeout(() => {
        soundSynth.playCelebration();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#facc15', '#f472b6', '#38bdf8', '#c084fc', '#4ade80'],
        });
      }, 300);
    }
  };

  const handleReset = () => {
    soundSynth.playSparkle();
    setPluckedPetals([]);
    setCurrentReason(null);
  };

  // Determine current romantic verdict
  const currentVerdict =
    pluckedPetals.length === 0
      ? 'Click a petal to pluck! 🌼'
      : pluckedPetals.length % 2 === 1
      ? 'He loves me... ♥'
      : 'He loves me MORE! 💖';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center shadow-xl backdrop-blur-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Daisy Oracle</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          "He Loves Me... He Loves Me More!"
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Pluck each daisy petal to reveal 10 heartfelt reasons why Ishan loves Sreeparna!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Side: Interactive ASCII Daisy Flower */}
        <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center relative min-h-[460px]">
          {/* Status Verdict Header */}
          <div className="mb-4 text-center">
            <span
              className={`text-sm sm:text-base font-bold font-mono px-4 py-1.5 rounded-full inline-block transition-all shadow-md ${
                isFinished
                  ? 'bg-gradient-to-r from-pink-500 to-amber-400 text-slate-950 font-extrabold animate-pulse'
                  : pluckedPetals.length % 2 === 1
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {isFinished ? 'Verdict: He Loves Sreeparna INFINITELY! 💖' : currentVerdict}
            </span>
          </div>

          {/* Interactive Petals Array (Circular/Radial Flower Arrangement) */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4">
            {/* Center Golden Core */}
            <div
              className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center text-center transition-all z-20 shadow-2xl ${
                isFinished
                  ? 'bg-amber-400 border-amber-300 text-slate-950 animate-gentle-bounce scale-110'
                  : 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border-yellow-200 text-amber-950 shadow-amber-500/40'
              }`}
            >
              <span className="font-mono text-xs font-bold leading-tight">
                {isFinished ? 'S+I' : 'SREEPARNA'}
              </span>
              <span className="text-[11px] font-mono opacity-80">
                {isFinished ? 'FOREVER' : `${remainingPetals} left`}
              </span>
              <Heart className="w-3.5 h-3.5 fill-current mt-0.5" />
            </div>

            {/* 10 Pluckable Radial Petals */}
            {PETAL_REASONS.map((petal, index) => {
              const angle = (index * 360) / totalPetals;
              const isPlucked = pluckedPetals.includes(index);
              const radius = 100; // px distance from center

              // Calculate polar coordinates
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;

              return (
                <button
                  key={petal.id}
                  onClick={() => handlePluckPetal(index)}
                  disabled={isPlucked}
                  title={isPlucked ? 'Petal already plucked!' : `Pluck petal #${index + 1}`}
                  style={{
                    transform: `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
                  }}
                  className={`absolute w-12 h-20 rounded-full flex flex-col items-center justify-start pt-2 font-mono text-xs font-bold transition-all duration-500 z-10 ${
                    isPlucked
                      ? 'opacity-0 scale-50 pointer-events-none'
                      : 'bg-gradient-to-b from-white via-slate-100 to-slate-200 border-2 border-slate-300 text-slate-800 shadow-lg hover:from-pink-100 hover:border-pink-300 hover:scale-110 cursor-pointer'
                  }`}
                >
                  <span className="text-[11px] text-pink-500 font-bold">{index + 1}</span>
                  <span className="text-[9px] text-slate-400 mt-1">❀</span>
                </button>
              );
            })}
          </div>

          {/* Daisy Stem in ASCII at bottom */}
          <div className="font-mono text-xs text-center text-emerald-400 select-none">
            <div>||</div>
            <div className="text-emerald-500">~-(_ || _)~-</div>
            <div>||</div>
            <div className="text-slate-600">~~~~~~~~~~~~~~~~~~~~</div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="mt-4 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regrow Daisy Petals</span>
          </button>
        </div>

        {/* Right Side: Reason Cards & Heart Reveal */}
        <div className="md:col-span-5 space-y-4">
          {currentReason ? (
            <div className="bg-slate-900/90 border border-pink-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md animate-gentle-bounce">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold font-mono"
                  style={{ backgroundColor: currentReason.color }}
                >
                  #{currentReason.id}
                </span>
                <div>
                  <span className="text-[11px] font-mono text-pink-400 uppercase tracking-wider">
                    Reason I Love You:
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {currentReason.text}
                  </h4>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed font-sans">
                "{currentReason.subtext}"
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Progress: {pluckedPetals.length} / {totalPetals} plucked</span>
                <span className="text-pink-400 flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-pink-500" /> Sreeparna
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
              <div className="text-3xl mb-2 animate-pulse">🌼</div>
              <h4 className="text-sm font-bold text-slate-200 mb-1">
                A Petal Awaits Your Touch
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click any numbered petal on the daisy to reveal a secret love reason written just for you!
              </p>
            </div>
          )}

          {/* List of Revealed Reasons */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Revealed Love Reasons ({pluckedPetals.length})</span>
            </h4>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {PETAL_REASONS.map((petal, idx) => {
                const isRevealed = pluckedPetals.includes(idx);
                return (
                  <div
                    key={petal.id}
                    onClick={() => {
                      if (isRevealed) {
                        setCurrentReason(petal);
                        soundSynth.playSparkle();
                      }
                    }}
                    className={`p-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all ${
                      isRevealed
                        ? 'bg-slate-800/80 border border-slate-700 text-slate-200 cursor-pointer hover:border-pink-500/40'
                        : 'bg-slate-950/40 border border-slate-900 text-slate-600'
                    }`}
                  >
                    <span className="text-pink-400 font-bold shrink-0">#{petal.id}</span>
                    <span className="truncate">
                      {isRevealed ? petal.text : '•••••••••••••••••••••••••••••'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
