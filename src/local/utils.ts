import { Blog, User, Comment } from "./interface";

export const updateObjectInArray = (items: any, itemId: any, objPropName: any, newObjProps: any) => {
    return items.map((item: any) => {
        if (item[objPropName] === itemId) {
            return {...item, ...newObjProps}
        }
        return item;
    })
}

export const handleError = (e:any, onCatch?:(e:any)=>void)=>{
    for(let key in e?.response?.data){
        onCatch && onCatch(e?.response?.data[key]);
        return
    }
}


export const dateConversion = (date : Date) => {
    return new Date(date).toLocaleString();
}

export const amILikedBlog = (blog: Blog, me: User)=>{
    let isLiked = false;
    blog.preferences.map((p)=>{
        if(p.user.pk===me.pk && p.type==="like" ){
            isLiked = true;
            return
        }
    })
    return isLiked;
}

export const amILikedComment = (comment:Comment, me:User)=>{
    let isLiked = false;
    comment.likes.map((cl)=>{
        if(cl.user.pk===me.pk){
            isLiked = true;
            return
        }
    })
    return isLiked
}

export const amIViewdBlog = (blog: Blog, me: User)=>{
    let isLiked = false;
    blog.preferences.map((p)=>{
        if(p.user.pk===me.pk && p.type==="view" ){
            isLiked = true;
            return
        }
    })
    return isLiked;
}