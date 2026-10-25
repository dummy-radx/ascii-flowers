import React, { useState, useEffect, useMemo } from 'react';
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
      renderer.drawLily(cx, cy, 1.25, 0, '#ffffff', '#94a3b8', '#facc15', true);
    } else if (selectedFlower === 'sunflower') {
      renderer.drawSunflower(cx, cy + 20, 1.15);
    } else if (selectedFlower === 'tulip') {
      renderer.drawTulip(cx, cy + 50, 1.2);
    } else if (selectedFlower === 'daisy') {
      renderer.drawDaisy(cx, cy + 30, 1.2);
    } else if (selectedFlower === 'lavender') {
      renderer.drawLavender(cx, cy + 80, 1.3);
    }

    const result = rasterizeBouquet(renderer.getCanvas(), {
      width: gridCols,
      height: gridRows,
      paletteMode,
      charDensity,
      glowIntensity: glow ? 0.9 : 0,
    });
    setAsciiData(result);
  }, [selectedFlower, paletteMode, charDensity, gridCols, gridRows, glow, renderer]);

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Specimen Selector */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl">
          <div className="pb-2 mb-3 border-b border-[#1c1c1c]">
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#888888]">
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
                    soundSynth.playBloom(2);
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
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl font-mono text-xs space-y-3">
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
        <div className="bg-[#080808] border border-[#222222] rounded-xl p-4 shadow-xl font-mono text-xs space-y-3">
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
        />
      </div>
    </div>
  );
};
