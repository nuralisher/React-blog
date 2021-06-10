import React, { ReactElement, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, match, useRouteMatch } from 'react-router-dom';
import { Blog, User } from '../local/interface';
import style from '../css/bloglist.module.css';
import like from '../images/like.svg';
import liked from '../images/liked.svg';
import view from '../images/view.svg';
import comment from '../images/comment.svg';
import withLoading from '../hoc/withLoading';
import Paginator from './Paginator';
import { likeBlog, loadBlogs, removeLikeBlog } from '../redux/blogReducer';
import { dateConversion, amILikedBlog } from '../local/utils';

export default function BlogsContainer(): ReactElement {
    const dispatch = useDispatch();
    const blogsList: Blog[] = useSelector((state: any) => state.blogReducer.blogs);
    const pageSize: number = useSelector((state: any) => state.blogReducer.pageSize);
    const blogTotalCount: number = useSelector((state: any) => state.blogReducer.count);
    const currentPage: number = useSelector((state: any) => state.blogReducer.currentPage);
    let match = useRouteMatch();
    const isLoading:boolean = useSelector((state:any) => state.appReducer.isLoading);
    const me:User = useSelector((state:any) => state.userReducer.currentUser);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(loadBlogs(pageSize, currentPage, scrollToTop, me));
    }, [])

    return (
        <div className='container' >
        <BlogsWithLoading 
            isLoading={isLoading}
            blogsList={blogsList}
            match={match} me={me}
            forwardRef={ref}
            onLikeClick={onLikeClick}
        />
        <Paginator
            goToPage={goToPage}
            pageCount={Math.ceil(blogTotalCount/pageSize)}
            currentPage={currentPage} 
        />
        </div>
    )

    async function goToPage(value:string ){
        if(currentPage===parseInt(value)){
            return
        }
        await dispatch(loadBlogs(pageSize , parseInt(value), scrollToTop, me))
    }


    function scrollToTop(){
        ref.current?.scrollIntoView({behavior: "smooth"})
    }

    async function onLikeClick(blog:Blog, target: EventTarget, ){
        console.log(target);
        if(!amILikedBlog(blog, me)){
            console.log("like");
            await dispatch(likeBlog(blog, me.pk));
        }else{
            console.log("remove like");
            const preference = blog.preferences.find(p=>p.user.pk===me.pk && p.type==="like");
            preference && await dispatch(removeLikeBlog(blog, preference));
        }

    }
}

 

interface Props {
    blogsList: Blog[],
    match: match<{}>,
    me:User,
    forwardRef: React.RefObject<HTMLDivElement>,
    onLikeClick:(blog:Blog, target: EventTarget)=>void,
}



export function Blogs({blogsList, match, me, forwardRef, onLikeClick ,}: Props): ReactElement {
    return (
        <>
        <div ref={forwardRef} className={style.top} ></div>
            {
                blogsList.map((blog, i)=>
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
                            <div onClick={(e)=>onLikeClick(blog, e.target )}
                            className={`${style.like} ${amILikedBlog(blog, me) && style.liked}`} >
                                {amILikedBlog(blog, me) ? 
                                <img src={liked} alt="liked" width="20px" />
                                :
                                <img src={like} alt="like" width="20px" />
                                }
                                <div className={style.like_count}> {blog.preferences.filter(p=>p.type==='like').length} </div>
                            </div>
                            <div className={style.view} >
                                <img src={view} alt="view" width="20px" />
                                <div className={style.view_count}> {blog.preferences.filter(p=>p.type==='view').length} </div>
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