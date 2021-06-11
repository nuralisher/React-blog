import { deleteBlog, deleteBlogPreference, getBlog, getBlogs, postBlog, postBlogPreference, putBlog, } from "../api/api"
import { ActionType } from "../local/actionType"
import { Blog, BlogPrefernces, User } from "../local/interface"
import { handleError, updateObjectInArray } from "../local/utils"

const initialState = {
    count: 0,
    pageSize: 10,
    currentPage: 1,
    searchText: "",
    orderBy: "",
    blogs: [],
    selectedBlog: {id: null},
}

export const blogReducer = (state: any = initialState, action: {
    type: ActionType , 
    blogs: Blog[], 
    searchText: string,
    selectedBlog: Blog,
    count: number,
    currentPage:number,
    likedBlog:Blog,
    blogPreference:BlogPrefernces,
    orderBy:string,
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
        case ActionType.setSearchText:
            return {...state, searchText: action.searchText}
        case ActionType.setOrderBy:
            return {...state, orderBy: action.orderBy}
        case ActionType.likeBlog:
            return {...state,
                blogs: updateObjectInArray(state.blogs, action.likedBlog.id, "id",
                { preferences: [...action.likedBlog.preferences, action.blogPreference ] } ) }
        case ActionType.removeLikeBlog:
            return {...state,
                blogs: updateObjectInArray(state.blogs, action.likedBlog.id, "id",
                {preferences: action.likedBlog.preferences.filter(p=>p.id!=action.blogPreference.id) } ) }
        default:
            return state;
    }
}


export const loadBlogs = (limit:number, page:number, me:User, orderBy?:string ,search?:string, onSuccess?:()=>void, onCatch?:(e:any)=>void)=>{
    return async (dispatch: any)=>{
        dispatch({type: ActionType.setLoading, loadingValue: true });
        await getBlogs(limit, (page-1)*limit, orderBy, search).then(
            (response)=>{
                dispatch({type: ActionType.setBlogs, blogs: response.data.results});
                dispatch({type: ActionType.setCurrentBlogsPage, currentPage: page});
                dispatch({type: ActionType.setBlogsCount, count: response.data.count});
                dispatch({type: ActionType.setSearchText, searchText: search});
                dispatch({type: ActionType.setOrderBy, orderBy});
                onSuccess && onSuccess()
            }
        ).catch((e)=>{
            handleError(e, onCatch);
        }).finally(()=>{
            dispatch({type: ActionType.setLoading, loadingValue: false });
        });
    }
}

export const loadBlog = (id: string, me:User,  onFinally?:()=>void, onCatch?:(e:any)=>void) => {
    return async (dispatch: any)=>{
        dispatch({type: ActionType.setLoading, loadingValue: true })
        await getBlog(id).then(async (response)=>{
            dispatch({type: ActionType.setSelectedBlog, selectedBlog: response.data});
        }).catch((e)=>{
            handleError(e, onCatch);
        }).finally(()=>{
            dispatch({type: ActionType.setLoading, loadingValue: false });
            onFinally && onFinally();
        });

    }
}

export const updateBlog = (blog:Blog, me:User , values:any, onSaveBlog: (value: boolean )=>void, onCatch?:(e:any)=>void)=>{
    return async (dispatch:any)=>{
        dispatch({type: ActionType.setLoading, loadingValue: true });
        await putBlog(blog.id , 
            {author_id: me.pk, 
            title: values.title.trim(), 
            description: values.description.trim() , 
            body: values.body.trim(),
        }
        ).then((response)=>{
            onSaveBlog(true)
        }).catch((e)=>{
            handleError(e, onCatch);
        }).finally(()=>{
            dispatch({type: ActionType.setLoading, loadingValue: false });
        })
    }
}

export const createBlog = (me:User, values:any, 
    onCreateBlog: (value: {isCreated:boolean, id: string} )=>void, onCatch?:(e:any)=>void) => {
    return async (dispatch: any)=>{
        dispatch({type: ActionType.setLoading, loadingValue: true });
        await postBlog(
            {author_id: me.pk, 
            title: values.title.trim(),
            description: values.description.trim(), 
            body: values.body.trim(),
            }
        ).then((response)=>{
            onCreateBlog({isCreated: true, id:response.data.id})
        }).catch((e)=>{
            handleError(e, onCatch);
        }).finally(()=>{
            dispatch({type: ActionType.setLoading, loadingValue: false });
        })
    }
}

export const removeBlog = (setDeleted:()=>void, id: string, onCatch?:(e:any)=>void)=>{
    return async (dispatch:any)=>{
        dispatch({type: ActionType.setLoading, loadingValue: true });
        await deleteBlog(id).then(()=>{
            setDeleted();
        }).catch((e)=>{
            handleError(e, onCatch);
        }).finally(()=>{
            dispatch({type: ActionType.setLoading, loadingValue: false });
        })
    }
}


export const likeBlog = (blog:Blog, user_id:string, onCatch?:(e:any)=>void)=>{
    return async (dispatch:any)=>{
        await postBlogPreference({user_id, blog_id: blog.id, type: "like"})
        .then((response)=>{
            dispatch({type: ActionType.likeBlog, likedBlog: blog, blogPreference: response.data});
        }).catch((e)=>{
            handleError(e);
        })
    }
}

export const removeLikeBlog = (blog:Blog, preference: BlogPrefernces, onCatch?:(e:any)=>void)=>{
    return async (dispatch:any)=>{
        await deleteBlogPreference(preference.id).then((response)=>{
            dispatch({type: ActionType.removeLikeBlog, likedBlog: blog, blogPreference: preference})
        })
    }
}


