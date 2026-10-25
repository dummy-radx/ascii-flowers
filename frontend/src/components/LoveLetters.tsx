import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Heart, Sparkles } from 'lucide-react';
import { PRESET_LOVE_LETTERS } from '../data/loveNotes';
import { soundSynth } from '../utils/audio';

const ASCII_ENVELOPE_CLOSED = [
  '<kraft>   .-------------------------------------------.   </kraft>',
  '<kraft>   | \\                                       / |   </kraft>',
  '<kraft>   |   \\                 <heart>♥</heart>                 /   |   </kraft>',
  '<kraft>   |     \\           <heart>[ ♥ S+I ]</heart>         /     |   </kraft>',
  '<kraft>   |       \\                         /       |   </kraft>',
  '<kraft>   |         \\_____________________/         |   </kraft>',
  '<kraft>   |                                           |   </kraft>',
  '<kraft>   |    FOR: Sreeparna                         |   </kraft>',
  '<kraft>   |    FROM: Ishan (With endless flowers)     |   </kraft>',
  '\'-------------------------------------------\'',
];

export const LoveLetters: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState(PRESET_LOVE_LETTERS[0]);
  const [isOpen, setIsOpen] = useState(true);
  const [affirmation, setAffirmation] = useState('You are capable, radiant, and loved beyond measure. ✨');

  const affirmations = [
    'You are capable, radiant, and loved beyond measure. ✨',
    'Your smile is literally the cutest thing in the universe. 🌻',
    'Ishan is so proud of everything you do! 💖',
    'Take a deep breath and relax your shoulders, beautiful girl. 🌸',
    'Today is going to be wonderful because you are in it! 🌼',
    'You make ordinary moments feel like pure poetry. 🪻',
  ];

  const handleOpenEnvelope = () => {
    soundSynth.playSparkle();
    setIsOpen(!isOpen);
    if (!isOpen) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fbbf24', '#c084fc'],
      });
    }
  };

  const handleNewAffirmation = () => {
    soundSynth.playBloom(2);
    const next = affirmations[Math.floor(Math.random() * affirmations.length)];
    setAffirmation(next);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-mono">
      {/* Header */}
      <div className="bg-[#080808] border border-[#222222] rounded-xl p-5 text-center shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#262626] text-white text-xs mb-2">
          <Mail className="w-3.5 h-3.5 text-white" />
          <span>POSTAL GARDEN OF LOVE</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
          LETTERS & SWEET NOTES FOR SREEPARNA
        </h2>
        <p className="text-xs text-[#888888] mt-1 max-w-md mx-auto">
          Folded letters, daily affirmations, and secret messages sealed with an ASCII wax stamp.
        </p>
      </div>

      {/* Daily Affirmation Pill */}
      <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="text-xl">✨</span>
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
          className="px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] text-white text-xs shrink-0 border border-[#262626] transition-all"
        >
          Another Reminder 🌸
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Letter Selector */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#888888] flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-white text-white" />
            <span>Select Letter</span>
          </h3>

          <div className="space-y-2">
            {PRESET_LOVE_LETTERS.map((letter) => {
              const isSelected = selectedLetter.id === letter.id;
              return (
                <button
                  key={letter.id}
                  onClick={() => {
                    setSelectedLetter(letter);
                    soundSynth.playSparkle();
                  }}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-[#101010] border-[#222222] text-[#888888] hover:border-[#333333] hover:text-white'
                  }`}
                >
                  <div className={`text-[10px] mb-0.5 ${isSelected ? 'text-black/70' : 'text-[#666666]'}`}>
                    {letter.badge}
                  </div>
                  <div className="text-xs font-bold truncate">
                    {letter.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Interactive ASCII Envelope / Unfolded Letter */}
        <div className="md:col-span-8">
          <div className="bg-[#080808] border border-[#222222] rounded-xl p-5 sm:p-6 shadow-2xl relative space-y-4">
            {/* ASCII Envelope Header / Seal */}
            <div
              onClick={handleOpenEnvelope}
              className="cursor-pointer group bg-[#000000] border border-[#222222] hover:border-white rounded-lg p-4 flex flex-col items-center justify-center transition-all overflow-x-auto"
              title="Click to toggle envelope"
            >
              <pre className="font-mono text-[11px] leading-[13px] text-white/90 select-none">
                {ASCII_ENVELOPE_CLOSED.map((l, i) => (
                  <div
                    key={i}
                    dangerouslySetInnerHTML={{
                      __html: l
                        .replace(/<kraft>/g, '<span style="color:#d4d4d4">')
                        .replace(/<\/kraft>/g, '</span>')
                        .replace(/<heart>/g, '<span style="color:#ffffff; font-weight:bold;">')
                        .replace(/<\/heart>/g, '</span>'),
                    }}
                  />
                ))}
              </pre>
              <span className="text-[11px] font-mono text-[#888888] group-hover:text-white mt-2 flex items-center gap-1 transition-all">
                <Sparkles className="w-3 h-3 text-white" />
                <span>{isOpen ? '[ Tap to fold letter ]' : '[ Tap wax seal to open letter ]'}</span>
              </span>
            </div>

            {/* Unfolded Letter Content */}
            {isOpen && (
              <div className="bg-[#0c0c0c] border border-[#262626] rounded-lg p-5 sm:p-6 shadow-xl relative">
                <div className="pb-3 mb-3 border-b border-[#222222]">
                  <span className="text-xs font-mono text-white font-bold">
                    {selectedLetter.badge}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mb-3 font-mono">
                  {selectedLetter.title}
                </h3>

                <div className="text-xs sm:text-sm text-[#cccccc] leading-relaxed font-mono whitespace-pre-line mb-4">
                  {selectedLetter.message}
                </div>

                {selectedLetter.ps && (
                  <div className="pt-3 border-t border-[#1f1f1f] text-xs text-[#888888] font-mono italic">
                    {selectedLetter.ps}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
