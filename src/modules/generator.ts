import {TurnsEnum} from '../Game';
import {containsWinningPattern} from './engine';
import {GameState, Graph} from './states-graph';

export function buildStatesGraph(g: Graph) {
  const initialGameState = new GameState('000000000', '');
  g.addVertex(initialGameState);

  addMoveRecursivelyToGraph(initialGameState, g);
  console.log(g);
}

export const addMoveRecursivelyToGraph = (currentGameState: GameState, g: Graph) => {
  const state = currentGameState.encodedState;

  const turn = getPlayerTurn(state);
  const availableTiles = findAvalableTiles(state);

  if (availableTiles.length === 0) return;

  for (const tile of availableTiles) {
    const newState = addMoveToState(state, tile, turn);
    const binary = toBinary(newState, turn);
    const isWinning = containsWinningPattern(binary);
    const isWinningFor = isWinning > 0 ? turn : '';

    const newGameState = new GameState(newState, isWinningFor);
    g.addVertex(newGameState);
    g.addEdge(currentGameState, newGameState);

    if (!isWinning) {
      addMoveRecursivelyToGraph(newGameState, g);
    }
  }
}

const findAvalableTiles = (state: string) => {
  const tiles: number[] = [];

  state.split('').forEach((letter: string, index: number) => {
    if (letter === '0') {
      tiles.push(index);
    }
  });

  return tiles;
}

const addMoveToState = (currentState: string, pos: number, player: string) => {
  return currentState.slice(0, pos) + player + currentState.slice(pos + 1);
}

const toBinary = (sequence: string, turn: string) => {
  const cleanSequence = sequence.split('').map((tile) => tile === turn ? 1 : 0).join('');

  return parseInt(cleanSequence, 2);
}

const getPlayerTurn = (currentState: string): string => {
  const qtyX = getFrequencyOf(TurnsEnum.x, currentState);
  const qtyO = getFrequencyOf(TurnsEnum.o, currentState);

  return (qtyX === qtyO ? TurnsEnum.x : TurnsEnum.o);
}

const getFrequencyOf = (needle: string, word: string) => {
  return word
      .split('')
      .map((letter) => letter === needle ? 1 : 0)
      .reduce((total: number, el: number) => {
        return total + el;
      }, 0);
}