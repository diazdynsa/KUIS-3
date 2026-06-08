// src/algorithms/geneticAlgorithm.js
import { calculateFitness, MAP_BOUNDS, getRandomCoordinate } from './benchmarkFunctions';

const createIndividual = () => {
  const coord = getRandomCoordinate();
  return { x: coord.x, y: coord.y };
};

const createPopulation = (size) => {
  return Array.from({ length: size }, createIndividual);
};

// Karena fitness kita sekarang bernilai negatif (mendekati 0 makin bagus),
// kita harus menggeser nilainya agar positif semua untuk Roulette Wheel Selection.
const rouletteWheelSelection = (population, minFitness) => {
  // Geser agar nilai terkecil menjadi positif (offset)
  const offset = Math.abs(minFitness) + 1; 
  let totalAdjustedFitness = population.reduce((sum, ind) => sum + (ind.fitness + offset), 0);
  
  let randomVal = Math.random() * totalAdjustedFitness;
  for (let ind of population) {
    randomVal -= (ind.fitness + offset);
    if (randomVal <= 0) return ind;
  }
  return population[population.length - 1];
};

const crossover = (parent1, parent2, crossoverRate) => {
  if (Math.random() > crossoverRate) return { ...parent1 }; 
  return {
    x: (parent1.x + parent2.x) / 2,
    y: (parent1.y + parent2.y) / 2
  };
};

// Mutation step dikecilin jadi 0.5
const mutate = (individual, mutationRate, mutationStep = 0.5) => {
  let newX = individual.x;
  let newY = individual.y;

  if (Math.random() < mutationRate) {
    newX += (Math.random() * 2 - 1) * mutationStep;
    newY += (Math.random() * 2 - 1) * mutationStep;
  }

  newX = Math.max(MAP_BOUNDS.minX, Math.min(MAP_BOUNDS.maxX, newX));
  newY = Math.max(MAP_BOUNDS.minY, Math.min(MAP_BOUNDS.maxY, newY));

  return { x: newX, y: newY };
};

export const geneticAlgorithm = (popSize = 50, generations = 100, crossoverRate = 0.8, mutationRate = 0.1) => {
  let population = createPopulation(popSize);
  let history = [];
  let globalBest = null;

  for (let gen = 0; gen < generations; gen++) {
    let currentBest = null;
    let minFitness = 0; // Untuk mencari nilai terburuk di populasi

    population.forEach(ind => {
      ind.fitness = calculateFitness(ind.x, ind.y);
      if (ind.fitness < minFitness) minFitness = ind.fitness;
      
      if (!currentBest || ind.fitness > currentBest.fitness) {
        currentBest = { ...ind };
      }
    });

    if (!globalBest || currentBest.fitness > globalBest.fitness) {
      globalBest = { ...currentBest };
    }

    // Rata-rata fitness yang logis (tidak perlu di-offset)
    let totalRealFitness = population.reduce((sum, ind) => sum + ind.fitness, 0);

    history.push({
      generation: gen + 1,
      bestFitness: currentBest.fitness,
      averageFitness: totalRealFitness / popSize,
      bestIndividual: currentBest
    });

    let newPopulation = [];
    newPopulation.push({ ...currentBest }); // Elitism

    while (newPopulation.length < popSize) {
      const parent1 = rouletteWheelSelection(population, minFitness);
      const parent2 = rouletteWheelSelection(population, minFitness);
      
      let child = crossover(parent1, parent2, crossoverRate);
      child = mutate(child, mutationRate);
      
      newPopulation.push(child);
    }

    population = newPopulation;
  }

  return { history, globalBest };
};