import { combineReducers, createStore } from "redux";
import { blogReducer } from "./blogReducer";
import { userReducer } from "./userReducer";
import { appReducer } from "./appReducer";

const allReducers = combineReducers({
    blogReducer,
    userReducer,
    appReducer,
});

const store = createStore(allReducers);

export default store;