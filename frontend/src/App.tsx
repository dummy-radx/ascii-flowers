import { useState } from 'react';
import { Navbar, type ActiveTab } from './components/Navbar';
import { BouquetBuilder } from './components/BouquetBuilder';
import { SoloSpecimens } from './components/SoloSpecimens';
import { ClickMeadow } from './components/ClickMeadow';
import { DaisyPetalGame } from './components/DaisyPetalGame';
import { LoveLetters } from './components/LoveLetters';
import { Heart } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('bouquet');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-mono selection:bg-white selection:text-black">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Minimal Monochrome Sub-Banner */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-4 pb-2">
        <div className="bg-[#080808] border border-[#222222] rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[#a0a0a0]">
              Photorealistic Botanical ASCII • High-density character matrices on pitch-black canvas
            </span>
          </div>
          <div className="text-[11px] text-[#666666] flex items-center gap-1.5">
            <span>DEDICATED TO SREEPARNA</span>
            <Heart className="w-3 h-3 fill-white text-white inline" />
          </div>
        </div>
      </section>

      {/* Main Content Area based on Tab */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-4 flex-1">
        {activeTab === 'bouquet' && <BouquetBuilder />}
        {activeTab === 'specimens' && <SoloSpecimens />}
        {activeTab === 'meadow' && <ClickMeadow />}
        {activeTab === 'oracle' && <DaisyPetalGame />}
        {activeTab === 'letters' && <LoveLetters />}
      </main>

      {/* Minimalist Monospace Footer */}
      <footer className="border-t border-[#1a1a1a] bg-[#000000] mt-12 py-6 px-4 text-center font-mono text-xs text-[#666666]">
        <div className="max-w-md mx-auto space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-white">
            <span>Crafted by Ishan for Sreeparna</span>
            <Heart className="w-3 h-3 fill-white text-white inline" />
          </div>
          <div className="text-[11px] text-[#555555]">
            Sunflowers • Daisies • Stargazer Lilies • Tulips • Lavender • Pure ASCII Realism
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
