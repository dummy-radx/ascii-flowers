import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { RefreshCw, Wand2, Sliders, Layers, Play, Pause, RotateCcw, Type } from 'lucide-react';
import {
  BotanicalCanvasRenderer,
  rasterizeBouquet,
  type BouquetComposition,
  type AsciiPaletteMode,
  type AsciiGridResult,
} from '../utils/asciiEngine';
import { RealisticAsciiViewer } from './RealisticAsciiViewer';
import { soundSynth } from '../utils/audio';

export const BOUQUET_MESSAGES = [
  'I LOVE YOU SREEPARNA',
  'YOU MAKE MY HEART BLOOM',
  'FOREVER AND ALWAYS',
  'MY SWEETEST SUNSHINE',
  'EVERY PETAL FOR SREEPARNA',
  'YOU ARE MY FAVORITE PERSON',
  'MY WHOLE HEART IS YOURS',
  'LOVING YOU MORE EVERY DAY',
];

export const BouquetBuilder: React.FC = () => {
  const [comp, setComp] = useState<BouquetComposition>({
    sunflower: 1,
    daisy: 2,
    lily: 4,
    tulip: 2,
    lavender: 2,
    density: 'ultra',
    renderStyle: 'scanline',
    bloomProgress: 0.05,
    floatingMessage: BOUQUET_MESSAGES[0],
  });

  const [isAutoCycle, setIsAutoCycle] = useState<boolean>(true);

  const [paletteMode, setPaletteMode] = useState<AsciiPaletteMode>('reference');
  const [charDensity, setCharDensity] = useState<'scanline' | 'fine' | 'matrix' | 'dense'>('scanline');
  const [gridCols, setGridCols] = useState<number>(170);
  const [gridRows, setGridRows] = useState<number>(95);
  const [glow, setGlow] = useState<boolean>(true);
  const [asciiData, setAsciiData] = useState<AsciiGridResult | null>(null);

  // Blooming Animation State
  const [isBlooming, setIsBlooming] = useState<boolean>(true);
  const [bloomValue, setBloomValue] = useState<number>(0.05);
  const animationFrameRef = useRef<number | null>(null);

  const renderer = useMemo(() => new BotanicalCanvasRenderer(520, 640), []);

  // Automatically cycle between romantic messages
  useEffect(() => {
    if (!isAutoCycle || isBlooming) return;

    const interval = setInterval(() => {
      setComp((c) => {
        const currentMsg = (c.floatingMessage || '').toUpperCase().trim();
        const currentIndex = BOUQUET_MESSAGES.indexOf(currentMsg);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % BOUQUET_MESSAGES.length;
        return {
          ...c,
          floatingMessage: BOUQUET_MESSAGES[nextIndex],
        };
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [isAutoCycle, isBlooming]);

  // Sync bloom value to composition
  useEffect(() => {
    setComp((prev) => ({
      ...prev,
      bloomProgress: bloomValue,
    }));
  }, [bloomValue]);

  // Re-render bouquet when params change
  useEffect(() => {
    renderer.drawReferenceBouquet(comp);
    const result = rasterizeBouquet(
      renderer.getCanvas(),
      {
        width: gridCols,
        height: gridRows,
        paletteMode,
        charDensity,
        glowIntensity: glow ? 0.8 : 0,
      },
      renderer.getTextOverlays()
    );
    setAsciiData(result);
  }, [comp, paletteMode, charDensity, gridCols, gridRows, glow, renderer, bloomValue]);

  // Bloom animation loop
  const triggerBloomAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setIsBlooming(true);
    setBloomValue(0.05);
    try {
      soundSynth.playBloom(0);
    } catch {
      // Audio context may require user interaction first
    }

    let progress = 0.05;
    const startTime = performance.now();
    const duration = 2800; // 2.8 seconds for smooth blossoming
    let playedStage1 = false;
    let playedStage2 = false;
    let playedStage3 = false;

    const step = (now: number) => {
      const elapsed = now - startTime;
      progress = Math.min(1.0, 0.05 + (elapsed / duration) * 0.95);
      setBloomValue(progress);

      if (!playedStage1 && progress >= 0.35) {
        playedStage1 = true;
        try { soundSynth.playBloom(1); } catch {}
      }
      if (!playedStage2 && progress >= 0.65) {
        playedStage2 = true;
        try { soundSynth.playBloom(2); } catch {}
      }
      if (!playedStage3 && progress >= 0.95) {
        playedStage3 = true;
        try { soundSynth.playBloom(4); } catch {}
      }

      if (progress < 1.0) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsBlooming(false);
        try {
          soundSynth.playCelebration();
        } catch {}
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#fbbf24', '#f43f5e', '#a855f7', '#34d399'],
        });
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, []);

  const toggleBloomAnimation = () => {
    if (isBlooming) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setIsBlooming(false);
    } else {
      triggerBloomAnimation();
    }
  };

  // Automatically trigger bloom animation as soon as the website is opened
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerBloomAnimation();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [triggerBloomAnimation]);

  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(() => soundSynth.isUnlocked());

  // If audio is locked on initial page load (browser autoplay policy),
  // unlock audio and re-bloom with sound on the first click/key anywhere on the page!
  useEffect(() => {
    if (audioUnlocked) return;

    const handleFirstGesture = () => {
      soundSynth.initCtx().then(() => {
        setAudioUnlocked(true);
        triggerBloomAnimation();
      });
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, [audioUnlocked, triggerBloomAnimation]);

  const handleSurpriseMix = () => {
    soundSynth.playSparkle();
    setComp((prev) => ({
      ...prev,
      sunflower: Math.random() > 0.4 ? 1 : 0,
      lily: Math.floor(Math.random() * 3) + 2,
      tulip: Math.floor(Math.random() * 3) + 1,
      lavender: Math.floor(Math.random() * 3) + 1,
      daisy: Math.floor(Math.random() * 3) + 1,
    }));
  };

  const handleCelebrate = () => {
    soundSynth.playCelebration();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#fbbf24', '#f43f5e', '#a855f7', '#34d399'],
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
      {/* Left Control Panel */}
      <div className="lg:col-span-4 space-y-4">
        {/* Bloom Animation Controller */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1c1c1c]">
            <span className="text-[11px] tracking-wider uppercase text-white font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Bloom Physics Engine</span>
            </span>
            <span className="text-[10px] text-[#888888]">
              {Math.round(bloomValue * 100)}% BLOOM
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleBloomAnimation}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isBlooming
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-white hover:bg-slate-200 text-black shadow'
              }`}
            >
              {isBlooming ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
              <span>{isBlooming ? 'Blooming...' : 'Trigger Flower Bloom ✨'}</span>
            </button>
            <button
              onClick={() => {
                soundSynth.playSparkle();
                setBloomValue(1.0);
              }}
              className="p-2 rounded-lg bg-[#141414] hover:bg-[#202020] text-white border border-[#262626]"
              title="Reset to Full Bloom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Real-time Slider */}
          <div>
            <div className="flex justify-between text-[10px] text-[#888888] mb-1">
              <span>Sprout (0%)</span>
              <span>Bud (50%)</span>
              <span>Full Blossom (100%)</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={1.0}
              step={0.02}
              value={bloomValue}
              onChange={(e) => setBloomValue(parseFloat(e.target.value))}
              className="w-full accent-white bg-[#222222]"
            />
          </div>
        </div>

        {/* Floating Romantic Message Editor */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-2.5">
          <div className="pb-2 border-b border-[#1c1c1c] flex items-center justify-between">
            <span className="text-[11px] tracking-wider uppercase text-[#888888] flex items-center gap-1.5 font-bold">
              <Type className="w-3.5 h-3.5 text-white" />
              <span>Glowing Romantic Message</span>
            </span>
            <button
              onClick={() => setIsAutoCycle((prev) => !prev)}
              className={`text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border transition-all ${
                isAutoCycle
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm'
                  : 'bg-[#141414] border-[#2a2a2a] text-[#888888] hover:text-white'
              }`}
              title={isAutoCycle ? 'Auto-cycling messages every ~4s (Click to pause)' : 'Click to resume auto-cycle'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isAutoCycle ? 'bg-emerald-400 animate-pulse' : 'bg-[#666666]'}`} />
              <span className="font-semibold">{isAutoCycle ? 'Auto-Cycle: Active' : 'Auto: Paused'}</span>
            </button>
          </div>

          <input
            type="text"
            value={comp.floatingMessage || ''}
            onChange={(e) => {
              setIsAutoCycle(false);
              setComp((prev) => ({ ...prev, floatingMessage: e.target.value }));
            }}
            placeholder="I LOVE YOU SREEPARNA"
            className="w-full bg-[#121212] border border-[#262626] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white font-mono"
          />

          <div className="flex flex-wrap gap-1.5 text-[10px]">
            {BOUQUET_MESSAGES.map((presetMsg) => {
              const isActive = (comp.floatingMessage || '').toUpperCase().trim() === presetMsg;
              return (
                <button
                  key={presetMsg}
                  onClick={() => {
                    soundSynth.playSparkle();
                    setComp((prev) => ({ ...prev, floatingMessage: presetMsg }));
                    setIsAutoCycle(true);
                  }}
                  className={`px-2.5 py-1 rounded transition-all border ${
                    isActive
                      ? 'bg-white text-black font-bold border-white shadow-md scale-[1.02]'
                      : 'bg-[#141414] hover:bg-[#202020] text-[#888888] hover:text-white border-[#222222]'
                  }`}
                >
                  {presetMsg}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preset Presets Box */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1c1c1c]">
            <span className="text-[11px] tracking-wider uppercase text-[#888888] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-white" />
              <span>Bouquet Presets</span>
            </span>
            <button
              onClick={handleSurpriseMix}
              className="text-[11px] text-[#aaaaaa] hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Surprise Mix</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              onClick={() => {
                soundSynth.playBloom(0);
                setComp((prev) => ({
                  ...prev,
                  sunflower: 1,
                  daisy: 2,
                  lily: 4,
                  tulip: 2,
                  lavender: 2,
                  density: 'ultra',
                  renderStyle: 'scanline',
                  bloomProgress: 1.0,
                }));
                setPaletteMode('reference');
                setCharDensity('scanline');
                setBloomValue(1.0);
              }}
              className="p-2.5 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-left transition-all text-white"
            >
              <div className="font-semibold text-white">Full Reference</div>
              <div className="text-[10px] text-[#777777] mt-0.5">Lilies, Sunflowers & Emerald</div>
            </button>

            <button
              onClick={() => {
                soundSynth.playBloom(1);
                setComp((prev) => ({
                  ...prev,
                  sunflower: 0,
                  daisy: 1,
                  lily: 4,
                  tulip: 2,
                  lavender: 2,
                  density: 'ultra',
                  renderStyle: 'fine',
                  bloomProgress: 1.0,
                }));
                setPaletteMode('emerald');
                setCharDensity('matrix');
                setBloomValue(1.0);
              }}
              className="p-2.5 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-left transition-all text-white"
            >
              <div className="font-semibold text-emerald-400">Emerald Starlight</div>
              <div className="text-[10px] text-[#777777] mt-0.5">Luminescent Stargazer (Img 1)</div>
            </button>

            <button
              onClick={() => {
                soundSynth.playBloom(2);
                setComp((prev) => ({
                  ...prev,
                  sunflower: 1,
                  daisy: 3,
                  lily: 3,
                  tulip: 1,
                  lavender: 2,
                  density: 'ultra',
                  renderStyle: 'fine',
                  bloomProgress: 1.0,
                }));
                setPaletteMode('monochrome');
                setCharDensity('fine');
                setBloomValue(1.0);
              }}
              className="p-2.5 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-left transition-all text-white"
            >
              <div className="font-semibold text-white">Silver Wireframe</div>
              <div className="text-[10px] text-[#777777] mt-0.5">Pure B&W Starlight (Img 2 & 3)</div>
            </button>

            <button
              onClick={() => {
                soundSynth.playBloom(3);
                setComp((prev) => ({
                  ...prev,
                  sunflower: 1,
                  daisy: 4,
                  lily: 2,
                  tulip: 2,
                  lavender: 3,
                  density: 'ultra',
                  renderStyle: 'scanline',
                  bloomProgress: 1.0,
                }));
                setPaletteMode('amber');
                setCharDensity('dense');
                setBloomValue(1.0);
              }}
              className="p-2.5 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-left transition-all text-white"
            >
              <div className="font-semibold text-amber-300">Golden Sunset</div>
              <div className="text-[10px] text-[#777777] mt-0.5">Warm Amber CRT Glow</div>
            </button>
          </div>
        </div>

        {/* Flower Composition Counters (Strictly No Roses) */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl">
          <div className="pb-2 mb-3 border-b border-[#1c1c1c]">
            <span className="text-[11px] tracking-wider uppercase text-[#888888]">
              Floral Elements
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Lilies */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#101010] border border-[#222222]">
              <div>
                <span className="text-white font-semibold">Stargazer Lilies</span>
                <span className="text-[10px] text-[#666666] block">Ruby, Violet & Pearlescent Star</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundSynth.playPluck();
                    setComp((p) => ({ ...p, lily: Math.max(0, p.lily - 1) }));
                  }}
                  className="w-6 h-6 rounded bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-5 text-center font-bold text-white">{comp.lily}</span>
                <button
                  onClick={() => {
                    soundSynth.playBloom(comp.lily);
                    setComp((p) => ({ ...p, lily: Math.min(6, p.lily + 1) }));
                  }}
                  className="w-6 h-6 rounded bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Sunflower */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#101010] border border-[#222222]">
              <div>
                <span className="text-white font-semibold">Radiant Sunflower</span>
                <span className="text-[10px] text-[#666666] block">Fibonacci Seed Centerpiece</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundSynth.playPluck();
                    setComp((p) => ({ ...p, sunflower: Math.max(0, p.sunflower - 1) }));
                  }}
                  className="w-6 h-6 rounded bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-5 text-center font-bold text-white">{comp.sunflower}</span>
                <button
                  onClick={() => {
                    soundSynth.playBloom(comp.sunflower);
                    setComp((p) => ({ ...p, sunflower: Math.min(2, p.sunflower + 1) }));
                  }}
                  className="w-6 h-6 rounded bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Tulips */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#101010] border border-[#222222]">
              <div>
                <span className="text-white font-semibold">Upright Tulips</span>
                <span className="text-[10px] text-[#666666] block">Flank Goblet Blooms</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundSynth.playPluck();
                    setComp((p) => ({ ...p, tulip: Math.max(0, p.tulip - 1) }));
                  }}
                  className="w-6 h-6 rounded bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-5 text-center font-bold text-white">{comp.tulip}</span>
                <button
                  onClick={() => {
                    soundSynth.playBloom(comp.tulip);
                    setComp((p) => ({ ...p, tulip: Math.min(4, p.tulip + 1) }));
                  }}
                  className="w-6 h-6 rounded bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Lavender */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#101010] border border-[#222222]">
              <div>
                <span className="text-white font-semibold">Lavender & Top Buds</span>
                <span className="text-[10px] text-[#666666] block">Slender Vertical Reaching Stalks</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundSynth.playPluck();
                    setComp((p) => ({ ...p, lavender: Math.max(0, p.lavender - 1) }));
                  }}
                  className="w-6 h-6 rounded bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-5 text-center font-bold text-white">{comp.lavender}</span>
                <button
                  onClick={() => {
                    soundSynth.playBloom(comp.lavender);
                    setComp((p) => ({ ...p, lavender: Math.min(4, p.lavender + 1) }));
                  }}
                  className="w-6 h-6 rounded bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rasterization Matrix & Texture Controls */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-3 text-xs">
          <div className="pb-2 border-b border-[#1c1c1c] flex items-center gap-1.5 text-[11px] text-[#888888] uppercase">
            <Sliders className="w-3.5 h-3.5 text-white" />
            <span>Pixel Density & Scanline Ramp</span>
          </div>

          <div>
            <label className="text-[#888888] block text-[11px] mb-1.5">Character Ramp Style:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'scanline', label: 'Scanline CRT (Ref)' },
                { id: 'matrix', label: 'Dot Matrix (Img 1)' },
                { id: 'fine', label: 'Ultra-Fine Micro' },
                { id: 'dense', label: 'Typography (Img 3)' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    setCharDensity(style.id as unknown as 'scanline' | 'fine' | 'matrix' | 'dense');
                    soundSynth.playSparkle();
                  }}
                  className={`p-2 rounded border text-left text-[11px] transition-all ${
                    charDensity === style.id
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-[#121212] border-[#222222] text-[#888888] hover:text-white'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette (Applied to ASCII only) */}
          <div>
            <label className="text-[#888888] block text-[11px] mb-1.5">ASCII Chromatic Mode:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'reference', label: 'Reference Vivid' },
                { id: 'emerald', label: 'Emerald Glow' },
                { id: 'monochrome', label: 'Silver Starlight' },
                { id: 'amber', label: 'Warm Amber' },
              ].map((pal) => (
                <button
                  key={pal.id}
                  onClick={() => {
                    setPaletteMode(pal.id as AsciiPaletteMode);
                    soundSynth.playSparkle();
                  }}
                  className={`p-2 rounded border text-left text-[11px] transition-all ${
                    paletteMode === pal.id
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-[#121212] border-[#222222] text-[#888888] hover:text-white'
                  }`}
                >
                  {pal.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Resolution Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-[#888888] mb-1">
              <span>Grid Columns:</span>
              <span className="text-white font-bold">{gridCols} chars</span>
            </div>
            <input
              type="range"
              min={120}
              max={220}
              step={10}
              value={gridCols}
              onChange={(e) => {
                const cols = parseInt(e.target.value);
                setGridCols(cols);
                setGridRows(Math.floor(cols * 0.56));
              }}
              className="w-full accent-white bg-[#222222]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[#888888] text-[11px]">Bioluminescent Bloom Glow:</span>
            <button
              onClick={() => setGlow(!glow)}
              className={`px-2 py-0.5 rounded text-[11px] border font-mono ${
                glow ? 'bg-white text-black border-white font-semibold' : 'bg-[#121212] text-[#666666] border-[#222222]'
              }`}
            >
              {glow ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Celebrate button */}
        <button
          onClick={handleCelebrate}
          className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Celebrate Sreeparna's Bouquet 💐</span>
        </button>
      </div>

      {/* Right Canvas: Realistic High-Density ASCII Display */}
      <div className="lg:col-span-8 space-y-4">
        {!audioUnlocked && (
          <button
            onClick={() => {
              soundSynth.initCtx().then(() => {
                setAudioUnlocked(true);
                triggerBloomAnimation();
              });
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-400/40 text-amber-200 text-xs font-mono flex items-center justify-center gap-2 shadow-lg animate-pulse hover:bg-white/10 transition-all cursor-pointer"
          >
            <span>🎵</span>
            <span className="font-bold">Click anywhere or tap here to bloom with music & celebration sound</span>
            <span>✨</span>
          </button>
        )}

        <RealisticAsciiViewer
          asciiData={asciiData}
          paletteMode={paletteMode}
          title="SREEPARNA'S BOTANICAL SPECIMEN [BOUQUET]"
          glow={glow}
          onCanvasClick={toggleBloomAnimation}
          actionHint="Click bouquet to bloom with sound ✨"
        />

        {/* Dedication Info Strip */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-3 text-xs text-[#888888] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="text-white font-semibold">Bouquet Architecture:</span>
            <span>Ruby Stargazer Lily • Pearlescent Lily • Golden Sunflower • Emerald Stem Spray</span>
          </div>
          <span className="text-[11px] text-[#666666] border border-[#222222] px-2 py-0.5 rounded">
            Handcrafted for Sreeparna • 2026
          </span>
        </div>
      </div>
    </div>
  );
};
