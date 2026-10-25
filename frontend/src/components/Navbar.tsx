import React from 'react';
import { Volume2, VolumeX, Heart } from 'lucide-react';
import { soundSynth } from '../utils/audio';

export type ActiveTab = 'bouquet' | 'specimens' | 'gifts' | 'meadow' | 'oracle' | 'letters' | 'radio';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
}) => {
  const toggleSound = () => {
    const nextMute = soundSynth.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) {
      soundSynth.playBloom(2);
    }
  };

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'bouquet', label: 'BOUQUET STUDIO' },
    { id: 'specimens', label: 'SOLO SPECIMENS' },
    { id: 'gifts', label: 'PLUSHIES & GIFTS' },
    { id: 'meadow', label: 'CLICK MEADOW' },
    { id: 'oracle', label: 'DAISY ORACLE' },
    { id: 'letters', label: 'LOVE LETTERS' },
    { id: 'radio', label: '📻 ASCII RADIO' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#000000]/95 backdrop-blur-md border-b border-[#222222] px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Dedication (Pure Monochrome) */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#2a2a2a] flex items-center justify-center text-white text-xs font-mono font-bold">
            S+I
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#888888] uppercase">
                FINE-PIXEL ASCII BOTANICAL
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
            <h1 className="text-sm sm:text-base font-bold font-mono tracking-wider text-white flex items-center gap-1.5">
              <span>FOR SREEPARNA</span>
              <Heart className="w-3.5 h-3.5 fill-white text-white inline ml-0.5" />
            </h1>
          </div>
        </div>

        {/* Navigation Tabs (Minimalist B&W Segmented) */}
        <nav className="flex flex-wrap items-center justify-center gap-1 bg-[#0a0a0a] p-1 rounded-lg border border-[#222222]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  soundSynth.playBloom(1);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-black font-bold shadow'
                    : 'text-[#888888] hover:text-white hover:bg-[#161616]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className={`px-2.5 py-1.5 rounded-md border text-xs font-mono flex items-center gap-1.5 transition-all ${
              !isMuted
                ? 'bg-white text-black font-semibold border-white'
                : 'bg-[#121212] border-[#262626] text-[#666666]'
            }`}
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{!isMuted ? 'SOUND: ON' : 'MUTE'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
