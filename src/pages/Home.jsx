// src/pages/Home.jsx
export default function Home() {
  return (
    <div className="animate-fade-in">
      <header className="mb-12">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
          Optimization <br/> Algorithm Simulator.
        </h2>
        <p className="text-neutral-500 max-w-xl text-lg leading-relaxed">
          Simulasi pencarian titik respawn optimal menggunakan pendekatan Local Search dan Evolutionary Algorithm.
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-2 p-8 border border-neutral-200 rounded-2xl bg-neutral-50">
          <h3 className="font-semibold text-xl mb-2">Studi Kasus</h3>
          <p className="text-neutral-600">
            Mencari koordinat (X, Y) paling ideal untuk titik respawn dalam level permainan. Algoritma akan bermanuver menghindari halangan dan memaksimalkan jarak pandang untuk mendapatkan nilai fitness tertinggi.
          </p>
        </div>

        <div className="col-span-1 p-8 border border-neutral-200 rounded-2xl flex flex-col justify-between">
          <h3 className="font-semibold text-xl mb-2">Tech Stack</h3>
          <ul className="text-neutral-600 space-y-1">
            <li>React.js</li>
            <li>Tailwind CSS</li>
            <li>Chart.js</li>
          </ul>
        </div>

        <div className="col-span-1 p-8 border border-neutral-200 rounded-2xl bg-black text-white">
          <h3 className="font-semibold text-xl mb-2">Algoritma</h3>
          <ul className="text-neutral-400 space-y-2 list-disc list-inside">
            <li>Hill Climbing</li>
            <li>Simulated Annealing</li>
            <li>Genetic Algorithm</li>
          </ul>
        </div>
        
        <div className="col-span-1 md:col-span-2 p-8 border border-neutral-200 rounded-2xl flex items-center justify-center">
          <p className="text-neutral-400 italic">"Mencari titik global optimum di antara ribuan local optima."</p>
        </div>
      </div>
    </div>
  );
}