import {TurnsEnum} from '../Game';
import {containsWinningPattern} from './engine';
import { string } from 'prop-types';

// This class actually represents the vertices in our graph
export class GameState {
  encodedState: string;
  isWinning: boolean;

  constructor(encodedState: string, isWinning: boolean) {
    this.encodedState = encodedState;
    this.isWinning = isWinning;
  }
}

// The graph will hold the states (vertices) and their relation (edges)
export class Graph {
  adjList: Map<GameState, GameState[]>;

  constructor() {
    this.adjList = new Map();
  }

  addVertex(v: GameState) {
    this.adjList.set(v, []);
  }

  addEdge(v1: GameState, v2: GameState) {
    const adjVertices = this.adjList.get(v1);
    if (!adjVertices) return;

    adjVertices.push(v2);
  }

  printItself() {
    for (const v of this.adjList.keys()) {
      let display = v.encodedState + ' => ';

      const adjVertices = this.adjList.get(v);
      if (!adjVertices) return;

      display += adjVertices.map((v) => v.encodedState).join(', ');
      console.log(display);
    }
  }
}

export function buildStatesGraph() {
  const initialState = '0000';

  addMoveRecursively(initialState);
}

export const addMoveRecursively = (state: string) => {
  
  const turn = getPlayerTurn(state);
  const availableTiles = findAvalableTiles(state);
  if (availableTiles.length === 0) return;

  for (const tile of availableTiles) {
    const newState = addMoveToState(state, tile, turn);

    const binary = toBinary(newState, turn);
    const isWinning = containsWinningPattern(binary);

    if (!isWinning) {
      addMoveRecursively(newState);
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