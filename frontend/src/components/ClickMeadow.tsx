import React, { useState, useRef, useEffect, type MouseEvent } from 'react';
import { Trash2, Wand2, Flower } from 'lucide-react';
import { soundSynth } from '../utils/audio';

interface PlantedItem {
  id: string;
  type: string;
  x: number;
  y: number;
  symbol: string;
  ascii: string[];
  color: string;
  name: string;
  scale: number;
  rotation: number;
}

const MINI_ASCII_BLOOMS = [
  {
    type: 'sunflower',
    name: 'Mini Sunflower',
    symbol: '🌻',
    color: '#fbbf24',
    ascii: [
      '<sunflower> (\\_/) </sunflower>',
      '<sunflower>(<sunseed>(#)</sunseed>)</sunflower>',
      '<stem>  |  </stem>',
      '<leaf> \\|/ </leaf>',
      '<stem>  |  </stem>',
    ],
  },
  {
    type: 'daisy',
    name: 'Mini Daisy',
    symbol: '🌼',
    color: '#f8fafc',
    ascii: [
      '<white> .-. </white>',
      '<white>(<daisyCenter>*</daisyCenter>)</white>',
      '<white> `-\' </white>',
      '<stem>  |  </stem>',
      '<leaf> -|- </leaf>',
      '<stem>  |  </stem>',
    ],
  },
  {
    type: 'lily',
    name: 'Mini Stargazer Lily',
    symbol: '🌸',
    color: '#f472b6',
    ascii: [
      '<lilyPetal>  /\\  </lilyPetal>',
      '<lilyPetal> /<lilyDeep>\\/</lilyDeep>\\ </lilyPetal>',
      '<lilyDeep> (i) </lilyDeep>',
      '<stem>  || </stem>',
      '<leaf> /||\\</leaf>',
      '<stem>  || </stem>',
    ],
  },
  {
    type: 'tulip',
    name: 'Mini Tulip',
    symbol: '🌷',
    color: '#fb923c',
    ascii: [
      '<tulipPeach>  (\\_/) </tulipPeach>',
      '<tulipPink>  ( | ) </tulipPink>',
      '<tulipPeach>   `-\'  </tulipPeach>',
      '<stem>    |   </stem>',
      '<leaf>   /|\\  </leaf>',
      '<stem>    |   </stem>',
    ],
  },
  {
    type: 'lavender',
    name: 'Mini Lavender',
    symbol: '🪻',
    color: '#c084fc',
    ascii: [
      '<lavender>  ()  </lavender>',
      '<lavenderDeep> (()) </lavenderDeep>',
      '<lavender> (()) </lavender>',
      '<stem>  ||  </stem>',
      '<leaf> //\\\\ </leaf>',
      '<stem>  ||  </stem>',
    ],
  },
  {
    type: 'butterfly',
    name: 'Starlight Butterfly',
    symbol: '🦋',
    color: '#e879f9',
    ascii: [
      '<blush>ƸӜƷ</blush>',
      '<sparkle> * </sparkle>',
    ],
  },
  {
    type: 'bunny',
    name: 'Little Meadow Bunny',
    symbol: '🐰',
    color: '#e0f2fe',
    ascii: [
      '<bunnyFur>(\\_/)</bunnyFur>',
      '<bunnyFur>(•.•)</bunnyFur>',
      '<bunnyFur>c(")(")</bunnyFur>',
    ],
  },
  {
    type: 'heart',
    name: 'Sprouting Love Heart',
    symbol: '💖',
    color: '#fb7185',
    ascii: [
      '<heart> /\\ /\\ </heart>',
      '<heart> \\ V / </heart>',
      '<heart>  \\_/  </heart>',
      '<stem>   |   </stem>',
      '<leaf>  \\|/  </leaf>',
    ],
  },
];

