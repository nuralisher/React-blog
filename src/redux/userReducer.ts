import { ActionType } from "../local/actionType"
import { User } from "../local/interface";

const initialState = {
    currentUser: {},
    isLogged: false,
}

export const userReducer = (state: any = initialState, action: {type: ActionType , user:User, }  )=>{
    switch (action.type){
        case ActionType.setUser:
            return {...state, currentUser: {...action.user}, isLogged: true }
        case ActionType.logout:
            return {...state, currentUser: {}, isLogged: false }
        default:
            return state;
    }
}