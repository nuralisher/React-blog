import React, { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { match, useRouteMatch } from 'react-router'
import { Blog, User } from '../local/interface';
import style from '../css/bloglist.module.css';
import like from '../images/like.svg';
import liked from '../images/liked.svg';
import edit_icon from '../images/pencil.svg';
import { Link } from 'react-router-dom';
import withLoading from '../hoc/withLoading';
import { likeBlog, loadBlog, removeLikeBlog } from '../redux/blogReducer';
import { amILikedBlog, dateConversion } from '../local/utils';
import Comments from './Comments';


export default function BlogDetailContainer(): ReactElement {
    let match = useRouteMatch<{id:string}>();
    const dispatch = useDispatch();
    const blog:Blog = useSelector((state:any) => state.blogReducer.selectedBlog);
    const isLoading:boolean = useSelector((state:any) => state.appReducer.isLoading);
    const me:User = useSelector((state:any) => state.userReducer.currentUser);

    useEffect(()=>{
        dispatch(loadBlog(match.params.id, me));
    }, [])

    return (
    <div className='container' >
        <BlogDetailWithLoading onLikeClick={onLikeClick} isLoading={isLoading} blog={blog} me={me} match={match} />
        <Comments/>
    </div>
    )

    async function onLikeClick(blo:Blog, ){
        if(!amILikedBlog(blog, me)){
            await dispatch(likeBlog(blog, me.pk));
        }else{
            const preference = blog.preferences.find(p=>p.user.pk===me.pk && p.type==="like");
            preference && await dispatch(removeLikeBlog(blog, preference));
        }
    }
}

const BlogDetailWithLoading = withLoading(BlogDetail);


interface Props {
    blog: Blog,
    me: User,
    match: match<{id: string}>,
    onLikeClick:(blog:Blog,)=>void,
}

function BlogDetail({blog, me, match, onLikeClick ,}: Props): ReactElement{
    if (blog.id) {
        return (
            <>
                <div className={style.blog_container}>
                    <div className={style.author} >{blog.author.pk===me.pk ? "You" :  "Alisher Nurzhanuly"}</div>
                    <div className={style.flat_title}>
                        <div>{blog.title}</div> 
                        {blog.author.pk===me.pk && <Link to={`${match.url}/edit`} className={style.edit_btn} >Edit <img src={edit_icon} alt="edit" /> </Link> } 
                    </div>
                    <div className={style.date} >
                        {dateConversion(blog.created_at)} 
                        {blog.created_at != blog.updated_at && 
                        <span> (edited at {dateConversion(blog.updated_at)})</span> }
                    </div>
                    <div className={style.descriptiond} >
                        {blog.description}
                    </div>
                    <pre className={style.body}>
                        {blog.body}
                    </pre>                
                    <div className={style.container_footer} >
                        <div  onClick={(e)=>onLikeClick(blog)} className={style.like_icon}>
                            {amILikedBlog(blog, me) ? 
                            <img src={liked} alt="liked" width="20px" />
                            :
                            <img src={like} alt="like" width="20px" />
                            }
                        </div>
                        <div className={style.like_count}> {blog.preferences.filter(p=>p.type==='like').length} </div>
                    </div>
                </div>
            </>
        )
    }else{
        return (
            <div>
                <h2>Something went wrong. Blog not found</h2>
            </div>
        )
    }
}