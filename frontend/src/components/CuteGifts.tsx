import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Gift } from 'lucide-react';
import {
  BotanicalCanvasRenderer,
  rasterizeBouquet,
  type AsciiPaletteMode,
  type AsciiGridResult,
} from '../utils/asciiEngine';
import { RealisticAsciiViewer } from './RealisticAsciiViewer';
import { soundSynth } from '../utils/audio';

type GiftType = 'teddy' | 'chocolates' | 'locket';

export const CuteGifts: React.FC = () => {
  const [selectedGift, setSelectedGift] = useState<GiftType>('chocolates');
  const [paletteMode, setPaletteMode] = useState<AsciiPaletteMode>('reference');
  const [asciiData, setAsciiData] = useState<AsciiGridResult | null>(null);
  const [activeMessage, setActiveMessage] = useState<string>('Handcrafted artisan Belgian truffles selected for Sreeparna ♥');

  const renderer = useMemo(() => new BotanicalCanvasRenderer(480, 560), []);

  useEffect(() => {
    renderer.clear();
    const cx = 240;
    const cy = 250;

    if (selectedGift === 'teddy') {
      renderer.drawTeddyPlushie(cx, cy, 1.15);
    } else if (selectedGift === 'chocolates') {
      renderer.drawChocolateBox(cx, cy + 30, 1.25);
    } else if (selectedGift === 'locket') {
      renderer.drawHeartLocket(cx, cy + 20, 1.2);
    }

    const result = rasterizeBouquet(renderer.getCanvas(), {
      width: 150,
      height: 85,
      paletteMode,
      charDensity: 'scanline',
      glowIntensity: 0.8,
    });
    setAsciiData(result);
  }, [selectedGift, paletteMode, renderer]);

  const handleInteract = () => {
    soundSynth.playCelebration();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fbbf24', '#ffffff', '#a855f7'],
    });

    if (selectedGift === 'teddy') {
      setActiveMessage('*Warm bear hug!* Barnaby whispers: Ishan loves you more than all the stars in the night sky! 🧸');
    } else if (selectedGift === 'chocolates') {
      setActiveMessage('Fed a silky ruby praline to Sreeparna! Sweeter than sugar, purer than gold. 🍫');
    } else if (selectedGift === 'locket') {
      setActiveMessage('Locket opened: "My heart belongs to Sreeparna forever, yesterday, today, and tomorrow." ✨');
    }
  };

  const giftOptions = [
    {
      id: 'chocolates',
      name: 'Heart Chocolate Box',
      badge: 'ARTISAN PRALINES',
      icon: '🍫',
      desc: 'Heart-shaped velvet box filled with dark chocolate truffles, hazelnut pralines, and gold leaf glaze.',
    },
    {
      id: 'teddy',
      name: 'Plush Teddy Bear',
      badge: 'CUDDLY PLUSHIE',
      icon: '🧸',
      desc: 'Soft fuzzy bear with stitched heart "♥ S+I", button eyes, and holding a golden sunflower for Sreeparna.',
    },
    {
      id: 'locket',
      name: 'Golden Heart Locket',
      badge: 'HEIRLOOM PENDANT',
      icon: '✨',
      desc: 'Solid gold filigree locket engraved with "SREEPARNA ♥ ISHAN" hanging on a delicate starlight chain.',
    },
  ];

  const currentOption = giftOptions.find((g) => g.id === selectedGift) || giftOptions[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
      {/* Left Control Panel */}
      <div className="lg:col-span-4 space-y-4">
        {/* Gift Selector */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl">
          <div className="pb-2 mb-3 border-b border-[#1c1c1c] flex items-center justify-between">
            <span className="text-[11px] tracking-wider uppercase text-[#888888] flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-white" />
              <span>Gifts for Sreeparna</span>
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
                    if (g.id === 'teddy') setActiveMessage('Barnaby is hugging a sunflower waiting for your cuddles! 🧸');
                    else if (g.id === 'chocolates') setActiveMessage('Heart box of assorted artisan pralines ready to taste! 🍫');
                    else setActiveMessage('Golden heirloom locket engraved with Sreeparna & Ishan! ✨');
                  }}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-[#101010] border-[#222222] text-[#888888] hover:text-white hover:bg-[#161616]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>{g.name}</span>
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

        {/* Gift Description & Interactive Message */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-3 text-xs">
          <div className="pb-2 border-b border-[#1c1c1c] text-[11px] text-[#888888] uppercase">
            Specimen Details
          </div>
          <p className="text-white leading-relaxed text-xs">
            "{currentOption.desc}"
          </p>
          <div className="bg-[#121212] border border-[#222222] rounded-lg p-3 text-[11px] text-[#cccccc] leading-relaxed">
            {activeMessage}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleInteract}
          className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Heart className="w-3.5 h-3.5 fill-black" />
          <span>
            {selectedGift === 'teddy'
              ? 'Hug Plush Teddy Bear 🧸'
              : selectedGift === 'chocolates'
              ? 'Taste a Chocolate Truffle 🍫'
              : 'Open Golden Locket ✨'}
          </span>
        </button>

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
      <div className="lg:col-span-8">
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
