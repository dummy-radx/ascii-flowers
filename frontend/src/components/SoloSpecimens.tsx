import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw } from 'lucide-react';
import {
  BotanicalCanvasRenderer,
  rasterizeBouquet,
  type AsciiPaletteMode,
  type AsciiGridResult,
} from '../utils/asciiEngine';
import { RealisticAsciiViewer } from './RealisticAsciiViewer';
import { soundSynth } from '../utils/audio';

type SoloFlower = 'lily' | 'sunflower' | 'tulip' | 'daisy' | 'lavender';

export const SoloSpecimens: React.FC = () => {
  const [selectedFlower, setSelectedFlower] = useState<SoloFlower>('lily');
  const [paletteMode, setPaletteMode] = useState<AsciiPaletteMode>('emerald');
  const [charDensity, setCharDensity] = useState<'scanline' | 'fine' | 'matrix' | 'dense'>('matrix');
  const [bloomValue, setBloomValue] = useState<number>(0.05);
  const [isBlooming, setIsBlooming] = useState<boolean>(true);
  const animationFrameRef = useRef<number | null>(null);

  const gridCols = 150;
  const gridRows = 85;
  const glow = true;
  const [asciiData, setAsciiData] = useState<AsciiGridResult | null>(null);

  const renderer = useMemo(() => new BotanicalCanvasRenderer(480, 560), []);

  useEffect(() => {
    renderer.clear();
    const cx = 240;
    const cy = 230;

    if (selectedFlower === 'lily') {
      renderer.drawLily(cx, cy, 1.25, 0, '#ffffff', '#94a3b8', '#facc15', true, bloomValue);
      renderer.addTextOverlay({
        text: '✦ BOTANICAL SPECIMEN: STARGAZER LILY ✦',
        canvasX: cx,
        canvasY: 38,
        color: '#fef08a',
        align: 'center',
      });
      renderer.addTextOverlay({
        text: '♥ Fragrance of Devotion & Starlight for Sreeparna ♥',
        canvasX: cx,
        canvasY: 64,
        color: '#f472b6',
        align: 'center',
      });
    } else if (selectedFlower === 'sunflower') {
      renderer.drawSunflower(cx, cy + 20, 1.15, bloomValue);
      renderer.addTextOverlay({
        text: '✦ BOTANICAL SPECIMEN: RADIANT SUNFLOWER ✦',
        canvasX: cx,
        canvasY: 38,
        color: '#fef08a',
        align: 'center',
      });
      renderer.addTextOverlay({
        text: '♥ Warmth, Loyalty & Pure Sunshine for Sreeparna ♥',
        canvasX: cx,
        canvasY: 64,
        color: '#fbbf24',
        align: 'center',
      });
    } else if (selectedFlower === 'tulip') {
      renderer.drawTulip(cx, cy + 50, 1.2, '#fef08a', 140, bloomValue);
      renderer.addTextOverlay({
        text: '✦ BOTANICAL SPECIMEN: ROYAL TULIP ✦',
        canvasX: cx,
        canvasY: 38,
        color: '#fef08a',
        align: 'center',
      });
      renderer.addTextOverlay({
        text: '♥ Grace, Rebirth & Deep Affection for Sreeparna ♥',
        canvasX: cx,
        canvasY: 64,
        color: '#fb7185',
        align: 'center',
      });
    } else if (selectedFlower === 'daisy') {
      renderer.drawDaisy(cx, cy + 30, 1.2, bloomValue);
      renderer.addTextOverlay({
        text: '✦ BOTANICAL SPECIMEN: MEADOW DAISY ✦',
        canvasX: cx,
        canvasY: 38,
        color: '#fef08a',
        align: 'center',
      });
      renderer.addTextOverlay({
        text: '♥ Innocence, True Love & Cheerful Radiance ♥',
        canvasX: cx,
        canvasY: 64,
        color: '#38bdf8',
        align: 'center',
      });
    } else if (selectedFlower === 'lavender') {
      renderer.drawLavender(cx, cy + 80, 1.3, '#c084fc', 160, bloomValue);
      renderer.addTextOverlay({
        text: '✦ BOTANICAL SPECIMEN: FRENCH LAVENDER ✦',
        canvasX: cx,
        canvasY: 38,
        color: '#fef08a',
        align: 'center',
      });
      renderer.addTextOverlay({
        text: '♥ Calm Serenity & Eternal Devotion for Sreeparna ♥',
        canvasX: cx,
        canvasY: 64,
        color: '#c084fc',
        align: 'center',
      });
    }

    const result = rasterizeBouquet(
      renderer.getCanvas(),
      {
        width: gridCols,
        height: gridRows,
        paletteMode,
        charDensity,
        glowIntensity: glow ? 0.9 : 0,
      },
      renderer.getTextOverlays()
    );
    setAsciiData(result);
  }, [selectedFlower, paletteMode, charDensity, bloomValue, gridCols, gridRows, glow, renderer]);

  // Bloom animation loop with rich pentatonic chimes & celebration
  const triggerBloomAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setIsBlooming(true);
    setBloomValue(0.05);
    try {
      soundSynth.playBloom(0);
    } catch {}

    let progress = 0.05;
    const startTime = performance.now();
    const duration = 2600;
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
          particleCount: 65,
          spread: 60,
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

  // Automatically trigger bloom animation on load / first time opening
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

  const specimens = [
    {
      id: 'lily',
      name: 'Stargazer Lily',
      refNote: 'Directly reproduces Image 1 (Emerald) & Image 3 (Silver)',
      desc: '6 flared recurved tepals, arched stamens, glossy lanceolate leaves, and falling stardust particles.',
      recommendedPalette: 'emerald',
      recommendedDensity: 'matrix',
    },
    {
      id: 'sunflower',
      name: 'Radiant Sunflower',
      refNote: 'Directly reproduces Image 4 (Close-up Scanline Micro-Typography)',
      desc: 'Dense Fibonacci phyllotaxis disc (137.5° golden spiral) with radiating elongated ray petals.',
      recommendedPalette: 'amber',
      recommendedDensity: 'fine',
    },
    {
      id: 'tulip',
      name: 'Wireframe Tulip',
      refNote: 'Directly reproduces Image 2 (Translucent 3D Point-Cloud Curve)',
      desc: 'Curved translucent goblet cup formed of delicate starlight ASCII points.',
      recommendedPalette: 'monochrome',
      recommendedDensity: 'fine',
    },
    {
      id: 'daisy',
      name: 'Gentle Daisy',
      refNote: 'Pure meadow classic',
      desc: 'Slender radiating petals surrounding a sunny stippled disk core.',
      recommendedPalette: 'reference',
      recommendedDensity: 'matrix',
    },
    {
      id: 'lavender',
      name: 'Fragrant Lavender',
      refNote: 'Slender aromatic florets',
      desc: 'Upright spike of clustered verticillasters whispering sweet dreams.',
      recommendedPalette: 'amethyst',
      recommendedDensity: 'scanline',
    },
  ];

  const currentSpecimen = specimens.find((s) => s.id === selectedFlower) || specimens[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
      {/* Left Specimen Selector */}
      <div className="lg:col-span-4 space-y-4">
        {/* Bloom Controller */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1c1c1c]">
            <span className="text-[11px] tracking-wider uppercase text-white font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Bloom Animation</span>
            </span>
            <span className="text-[10px] text-[#888888]">
              {Math.round(bloomValue * 100)}%
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
              <span>{isBlooming ? 'Blooming...' : 'Watch Bloom Unfurl ✨'}</span>
            </button>
            <button
              onClick={() => {
                soundSynth.playSparkle();
                setBloomValue(1.0);
              }}
              className="p-2 rounded-lg bg-[#141414] hover:bg-[#202020] text-white border border-[#262626]"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
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

        {/* Specimen Picker */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl">
          <div className="pb-2 mb-3 border-b border-[#1c1c1c]">
            <span className="text-[11px] tracking-wider uppercase text-[#888888]">
              Botanical Specimens
            </span>
          </div>

          <div className="space-y-2">
            {specimens.map((item) => {
              const isSelected = selectedFlower === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedFlower(item.id as SoloFlower);
                    setPaletteMode(item.recommendedPalette as AsciiPaletteMode);
                    setCharDensity(item.recommendedDensity as unknown as 'scanline' | 'fine' | 'matrix' | 'dense');
                    triggerBloomAnimation();
                  }}
                  className={`w-full p-3 rounded-lg border text-left font-mono transition-all ${
                    isSelected
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-[#101010] border-[#222222] text-[#888888] hover:text-white hover:bg-[#161616]'
                  }`}
                >
                  <div className="text-xs font-semibold flex items-center justify-between">
                    <span>{item.name}</span>
                    {isSelected && <span className="text-[10px] uppercase font-bold">ACTIVE</span>}
                  </div>
                  <div
                    className={`text-[10px] mt-1 line-clamp-1 ${
                      isSelected ? 'text-black/70' : 'text-[#666666]'
                    }`}
                  >
                    {item.refNote}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Specimen Notes & Anatomy */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-3 text-xs">
          <div className="pb-2 border-b border-[#1c1c1c] text-[11px] text-[#888888] uppercase">
            Specimen Anatomy & Details
          </div>
          <p className="text-white leading-relaxed text-xs">
            "{currentSpecimen.desc}"
          </p>
          <div className="text-[11px] text-[#666666] pt-1 border-t border-[#1a1a1a]">
            {currentSpecimen.refNote}
          </div>
        </div>

        {/* Shading & Matrix Options */}
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl space-y-3 text-xs">
          <div className="pb-2 border-b border-[#1c1c1c] text-[11px] text-[#888888] uppercase">
            Chromatic Mode (ASCII Only)
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {[
              { id: 'emerald', label: 'Emerald Glow (Img 1)' },
              { id: 'monochrome', label: 'Silver Wireframe (Img 2)' },
              { id: 'amber', label: 'Amber Gold (Img 4)' },
              { id: 'reference', label: 'Reference Natural' },
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
          title={`BOTANICAL SPECIMEN: ${currentSpecimen.name.toUpperCase()}`}
          glow={glow}
          onCanvasClick={toggleBloomAnimation}
          actionHint="Click flower to bloom with sound ✨"
        />
      </div>
    </div>
  );
};
