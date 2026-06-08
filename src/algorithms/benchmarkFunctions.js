// src/algorithms/benchmarkFunctions.js

// Batas standar untuk Rastrigin Function
export const MAP_BOUNDS = { minX: -5.12, maxX: 5.12, minY: -5.12, maxY: 5.12 };

// Fungsi Benchmark: Rastrigin (Banyak banget jebakan local optima)
export const rastrigin = (x, y) => {
  return 20 + (x * x - 20 * Math.cos(2 * Math.PI * x)) + (y * y - 20 * Math.cos(2 * Math.PI * y));
};

// Fitness: Karena kita mencari maksimum, kita balik nilai Rastrigin menjadi negatif.
// Nilai terbaik (Global Optimum) adalah X=0, Y=0 dengan Fitness = 0.
export const calculateFitness = (x, y) => {
  if (x < MAP_BOUNDS.minX || x > MAP_BOUNDS.maxX || y < MAP_BOUNDS.minY || y > MAP_BOUNDS.maxY) {
    return -9999; // Penalti karena keluar batas
  }
  return -rastrigin(x, y); 
};

// Fungsi bantuan untuk menghasilkan titik awal acak (kepakai buat Random Restart & GA)
export const getRandomCoordinate = () => ({
  x: Math.random() * (MAP_BOUNDS.maxX - MAP_BOUNDS.minX) + MAP_BOUNDS.minX,
  y: Math.random() * (MAP_BOUNDS.maxY - MAP_BOUNDS.minY) + MAP_BOUNDS.minY
});