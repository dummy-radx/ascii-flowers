import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Mail,
  Heart,
  Sparkles,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { PRESET_LOVE_LETTERS } from '../data/loveNotes';
import { soundSynth } from '../utils/audio';

type AnimationPhase = 'closed' | 'unsealing' | 'opening-flap' | 'sliding' | 'opened';
type PaletteTheme = 'botanical' | 'amber' | 'emerald' | 'monochrome';
type TextScale = 'normal' | 'large' | 'xlarge';

const ASCII_ENVELOPE_CLOSED = [
  '  .--------------------------------------------------.  ',
  ' /  [AIR MAIL]                            .--------.  \\ ',
  '|   PAR AVION    POSTAL MEADOW OF LOVE   | [♥] S+I |   |',
  '|   SPECIAL      ETERNAL AIRMAIL 2026    |  POST   |   |',
  '|                                         \'--------\'   |',
  '|    \\                                            /    |',
  '|     \\                 .------.                 /     |',
  '|      \\               / .-..-. \\               /      |',
  '|       \\             | ( S ♥ I) |             /       |',
  '|        \\             \\ \'-..-\' /             /        |',
  '|         \\             \'------\'             /         |',
  '|          \\           [WAX SEAL]           /          |',
  '|           \\______________________________/           |',
  '|                                                      |',
  '|   DELIVER TO: Sreeparna (Prettiest Blossom 🌸)       |',
  '|   SENT FROM:  Ishan (With Everlasting Flowers 🌻)    |',
  '|   STATUS:     [★] Sealed with Devotion & Kisses ♥    |',
  ' \\                                                    / ',
  '  \'--------------------------------------------------\'  ',
];

const ASCII_ENVELOPE_UNSEALING = [
  '  .--------------------------------------------------.  ',
  ' /  [AIR MAIL]                            .--------.  \\ ',
  '|   PAR AVION    * * * UNSEALING... * *  | [♥] S+I |   |',
  '|   SPECIAL      BREAKING WAX SEAL...    |  POST   |   |',
  '|                                         \'--------\'   |',
  '|    \\                   *  ✦  *                  /    |',
  '|     \\                 \\.-..-./                 /     |',
  '|      \\              --( *S ✕ I* )--            /      |',
  '|       \\               /\'-..-\'\\                 /       |',
  '|        \\             *  * ♥ *  *              /        |',
  '|         \\           [SEAL BROKEN!]           /         |',
  '|          \\__________________________________/          |',
  '|                                                      |',
  '|   DELIVER TO: Sreeparna (Prettiest Blossom 🌸)       |',
  '|   SENT FROM:  Ishan (With Everlasting Flowers 🌻)    |',
  '|   STATUS:     ✦ Wax Seal Cracked Open! ✦             |',
  ' \\                                                    / ',
  '  \'--------------------------------------------------\'  ',
];

const ASCII_ENVELOPE_OPENING_FLAP = [
  '                    /\\                    ',
  '                   /  \\                   ',
  '                  /    \\                  ',
  '                 /  ♥   \\                 ',
  '                /  S+I   \\                ',
  '               /          \\               ',
  '              /   FLAP     \\              ',
  '             /   OPENED     \\             ',
  '  .---------\'                \'-------------------.  ',
  ' /  [AIR MAIL]                            .--------.  \\ ',
  '|   PAR AVION    POSTAL MEADOW OF LOVE   | [♥] S+I |   |',
  '|  .--------------------------------------------.  |',
  '|  | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~  |  |',
  '|  |     [ LETTER SLIDING OUT... 💌 ]           |  |',
  '|  |____________________________________________|  |',
  '|                                                  |',
  '|   DELIVER TO: Sreeparna (Prettiest Blossom 🌸)   |',
  '|   SENT FROM:  Ishan (Forever Yours ♥)            |',
  ' \\                                                / ',
  '  \'----------------------------------------------\'  ',
];

const ASCII_ENVELOPE_SLIDING = [
  '  .--------------------------------------------.  ',
  '  |  [LETTER REVEALED] * FOR MY SREEPARNA      |  ',
  '  |  >> SLIDING OUT OF ENVELOPE... 💌          |  ',
  '  +============================================+  ',
  '  |              .---.   .---.                 |  ',
  '  |             (     \\ /     )                |  ',
  '  |              )  (  ♥  )  (                 |  ',
  '  .---------\'   (     / \\     )  \'-------------.  ',
  ' /  [AIR MAIL]   \'---\'   \'---\'        .--------.  \\ ',
  '|   PAR AVION    POSTAL MEADOW OF LOVE| [♥] S+I |   |',
  '|  .--------------------------------------------.  |',
  '|  |                                            |  |',
  '|  |____________________________________________|  |',
  '|   DELIVER TO: Sreeparna (Prettiest Blossom 🌸)|  |',
  ' \\                                                / ',
  '  \'----------------------------------------------\'  ',
];

