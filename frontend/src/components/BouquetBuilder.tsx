import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Copy, Check, Heart, RefreshCw, Eye, Plus, Minus, Wand2, Share2 } from 'lucide-react';
import { FLOWERS, WRAPPERS } from '../data/flowers';
import { type BouquetConfig, DEFAULT_BOUQUET_CONFIG, generateMixedBouquet } from '../data/bouquetEngine';
import { AsciiRenderer } from './AsciiRenderer';
import { soundSynth } from '../utils/audio';
import type { FlowerData } from '../types';

export const BouquetBuilder: React.FC = () => {
  const [config, setConfig] = useState<BouquetConfig>(DEFAULT_BOUQUET_CONFIG);
  const [copied, setCopied] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [selectedInspectFlower, setSelectedInspectFlower] = useState<FlowerData | null>(null);
  const [animationStyle, setAnimationStyle] = useState<'sway' | 'bounce' | 'glow' | 'none'>('sway');

  const bouquetResult = generateMixedBouquet(config);

  const handleFlowerCountChange = (flowerId: string, delta: number) => {
    setConfig((prev) => {
      const current = (prev as unknown as Record<string, number>)[flowerId] || 0;
      const next = Math.max(0, Math.min(8, current + delta));
      if (delta > 0) {
        soundSynth.playBloom(next);
      } else {
        soundSynth.playPluck();
      }
      return {
        ...prev,
        [flowerId]: next,
      };
    });
  };

  const handleRandomSurprise = () => {
    soundSynth.playSparkle();
    const randomConfig: BouquetConfig = {
      ...config,
      sunflower: Math.floor(Math.random() * 3) + 1,
      daisy: Math.floor(Math.random() * 3) + 1,
      lily: Math.floor(Math.random() * 3) + 1,
      tulip: Math.floor(Math.random() * 3),
      lavender: Math.floor(Math.random() * 4) + 1,
      forgetmenot: Math.floor(Math.random() * 3),
      orchid: Math.floor(Math.random() * 2),
      wrapperId: WRAPPERS[Math.floor(Math.random() * WRAPPERS.length)].id,
    };
    setConfig(randomConfig);
  };

  const applyPreset = (presetName: string) => {
    soundSynth.playSparkle();
    if (presetName === 'sunlight') {
      setConfig((prev) => ({
        ...prev,
        sunflower: 3,
        daisy: 4,
        lily: 0,
        tulip: 0,
        lavender: 3,
        forgetmenot: 1,
        orchid: 0,
        wrapperId: 'ribbon',
        customMessage: 'You are my sunshine on the rainiest days!',
      }));
    } else if (presetName === 'starlight') {
      setConfig((prev) => ({
        ...prev,
        sunflower: 0,
        daisy: 2,
        lily: 3,
        tulip: 0,
        lavender: 2,
        forgetmenot: 3,
        orchid: 2,
        wrapperId: 'glass',
        customMessage: 'As rare and luminous as a shooting star.',
      }));
    } else if (presetName === 'cottage') {
      setConfig((prev) => ({
        ...prev,
        sunflower: 2,
        daisy: 3,
        lily: 2,
        tulip: 2,
        lavender: 2,
        forgetmenot: 2,
        orchid: 0,
        wrapperId: 'kraft',
        customMessage: 'A sweet meadow gathered just for my sweetheart.',
      }));
    } else if (presetName === 'meadow') {
      setConfig((prev) => ({
        ...prev,
        sunflower: 2,
        daisy: 4,
        lily: 1,
        tulip: 2,
        lavender: 4,
        forgetmenot: 2,
        orchid: 1,
        wrapperId: 'basket',
        customMessage: 'Handcrafted with all my love for Sreeparna!',
      }));
    }
  };

  const handleCelebrate = () => {
    soundSynth.playCelebration();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f472b6', '#38bdf8', '#c084fc', '#facc15', '#4ade80'],
    });
  };

  const handleCopyAscii = () => {
    soundSynth.playSparkle();
    navigator.clipboard.writeText(bouquetResult.plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCopyShareableMessage = () => {
    soundSynth.playSparkle();
    const shareText = `💐 A Special ASCII Bouquet For Sreeparna 💐\n\n${bouquetResult.plainText}\n\n🌸 Made with love on your ASCII Flower Playground! ✨`;
    navigator.clipboard.writeText(shareText);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Control Panel: Flower Picker, Wrappers, Notes */}
      <div className="lg:col-span-5 space-y-5">
        {/* Quick Presets */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bouquet Presets</span>
            </h3>
            <button
              onClick={handleRandomSurprise}
              className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors font-mono"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Surprise Mix</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => applyPreset('sunlight')}
              className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 text-left transition-all group"
            >
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                <span>🌻 Sunshine Meadow</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">Sunflowers & Daisies</div>
            </button>

            <button
              onClick={() => applyPreset('starlight')}
              className="px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:border-purple-400 text-left transition-all group"
            >
              <div className="text-xs font-semibold text-purple-300 flex items-center gap-1">
                <span>🌸 Starlight Lilies</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">Lilies & Orchids in Flute</div>
            </button>

            <button
              onClick={() => applyPreset('cottage')}
              className="px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 hover:border-orange-400 text-left transition-all group"
            >
              <div className="text-xs font-semibold text-orange-300 flex items-center gap-1">
                <span>📜 Rustic Kraft Mix</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">Tulips, Daisies & Seal</div>
            </button>

            <button
              onClick={() => applyPreset('meadow')}
              className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all group"
            >
              <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                <span>🧺 Garden Basket</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">Lush Wildflower Mix</div>
            </button>
          </div>
        </div>

        {/* Flower Selector Cards (Strictly No Roses) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400 font-mono flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-pink-500" />
                <span>Select Mixed Flowers ({bouquetResult.totalFlowers})</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Click + to add flowers to Sreeparna's bouquet (strictly fresh meadow blooms, no roses!)
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {FLOWERS.map((flower) => {
              const currentCount = (config as unknown as Record<string, number>)[flower.id] || 0;
              return (
                <div
                  key={flower.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                    currentCount > 0
                      ? 'bg-slate-800/80 border-pink-500/40 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 border"
                      style={{
                        backgroundColor: `${flower.primaryColor}15`,
                        borderColor: `${flower.primaryColor}40`,
                      }}
                    >
                      {flower.symbol}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">
                          {flower.name}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedInspectFlower(flower);
                            soundSynth.playSparkle();
                          }}
                          title="Inspect flower ASCII art & meaning"
                          className="text-slate-500 hover:text-slate-300 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {flower.meaning}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-900/90 border border-slate-700/60 rounded-lg p-0.5">
                    <button
                      onClick={() => handleFlowerCountChange(flower.id, -1)}
                      disabled={currentCount === 0}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-mono font-bold text-amber-300">
                      {currentCount}
                    </span>
                    <button
                      onClick={() => handleFlowerCountChange(flower.id, 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-pink-400 hover:text-pink-300 hover:bg-slate-800"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bouquet Wrapper & Vase Selector */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono mb-2.5 flex items-center gap-1.5">
            <span>Choose Wrap or Vase</span>
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {WRAPPERS.map((wrapper) => {
              const isSelected = config.wrapperId === wrapper.id;
              return (
                <button
                  key={wrapper.id}
                  onClick={() => {
                    setConfig((prev) => ({ ...prev, wrapperId: wrapper.id }));
                    soundSynth.playBloom(3);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-400 shadow-md shadow-cyan-500/20 text-white'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xl mb-1">{wrapper.icon}</div>
                  <div className="text-[11px] font-medium leading-tight truncate">
                    {wrapper.name.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Personalization & Dedication Plaque */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
            <span>Dedication Plaque</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-mono">For (Recipient):</label>
              <input
                type="text"
                value={config.recipientName}
                onChange={(e) => setConfig((prev) => ({ ...prev, recipientName: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                placeholder="Sreeparna"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-mono">From (Sender):</label>
              <input
                type="text"
                value={config.senderName}
                onChange={(e) => setConfig((prev) => ({ ...prev, senderName: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                placeholder="Ishan"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-mono">Sweet Note on Plaque:</label>
            <input
              type="text"
              value={config.customMessage}
              onChange={(e) => setConfig((prev) => ({ ...prev, customMessage: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              placeholder="You make every day blossom!"
            />
          </div>
        </div>
      </div>

      {/* Right Canvas: Real-Time Colorful ASCII Bouquet & Actions */}
      <div className="lg:col-span-7 space-y-4">
        {/* Bouquet Display Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Top Canvas Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block animate-pulse"></span>
              <span className="text-xs font-mono font-semibold text-slate-200">
                ASCII Bouquet Canvas
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                {bouquetResult.totalFlowers} blooms
              </span>
            </div>

            {/* Animation Controls */}
            <div className="flex items-center gap-1 bg-slate-950/60 border border-slate-800 rounded-lg p-0.5">
              {(['sway', 'glow', 'bounce', 'none'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setAnimationStyle(style)}
                  className={`px-2 py-0.5 text-[10px] rounded font-mono uppercase transition-all ${
                    animationStyle === style
                      ? 'bg-pink-500 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Colored ASCII Canvas */}
          <div className="bg-[#0b0d15] border border-slate-800/80 rounded-xl p-4 sm:p-6 overflow-x-auto flex justify-center min-h-[480px] shadow-inner items-center">
            <AsciiRenderer
              lines={bouquetResult.lines}
              animate={animationStyle}
              fontSize="sm"
              className="text-center"
            />
          </div>

          {/* Action Buttons Below Canvas */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={handleCelebrate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Wand2 className="w-4 h-4 animate-spin" />
              <span>Celebrate Bouquet! 💐</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAscii}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-all"
                title="Copy plain ASCII text to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied ASCII!' : 'Copy ASCII'}</span>
              </button>

              <button
                onClick={handleCopyShareableMessage}
                className="px-3 py-2 rounded-xl bg-pink-950/70 hover:bg-pink-900/80 border border-pink-700/60 text-pink-200 text-xs font-mono flex items-center gap-1.5 transition-all"
                title="Copy formatted message with love card"
              >
                {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedMessage ? 'Copied Love Card!' : 'Share For Sreeparna'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Flowers Overview Badge */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">💐 Bouquet Composition:</span>
            <span className="text-slate-400">{bouquetResult.flowerListText}</span>
          </div>
          <span className="text-[11px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
            Handcrafted for Sreeparna ✨
          </span>
        </div>
      </div>

      {/* Flower Inspect Modal */}
      {selectedInspectFlower && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-pink-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-gentle-bounce">
            <button
              onClick={() => setSelectedInspectFlower(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-sm bg-slate-800 px-2 py-1 rounded-lg"
            >
              [✕ Close]
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selectedInspectFlower.symbol}</span>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedInspectFlower.name}
                </h3>
                <p className="text-xs text-pink-400 font-mono">
                  {selectedInspectFlower.meaning}
                </p>
              </div>
            </div>

            <div className="bg-[#0b0d15] border border-slate-800 rounded-xl p-4 mb-4 flex justify-center">
              <AsciiRenderer
                lines={selectedInspectFlower.asciiArt}
                animate="sway"
                fontSize="sm"
              />
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed font-sans">
              "{selectedInspectFlower.description}"
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  handleFlowerCountChange(selectedInspectFlower.id, 1);
                  setSelectedInspectFlower(null);
                }}
                className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-pink-500/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Sreeparna's Bouquet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
