import { roomlist } from "../constants/actionTypes";

const inital_state = 
[
        {
            id:2,
            title:"vuong's room",
            created_at:(new Date()).toLocaleString(),
            bet_money:250,
            host_name: "vuong",
            host: "3"
        }
]
    
export default (state = inital_state, action) => {
    switch (action.type) {
      case roomlist.UPDATE_ROOMS: {
        return action.rooms;
      }
      default:
        return state;
    }
  };