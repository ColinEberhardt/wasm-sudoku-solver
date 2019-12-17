import initWasmModule, { solve } from "../../rust-solver/pkg/sudoku_wasm.js";

const init = async () => {
  await initWasmModule();
};

const cache = {};

const distance = (p1, p2) => {
  let d = 0;
  for (let i = 0; i < p1.length; i++) {
    if (p1[i] != p2[i]) {
      d++;
    }
  }
  return d;
};

const solver = puzzle => {
  // check for a cached solution
  for (let i = 0; i < Object.keys(cache).length; i++) {
    const cachedPuzzle = Object.keys(cache)[i];
    if (distance(puzzle, cachedPuzzle) < 5) {
      return cache[cachedPuzzle];
    }
  }

  const solution = solve(puzzle);
  if (solution.length !== 0) {
    cache[puzzle] = solution;
  }
  return solution;
};

export { solver, init };
