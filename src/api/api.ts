import Axios from "axios";
import { Comment, User } from "../local/interface";

const instance = Axios.create({
    baseURL: "http://localhost:8000/",
})

instance.interceptors.request.use(
    (request)=>{
        if(localStorage.getItem('key')){
            request.headers['Authorization'] = `Token ${localStorage.getItem('key')}`
        }

        return request;
    },
    (e)=>{}
)

export const getBlogs = (limit: number , offset:number, orderBy="" ,search="")=>{
    return instance.get(`/blogs/?limit=${limit}&offset=${offset}&ordering=${orderBy}&search=${search}`);
}

export const getBlog = (id: string)=>{
    return instance.get(`/blogs/${id}/`);
}

export const login = (cridentials: any)=>{
    return instance.post('dj_rest_auth/login/', cridentials );
}

export const getUser = ()=>{
    return instance.get('dj_rest_auth/user/');
}

export const logout = ()=>{
    return instance.post('dj_rest_auth/logout/');
}

export const postBlog = (payload: 
    {author_id: string, 
    title: string,
    description: string, 
    body: string,
    })=>{
    return instance.post('/blogs/', payload);
}

export const putBlog = (blogId:string , 
    payload: {author_id: string, 
        title: string, 
        description:string,
        body: string, 
     })=>{
    return instance.put(`/blogs/${blogId}/`, payload);
}

export const deleteBlog = (blogId:string)=>{
    return instance.delete(`/blogs/${blogId}/`);
}

export const signUp = (cridentials:any)=>{
    return instance.post('/dj_rest_auth/registration/', cridentials);
}

export const postBlogPreference = (preference:{user_id:string, blog_id:string, type: string  })=>{
    return instance.post('/blogs/preferences/', preference);
}

export const deleteBlogPreference = (preference_id:string)=>{
    return instance.delete(`/blogs/preferences/${preference_id}/`);
}

export const postComment = (comment: {author_id: string, blog_id: string, body: string})=>{
    return instance.post('/comments/', comment);
}

export const postCommentLike = (like: {user_id: string , comment_id: string})=>{
    return instance.post('/comments/likes/', like);
}

export const deleteCommentLike = (like_id: string)=>{
    return instance.delete(`/comments/likes/${like_id}/`);
}