import { ActionType } from "../local/actionType"
import { Blog } from "../local/interface"

const initialState = {
    count: 0,
    pageSize:10,
    currentPage: 1,
    blogs: [
    ],
    selectedBlog: {id: null},
}

export const blogReducer = (state: any = initialState, action: {
    type: ActionType , 
    blogs: Blog[], 
    selectedBlog: Blog,
    count: number,
    currentPage:number,
    } )=>{
    switch (action.type){
        case ActionType.setBlogs:
            return {...state, blogs: [...action.blogs]}
        case ActionType.setBlogsCount:
            return {...state, count: action.count}
        case ActionType.setCurrentBlogsPage:
            return {...state, currentPage: action.currentPage}
        case ActionType.setSelectedBlog:
            return {...state, selectedBlog:{...action.selectedBlog} }
        default:
            return state;
    }
}