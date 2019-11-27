import {checkForWinningPattern} from './engine';

export function getWeightedMovesForPlayer(state: string, player: string) {
  const values = new Array(9).fill(-Infinity);
  const initialMoves = getPotentialMoves(state);
  
  for (const i of initialMoves) {
    const newState = addMoveToState(state, i, player);
    const v = minimax(newState, player, player);
    values[i] = v;
  }
  return values;
}

export function minimax(state: string, turn: string, playerToMaximize: string): number {

  const pattern = checkForWinningPattern(state, turn);

  // winning
  if (pattern !== 0) {
    if (turn === playerToMaximize) {
      return 1;
    } else {
      return -1;
    }
  } 

  turn = switchTurn(turn);
  const moves = getPotentialMoves(state);

  // draw
  if (moves.length === 0) {
    return 0;
  }

  const values = [];
  // recursion on each move
  for (const i of moves) {
      const newState = addMoveToState(state, i, turn);
      const v = minimax(newState, turn, playerToMaximize);
      values.push(v);
  }

  if (turn === playerToMaximize) {
    return Math.max(...values);
  } else {
    return Math.min(...values);
  }
}

function switchTurn(player: string) {
  return player === 'x' ? 'o' : 'x';
}

// working, don't touch
function addMoveToState(state: string, move: number, player: string) {
  return state.slice(0, move) + player + state.slice(move + 1);
}

function getPotentialMoves(state: string): number[] {
  const moves: number[] = [];

  state.split('').forEach((value, i) => {
    if (state[i] === '0') {
      moves.push(i);
    }
  });

  return moves;
}