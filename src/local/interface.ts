//django ~userserializer
export interface User{
    pk: string,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
}



//django PostSerializer
export interface Blog{
    id: string,
    author: User,
    author_id: string,
    title: string,
    body: string,
    description: string,
    comments: Comment[],
    preferences:BlogPrefernces[],
    created_at: Date,
    updated_at: Date,
}

export interface BlogPrefernces{
    id:string,
    user:User,
    user_id:string,
    blog:Blog,
    blog_id:string,
    type:string,
    created_at:Date,
}

export interface Comment{
    id: string,
    author: User,
    author_id: number,
    blog_id: number,
    body: string,
    likes: CommentLike[],
    created_at: Date,
    updated_at: Date,
}


export interface CommentLike{
    id:string,
    user:User,
    user_id:string,
    comment:Comment,
    comment_id:string,
    created_at:Date,
}
