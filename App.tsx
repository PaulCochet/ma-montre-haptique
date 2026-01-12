
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WatchDevice from './components/WatchDevice';
import Smiley from './components/Smiley';
import { AppState } from './types';
import { detectActivity } from './services/gemini';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ALERT);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isVibrating, setIsVibrating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerHaptic = useCallback((pattern: number | number[] = 100) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
    // Visual feedback for haptic
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 200);
  }, []);

  const handleStartRace = () => {
    triggerHaptic([50, 30, 50]);
    setAppState(AppState.ACTIVE);
  };

  const handleClose = () => {
    triggerHaptic(20);
    setAppState(AppState.IDLE);
  };

  const triggerDetection = async () => {
    setAppState(AppState.DETECTING);
    // Simulate complex data analysis with Gemini
    const result = await detectActivity("Heart rate 160bpm, high acceleration, GPS moving at 12km/h");
    if (result.detected) {
      setAppState(AppState.ALERT);
      triggerHaptic([100, 50, 100]);
    } else {
      setAppState(AppState.IDLE);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <WatchDevice>
        <div className={`relative w-full h-full transition-all duration-300 ${isVibrating ? 'scale-105' : 'scale-100'} overflow-hidden`}>
          
          {/* Status Bar */}
          <div className="absolute top-4 left-0 w-full px-8 flex justify-between items-center z-20 text-white font-medium text-sm">
             <button onClick={handleClose} className="w-8 h-8 rounded-full bg-blue-100/20 backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform">
                <i className="fa-solid fa-xmark text-blue-400"></i>
             </button>
             <span>{time}</span>
          </div>

          <AnimatePresence mode="wait">
            {appState === AppState.ALERT && (
              <motion.div 
                key="alert"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full h-full bg-gradient-to-b from-blue-200 to-white flex flex-col items-center justify-center p-6"
              >
                <div className="mt-8 flex-1 flex flex-col items-center justify-center">
                  <Smiley mood="happy" />
                  <h2 className="text-black text-2xl font-bold mt-4">Race detected</h2>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartRace}
                  className="w-full h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center gap-3 mb-4 group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <i className="fa-solid fa-person-running text-2xl text-black"></i>
                  <span className="text-black text-2xl font-semibold">Start</span>
                </motion.button>
              </motion.div>
            )}

            {appState === AppState.IDLE && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
              >
                <i className="fa-solid fa-clock text-blue-500 text-5xl mb-4"></i>
                <h3 className="text-white text-lg font-medium">Ready when you are</h3>
                <button 
                  onClick={triggerDetection}
                  className="mt-6 px-6 py-2 bg-zinc-800 text-zinc-300 rounded-full text-sm border border-zinc-700"
                >
                  Simulate Activity
                </button>
              </motion.div>
            )}

            {appState === AppState.DETECTING && (
              <motion.div 
                key="detecting"
                className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-6"
                />
                <h3 className="text-white text-lg font-medium">AI Analyzing...</h3>
                <p className="text-zinc-400 text-xs mt-2 px-4 italic">Using Gemini to process sensor patterns</p>
              </motion.div>
            )}

            {appState === AppState.ACTIVE && (
              <motion.div 
                key="active"
                className="w-full h-full bg-black flex flex-col items-center justify-center p-6"
              >
                <Smiley mood="active" />
                <div className="mt-8 text-center">
                  <span className="text-blue-500 text-5xl font-mono font-bold">00:04</span>
                  <p className="text-zinc-400 text-sm mt-2 uppercase tracking-widest">Racing</p>
                </div>
                <button 
                  onClick={() => setAppState(AppState.IDLE)}
                  className="mt-8 w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30"
                >
                  <i className="fa-solid fa-stop text-red-500 text-xl"></i>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Background Decorative Circles */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </WatchDevice>

      <div className="max-w-md text-zinc-500 text-center px-6">
        <h1 className="text-white text-xl font-bold mb-2">Watch UI Prototype</h1>
        <p className="text-sm">
          Transitioned your Figma design to a functional React component. 
          Features include an <strong>animated smiley</strong>, <strong>Gemini-powered</strong> activity detection simulation, 
          and <strong>haptic feedback</strong> triggers (simulated visually and via Vibration API).
        </p>
      </div>
    </div>
  );
};

export default App;
