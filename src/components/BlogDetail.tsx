import React, { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { match, useRouteMatch } from 'react-router'
import { getBlog } from '../api/api'
import { ActionType } from '../local/actionType';
import { Blog, dateConversion, User } from '../local/interface';
import style from '../css/bloglist.module.css';
import like from '../images/like.svg';
import view from '../images/view.svg';
import comment from '../images/comment.svg';
import edit_icon from '../images/pencil.svg';
import { Link } from 'react-router-dom';
import withLoading from '../hoc/withLoading';


export default function BlogDetailContainer(): ReactElement {
    let match = useRouteMatch<{id:string}>();
    const dispatch = useDispatch();
    const blog:Blog = useSelector((state:any) => state.blogReducer.selectedBlog);
    const isLoading:boolean = useSelector((state:any) => state.appReducer.isLoading);
    const me:User = useSelector((state:any) => state.userReducer.currentUser);

    useEffect(()=>{
        dispatch({type: ActionType.setLoading, loadingValue: true })
        getBlog(match.params.id).then((response)=>{
            dispatch({type: ActionType.setSelectedBlog, selectedBlog: response.data});
        }).catch((e)=>{
            console.error(e);
        }).finally(()=>{
            dispatch({type: ActionType.setLoading, loadingValue: false })
        });
    }, [])

    return <BlogDetailWithLoading isLoading={isLoading} blog={blog} me={me} match={match} />
}

const BlogDetailWithLoading = withLoading(BlogDetail);


interface Props {
    blog: Blog,
    me: User,
    match: match<{id: string}>
}

function BlogDetail({blog, me, match}: Props): ReactElement{
    if (blog.id) {
        return (
            <div className='container' >
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
            </div>
        )
    }else{
        return (
            <div>
                <h2>Something went wrong. Blog not found or maybe loading</h2>
            </div>
        )
    }
}