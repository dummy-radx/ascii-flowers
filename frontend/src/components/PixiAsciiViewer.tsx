import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Download, Sliders, Wind, Sparkles, Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { PixiBotanicalEngine, type PixiPalette, type PixiBouquetConfig } from '../utils/pixiBotanical';
import { soundSynth } from '../utils/audio';

export interface PixiViewerHandle {
  renderBouquet: (config: PixiBouquetConfig) => void;
  renderGift: (gift: 'teddy' | 'chocolates' | 'locket') => void;
  setFilterOptions: (size: number, palette: PixiPalette, enabled: boolean) => void;
}

interface PixiAsciiViewerProps {
  title?: string;
  palette: PixiPalette;
  onPaletteChange?: (palette: PixiPalette) => void;
}

export const PixiAsciiViewer = forwardRef<PixiViewerHandle, PixiAsciiViewerProps>(({
  title = 'PIXI.JS VECTOR BOTANICAL • ASCII FILTER',
  palette,
  onPaletteChange,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PixiBotanicalEngine | null>(null);

  const [filterEnabled, setFilterEnabled] = useState(true);
  const [asciiSize, setAsciiSize] = useState(6);
  const [swayEnabled, setSwayEnabled] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isReady, setIsReady] = useState(false);

  // Initialize Pixi Engine
  useEffect(() => {
    let isMounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new PixiBotanicalEngine();
    engineRef.current = engine;

    engine.init(canvas, 600, 700).then(() => {
      if (!isMounted) {
        engine.destroy();
        return;
      }
      engine.setFilterOptions(asciiSize, palette, filterEnabled);
      setIsReady(true);
    }).catch(() => {});

    return () => {
      isMounted = false;
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // Update filter options
  useEffect(() => {
    if (engineRef.current && isReady) {
      engineRef.current.setFilterOptions(asciiSize, palette, filterEnabled);
    }
  }, [asciiSize, palette, filterEnabled, isReady]);

  // Expose imperative handle to parent
  useImperativeHandle(ref, () => ({
    renderBouquet: (config: PixiBouquetConfig) => {
      if (engineRef.current && isReady) {
        engineRef.current.renderBouquet({ ...config, sway: swayEnabled });
      }
    },
    renderGift: (gift: 'teddy' | 'chocolates' | 'locket') => {
      if (engineRef.current && isReady) {
        engineRef.current.renderGift(gift);
      }
    },
    setFilterOptions: (size: number, pal: PixiPalette, enabled: boolean) => {
      setAsciiSize(size);
      if (onPaletteChange) onPaletteChange(pal);
      setFilterEnabled(enabled);
      if (engineRef.current && isReady) {
        engineRef.current.setFilterOptions(size, pal, enabled);
      }
    },
  }), [isReady, swayEnabled, onPaletteChange]);

  const handleDownloadPng = async () => {
    if (!engineRef.current) return;
    soundSynth.playSparkle();
    const app = engineRef.current.app;
    const extractedCanvas = app.renderer.extract.canvas(app.stage) as HTMLCanvasElement;
    if (extractedCanvas && typeof extractedCanvas.toDataURL === 'function') {
      const link = document.createElement('a');
      link.download = `sreeparna-pixi-ascii-${Date.now()}.png`;
      link.href = extractedCanvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="bg-[#050505] border border-[#222222] rounded-xl overflow-hidden flex flex-col shadow-2xl font-mono text-xs">
      {/* Top Minimal Toolbar */}
      <div className="bg-[#0a0a0a] border-b border-[#222222] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-medium tracking-wide">
            {title}
          </span>
          <span className="text-[#666666] text-[10px] border border-[#222222] px-1.5 py-0.5 rounded">
            WebGL 60FPS
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* AsciiFilter Toggle */}
          <button
            onClick={() => {
              soundSynth.playSparkle();
              setFilterEnabled(!filterEnabled);
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all flex items-center gap-1.5 ${
              filterEnabled
                ? 'bg-white text-black border-white'
                : 'bg-[#141414] text-[#888888] border-[#262626] hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>AsciiFilter: {filterEnabled ? 'ON' : 'RAW VECTORS'}</span>
          </button>

          {/* Sway Physics Toggle */}
          <button
            onClick={() => setSwayEnabled(!swayEnabled)}
            className={`p-1.5 rounded border transition-all ${
              swayEnabled
                ? 'bg-[#161616] border-white text-white'
                : 'bg-[#101010] border-[#222222] text-[#666666]'
            }`}
            title="Toggle Organic Wind Sway"
          >
            <Wind className="w-3.5 h-3.5" />
          </button>

          {/* Zoom */}
          <div className="flex items-center bg-[#141414] border border-[#262626] rounded p-0.5 text-[#888888]">
            <button
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
              className="p-1 hover:text-white"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] px-1 text-white">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
              className="p-1 hover:text-white"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 hover:text-white"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Download PNG */}
          <button
            onClick={handleDownloadPng}
            className="px-2.5 py-1 bg-[#141414] hover:bg-[#202020] border border-[#262626] text-white rounded flex items-center gap-1 text-[11px] transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>PNG</span>
          </button>
        </div>
      </div>

      {/* Main Pixi WebGL Canvas */}
      <div className="relative bg-[#000000] p-4 sm:p-6 flex items-center justify-center overflow-auto min-h-[540px]">
        <canvas
          ref={canvasRef}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          className="shadow-2xl rounded-lg cursor-grab active:cursor-grabbing transition-transform"
        />
      </div>

      {/* Bottom Pixi Ascii Filter Parameters Toolbar */}
      <div className="bg-[#080808] border-t border-[#1c1c1c] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#888888]">
        {/* Character Block Size Slider */}
        <div className="flex items-center gap-2">
          <Sliders className="w-3 h-3 text-white" />
          <span>AsciiFilter Size:</span>
          <div className="flex items-center gap-1">
            {[4, 6, 8, 10, 12].map((sz) => (
              <button
                key={sz}
                onClick={() => {
                  soundSynth.playSparkle();
                  setAsciiSize(sz);
                }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  asciiSize === sz
                    ? 'bg-white text-black'
                    : 'bg-[#141414] text-[#888888] hover:text-white'
                }`}
              >
                {sz}px
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-white" />
          <span>PixiJS v8 Hardware Shader Filter Active</span>
        </div>
      </div>
    </div>
  );
});
