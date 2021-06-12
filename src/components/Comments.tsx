import React, { ReactElement, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Blog, User } from '../local/interface';
import style from '../css/comment.module.css'
import { amILikedComment, dateConversion } from '../local/utils';
import like from '../images/like.svg';
import liked from '../images/liked.svg';
import comment from '../images/comment.svg';

interface Props {
    
}

export default function Comments({}: Props): ReactElement {
    const blog:Blog = useSelector((state:any) => state.blogReducer.selectedBlog);
    const me:User = useSelector((state:any) => state.userReducer.currentUser);


    return (
        <div className={style.comments_box} >
        <div className={style.header}>
            {blog.comments?.length!=0 && <span className={style.comment_length}>{blog.comments?.length}</span>}
            {blog.comments?.length===1 ? 
            <span className={style.header_name}>Comment</span>
            : 
            <span className={style.header_name}>Comments</span>
            }
            <img src={comment} alt="comment" width="20px" />
        </div>
            {blog.comments?.length>0?
            <>
            <div className={style.comments_inner_box}>
            {
            blog.comments.map((comment)=>(
                    <div className={style.comment_box} >
                        <div className={style.comment_header}>
                            <div className={style.author}>{comment.author.username}</div>
                            <div className={style.date} >
                                {dateConversion(comment.created_at)} 
                                {comment.created_at != comment.updated_at && 
                                <span> (edited at {dateConversion(comment.updated_at)})</span> }
                            </div>
                        </div>
                        <div className={style.comment_body}>
                            {comment.body}
                        </div>
                        <div className={style.comment_footer}>
                        {amILikedComment(comment, me) ?
                            <img src={liked} alt="liked" width="20px" />
                            :
                            <img src={like} alt="like" width="20px" />
                        }
                        {comment.likes.length!=0 &&  <div className={style.like_count}>{comment.likes.length}</div> }
                        </div>
                    </div>
                ))
            }
            </div>
            </>
            :
                <div className={style.no_comment}>
                    No Comments
                </div>
            }
        </div>
    )
}
