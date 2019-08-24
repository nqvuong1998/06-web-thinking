import { UserO } from "../constants/actionTypes";


const inital_state = {
  userO:{
    id: 0,
    username:"",
    money: 0
  }
};
export default (state = inital_state, action) => {
  switch (action.type) {
    case UserO.UPDATE_USER_O: {
      return { userO: action.userO};
    }
    default:
      return state;
  }
};