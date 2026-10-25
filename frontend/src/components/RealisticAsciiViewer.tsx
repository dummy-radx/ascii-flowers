import React, { useRef, useEffect, useState } from 'react';
import { Download, ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';
import type { AsciiGridResult, AsciiPaletteMode } from '../utils/asciiEngine';
import { soundSynth } from '../utils/audio';

interface RealisticAsciiViewerProps {
  asciiData: AsciiGridResult | null;
  paletteMode: AsciiPaletteMode;
  title?: string;
  glow?: boolean;
  onCanvasClick?: () => void;
  actionHint?: string;
}

export const RealisticAsciiViewer: React.FC<RealisticAsciiViewerProps> = ({
  asciiData,
  paletteMode,
  title,
  glow = true,
  onCanvasClick,
  actionHint,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);

  // Render high-density ASCII characters onto the canvas with pixel precision
  useEffect(() => {
    if (!asciiData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Character cell dimensions (aspect ratio ~ 0.55 for monospace) - enlarged for crisp, large visibility
    const cellW = 7.2 * zoom;
    const cellH = 12.6 * zoom;

    canvas.width = Math.floor(asciiData.width * cellW);
    canvas.height = Math.floor(asciiData.height * cellH);

    // Pure pitch-black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingEnabled = true;
    const fontSize = Math.max(11, Math.round(11.8 * zoom));
    ctx.font = `bold ${fontSize}px "JetBrains Mono", "Space Mono", monospace`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    const grid = asciiData.grid;
    const isMonochrome = paletteMode === 'monochrome';

    const hasStampedOverlays = Boolean(asciiData.stampedOverlays && asciiData.stampedOverlays.length > 0);

    for (let y = 0; y < asciiData.height; y++) {
      const row = grid[y];
      if (!row) continue;
      const posY = y * cellH;

      for (let x = 0; x < asciiData.width; x++) {
        const cell = row[x];
        if (!cell || cell.char === ' ' || cell.brightness < 0.05) continue;
        if (hasStampedOverlays && cell.isOverlay) continue;

        const posX = x * cellW;
        const colorStr = `rgb(${cell.r}, ${cell.g}, ${cell.b})`;

        ctx.fillStyle = colorStr;
        if (glow && !isMonochrome) {
          ctx.shadowColor = colorStr;
          // Alphanumeric text & symbols get subtle sharp glow, scanlines get rich bloom
          const isTextGlyph = /[a-zA-Z0-9✦♥✨•+*]/.test(cell.char);
          ctx.shadowBlur = isTextGlyph ? 2 * zoom : 6 * zoom;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillText(cell.char, posX, posY);
      }
    }

    // Render prominent, large glowing ASCII typography overlays (e.g. ✦ MY SWEETEST SUNSHINE ✦)
    if (hasStampedOverlays && asciiData.stampedOverlays) {
      for (const ov of asciiData.stampedOverlays) {
        if (!ov.text) continue;

        const posX = ov.gridX * cellW;
        const posY = ov.gridY * cellH + cellH / 2;

        // Substantially bigger typography!
        // Main title (e.g. ✦ MY SWEETEST SUNSHINE ✦): 23px * zoom
        // Subtitle (e.g. ♥ Forever Blooming in Starlight ♥): 16.5px * zoom
        // General text: 14.5px * zoom
        const overlayFontSize = ov.isTitle
          ? Math.max(16, Math.round(23 * zoom))
          : ov.isSubtitle
          ? Math.max(13, Math.round(16.5 * zoom))
          : Math.max(11, Math.round(14.5 * zoom));

        ctx.font = `bold ${overlayFontSize}px "JetBrains Mono", "Space Mono", monospace`;
        ctx.textAlign = ov.align || 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = ov.colorStr;

        if (glow && !isMonochrome) {
          ctx.shadowColor = ov.colorStr;
          ctx.shadowBlur = ov.isTitle ? 14 * zoom : 8 * zoom;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillText(ov.text, posX, posY);
      }
    }
  }, [asciiData, paletteMode, glow, zoom]);


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

        {/* Zoom & Export Controls */}
        <div className="flex items-center gap-1.5">
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

          <button
            onClick={handleDownloadPng}
            className="px-2.5 py-1 bg-[#141414] hover:bg-[#202020] border border-[#262626] text-white rounded-md flex items-center gap-1 text-[11px] transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>PNG</span>
          </button>
        </div>
      </div>

      {/* Main Pitch-Black Canvas Container */}
      <div
        onClick={onCanvasClick}
        className={`relative bg-[#000000] p-4 sm:p-6 flex items-center justify-center overflow-auto min-h-[500px] ${
          onCanvasClick ? 'cursor-pointer group' : ''
        }`}
      >
        <canvas
          ref={canvasRef}
          className={`max-w-full h-auto shadow-2xl block select-none ${
            onCanvasClick
              ? 'cursor-pointer group-hover:brightness-110 transition-all'
              : 'cursor-grab active:cursor-grabbing'
          }`}
          style={{ imageRendering: 'pixelated' }}
        />

        {actionHint && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#121212]/90 border border-white/20 text-white text-xs font-mono pointer-events-none shadow-2xl flex items-center gap-2 backdrop-blur-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{actionHint}</span>
          </div>
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
