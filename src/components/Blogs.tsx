import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, match, Redirect, useRouteMatch } from 'react-router-dom';
import { Blog, User } from '../local/interface';
import style from '../css/bloglist.module.css';
import form from '../css/form.module.css';
import like from '../images/like.svg';
import liked from '../images/liked.svg';
import view from '../images/view.svg';
import comment from '../images/comment.svg';
import withLoading from '../hoc/withLoading';
import Paginator from './Paginator';
import { likeBlog, loadBlogs, removeLikeBlog } from '../redux/blogReducer';
import { dateConversion, amILikedBlog } from '../local/utils';
import BlogFilter from './BlogFilter';

export default function BlogsContainer(): ReactElement {
    const dispatch = useDispatch();
    const blogsList: Blog[] = useSelector((state: any) => state.blogReducer.blogs);
    const pageSize: number = useSelector((state: any) => state.blogReducer.pageSize);
    const blogTotalCount: number = useSelector((state: any) => state.blogReducer.count);
    const searchText: string = useSelector((state: any) => state.blogReducer.searchText);
    const orderByValue: string = useSelector((state: any) => state.blogReducer.orderBy);
    const currentPage: number = useSelector((state: any) => state.blogReducer.currentPage);
    let match = useRouteMatch();
    const isLoading:boolean = useSelector((state:any) => state.appReducer.isLoading);
    const me:User = useSelector((state:any) => state.userReducer.currentUser);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(loadBlogs(pageSize, currentPage, me));
    }, [])


    return (
        <div className='container' >
            <BlogFilter orderByValue={orderByValue} orderBy={orderBy} searchText={searchText} onSearch={onSearch} />
            {searchText && 
                <div className={style.search_result_box}>
                    <span className={style.search_result}>Search resuls for {searchText}</span>
                    <span onClick={clearSearch} className={`${form.link} ${form.link_danger}`} >Click to clear search</span>
                </div> }
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


    async function onSearch(values:{search:string}){
        await dispatch(loadBlogs(pageSize, 1, me, orderByValue, values.search));
    }

    function clearSearch(){
        dispatch(loadBlogs(pageSize, 1, me));
    }

    function orderBy(value:string){
        console.log(value);
        dispatch(loadBlogs(pageSize, currentPage, me, value, searchText))
    }

    async function goToPage(value:string ){
        if(currentPage===parseInt(value)){
            return
        }
        await dispatch(loadBlogs(pageSize , parseInt(value), me,  orderByValue, searchText, scrollToTop))
    }


    function scrollToTop(){
        ref.current?.scrollIntoView({behavior: "smooth"})
    }

    async function onLikeClick(blog:Blog, ){
        if(!amILikedBlog(blog, me)){
            await dispatch(likeBlog(blog, me.pk));
        }else{
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
    onLikeClick:(blog:Blog,)=>void,
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
                            <div className={`${style.like} ${amILikedBlog(blog, me) && style.liked}`} >
                                <div  onClick={(e)=>onLikeClick(blog)} className={style.like_icon}>
                                    {amILikedBlog(blog, me) ? 
                                    <img src={liked} alt="liked" width="20px" />
                                    :
                                    <img src={like} alt="like" width="20px" />
                                    }
                                </div>
                                <div className={style.like_count}> {blog.preferences.filter(p=>p.type==='like').length} </div>
                            </div>
                            <div className={style.comment} >
                                <div className={style.comment_icon}>
                                    <img src={comment} alt="comment" width="20px" />
                                </div>
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