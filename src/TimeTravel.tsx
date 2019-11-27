import React, { Dispatch } from 'react';
import {TileType, ActionType} from 'Game';

export interface Props {
  frames: TileType[][],
  dispatch: Dispatch<ActionType>
}

export default function TimeTravel({frames, dispatch}: Props) {
  return (
    <div>
      <h3>Time travel</h3>
      {
        frames.map((_, index) => {
          const text = index > 0 ? `move ${index}` : "start";
          return (
            <button onClick={() => dispatch({type: 'travel', payload: {resetTo: index}})} key={index}>
              Go to {text}
            </button>
          );
        })
      }
    </div>
  );
}
