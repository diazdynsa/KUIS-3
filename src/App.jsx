import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Simulation from './pages/Simulation';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Konfigurasi animasi transisi antar halaman
  const pageVariants = {
    initial: { opacity: 0, y: 15, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    out: { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-neutral-200 overflow-x-hidden">
      
      {/* Navbar Minimalis */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-neutral-500 transition-colors">
              Nexus<span className="text-neutral-300">.</span>
            </span>
          </div>
          
          <div className="flex bg-neutral-100 p-1 rounded-full border border-neutral-200/50">
            <button 
              onClick={() => setActiveTab('home')}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'home' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('simulation')}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'simulation' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'}`}
            >
              Simulation
            </button>
          </div>

        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-12 md:px-8">
        {/* AnimatePresence membungkus komponen yang berganti-ganti */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
          >
            {activeTab === 'home' ? <Home /> : <Simulation />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;