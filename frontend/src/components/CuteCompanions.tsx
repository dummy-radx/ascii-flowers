import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, MessageCircle, Volume2 } from 'lucide-react';
import { CUTE_CREATURES, type CuteCreature } from '../data/animals';
import { AsciiRenderer } from './AsciiRenderer';
import { soundSynth } from '../utils/audio';

export const CuteCompanions: React.FC = () => {
  const [selectedCreature, setSelectedCreature] = useState<CuteCreature>(CUTE_CREATURES[0]);
  const [isHappy, setIsHappy] = useState<boolean>(false);
  const [dialogueIndex, setDialogueIndex] = useState<number>(0);
  const [loveHearts, setLoveHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const handlePet = () => {
    // Play appropriate sound
    if (selectedCreature.soundType === 'purr') {
      soundSynth.playPurr();
    } else if (selectedCreature.soundType === 'sparkle') {
      soundSynth.playSparkle();
    } else if (selectedCreature.soundType === 'celebration') {
      soundSynth.playCelebration();
    } else {
      soundSynth.playBloom(4);
    }

    setIsHappy(true);
    setDialogueIndex((prev) => (prev + 1) % selectedCreature.dialogues.length);

    // Spawn heart particles
    const newHearts = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40,
      y: 20 + Math.random() * 40,
    }));
    setLoveHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setLoveHearts((prev) => prev.filter((h) => !newHearts.includes(h)));
    }, 1500);

    setTimeout(() => {
      setIsHappy(false);
    }, 2800);
  };

  const handleGiveTreat = () => {
    soundSynth.playCelebration();
    setIsHappy(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fbbf24', '#c084fc'],
    });
    setTimeout(() => setIsHappy(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center shadow-xl backdrop-blur-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive ASCII Companions</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Sreeparna's Cute Petting Zoo
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Tap to pet your ASCII companions, hear them purr, and receive cute messages!
        </p>
      </div>

      {/* Creature Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CUTE_CREATURES.map((creature) => {
          const isSelected = selectedCreature.id === creature.id;
          return (
            <button
              key={creature.id}
              onClick={() => {
                setSelectedCreature(creature);
                setIsHappy(false);
                setDialogueIndex(0);
                soundSynth.playSparkle();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 border transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30 font-semibold scale-105'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="text-base">{creature.avatar}</span>
              <span>{creature.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Floating Heart Particles */}
        {loveHearts.map((h) => (
          <div
            key={h.id}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            className="absolute pointer-events-none text-pink-400 text-lg animate-ping font-mono"
          >
            ♥
          </div>
        ))}

        {/* Creature Header info */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedCreature.avatar}</span>
              <h3 className="text-base font-bold text-white font-mono">
                {selectedCreature.name}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedCreature.title}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                isHappy
                  ? 'bg-pink-500/20 border-pink-500/40 text-pink-300 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {isHappy ? '♥ Super Happy! ♥' : 'Waiting for pets...'}
            </span>
          </div>
        </div>

        {/* ASCII Stage Frame */}
        <div className="bg-[#0b0d15] border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center min-h-[220px] shadow-inner relative">
          <AsciiRenderer
            lines={isHappy ? selectedCreature.frames.happy : selectedCreature.frames.idle}
            animate={isHappy ? 'bounce' : 'sway'}
            fontSize="base"
            className="text-center"
          />
        </div>

        {/* Speech Bubble from Creature */}
        <div className="mt-5 bg-purple-950/40 border border-purple-500/30 rounded-2xl p-4 relative shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-purple-300 uppercase tracking-wider mb-1">
                {selectedCreature.name} says:
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                "{selectedCreature.dialogues[dialogueIndex]}"
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={handlePet}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-pink-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Pet {selectedCreature.name.split(' ')[0]}!</span>
          </button>

          <button
            onClick={handleGiveTreat}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs flex items-center gap-2 transition-all"
          >
            <span>🌻 Give Flower Treat</span>
          </button>

          <button
            onClick={() => {
              if (selectedCreature.soundType === 'purr') soundSynth.playPurr();
              else soundSynth.playBloom(3);
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-all"
            title="Hear animal sound"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
