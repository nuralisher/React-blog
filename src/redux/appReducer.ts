import { ActionType } from "../local/actionType"

const initialState = {
    isInitialized: false,
    isLoading: false,
}

export const appReducer = (state: any = initialState, action: {
    type: ActionType , 
    initializedValue: Boolean,
    loadingValue: Boolean,
    } )=>{
    switch (action.type){
        case ActionType.setInitialized:
            return {...state, isInitialized: action.initializedValue } 
        case ActionType.setLoading:
            return {...state, isLoading: action.loadingValue}
        default:
            return state;
    }
}