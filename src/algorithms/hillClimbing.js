// src/algorithms/hillClimbing.js
import { calculateFitness, MAP_BOUNDS, getRandomCoordinate } from './benchmarkFunctions';

// Step size dikecilin jadi 0.5 karena skala area Rastrigin cuma dari -5.12 sampai 5.12
const getNeighbors = (currentX, currentY, stepSize = 0.5) => {
  return [
    { x: currentX + stepSize, y: currentY },
    { x: currentX - stepSize, y: currentY },
    { x: currentX, y: currentY + stepSize },
    { x: currentX, y: currentY - stepSize },
    { x: currentX + stepSize, y: currentY + stepSize },
    { x: currentX - stepSize, y: currentY - stepSize },
  ].filter(p => 
    p.x >= MAP_BOUNDS.minX && p.x <= MAP_BOUNDS.maxX && 
    p.y >= MAP_BOUNDS.minY && p.y <= MAP_BOUNDS.maxY
  );
};

export const simpleHillClimbing = (startX, startY, maxIterations = 100) => {
  let current = { x: startX, y: startY, fitness: calculateFitness(startX, startY) };
  let history = [current];

  for (let i = 0; i < maxIterations; i++) {
    const neighbors = getNeighbors(current.x, current.y);
    let foundBetter = false;

    for (let neighbor of neighbors) {
      const neighborFitness = calculateFitness(neighbor.x, neighbor.y);
      if (neighborFitness > current.fitness) {
        current = { x: neighbor.x, y: neighbor.y, fitness: neighborFitness };
        history.push(current);
        foundBetter = true;
        break; 
      }
    }
    if (!foundBetter) break; 
  }
  return history;
};

export const steepestAscentHC = (startX, startY, maxIterations = 100) => {
  let current = { x: startX, y: startY, fitness: calculateFitness(startX, startY) };
  let history = [current];

  for (let i = 0; i < maxIterations; i++) {
    const neighbors = getNeighbors(current.x, current.y);
    let bestNeighbor = null;
    let bestFitness = current.fitness;

    for (let neighbor of neighbors) {
      const neighborFitness = calculateFitness(neighbor.x, neighbor.y);
      if (neighborFitness > bestFitness) {
        bestFitness = neighborFitness;
        bestNeighbor = { x: neighbor.x, y: neighbor.y, fitness: neighborFitness };
      }
    }

    if (!bestNeighbor) break; 
    current = bestNeighbor;
    history.push(current);
  }
  return history;
};

export const stochasticHC = (startX, startY, maxIterations = 100) => {
  let current = { x: startX, y: startY, fitness: calculateFitness(startX, startY) };
  let history = [current];

  for (let i = 0; i < maxIterations; i++) {
    const neighbors = getNeighbors(current.x, current.y);
    if (neighbors.length === 0) break;

    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    const neighborFitness = calculateFitness(randomNeighbor.x, randomNeighbor.y);

    if (neighborFitness > current.fitness) {
      current = { x: randomNeighbor.x, y: randomNeighbor.y, fitness: neighborFitness };
      history.push(current);
    }
  }
  return history;
};

// 4. Mekanisme Random Restart untuk lolos dari Local Optima
export const randomRestartHC = (maxRestarts = 5, maxIterationsPerRestart = 100) => {
  let globalBest = null;
  let fullHistory = [];

  for (let r = 0; r < maxRestarts; r++) {
    const startNode = getRandomCoordinate();
    const result = steepestAscentHC(startNode.x, startNode.y, maxIterationsPerRestart);
    const localBest = result[result.length - 1];

    // Menandai proses restart untuk visualisasi UI nantinya
    result.forEach(step => fullHistory.push({ ...step, restartId: r }));

    if (!globalBest || localBest.fitness > globalBest.fitness) {
      globalBest = { ...localBest };
    }
  }
  return { history: fullHistory, best: globalBest };
};