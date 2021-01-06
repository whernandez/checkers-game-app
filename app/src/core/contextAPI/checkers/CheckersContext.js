import React, { useReducer } from "react";
import { REFRESH_BOARD } from "../../constants";
import { getBoardData } from "../../boardData";

const initialState = {
  board: getBoardData(),
};

const reducer = (state, action) => {
  switch (action.type) {
    case REFRESH_BOARD:
      return {
        board: [...action.payload],
      };
  }
  return state;
};

/**
 * @description create context to share pieces props with the rest of the application
 * @type {React.Context<Array>}
 */
const CheckersContext = React.createContext([]);

/**
 * @description To set Pieces values or props
 * @type {React.Provider<Array>}
 */
export const CheckersProvider = (props) => {
  const [boardState, dispatch] = useReducer(reducer, initialState);

  const actions = {
    refreshBoard: (board) => {
      if (board.length > 0) {
        dispatch({ type: REFRESH_BOARD, payload: board });
      }
    },
  };

  return (
    <CheckersContext.Provider
      value={{
        board: [...boardState.board],
        ...actions,
      }}
    >
      {props.children}
    </CheckersContext.Provider>
  );
};

/**
 * @description to get pieces values or props
 * @type {React.Consumer<Array>}
 */
export const CheckersConsumer = CheckersContext.Consumer;

export default CheckersContext;
