import { getUser, login, logout, signUp } from "../api/api";
import { ActionType } from "../local/actionType"
import { User, Blog } from "../local/interface";
import { handleError } from "../local/utils";
 
const initialState = {
    currentUser: {},
    isLogged: false,
    liked_blogs: [],
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


export const auth = (value: any, redirect:()=>void, onCatch?:(e:any)=>void )=>{
    return async (dispatch:any)=>{
        dispatch({type: ActionType.setLoading, loadingValue: true });

        await login(value).then((response)=>{
            localStorage.setItem('key', response.data.key);
            getUser().then((response)=>{
                dispatch({type: ActionType.setUser, user: response.data})
                redirect();
            })
        }).catch((e)=>{
            handleError(e, onCatch);
        }).finally(()=>{
            dispatch({type: ActionType.setLoading, loadingValue: false })
        });
    }
}

export const logOut = (onCatch?:(e:any)=>void)=>{
    return async (dispatch:any)=>{
        await logout().then((response)=>{
            dispatch({type: ActionType.logout});
            localStorage.removeItem('key');
        }).catch((e)=>{
            handleError(e, onCatch);
        })
    }
}

export const registrate = (value:any, redirect:()=>void, onCatch?:(e:any)=>void )=>{
    return async (dispatch:any)=>{
        dispatch({type: ActionType.setLoading, loadingValue: true });

        await signUp(value).then((response)=>{
            localStorage.setItem('key', response.data.key);
            getUser().then((response)=>{
                dispatch({type: ActionType.setUser, user: response.data})
                redirect();
            })
        }).catch((e)=>{
            handleError(e, onCatch);
        }).finally(()=>{
            dispatch({type: ActionType.setLoading, loadingValue: false })
        })      
    }
}
