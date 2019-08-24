import {ignoreTurn} from '../constants/actionTypes'

const inital_state = false
    
export default (state = inital_state, action) => {
    switch (action.type) {
      case ignoreTurn.UPDATE_IGNORE_TURN: {
        return action.isIgnore;
      }
      default:
        return state;
    }
  };