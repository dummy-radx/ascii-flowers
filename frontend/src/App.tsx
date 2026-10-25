import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BouquetBuilder } from './components/BouquetBuilder';
import { ClickMeadow } from './components/ClickMeadow';
import { DaisyPetalGame } from './components/DaisyPetalGame';
import { CuteCompanions } from './components/CuteCompanions';
import { LoveLetters } from './components/LoveLetters';
import type { GardenTheme } from './types';
import { Heart, Sparkles } from 'lucide-react';

interface PetalParticle {
  id: number;
  char: string;
  left: number;
  duration: number;
  delay: number;
  color: string;
}

export function App() {
  const [activeTab, setActiveTab] = useState<'bouquet' | 'meadow' | 'daisy' | 'critters' | 'letters'>('bouquet');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<GardenTheme>('midnight');
  const [fallingPetals, setFallingPetals] = useState<boolean>(true);
  const [petals, setPetals] = useState<PetalParticle[]>([]);

  // Generate floating ASCII petals
  useEffect(() => {
    if (!fallingPetals) {
      setPetals([]);
      return;
    }

    const petalChars = ['❀', '🌸', '✿', '·', '✧', '°', '*'];
    const petalColors = ['#f472b6', '#fbbf24', '#c084fc', '#38bdf8', '#facc15', '#f1f5f9'];

    const newPetals: PetalParticle[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      char: petalChars[Math.floor(Math.random() * petalChars.length)],
      left: Math.random() * 98,
      duration: 7 + Math.random() * 8,
      delay: Math.random() * 6,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
    }));

    setPetals(newPetals);
  }, [fallingPetals]);

  // Theme container classes
  const themeStyles: Record<GardenTheme, { bg: string; border: string }> = {
    midnight: { bg: 'bg-[#0b0d17]', border: 'border-slate-800' },
    twilight: { bg: 'bg-[#120d24]', border: 'border-purple-900/40' },
    strawberry: { bg: 'bg-[#180d14]', border: 'border-pink-900/40' },
    matcha: { bg: 'bg-[#0d1712]', border: 'border-emerald-900/40' },
    sunset: { bg: 'bg-[#1c120c]', border: 'border-amber-900/40' },
  };

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col transition-colors duration-500 relative overflow-x-hidden ${themeStyles[currentTheme].bg}`}>
      {/* Falling ASCII Petals Layer */}
      {fallingPetals && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {petals.map((petal) => (
            <div
              key={petal.id}
              style={{
                left: `${petal.left}%`,
                animationDuration: `${petal.duration}s`,
                animationDelay: `${petal.delay}s`,
                color: petal.color,
              }}
              className="absolute -top-6 text-sm font-mono opacity-80"
              style-petal-anim="true"
            >
              <span
                className="inline-block animate-[float-petal_linear_infinite]"
                style={{
                  animationDuration: `${petal.duration}s`,
                  animationDelay: `${petal.delay}s`,
                }}
              >
                {petal.char}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        fallingPetals={fallingPetals}
        setFallingPetals={setFallingPetals}
      />

      {/* Hero Dedication Sub-Banner */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-5 pb-2">
        <div className="bg-gradient-to-r from-pink-500/10 via-amber-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-gentle-bounce">💐</span>
            <div>
              <div className="text-xs font-mono text-pink-400 font-bold flex items-center gap-1.5">
                <span>Handmade with Love</span>
                <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                "For Sreeparna: where every character blooms with sunflowers, daisies & lilies!"
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>100% Pure Colorful ASCII</span>
          </div>
        </div>
      </section>

      {/* Main Content Area based on Tab */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex-1">
        {activeTab === 'bouquet' && <BouquetBuilder />}
        {activeTab === 'meadow' && <ClickMeadow />}
        {activeTab === 'daisy' && <DaisyPetalGame />}
        {activeTab === 'critters' && <CuteCompanions />}
        {activeTab === 'letters' && <LoveLetters />}
      </main>

      {/* Retro Cute Monospace Footer */}
      <footer className="border-t border-slate-800/80 bg-[#07080e]/90 mt-12 py-6 px-4 text-center font-mono text-xs text-slate-400 relative">
        <div className="max-w-md mx-auto space-y-2">
          {/* Sleeping ASCII Cat */}
          <pre className="text-[11px] leading-[13px] text-pink-400/80 inline-block">
{`   |\\      _,,,---,,_
   /, \`.-'\`'    -.  ;-;;,_
  |,4-  ) )-,_. ,\\ (  \`'-'
 '---''(_/--'  \`-'\\_)   (=^･ω･^=) zzz`}
          </pre>
          <div className="flex items-center justify-center gap-1 text-slate-300">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
            <span>by Ishan for Sreeparna</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Sunflowers • Daisies • Lilies • Tulips • Lavender • Pure ASCII Magic ✨
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
