import { types, pieces } from "../constants/actionTypes";

const numcell = 16

const inital_state = {
  number_cell: numcell,
  array_board: Array(numcell).fill(null).map(() => Array(numcell).fill(null)),
  piece_current: pieces.X,
  board_property: {}
};
export default (state = inital_state, action) => {
  switch (action.type) {
    case types.SET_NUMBER_CELL: {
      return { ...state, number_cell: parseInt(action.number_cell) };
    }
    case types.INIT_ARRAY: {
      return { ...state, array_board: action.array_board };
    }
    case types.SWITCH_PIECE: {
      return { ...state, piece_current: action.data };
    }
    case types.MARK: {
      return {...state, array_board: action.array_new}
    }

    case types.UPDATE_BOARD_PROPERTY: {
      return {...state, board_property: action.board}
    }
    default:
      return state;
  }
};