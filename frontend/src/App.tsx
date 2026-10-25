import { useState } from 'react';
import { Navbar, type ActiveTab } from './components/Navbar';
import { BouquetBuilder } from './components/BouquetBuilder';
import { SoloSpecimens } from './components/SoloSpecimens';
import { CuteGifts } from './components/CuteGifts';
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


      {/* Main Content Area based on Tab */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-4 flex-1">
        {activeTab === 'bouquet' && <BouquetBuilder />}
        {activeTab === 'specimens' && <SoloSpecimens />}
        {activeTab === 'gifts' && <CuteGifts />}
        {activeTab === 'meadow' && <ClickMeadow />}
        {activeTab === 'oracle' && <DaisyPetalGame />}
        {activeTab === 'letters' && <LoveLetters />}
      </main>

      {/* Minimalist Monospace Footer */}
      <footer className="border-t border-[#1a1a1a] bg-[#000000] mt-12 py-6 px-4 text-center font-mono text-xs text-[#666666]">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-white">
            <span>Crafted by Ishan for Sreeparna</span>
            <Heart className="w-3 h-3 fill-white text-white inline" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
