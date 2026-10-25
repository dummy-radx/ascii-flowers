import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Heart, Sparkles, Send, Copy, Check, Feather } from 'lucide-react';
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
  '<kraft>   \'-------------------------------------------\'   </kraft>',
];

export const LoveLetters: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState(PRESET_LOVE_LETTERS[0]);
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isWritingCustom, setIsWritingCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('A Note For My Girl');
  const [customBody, setCustomBody] = useState('You make my heart smile every single day!');
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

  const handleCopyLetter = () => {
    soundSynth.playSparkle();
    const formatted = `✉️ LOVE LETTER FOR SREEPARNA ✉️\n\n${selectedLetter.title}\n\n${selectedLetter.message}\n\n${selectedLetter.ps}\n\n-- Crafted with love on Sreeparna's ASCII Botanical Garden --`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendCustom = () => {
    soundSynth.playCelebration();
    const newNote = {
      id: `custom-${Date.now()}`,
      title: customTitle,
      badge: '💌 Written With Love',
      message: customBody,
      ps: 'P.S. Hand-delivered straight to Sreeparna\'s heart ♥',
    };
    setSelectedLetter(newNote);
    setIsWritingCustom(false);
    setIsOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center shadow-xl backdrop-blur-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono mb-2">
          <Mail className="w-3.5 h-3.5" />
          <span>Postal Garden of Love</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Letters & Sweet Notes for Sreeparna
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Folded letters, daily affirmations, and secret messages sealed with an ASCII wax stamp!
        </p>
      </div>

      {/* Daily Affirmation Pill */}
      <div className="bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="text-2xl">✨</span>
          <div>
            <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
              Sweet Reminder for Today:
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              "{affirmation}"
            </p>
          </div>
        </div>
        <button
          onClick={handleNewAffirmation}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono shrink-0 border border-slate-700 transition-all"
        >
          Another Reminder 🌸
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Letter Selector & Composer Toggle */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Select Letter</span>
          </h3>

          <div className="space-y-2">
            {PRESET_LOVE_LETTERS.map((letter) => {
              const isSelected = selectedLetter.id === letter.id && !isWritingCustom;
              return (
                <button
                  key={letter.id}
                  onClick={() => {
                    setSelectedLetter(letter);
                    setIsWritingCustom(false);
                    soundSynth.playSparkle();
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-rose-500/10 border-rose-400 shadow-md shadow-rose-500/20 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[10px] font-mono text-rose-400 mb-0.5">
                    {letter.badge}
                  </div>
                  <div className="text-xs font-bold truncate text-slate-200">
                    {letter.title}
                  </div>
                </button>
              );
            })}

            <button
              onClick={() => {
                setIsWritingCustom(true);
                soundSynth.playBloom(3);
              }}
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                isWritingCustom
                  ? 'bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/20 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] font-mono text-amber-400 mb-0.5 flex items-center gap-1">
                <Feather className="w-3 h-3" />
                <span>Custom Pen</span>
              </div>
              <div className="text-xs font-bold truncate text-slate-200">
                Write a New Note...
              </div>
            </button>
          </div>
        </div>

        {/* Right Side: Interactive ASCII Envelope / Unfolded Letter */}
        <div className="md:col-span-8">
          {isWritingCustom ? (
            /* Custom Letter Composer */
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Feather className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  Write a Special Note for Sreeparna
                </h3>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-mono">Letter Title:</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  placeholder="To My Favorite Person..."
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-mono">Message:</label>
                <textarea
                  rows={6}
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-sans leading-relaxed"
                  placeholder="Write your heartfelt words here..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsWritingCustom(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendCustom}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Seal & Present Letter!</span>
                </button>
              </div>
            </div>
          ) : (
            /* Envelope & Letter View */
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl relative backdrop-blur-md space-y-4">
              {/* ASCII Envelope Header / Seal */}
              <div
                onClick={handleOpenEnvelope}
                className="cursor-pointer group bg-[#0b0d15] border border-slate-800 hover:border-pink-500/50 rounded-xl p-4 flex flex-col items-center justify-center transition-all overflow-x-auto shadow-inner"
                title="Click to toggle envelope"
              >
                <pre className="font-mono text-[11px] leading-[13px] text-amber-500/90 select-none">
                  {ASCII_ENVELOPE_CLOSED.map((l, i) => (
                    <div
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: l
                          .replace(/<kraft>/g, '<span style="color:#d97706">')
                          .replace(/<\/kraft>/g, '</span>')
                          .replace(/<heart>/g, '<span style="color:#f43f5e; font-weight:bold;">')
                          .replace(/<\/heart>/g, '</span>'),
                      }}
                    />
                  ))}
                </pre>
                <span className="text-[11px] font-mono text-pink-400 mt-2 flex items-center gap-1 group-hover:scale-105 transition-all">
                  <Sparkles className="w-3 h-3" />
                  <span>{isOpen ? '[ Tap to fold letter ]' : '[ Tap wax seal to open letter! ]'}</span>
                </span>
              </div>

              {/* Unfolded Letter Content */}
              {isOpen && (
                <div className="bg-[#121526] border border-pink-500/30 rounded-xl p-5 sm:p-6 shadow-xl relative animate-gentle-bounce">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <span className="text-xs font-mono text-pink-400 font-bold">
                      {selectedLetter.badge}
                    </span>
                    <button
                      onClick={handleCopyLetter}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                      title="Copy letter to clipboard"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 font-mono">
                    {selectedLetter.title}
                  </h3>

                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line mb-4">
                    {selectedLetter.message}
                  </div>

                  {selectedLetter.ps && (
                    <div className="pt-3 border-t border-slate-800/80 text-xs text-pink-300/90 font-mono italic">
                      {selectedLetter.ps}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
