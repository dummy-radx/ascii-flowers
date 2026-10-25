import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Gift, Copy, Check, Sparkles, MessageSquare } from 'lucide-react';
import {
  BotanicalCanvasRenderer,
  rasterizeBouquet,
  type AsciiPaletteMode,
  type AsciiGridResult,
} from '../utils/asciiEngine';
import { RealisticAsciiViewer } from './RealisticAsciiViewer';
import { soundSynth } from '../utils/audio';
import { GIFT_ASCII_CARDS } from '../data/loveNotes';

type GiftType = 'teddy' | 'chocolates' | 'locket';

export const CuteGifts: React.FC = () => {
  const [selectedGift, setSelectedGift] = useState<GiftType>('locket');
  const [paletteMode, setPaletteMode] = useState<AsciiPaletteMode>('reference');
  const [asciiData, setAsciiData] = useState<AsciiGridResult | null>(null);
  const [interactedGifts, setInteractedGifts] = useState<Record<GiftType, boolean>>({
    teddy: false,
    chocolates: false,
    locket: false,
  });
  const [copied, setCopied] = useState<boolean>(false);

  const renderer = useMemo(() => new BotanicalCanvasRenderer(480, 560), []);

  const isCurrentInteracted = interactedGifts[selectedGift];

  useEffect(() => {
    renderer.clear();
    const cx = 240;
    const cy = 250;

    if (selectedGift === 'teddy') {
      renderer.drawTeddyPlushie(cx, cy, 1.15, isCurrentInteracted);
    } else if (selectedGift === 'chocolates') {
      renderer.drawChocolateBox(cx, cy + 30, 1.25, isCurrentInteracted);
    } else if (selectedGift === 'locket') {
      renderer.drawHeartLocket(cx, cy + 20, 1.2, isCurrentInteracted);
    }

    const result = rasterizeBouquet(
      renderer.getCanvas(),
      {
        width: 150,
        height: 85,
        paletteMode,
        charDensity: 'scanline',
        glowIntensity: 0.8,
      },
      renderer.getTextOverlays()
    );
    setAsciiData(result);
  }, [selectedGift, paletteMode, renderer, isCurrentInteracted]);

  const handleInteract = () => {
    soundSynth.playCelebration();
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fbbf24', '#ffffff', '#a855f7', '#fb7185'],
    });

    setInteractedGifts((prev) => ({
      ...prev,
      [selectedGift]: true,
    }));
  };

  const giftOptions = [
    {
      id: 'locket',
      name: 'Golden Heart Locket',
      badge: 'INITIALS: S ♥ I',
      icon: '✨',
      desc: 'Solid gold filigree locket engraved with our initials "S ♥ I" and "SREEPARNA ♥ ISHAN" hanging on a delicate starlight chain.',
    },
    {
      id: 'chocolates',
      name: 'Heart Chocolate Box',
      badge: 'ARTISAN PRALINES',
      icon: '🍫',
      desc: 'Heart-shaped velvet box filled with dark Belgian ganache, hazelnut pralines, and ruby chocolate with "S+I" monogram.',
    },
    {
      id: 'teddy',
      name: 'Plush Teddy Bear',
      badge: 'CUDDLY PLUSHIE',
      icon: '🧸',
      desc: 'Soft fuzzy bear with stitched belly heart "♥ S+I", button eyes, and holding a golden blooming sunflower for Sreeparna.',
    },
  ];

  const currentOption = giftOptions.find((g) => g.id === selectedGift) || giftOptions[0];
  const currentCard = GIFT_ASCII_CARDS[selectedGift];
  const displayedAscii = isCurrentInteracted ? currentCard.revealedAscii : currentCard.ascii;

  const handleCopyAscii = () => {
    navigator.clipboard.writeText(displayedAscii);
    soundSynth.playSparkle();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
      {/* Left Control Panel */}
      <div className="lg:col-span-5 space-y-4">
        {/* Gift Selector */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl">
          <div className="pb-2 mb-3 border-b border-[#1c1c1c] flex items-center justify-between">
            <span className="text-[11px] tracking-wider uppercase text-[#888888] flex items-center gap-1.5 font-bold">
              <Gift className="w-3.5 h-3.5 text-white" />
              <span>Gifts for Sreeparna • With Love</span>
            </span>
            <span className="text-[10px] text-pink-400 font-bold px-2 py-0.5 rounded-full bg-pink-950/40 border border-pink-900/50">
              S ♥ I
            </span>
          </div>

          <div className="space-y-2">
            {giftOptions.map((g) => {
              const isSelected = selectedGift === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedGift(g.id as GiftType);
                    soundSynth.playSparkle();
                  }}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-[#101010] border-[#222222] text-[#888888] hover:text-white hover:bg-[#161616]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span>{g.name}</span>
                      {g.id === 'locket' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-black font-extrabold">
                          S ♥ I
                        </span>
                      )}
                    </span>
                    <span className="text-sm">{g.icon}</span>
                  </div>
                  <div
                    className={`text-[10px] mt-1 line-clamp-1 ${
                      isSelected ? 'text-black/70' : 'text-[#666666]'
                    }`}
                  >
                    {g.badge}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ASCII Loving Message Card (Pure Monospace ASCII Terminal) */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-3">
          <div className="pb-2 border-b border-[#1c1c1c] flex items-center justify-between">
            <span className="text-[11px] text-[#888888] uppercase flex items-center gap-1.5 font-bold">
              <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
              <span>ASCII Loving Message</span>
            </span>
            <button
              onClick={handleCopyAscii}
              className="text-[10px] px-2 py-1 rounded bg-[#141414] hover:bg-[#222222] border border-[#2a2a2a] text-white flex items-center gap-1 transition-all"
              title="Copy ASCII Art message"
            >
              {copied ? (
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

          {/* ASCII Monospace Card Render */}
          <div className="bg-[#000000] border border-[#222222] rounded-lg p-2.5 overflow-x-auto shadow-inner">
            <pre className="text-[8.5px] sm:text-[9.5px] leading-[11px] font-mono text-pink-200 select-all whitespace-pre tracking-tight">
              {displayedAscii}
            </pre>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleInteract}
            className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Heart className="w-3.5 h-3.5 fill-black text-black" />
            <span>
              {selectedGift === 'teddy'
                ? isCurrentInteracted
                  ? 'Squeeze Teddy Again 🧸'
                  : 'Hug Plush Teddy Bear 🧸'
                : selectedGift === 'chocolates'
                ? isCurrentInteracted
                  ? 'Taste Another Truffle 🍫'
                  : 'Taste a Chocolate Truffle 🍫'
                : isCurrentInteracted
                ? 'Read Locket Vow Again ✨'
                : 'Open Golden Locket ✨'}
            </span>
          </button>
        </div>

        {/* Gift Details & Monogram Inscription */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-2 text-xs">
          <div className="pb-2 border-b border-[#1c1c1c] text-[11px] text-[#888888] uppercase font-bold flex items-center justify-between">
            <span>Specimen Inscription</span>
            <span className="text-[10px] text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Monogram: {currentCard.initials}</span>
            </span>
          </div>
          <p className="text-[#cccccc] leading-relaxed text-xs">
            "{currentOption.desc}"
          </p>
        </div>

        {/* Chromatic Mode */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-2 text-xs">
          <span className="text-[11px] text-[#888888] uppercase block pb-1 border-b border-[#1c1c1c]">
            Chromatic Display
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {[
              { id: 'reference', label: 'Reference Vivid' },
              { id: 'emerald', label: 'Emerald Glow' },
              { id: 'monochrome', label: 'Silver Wireframe' },
              { id: 'amber', label: 'Amber Gold' },
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
      </div>

      {/* Right Canvas */}
      <div className="lg:col-span-7">
        <RealisticAsciiViewer
          asciiData={asciiData}
          paletteMode={paletteMode}
          title={`BOTANICAL SPECIMEN: ${currentOption.name.toUpperCase()}`}
          glow={true}
        />
      </div>
    </div>
  );
};
