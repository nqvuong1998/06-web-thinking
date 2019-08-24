import {countdown} from '../constants/actionTypes'

const inital_state = 30
    
export default (state = inital_state, action) => {
    switch (action.type) {
      case countdown.UPDATE_COUNTDOWN: {
        return action.time;
      }
      default:
        return state;
    }
  };