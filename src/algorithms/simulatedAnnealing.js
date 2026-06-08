// src/algorithms/simulatedAnnealing.js
import { calculateFitness, MAP_BOUNDS } from './benchmarkFunctions';

// Step size disesuaikan dengan skala Rastrigin (0.5)
const getRandomNeighbor = (currentX, currentY, stepSize = 0.5) => {
  const moves = [
    { x: currentX + stepSize, y: currentY },
    { x: currentX - stepSize, y: currentY },
    { x: currentX, y: currentY + stepSize },
    { x: currentX, y: currentY - stepSize },
    { x: currentX + stepSize, y: currentY + stepSize },
    { x: currentX - stepSize, y: currentY - stepSize },
  ];
  
  const validMoves = moves.filter(p => 
    p.x >= MAP_BOUNDS.minX && p.x <= MAP_BOUNDS.maxX && 
    p.y >= MAP_BOUNDS.minY && p.y <= MAP_BOUNDS.maxY
  );
  
  if (validMoves.length === 0) return null;
  return validMoves[Math.floor(Math.random() * validMoves.length)];
};

export const simulatedAnnealing = (startX, startY, initialTemp = 100, coolingRate = 0.95, minTemp = 0.1) => {
  let current = { x: startX, y: startY, fitness: calculateFitness(startX, startY) };
  let best = { ...current };
  
  let history = [{ 
    ...current, 
    temp: initialTemp, 
    acceptedWorse: false,
    probability: 1 
  }];
  
  let temp = initialTemp;

  while (temp > minTemp) {
    const neighbor = getRandomNeighbor(current.x, current.y);
    if (!neighbor) break;

    const neighborFitness = calculateFitness(neighbor.x, neighbor.y);
    const deltaE = neighborFitness - current.fitness; 
    let acceptedWorse = false;
    let prob = 1;

    if (deltaE > 0) {
      current = { x: neighbor.x, y: neighbor.y, fitness: neighborFitness };
      if (neighborFitness > best.fitness) {
        best = { ...current };
      }
    } else {
      prob = Math.exp(deltaE / temp);
      if (Math.random() < prob) {
        current = { x: neighbor.x, y: neighbor.y, fitness: neighborFitness };
        acceptedWorse = true;
      }
    }

    history.push({ 
      ...current, 
      temp, 
      acceptedWorse, 
      probability: prob 
    });
    
    temp *= coolingRate; 
  }

  return { history, best };
};