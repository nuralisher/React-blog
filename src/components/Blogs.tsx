import React, { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, match, useRouteMatch } from 'react-router-dom';
import { getBlogs, getUser } from '../api/api';
import { ActionType } from '../local/actionType';
import { Blog, dateConversion, User } from '../local/interface';
import style from '../css/bloglist.module.css';
import like from '../images/like.svg';
import view from '../images/view.svg';
import comment from '../images/comment.svg';
import withLoading from '../hoc/withLoading';
import Paginator from './Paginator';

export default function BlogsContainer(): ReactElement {
    const dispatch = useDispatch();
    const blogsList: Blog[] = useSelector((state: any) => state.blogReducer.blogs);
    const pageSize: number = useSelector((state: any) => state.blogReducer.pageSize);
    const blogTotalCount: number = useSelector((state: any) => state.blogReducer.count);
    const nextPageUrl: string = useSelector((state: any) => state.blogReducer.next);
    const prevPageUrl: string = useSelector((state: any) => state.blogReducer.previous);
    const currentPage: number = useSelector((state: any) => state.blogReducer.currentPage);
    let match = useRouteMatch();
    const isLoading:boolean = useSelector((state:any) => state.appReducer.isLoading);
    const me:User = useSelector((state:any) => state.userReducer.currentUser);

    useEffect(() => {
        dispatch({type: ActionType.setLoading, loadingValue: true });
        getBlogs().then(
            (response)=>{
                dispatch({type: ActionType.setBlogs, blogs: response.data.results});
                dispatch({type: ActionType.setBlogsCount, count: response.data.count});
                dispatch({type: ActionType.setBlogsNext, next: response.data.next});
                dispatch({type: ActionType.setBlogsPrev, previous: response.data.previous});
            }
        ).finally(()=>{
            dispatch({type: ActionType.setLoading, loadingValue: false })
        });
    }, [])

    return (
        <div className='container' >
        <BlogsWithLoading isLoading={isLoading} blogsList={blogsList} match={match} me={me} />
        <Paginator
            pageNumber={Math.ceil(blogTotalCount/pageSize)}
            currentPage={currentPage} 
        />
        </div>
    )
}

 

interface Props {
    blogsList: Blog[],
    match: match<{}>,
    me:User,
}



export function Blogs({blogsList, match, me }: Props): ReactElement {
    return (
        <>
            {
                blogsList.map((blog)=>
                    <div className={style.blog_container} key={blog.id} >
                    <div className={style.author} >{blog.author.pk==me.pk ? "You" :  blog.author?.username}</div>
                        <Link className={style.title} to={`${match.url}/${blog.id}`} > {blog.title} </Link> 
                        <div className={style.date} >
                            {dateConversion(blog.created_at)} 
                            {blog.created_at != blog.updated_at && 
                            <span> (edited at {dateConversion(blog.updated_at)})</span> }
                        </div>
                        <div className={style.description} >
                            {blog.description}
                        </div>
                        <div className={style.container_footer} >
                            <div className={style.like} >
                                <img src={like} alt="like" width="20px" />
                                <div className={style.like_count}> {blog.likes} </div>
                            </div>
                            <div className={style.view} >
                                <img src={view} alt="view" width="20px" />
                                <div className={style.view_count}> {blog.views} </div>
                            </div>
                            <div className={style.comment} >
                                <img src={comment} alt="comment" width="20px" />
                                <div className={style.comment_count}> {blog.comments.length} </div>
                            </div>
                        </div>
                    </div>
                )
                
            }
        </>
    )
}


const BlogsWithLoading = withLoading(Blogs)