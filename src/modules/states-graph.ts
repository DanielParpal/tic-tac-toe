// unused at the moment
// This class actually represents the vertices in our graph
export class GameState {
  encodedState: string;
  isWinningFor: string;

  constructor(encodedState: string, isWinningFor: string) {
    this.encodedState = encodedState;
    this.isWinningFor = isWinningFor;
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

  addVertices(vertices: GameState[]) {
    for (const v of vertices) {
      this.addVertex(v);
    }
  }

  addEdge(v1: GameState, v2: GameState) {
    const adjVertices = this.adjList.get(v1);
    if (!adjVertices) return;

    adjVertices.push(v2);
  }

  addEdges(edges: [GameState, GameState][]) {
    for (const [v1, v2] of edges) {
      this.addEdge(v1, v2);
    }
  }

  getLeafNodesForState(s: GameState) {
    const leaves = [];

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

  bfs(start: GameState, leavesOnly: boolean = false) {
    const returnNodes: GameState[] = [];
    const visited = new Map<GameState, boolean>();
    const queue = [];

    queue.unshift(start);
    visited.set(start, true);
    
    while (queue.length > 0) {
      const node = queue.pop();
      if (!node) break;

      const adjNodes = this.adjList.get(node);
      if (!adjNodes) break;

      // Handles the leavesOnly option
      if (leavesOnly) {
        if (adjNodes.length === 0) {
          returnNodes.push(node);
        }
      } else {
        returnNodes.push(node);
      }

      for (const adjNode of adjNodes) {
        const isVisited = visited.get(adjNode);
        if (!isVisited) {
          queue.unshift(adjNode);
        }
      }
    }
    
    return returnNodes;
  }
}