export const ClickMeadow: React.FC = () => {
  const [items, setItems] = useState<PlantedItem[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('random');
  const [mouseTrail, setMouseTrail] = useState<{ x: number; y: number; char: string; id: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial seed flowers for Sreeparna
  useEffect(() => {
    const initialItems: PlantedItem[] = [
      {
        id: 'init-1',
        type: 'sunflower',
        name: 'Mini Sunflower',
        symbol: '🌻',
        color: '#fbbf24',
        x: 18,
        y: 55,
        scale: 1,
        rotation: 0,
        ascii: MINI_ASCII_BLOOMS[0].ascii,
      },
      {
        id: 'init-2',
        type: 'daisy',
        name: 'Mini Daisy',
        symbol: '🌼',
        color: '#f8fafc',
        x: 35,
        y: 62,
        scale: 1,
        rotation: 0,
        ascii: MINI_ASCII_BLOOMS[1].ascii,
      },
      {
        id: 'init-3',
        type: 'lily',
        name: 'Mini Stargazer Lily',
        symbol: '🌸',
        color: '#f472b6',
        x: 52,
        y: 52,
        scale: 1,
        rotation: 0,
        ascii: MINI_ASCII_BLOOMS[2].ascii,
      },
      {
        id: 'init-4',
        type: 'lavender',
        name: 'Mini Lavender',
        symbol: '🪻',
        color: '#c084fc',
        x: 68,
        y: 60,
        scale: 1,
        rotation: 0,
        ascii: MINI_ASCII_BLOOMS[4].ascii,
      },
      {
        id: 'init-5',
        type: 'bunny',
        name: 'Little Meadow Bunny',
        symbol: '🐰',
        color: '#e0f2fe',
        x: 82,
        y: 68,
        scale: 1,
        rotation: 0,
        ascii: MINI_ASCII_BLOOMS[6].ascii,
      },
    ];
    setItems(initialItems);
  }, []);

  const handleCanvasClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(10, Math.min(85, ((e.clientY - rect.top) / rect.height) * 100));

    let chosenTemplate = MINI_ASCII_BLOOMS[0];
    if (selectedTool === 'random') {
      chosenTemplate = MINI_ASCII_BLOOMS[Math.floor(Math.random() * MINI_ASCII_BLOOMS.length)];
    } else {
      const found = MINI_ASCII_BLOOMS.find((b) => b.type === selectedTool);
      if (found) chosenTemplate = found;
    }

    soundSynth.playBloom(items.length % 6);

    const newItem: PlantedItem = {
      id: `planted-${Date.now()}-${Math.random()}`,
      type: chosenTemplate.type,
      name: chosenTemplate.name,
      symbol: chosenTemplate.symbol,
      color: chosenTemplate.color,
      x: xPct,
      y: yPct,
      scale: 0.9 + Math.random() * 0.25,
      rotation: (Math.random() - 0.5) * 6,
      ascii: chosenTemplate.ascii,
    };

    setItems((prev) => [...prev, newItem]);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const chars = ['✦', '°', '·', '❀', '♥', '✧'];
    const randomChar = chars[Math.floor(Math.random() * chars.length)];

    const id = Date.now() + Math.random();
    setMouseTrail((prev) => [...prev.slice(-12), { x, y, char: randomChar, id }]);
  };

  const handleBloomEntireMeadow = () => {
    soundSynth.playCelebration();
    const newItems: PlantedItem[] = [];
    for (let i = 0; i < 24; i++) {
      const template = MINI_ASCII_BLOOMS[Math.floor(Math.random() * MINI_ASCII_BLOOMS.length)];
      newItems.push({
        id: `wave-${Date.now()}-${i}`,
        type: template.type,
        name: template.name,
        symbol: template.symbol,
        color: template.color,
        x: 6 + Math.random() * 88,
        y: 20 + Math.random() * 65,
        scale: 0.85 + Math.random() * 0.3,
        rotation: (Math.random() - 0.5) * 8,
        ascii: template.ascii,
      });
    }
    setItems((prev) => [...prev, ...newItems]);
  };

  const handleClearMeadow = () => {
    soundSynth.playPluck();
    setItems([]);
  };

  // Sky themes
  return (
    <div className="space-y-4 font-mono">
      {/* Top Controls Toolbar (Pure Minimalist B&W) */}
      <div className="bg-[#080808] border border-[#222222] rounded-xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Flower Selection Tools */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[#888888] font-bold mr-1 flex items-center gap-1">
            <Flower className="w-3.5 h-3.5 text-white" />
            <span>BRUSH:</span>
          </span>

          <button
            onClick={() => setSelectedTool('random')}
            className={`px-2.5 py-1 rounded text-xs transition-all ${
              selectedTool === 'random'
                ? 'bg-white text-black font-bold'
                : 'bg-[#141414] text-[#888888] hover:text-white border border-[#222222]'
            }`}
          >
            ✦ Mixed Wildflowers
          </button>

          {MINI_ASCII_BLOOMS.map((tool) => (
            <button
              key={tool.type}
              onClick={() => setSelectedTool(tool.type)}
              className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-all ${
                selectedTool === tool.type
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#141414] text-[#888888] hover:text-white border border-[#222222]'
              }`}
            >
              <span>{tool.symbol}</span>
              <span className="hidden sm:inline">{tool.name.replace('Mini ', '')}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleBloomEntireMeadow}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-black font-bold text-xs flex items-center gap-1.5 shadow transition-all"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Bloom Field (30x)</span>
          </button>

          <button
            onClick={handleClearMeadow}
            disabled={items.length === 0}
            className="p-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] text-[#888888] hover:text-white border border-[#262626] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Clear flowers"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Meadow Canvas (Pure Pitch Black) */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className="relative w-full h-[580px] rounded-xl border border-[#222222] overflow-hidden cursor-crosshair select-none bg-[#000000] shadow-2xl transition-all"
      >
        {/* Floating Background Stars & Clouds */}
        <div className="absolute inset-0 pointer-events-none opacity-40 font-mono text-xs text-sky-300">
          <div className="absolute top-6 left-12 animate-pulse">✦ * . °</div>
          <div className="absolute top-14 right-20 animate-pulse delay-700">° . * ✧</div>
          <div className="absolute top-28 left-1/3 animate-pulse delay-1000">. ✦ · °</div>
          <div className="absolute top-8 right-1/3 animate-pulse delay-500">ƸӜƷ · °</div>
          <div className="absolute top-20 right-1/4">. ~ - . ( Sreeparna's Sky ) . - ~ .</div>
        </div>

        {/* Meadow Ground Grass Layer at Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-emerald-950/80 via-emerald-950/40 to-transparent pointer-events-none">
          <div className="absolute bottom-1 inset-x-0 font-mono text-xs text-emerald-500/60 whitespace-nowrap overflow-hidden text-center">
            {`\\\\//\\||//\\\\//\\||//\\\\//\\||//\\\\//\\||//\\\\//\\||//\\\\//\\||//\\\\//\\||//\\\\//\\||//\\\\//\\||//\\\\//\\||//`}
          </div>
          <div className="absolute bottom-4 inset-x-0 font-mono text-xs text-emerald-400/40 whitespace-nowrap overflow-hidden text-center">
            {`~-.._||_..-~-.._||_..-~-.._||_..-~-.._||_..-~-.._||_..-~-.._||_..-~-.._||_..-~`}
          </div>
        </div>

        {/* Instruction Overlay when empty */}
        {items.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-6">
            <span className="text-4xl mb-3 animate-bounce">🌻</span>
            <h4 className="text-base font-bold text-emerald-300 font-mono">
              [ Tap anywhere to bloom a flower! ]
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Click anywhere on Sreeparna's meadow to plant sunflowers, daisies, lilies, lavender, and gentle creatures!
            </p>
          </div>
        )}

        {/* Planted Items Rendering */}
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) scale(${item.scale}) rotate(${item.rotation}deg)`,
            }}
            className="absolute pointer-events-none transition-all duration-300 group"
          >
            <pre
              className="font-mono text-[12px] leading-[14px] font-bold drop-shadow-md select-none"
              style={{
                color: item.color,
                textShadow: `0 0 10px ${item.color}60`,
              }}
            >
              {item.ascii.map((line, lIdx) => (
                <div
                  key={lIdx}
                  dangerouslySetInnerHTML={{
                    __html: line
                      .replace(/<sunflower>/g, '<span style="color:#fbbf24">')
                      .replace(/<\/sunflower>/g, '</span>')
                      .replace(/<sunseed>/g, '<span style="color:#78350f">')
                      .replace(/<\/sunseed>/g, '</span>')
                      .replace(/<white>/g, '<span style="color:#f8fafc">')
                      .replace(/<\/white>/g, '</span>')
                      .replace(/<daisyCenter>/g, '<span style="color:#facc15">')
                      .replace(/<\/daisyCenter>/g, '</span>')
                      .replace(/<lilyPetal>/g, '<span style="color:#f472b6">')
                      .replace(/<\/lilyPetal>/g, '</span>')
                      .replace(/<lilyDeep>/g, '<span style="color:#db2777">')
                      .replace(/<\/lilyDeep>/g, '</span>')
                      .replace(/<tulipPeach>/g, '<span style="color:#fb923c">')
                      .replace(/<\/tulipPeach>/g, '</span>')
                      .replace(/<tulipPink>/g, '<span style="color:#f43f5e">')
                      .replace(/<\/tulipPink>/g, '</span>')
                      .replace(/<lavender>/g, '<span style="color:#c084fc">')
                      .replace(/<\/lavender>/g, '</span>')
                      .replace(/<lavenderDeep>/g, '<span style="color:#9333ea">')
                      .replace(/<\/lavenderDeep>/g, '</span>')
                      .replace(/<bunnyFur>/g, '<span style="color:#e0f2fe">')
                      .replace(/<\/bunnyFur>/g, '</span>')
                      .replace(/<stem>/g, '<span style="color:#16a34a">')
                      .replace(/<\/stem>/g, '</span>')
                      .replace(/<leaf>/g, '<span style="color:#22c55e">')
                      .replace(/<\/leaf>/g, '</span>')
                      .replace(/<heart>/g, '<span style="color:#fb7185">')
                      .replace(/<\/heart>/g, '</span>')
                      .replace(/<blush>/g, '<span style="color:#fda4af">')
                      .replace(/<\/blush>/g, '</span>')
                      .replace(/<sparkle>/g, '<span style="color:#fef08a">')
                      .replace(/<\/sparkle>/g, '</span>'),
                  }}
                />
              ))}
            </pre>
          </div>
        ))}

        {/* Cursor Sparkle Trail */}
        {mouseTrail.map((spark) => (
          <div
            key={spark.id}
            style={{ left: spark.x, top: spark.y }}
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 font-mono text-xs text-amber-300 animate-ping opacity-75"
          >
            {spark.char}
          </div>
        ))}

        {/* Counter Badge */}
        <div className="absolute bottom-3 left-4 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-xl text-xs font-mono text-emerald-300 backdrop-blur-sm pointer-events-none flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Blooms in Sreeparna's Meadow: {items.length}</span>
        </div>
      </div>
    </div>
  );
};
