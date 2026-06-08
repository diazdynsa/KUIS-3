import { useState } from 'react';
import { motion } from 'framer-motion';
import { randomRestartHC } from '../algorithms/hillClimbing';
import { simulatedAnnealing } from '../algorithms/simulatedAnnealing';
import { geneticAlgorithm } from '../algorithms/geneticAlgorithm';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Simulation() {
  const [logs, setLogs] = useState("Menunggu eksekusi simulasi...\nArea Pencarian: Rastrigin Function (Nonlinear)\nBatas: -5.12 hingga 5.12\n");
  const [chartData, setChartData] = useState(null);
  
  const [params, setParams] = useState({ hcRestarts: 5, saTemp: 100, saCooling: 0.95, gaPopSize: 50, gaGenerations: 100, gaMutation: 0.1 });
  const [metrics, setMetrics] = useState({
    HC: { time: '-', iterations: '-', fitness: '-' },
    SA: { time: '-', iterations: '-', fitness: '-' },
    GA: { time: '-', iterations: '-', fitness: '-' }
  });

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: Number(value) }));
  };

  const runHC = () => {
    const start = performance.now();
    const { history, best } = randomRestartHC(params.hcRestarts, 100);
    const end = performance.now();

    setMetrics(prev => ({ ...prev, HC: { time: (end - start).toFixed(2) + ' ms', iterations: history.length, fitness: best.fitness.toFixed(4) } }));
    setLogs(`[Hill Climbing w/ Random Restart]\nTotal Restart: ${params.hcRestarts}\nTitik Terbaik: X=${best.x.toFixed(4)}, Y=${best.y.toFixed(4)}\nFitness: ${best.fitness.toFixed(4)}\n`);

    setChartData({
      labels: history.map((_, i) => `Iter ${i + 1}`),
      datasets: [{
        label: 'Fitness Score (HC)',
        data: history.map(item => item.fitness),
        borderColor: '#000000', backgroundColor: '#000000', tension: 0.1, pointRadius: 1,
      }]
    });
  };

  const runSA = () => {
    const start = performance.now();
    const { history, best } = simulatedAnnealing(0, 0, params.saTemp, params.saCooling, 0.1);
    const end = performance.now();

    setMetrics(prev => ({ ...prev, SA: { time: (end - start).toFixed(2) + ' ms', iterations: history.length, fitness: best.fitness.toFixed(4) } }));
    setLogs(`[Simulated Annealing]\nSuhu Awal: ${params.saTemp}, Cooling Rate: ${params.saCooling}\nTitik Terbaik: X=${best.x.toFixed(4)}, Y=${best.y.toFixed(4)}\nFitness: ${best.fitness.toFixed(4)}\n`);
    
    setChartData({
      labels: history.map((_, i) => `Iter ${i + 1}`),
      datasets: [{
        label: 'Fitness Score (SA)',
        data: history.map(item => item.fitness),
        borderColor: '#525252', backgroundColor: '#525252', tension: 0.1, pointRadius: 1,
      }]
    });
  };

  const runGA = () => {
    const start = performance.now();
    const { history, globalBest } = geneticAlgorithm(params.gaPopSize, params.gaGenerations, 0.8, params.gaMutation);
    const end = performance.now();

    setMetrics(prev => ({ ...prev, GA: { time: (end - start).toFixed(2) + ' ms', iterations: params.gaGenerations, fitness: globalBest.fitness.toFixed(4) } }));
    setLogs(`[Genetic Algorithm]\nPopulasi: ${params.gaPopSize}, Generasi: ${params.gaGenerations}\nTitik Terbaik: X=${globalBest.x.toFixed(4)}, Y=${globalBest.y.toFixed(4)}\nFitness: ${globalBest.fitness.toFixed(4)}\n`);
    
    setChartData({
      labels: history.map(item => `Gen ${item.generation}`),
      datasets: [{
        label: 'Best Fitness per Generation (GA)',
        data: history.map(item => item.bestFitness),
        borderColor: '#171717', backgroundColor: '#171717', tension: 0.2, pointRadius: 2,
      }]
    });
  };

  // Varian animasi untuk panel-panel agar muncul berurutan (stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900">Simulation Panel</h2>
        <p className="text-neutral-500 mt-2 text-sm">Sesuaikan parameter dan jalankan simulasi pencarian koordinat optimal.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Kolom Kiri: Controls */}
        <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col gap-6">
          <div className="border border-neutral-200/80 rounded-2xl p-5 bg-white shadow-sm">
            <h3 className="font-semibold mb-4 border-b border-neutral-100 pb-3 text-neutral-800">Parameter Kontrol</h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-neutral-500 mb-1.5 font-medium">HC Random Restarts</label>
                <input type="number" name="hcRestarts" value={params.hcRestarts} onChange={handleParamChange} className="w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50/50 focus:bg-white focus:ring-2 focus:ring-black/10 focus:border-neutral-400 outline-none transition-all" />
              </div>
              <div className="h-px bg-neutral-100 my-2" />
              <div>
                <label className="block text-neutral-500 mb-1.5 font-medium">SA Suhu Awal</label>
                <input type="number" name="saTemp" value={params.saTemp} onChange={handleParamChange} className="w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50/50 focus:bg-white focus:ring-2 focus:ring-black/10 focus:border-neutral-400 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1.5 font-medium">SA Cooling Rate</label>
                <input type="number" step="0.01" name="saCooling" value={params.saCooling} onChange={handleParamChange} className="w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50/50 focus:bg-white focus:ring-2 focus:ring-black/10 focus:border-neutral-400 outline-none transition-all" />
              </div>
              <div className="h-px bg-neutral-100 my-2" />
              <div>
                <label className="block text-neutral-500 mb-1.5 font-medium">GA Populasi</label>
                <input type="number" name="gaPopSize" value={params.gaPopSize} onChange={handleParamChange} className="w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50/50 focus:bg-white focus:ring-2 focus:ring-black/10 focus:border-neutral-400 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1.5 font-medium">GA Generasi</label>
                <input type="number" name="gaGenerations" value={params.gaGenerations} onChange={handleParamChange} className="w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50/50 focus:bg-white focus:ring-2 focus:ring-black/10 focus:border-neutral-400 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={runHC} 
              className="bg-black text-white px-4 py-3.5 rounded-xl text-sm font-semibold shadow-md"
            >
              Run Hill Climbing
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={runSA} 
              className="bg-white border border-neutral-200 text-neutral-800 px-4 py-3.5 rounded-xl hover:border-neutral-400 shadow-sm text-sm font-semibold"
            >
              Run Simulated Annealing
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={runGA} 
              className="bg-white border border-neutral-200 text-neutral-800 px-4 py-3.5 rounded-xl hover:border-neutral-400 shadow-sm text-sm font-semibold"
            >
              Run Genetic Algorithm
            </motion.button>
          </div>
        </motion.div>

        {/* Kolom Kanan: Visualisasi & Metrik */}
        <motion.div variants={itemVariants} className="lg:col-span-3 flex flex-col gap-6">
          <div className="border border-neutral-200/80 rounded-2xl p-6 bg-white shadow-sm overflow-x-auto">
            <h3 className="font-semibold text-lg mb-4 text-neutral-800">Metrik Perbandingan Algoritma</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 text-sm text-neutral-400">
                  <th className="pb-3 font-medium">Algoritma</th>
                  <th className="pb-3 font-medium">Waktu Konvergensi</th>
                  <th className="pb-3 font-medium">Jumlah Iterasi/Gen</th>
                  <th className="pb-3 font-medium">Kualitas Solusi (Fitness)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-neutral-50 group hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 font-medium text-neutral-800">Hill Climbing (Restart)</td>
                  <td className="py-3.5 text-neutral-600">{metrics.HC.time}</td>
                  <td className="py-3.5 text-neutral-600">{metrics.HC.iterations}</td>
                  <td className="py-3.5 font-mono text-neutral-700">{metrics.HC.fitness}</td>
                </tr>
                <tr className="border-b border-neutral-50 group hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 font-medium text-neutral-800">Simulated Annealing</td>
                  <td className="py-3.5 text-neutral-600">{metrics.SA.time}</td>
                  <td className="py-3.5 text-neutral-600">{metrics.SA.iterations}</td>
                  <td className="py-3.5 font-mono text-neutral-700">{metrics.SA.fitness}</td>
                </tr>
                <tr className="group hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 font-medium text-neutral-800">Genetic Algorithm</td>
                  <td className="py-3.5 text-neutral-600">{metrics.GA.time}</td>
                  <td className="py-3.5 text-neutral-600">{metrics.GA.iterations}</td>
                  <td className="py-3.5 font-mono text-neutral-700">{metrics.GA.fitness}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border border-neutral-200/80 rounded-2xl p-6 bg-white shadow-sm min-h-[400px] flex flex-col">
            <div className="bg-[#FAFAFA] p-4 rounded-xl border border-neutral-100 mb-6 flex-shrink-0 shadow-inner">
              <pre className="font-mono text-xs md:text-sm text-neutral-600 whitespace-pre-wrap leading-relaxed">
                {logs}
              </pre>
            </div>
            
            <div className="w-full flex-grow flex items-center justify-center min-h-[250px]">
              {chartData ? (
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6 } } },
                    interaction: { mode: 'index', intersect: false },
                    scales: { x: { grid: { display: false } }, y: { grid: { color: '#f5f5f5' } } }
                  }} 
                />
              ) : (
                <p className="text-neutral-400 text-sm flex items-center gap-2">
                  <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 rounded-full bg-neutral-400"></motion.span>
                  Grafik konvergensi akan muncul di sini...
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}