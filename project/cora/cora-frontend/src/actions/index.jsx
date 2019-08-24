import { ignoreTurn,countdown,types, rooms, UserO, User,  roomlist, roomplaying } from "../constants/actionTypes";

export const chooseRoom = (room) => {
    return {
        type: rooms.CHOOSE_ROOM,
        payload: room
    }
}

export const updateRooms = (rooms) => {
    return {
        type: roomlist.UPDATE_ROOMS,
        rooms
    }
}

export const roomPlaying = (room) =>{
    return {
        type: roomplaying.ROOM_PLAYING,
        room
    }
}


export const set_number_cell = number_cell => ({
    type: types.SET_NUMBER_CELL,
    number_cell
})

export const init_array = array_board => ({
    type: types.INIT_ARRAY,
    array_board
})

export const mark =  (array_new) => ({
    type: types.MARK,
    array_new
})

export const switch_piece = (data) => ({
    type: types.SWITCH_PIECE,
    data
})

export const update_board_property = (board) => ({
    type: types.UPDATE_BOARD_PROPERTY,
    board
})

export const updateUserO = (userO) => {
    return {
        type: UserO.UPDATE_USER_O,
        userO
    }
}

export const updateUser = (user) => {
    return {
        type: User.UPDATE_USER,
        user
    }
}

export const updateCountdown = (time) =>{
    return {
        type: countdown.UPDATE_COUNTDOWN,
        time
    }
}

export const updateIgnoreTurn = (isIgnore) =>{
    return {
        type: ignoreTurn.UPDATE_IGNORE_TURN,
        isIgnore
    }
}