import React, { useRef, useEffect, useState } from 'react';
import { Copy, Check, Download, ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';
import type { AsciiGridResult, AsciiPaletteMode } from '../utils/asciiEngine';
import { soundSynth } from '../utils/audio';

interface RealisticAsciiViewerProps {
  asciiData: AsciiGridResult | null;
  paletteMode: AsciiPaletteMode;
  title?: string;
  glow?: boolean;
}

export const RealisticAsciiViewer: React.FC<RealisticAsciiViewerProps> = ({
  asciiData,
  paletteMode,
  title,
  glow = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState<'canvas' | 'text'>('canvas');
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Render high-density ASCII characters onto the canvas with pixel precision
  useEffect(() => {
    if (!asciiData || !canvasRef.current || viewMode !== 'canvas') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Character cell dimensions (aspect ratio ~ 0.55 for monospace)
    const cellW = 5.2 * zoom;
    const cellH = 9.2 * zoom;

    canvas.width = Math.floor(asciiData.width * cellW);
    canvas.height = Math.floor(asciiData.height * cellH);

    // Pure pitch-black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `bold ${Math.floor(8.5 * zoom)}px "JetBrains Mono", "Space Mono", monospace`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    const grid = asciiData.grid;

    // First pass: optional soft bloom glow
    if (glow && paletteMode !== 'monochrome') {
      ctx.shadowBlur = 6 * zoom;
    } else {
      ctx.shadowBlur = 0;
    }

    for (let y = 0; y < asciiData.height; y++) {
      const row = grid[y];
      if (!row) continue;
      const posY = y * cellH;

      for (let x = 0; x < asciiData.width; x++) {
        const cell = row[x];
        if (!cell || cell.char === ' ' || cell.brightness < 0.05) continue;

        const posX = x * cellW;
        const colorStr = `rgb(${cell.r}, ${cell.g}, ${cell.b})`;

        ctx.fillStyle = colorStr;
        if (glow) {
          ctx.shadowColor = colorStr;
        }

        ctx.fillText(cell.char, posX, posY);
      }
    }
  }, [asciiData, paletteMode, glow, zoom, viewMode]);

  const handleCopyText = () => {
    if (!asciiData) return;
    soundSynth.playSparkle();
    navigator.clipboard.writeText(asciiData.plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    soundSynth.playSparkle();
    const link = document.createElement('a');
    link.download = `sreeparna-ascii-flower-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-[#050505] border border-[#222222] rounded-xl overflow-hidden flex flex-col shadow-2xl">
      {/* Top Minimal Toolbar (Pure Monochrome B&W) */}
      <div className="bg-[#0a0a0a] border-b border-[#222222] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-white font-medium tracking-wide">
            {title || 'HIGH-RESOLUTION ASCII RASTER'}
          </span>
          {asciiData && (
            <span className="text-[#666666] text-[11px] ml-1">
              [{asciiData.width}×{asciiData.height} char grid]
            </span>
          )}
        </div>

        {/* View Mode & Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <div className="bg-[#141414] border border-[#262626] rounded-md p-0.5 flex items-center">
            <button
              onClick={() => setViewMode('canvas')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                viewMode === 'canvas'
                  ? 'bg-white text-black font-semibold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Dot Matrix
            </button>
            <button
              onClick={() => setViewMode('text')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                viewMode === 'text'
                  ? 'bg-white text-black font-semibold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Raw Typography
            </button>
          </div>

          {viewMode === 'canvas' && (
            <div className="flex items-center bg-[#141414] border border-[#262626] rounded-md p-0.5 text-[#888888]">
              <button
                onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
                className="p-1 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] px-1 text-white font-mono">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
                className="p-1 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1 hover:text-white"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={handleCopyText}
            className="px-2.5 py-1 bg-[#141414] hover:bg-[#202020] border border-[#262626] text-white rounded-md flex items-center gap-1 text-[11px] transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {viewMode === 'canvas' && (
            <button
              onClick={handleDownloadPng}
              className="px-2.5 py-1 bg-[#141414] hover:bg-[#202020] border border-[#262626] text-white rounded-md flex items-center gap-1 text-[11px] transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>PNG</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Pitch-Black Canvas Container */}
      <div className="relative bg-[#000000] p-4 sm:p-6 flex items-center justify-center overflow-auto min-h-[500px]">
        {viewMode === 'canvas' ? (
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto shadow-2xl block select-none cursor-grab active:cursor-grabbing"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <pre
            className="text-[6.5px] sm:text-[7.5px] leading-[8px] font-mono text-white select-all overflow-x-auto whitespace-pre tracking-tight"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              color:
                paletteMode === 'emerald'
                  ? '#34d399'
                  : paletteMode === 'amber'
                  ? '#fbbf24'
                  : paletteMode === 'amethyst'
                  ? '#c084fc'
                  : '#ffffff',
            }}
          >
            {asciiData?.plainText}
          </pre>
        )}
      </div>

      {/* Minimal Footer Info */}
      <div className="bg-[#080808] border-t border-[#1a1a1a] px-4 py-2 flex items-center justify-between text-[11px] font-mono text-[#666666]">
        <span>Botanical ASCII Engine • Built for Sreeparna</span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-white" />
          <span>Real-time Rasterization</span>
        </span>
      </div>
    </div>
  );
};
