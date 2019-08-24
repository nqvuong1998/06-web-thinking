import {rooms} from '../constants/actionTypes';

export default (state={}, action) =>{
    switch (action.type){
        case rooms.CHOOSE_ROOM:
            return action.payload;
        default:
            return null;
    }
}