export const LoveLetters: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState(PRESET_LOVE_LETTERS[0]);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('opened');
  const [paletteTheme, setPaletteTheme] = useState<PaletteTheme>('botanical');
  const [textScale, setTextScale] = useState<TextScale>('large');
  const [copied, setCopied] = useState<boolean>(false);
  const [affirmation, setAffirmation] = useState('You are capable, radiant, and loved beyond measure. ✨');

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

  // Handle Multi-stage Opening Animation
  const handleOpenLetter = () => {
    if (animationPhase !== 'closed') return;
    soundSynth.playWaxCrack();
    setAnimationPhase('unsealing');

    // Confetti burst for breaking the seal!
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.55 },
      colors: ['#f43f5e', '#fbbf24', '#ffffff', '#fb7185'],
    });

    setTimeout(() => {
      soundSynth.playPaperRustle();
      setAnimationPhase('opening-flap');
    }, 600);

    setTimeout(() => {
      soundSynth.playBloom(2);
      setAnimationPhase('sliding');
    }, 1200);

    setTimeout(() => {
      soundSynth.playCelebration();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fbbf24', '#c084fc', '#38bdf8', '#ffffff'],
      });
      setAnimationPhase('opened');
    }, 1850);
  };

  // Handle Smooth Closing Animation
  const handleCloseLetter = () => {
    if (animationPhase !== 'opened') return;
    soundSynth.playPaperRustle();
    setAnimationPhase('sliding');

    setTimeout(() => {
      setAnimationPhase('opening-flap');
    }, 400);

    setTimeout(() => {
      soundSynth.playWaxCrack();
      setAnimationPhase('closed');
    }, 800);
  };

  const handleCopyAscii = () => {
    const textToCopy = selectedLetter.plainAscii || selectedLetter.asciiArt || selectedLetter.message;
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

  // Current envelope frame lines based on animation phase
  const getEnvelopeLines = () => {
    switch (animationPhase) {
      case 'unsealing':
        return ASCII_ENVELOPE_UNSEALING;
      case 'opening-flap':
        return ASCII_ENVELOPE_OPENING_FLAP;
      case 'sliding':
        return ASCII_ENVELOPE_SLIDING;
      case 'closed':
      default:
        return ASCII_ENVELOPE_CLOSED;
    }
  };

  // Resolve font size class based on textScale
  const getLetterSizeClass = () => {
    switch (textScale) {
      case 'xlarge':
        return 'text-[14px] sm:text-[15.5px] md:text-[16px] leading-[18px] sm:leading-[20px] md:leading-[21px]';
      case 'large':
        return 'text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-[16px] sm:leading-[17.5px] md:leading-[18px]';
      case 'normal':
      default:
        return 'text-[11px] sm:text-[12px] leading-[14px] sm:leading-[15.5px]';
    }
  };

  // Colorize letter lines for botanical mode
  const colorizeLetterLine = (line: string): string => {
    if (paletteTheme !== 'botanical') return line;

    return line
      .replace(/(\.---+|\+===+|'---+|\|  ===+|\|  \.\.\.\.+)/g, '<span style="color:#64748b">$1</span>')
      .replace(/(\[LETTER #[0-9]+\])/g, '<span style="color:#fbbf24; font-weight:bold">$1</span>')
      .replace(/(>> [A-Z ]+:)/g, '<span style="color:#f472b6; font-weight:bold">$1</span>')
      .replace(/(♥|✿|❀|❁|✦|★)/g, '<span style="color:#fb7185; font-weight:bold">$1</span>')
      .replace(/(SREEPARNA|S \+ I|S ♥ I)/g, '<span style="color:#ffffff; font-weight:bold">$1</span>')
      .replace(/(ISHAN|Ishan)/g, '<span style="color:#fde047; font-weight:bold">$1</span>')
      .replace(/(".*?")/g, '<span style="color:#fef08a">$1</span>');
  };

  // Envelope colorizer
  const colorizeEnvelopeLine = (line: string): string => {
    return line
      .replace(/(\[AIR MAIL\]|PAR AVION|POSTAL MEADOW OF LOVE)/g, '<span style="color:#38bdf8">$1</span>')
      .replace(/(\[\♥\] S\+I|POST)/g, '<span style="color:#fbbf24">$1</span>')
      .replace(/(♥)/g, '<span style="color:#f43f5e; font-weight:bold">$1</span>')
      .replace(/(\( S ♥ I\)|\[WAX SEAL\]|\[CRIMSON WAX\])/g, '<span style="color:#f43f5e; font-weight:bold">$1</span>')
      .replace(/(\*S ✕ I\*|\[SEAL BROKEN!\]|✦ Wax Seal Cracked Open! ✦)/g, '<span style="color:#fbbf24; font-weight:bold">$1</span>')
      .replace(/(DELIVER TO: Sreeparna \(Prettiest Blossom 🌸\))/g, '<span style="color:#f472b6">$1</span>')
      .replace(/(SENT FROM:  Ishan \(With Everlasting Flowers 🌻\))/g, '<span style="color:#fbbf24">$1</span>');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono pb-12">
      {/* Postal Header */}
      <div className="bg-[#080808] border border-[#222222] rounded-2xl p-5 sm:p-6 text-center shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141414] border border-[#262626] text-white text-xs mb-2">
          <Mail className="w-3.5 h-3.5 text-pink-400" />
          <span>VINTAGE POSTAL MEADOW • SPECIAL AIRMAIL</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          LETTERS & SWEET NOTES FOR SREEPARNA
        </h2>
        <p className="text-xs sm:text-sm text-[#888888] mt-1.5 max-w-lg mx-auto">
          Folded letters sealed with an authentic ASCII wax stamp. Tap to break the seal and unfold the letter.
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
        {/* Left Column: Letter Selector & Controls */}
        <div className="lg:col-span-4 space-y-4">
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
                      // If closed, open smoothly to show the selected letter
                      if (animationPhase === 'closed') {
                        setAnimationPhase('opened');
                      }
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
                          READING
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
          </div>

          {/* Letter Toolbar Controls */}
          <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-3">
            <span className="text-[11px] text-[#888888] uppercase block pb-1 border-b border-[#1c1c1c] font-bold">
              Letter Display Options
            </span>

            {/* Text Scale Buttons */}
            <div>
              <div className="text-[10px] text-[#777777] mb-1.5 uppercase">
                Text ASCII Size:
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: 'normal', label: 'Medium' },
                  { id: 'large', label: 'Large' },
                  { id: 'xlarge', label: 'X-Large' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setTextScale(s.id as TextScale);
                      soundSynth.playSparkle();
                    }}
                    className={`py-1.5 rounded border text-center transition-all ${
                      textScale === s.id
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-[#121212] border-[#222222] text-[#888888] hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Mode Palette */}
            <div>
              <div className="text-[10px] text-[#777777] mb-1.5 uppercase">
                Color Mode:
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {[
                  { id: 'botanical', label: 'Botanical Glow' },
                  { id: 'amber', label: 'Amber CRT' },
                  { id: 'emerald', label: 'Emerald Matrix' },
                  { id: 'monochrome', label: 'Silver Wire' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPaletteTheme(p.id as PaletteTheme);
                      soundSynth.playSparkle();
                    }}
                    className={`p-2 rounded border text-left transition-all ${
                      paletteTheme === p.id
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-[#121212] border-[#222222] text-[#888888] hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
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
                <span>Prev</span>
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
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Envelope & Unfolded ASCII Letter */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#080808] border border-[#222222] rounded-2xl p-4 sm:p-6 shadow-2xl relative space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1c1c1c]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {animationPhase === 'opened' ? 'ASCII LOVE LETTER • UNSEALED' : 'AIRMAIL ENVELOPE • SEALED'}
                </span>
                <span className="text-[10px] text-pink-400 font-bold px-2 py-0.5 rounded-full bg-pink-950/40 border border-pink-900/50">
                  {selectedLetter.badge}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyAscii}
                  className="text-xs px-2.5 py-1 rounded bg-[#141414] hover:bg-[#222222] border border-[#2a2a2a] text-white flex items-center gap-1.5 transition-all"
                  title="Copy ASCII Letter to Clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ASCII Letter</span>
                    </>
                  )}
                </button>

                {animationPhase === 'opened' ? (
                  <button
                    onClick={handleCloseLetter}
                    className="text-xs px-3 py-1 rounded bg-white text-black hover:bg-neutral-200 font-bold flex items-center gap-1.5 transition-all shadow"
                    title="Fold and reseal letter back into envelope"
                  >
                    <span>Reseal Envelope ✉️</span>
                  </button>
                ) : (
                  <button
                    onClick={handleOpenLetter}
                    disabled={animationPhase !== 'closed'}
                    className="text-xs px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-black font-extrabold flex items-center gap-1.5 transition-all shadow-lg animate-pulse"
                    title="Break wax seal and open letter"
                  >
                    <span>Break Wax Seal 💌</span>
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Envelope (when not opened, or for clicking) */}
            {animationPhase !== 'opened' ? (
              <div
                onClick={animationPhase === 'closed' ? handleOpenLetter : undefined}
                className={`group bg-[#000000] border rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center transition-all overflow-x-auto shadow-inner ${
                  animationPhase === 'closed'
                    ? 'cursor-pointer hover:border-pink-400/80 border-[#222222]'
                    : 'border-amber-400/50'
                }`}
                title={animationPhase === 'closed' ? 'Click to break wax seal & unfold letter!' : 'Opening letter...'}
              >
                <pre
                  className={`font-mono select-none transition-all ${
                    textScale === 'xlarge'
                      ? 'text-[13.5px] sm:text-[14.5px] leading-[17px] sm:leading-[18.5px]'
                      : textScale === 'large'
                      ? 'text-[12px] sm:text-[13px] leading-[15px] sm:leading-[16.5px]'
                      : 'text-[10.5px] sm:text-[11.5px] leading-[13px] sm:leading-[14.5px]'
                  }`}
                  style={{
                    color:
                      paletteTheme === 'amber'
                        ? '#fbbf24'
                        : paletteTheme === 'emerald'
                        ? '#34d399'
                        : '#ffffff',
                  }}
                >
                  {getEnvelopeLines().map((line, i) => (
                    <div
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: paletteTheme === 'botanical' ? colorizeEnvelopeLine(line) : line,
                      }}
                    />
                  ))}
                </pre>

                <div className="mt-4 text-xs font-mono flex items-center gap-2">
                  {animationPhase === 'closed' ? (
                    <span className="text-amber-400 font-bold group-hover:text-white flex items-center gap-1.5 animate-pulse">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>[ Tap wax seal to break & open letter ]</span>
                    </span>
                  ) : (
                    <span className="text-pink-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
                      <span>Unfolding Sreeparna's letter... ✨</span>
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* FULL OPENED LOVE LETTER IN VINTAGE ASCII CARD STYLE */
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                {/* ASCII Letter Card Render */}
                <div className="bg-[#000000] border border-[#222222] rounded-xl p-4 sm:p-5 overflow-x-auto shadow-2xl relative">
                  <pre
                    className={`font-mono select-all whitespace-pre tracking-tight transition-all ${getLetterSizeClass()}`}
                    style={{
                      color:
                        paletteTheme === 'amber'
                          ? '#fbbf24'
                          : paletteTheme === 'emerald'
                          ? '#34d399'
                          : paletteTheme === 'monochrome'
                          ? '#f8fafc'
                          : '#e2e8f0',
                      textShadow:
                        paletteTheme === 'amber'
                          ? '0 0 10px rgba(251,191,36,0.2)'
                          : paletteTheme === 'emerald'
                          ? '0 0 10px rgba(52,211,153,0.2)'
                          : 'none',
                    }}
                  >
                    {(selectedLetter.asciiArt || selectedLetter.plainAscii || selectedLetter.message)
                      .split('\n')
                      .map((line, i) => (
                        <div
                          key={i}
                          dangerouslySetInnerHTML={{
                            __html: colorizeLetterLine(line),
                          }}
                        />
                      ))}
                  </pre>
                </div>

                {/* Bottom Action Tray */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#0d0d0d] border border-[#222222] rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundSynth.playBloom(3);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] text-white border border-[#262626] flex items-center gap-1.5 transition-all"
                      title="Play sweet love chime"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                      <span>Play Chime ✨</span>
                    </button>
                    <button
                      onClick={handleCopyAscii}
                      className="px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] text-white border border-[#262626] flex items-center gap-1.5 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy ASCII'}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleCloseLetter}
                    className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 font-bold flex items-center gap-1.5 transition-all shadow"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Fold & Reseal Envelope ✉️</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
