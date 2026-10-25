import { useState, useEffect } from 'react';
import { Navbar, type ActiveTab } from './components/Navbar';
import { BouquetBuilder } from './components/BouquetBuilder';
import { SoloSpecimens } from './components/SoloSpecimens';
import { CuteGifts } from './components/CuteGifts';
import { ClickMeadow } from './components/ClickMeadow';
import { DaisyPetalGame } from './components/DaisyPetalGame';
import { LoveLetters } from './components/LoveLetters';
import { AsciiRadioBox } from './components/AsciiRadioBox';
import { Heart } from 'lucide-react';

const VALID_TABS: ActiveTab[] = ['bouquet', 'specimens', 'gifts', 'meadow', 'oracle', 'letters', 'radio'];

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as ActiveTab;
      if (VALID_TABS.includes(hash)) {
        return hash;
      }
    }
    return 'bouquet';
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Sync tab with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ActiveTab;
      if (VALID_TABS.includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-mono selection:bg-white selection:text-black">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
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
        {activeTab === 'radio' && <AsciiRadioBox />}
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
