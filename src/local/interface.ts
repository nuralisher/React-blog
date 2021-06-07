export interface User{
    pk: string,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
}

export interface UserProfile{
    user: User,
    blogs: Blog[],
    comments: Comment[],
}

export interface Blog{
    id: string,
    title: string,
    description: string,
    body: string,
    likes: number,
    views: number,
    comments: Comment[],
    rating: number,
    author: User,
    author_id: string,
    created_at: Date,
    updated_at: Date,
}

export interface Comment{
    id: string,
    author: User,
    author_id: number,
    blog_id: number,
    body: string,
    likes: number,
    created_at: Date,
    updated_at: Date,
}


export const dateConversion = (date : Date) => {
    return new Date(date).toLocaleString();
}