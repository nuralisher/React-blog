import React, { ReactElement, useEffect, useRef } from 'react'
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
    const currentPage: number = useSelector((state: any) => state.blogReducer.currentPage);
    let match = useRouteMatch();
    const isLoading:boolean = useSelector((state:any) => state.appReducer.isLoading);
    const me:User = useSelector((state:any) => state.userReducer.currentUser);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadBlogs(pageSize, currentPage);
    }, [])

    return (
        <div className='container' >
        <BlogsWithLoading isLoading={isLoading} blogsList={blogsList} match={match} me={me} forwardRef={ref} />
        <Paginator
            goToPage={goToPage}
            pageNumber={Math.ceil(blogTotalCount/pageSize)}
            currentPage={currentPage} 
        />
        </div>
    )


    function loadBlogs(limit:number, page:number){
        dispatch({type: ActionType.setLoading, loadingValue: true });
        getBlogs(limit, (page-1)*limit ).then(
            (response)=>{
                dispatch({type: ActionType.setCurrentBlogsPage, currentPage: page});
                dispatch({type: ActionType.setBlogs, blogs: response.data.results});
                dispatch({type: ActionType.setBlogsCount, count: response.data.count});
                scrollToTop();
            }
        ).finally(()=>{
            dispatch({type: ActionType.setLoading, loadingValue: false })
        });
    }

    function goToPage(value:string ){
        if(currentPage===parseInt(value)){
            return
        }

        switch (value){
            case "next":
                console.log("next");
                loadBlogs(pageSize, currentPage+1)
                break;
            case "prev":
                console.log("prev")
                loadBlogs(pageSize, currentPage-1)
                break;
            default:
                console.log("number")
                loadBlogs(pageSize , parseInt(value) )
        }
    }


    function scrollToTop(){
        ref.current?.scrollIntoView({behavior: "smooth"})
    }
}

 

interface Props {
    blogsList: Blog[],
    match: match<{}>,
    me:User,
    forwardRef: React.RefObject<HTMLDivElement>
}



export function Blogs({blogsList, match, me, forwardRef }: Props): ReactElement {
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