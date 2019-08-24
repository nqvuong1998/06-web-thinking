import { User } from "../constants/actionTypes";

const inital_state =
    {
        id: 1,
        username:"conglt",
        money: 500,
        token:"abcxyz",
        isAuth: false,
        idsocket:"",
        socket: null
    }
;
export default (state = inital_state, action) => {
  switch (action.type) {
    case User.UPDATE_USER: {
      return action.user;
    }
    default:
      return state;
  }
};