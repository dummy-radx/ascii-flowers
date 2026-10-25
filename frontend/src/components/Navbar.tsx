import React from 'react';
import { Volume2, VolumeX, Sparkles, Heart, Flower2, PawPrint, Mail, Sun } from 'lucide-react';
import { soundSynth } from '../utils/audio';
import type { GardenTheme } from '../types';

interface NavbarProps {
  activeTab: 'bouquet' | 'meadow' | 'daisy' | 'critters' | 'letters';
  setActiveTab: (tab: 'bouquet' | 'meadow' | 'daisy' | 'critters' | 'letters') => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  currentTheme: GardenTheme;
  setCurrentTheme: (theme: GardenTheme) => void;
  fallingPetals: boolean;
  setFallingPetals: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
  currentTheme,
  setCurrentTheme,
  fallingPetals,
  setFallingPetals,
}) => {
  const toggleSound = () => {
    const nextMute = soundSynth.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) {
      soundSynth.playBloom(2);
    }
  };

  const themes: { id: GardenTheme; label: string; iconColor: string }[] = [
    { id: 'midnight', label: 'Midnight', iconColor: '#38bdf8' },
    { id: 'twilight', label: 'Twilight', iconColor: '#c084fc' },
    { id: 'strawberry', label: 'Strawberry', iconColor: '#f472b6' },
    { id: 'matcha', label: 'Matcha', iconColor: '#4ade80' },
    { id: 'sunset', label: 'Sunset', iconColor: '#fb923c' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0d0f18]/90 border-b border-pink-500/20 px-3 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Dedication */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-pink-400 to-purple-500 p-0.5 flex items-center justify-center shadow-lg shadow-pink-500/20 animate-gentle-bounce">
            <span className="text-xl">🌻</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                [✦ ASCII Playground ✦]
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Sreeparna's Botanical Garden</span>
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500 inline animate-pulse" />
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              setActiveTab('bouquet');
              soundSynth.playBloom(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${
              activeTab === 'bouquet'
                ? 'bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-md shadow-pink-500/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Flower2 className="w-4 h-4" />
            <span>Bouquet Studio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('meadow');
              soundSynth.playBloom(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${
              activeTab === 'meadow'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Click Meadow</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('daisy');
              soundSynth.playBloom(2);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${
              activeTab === 'daisy'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 shadow-md shadow-amber-400/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Loves Me Game</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('critters');
              soundSynth.playPurr();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${
              activeTab === 'critters'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PawPrint className="w-4 h-4" />
            <span>Cute Critters</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('letters');
              soundSynth.playSparkle();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${
              activeTab === 'letters'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Love Letters</span>
          </button>
        </nav>

        {/* Global Controls: Theme, Petals, Sound */}
        <div className="flex items-center gap-2">
          {/* Theme Selector */}
          <div className="hidden lg:flex items-center bg-slate-900/80 border border-slate-700/60 rounded-lg p-0.5">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setCurrentTheme(t.id);
                  soundSynth.playSparkle();
                }}
                title={t.label}
                className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] transition-all ${
                  currentTheme === t.id
                    ? 'bg-slate-700 shadow text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: t.iconColor }}
                />
              </button>
            ))}
          </div>

          {/* Falling Petals Toggle */}
          <button
            onClick={() => setFallingPetals(!fallingPetals)}
            title={fallingPetals ? 'Pause falling petals' : 'Start falling petals'}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-all ${
              fallingPetals
                ? 'bg-pink-950/60 border-pink-500/50 text-pink-300'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
            }`}
          >
            <span>🌸</span>
            <span className="hidden sm:inline">{fallingPetals ? 'Petals ON' : 'Petals OFF'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute cute music & chimes' : 'Mute sounds'}
            className={`p-2 rounded-lg border transition-all ${
              !isMuted
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm'
                : 'bg-slate-800/50 border-slate-700 text-slate-500'
            }`}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
