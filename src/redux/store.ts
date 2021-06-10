import { applyMiddleware, combineReducers, createStore } from "redux";
import { blogReducer } from "./blogReducer";
import { userReducer } from "./userReducer";
import { appReducer } from "./appReducer";
import thunkMiddleware from "redux-thunk";

const allReducers = combineReducers({
    blogReducer,
    userReducer,
    appReducer,
});

const store = createStore(allReducers, applyMiddleware(thunkMiddleware));

export default store;