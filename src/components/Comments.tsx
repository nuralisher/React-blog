import React, { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Blog, User, Comment} from '../local/interface';
import style from '../css/comment.module.css'
import { amILikedComment, dateConversion } from '../local/utils';
import like from '../images/like.svg';
import liked from '../images/liked.svg';
import comment from '../images/comment.svg';
import { likeComment, removeLikeComment } from '../redux/blogReducer';

interface Props {
    
}

export default function Comments({}: Props): ReactElement {
    const comments:Comment[] = useSelector((state:any) => state.blogReducer.selectedBlog.comments);
    const me:User = useSelector((state:any) => state.userReducer.currentUser);
    const dispatch = useDispatch();


    return (
        <div className={style.comments_box} >
        <div className={style.header}>
            {comments?.length!=0 && <span className={style.comment_length}>{comments?.length}</span>}
            {comments?.length===1 ? 
            <span className={style.header_name}>Comment</span>
            : 
            <span className={style.header_name}>Comments</span>
            }
            <img src={comment} alt="comment" width="20px" />
        </div>
            {comments?.length>0?
            <>
            <div className={style.comments_inner_box}>
            {
            comments.map((comment)=>(
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
                            <div className={`${style.like} ${amILikedComment(comment, me) && style.liked}`} >
                                <div onClick={(e)=>onLikeClick(comment)} className={style.like_icon}>
                                    {amILikedComment(comment, me) ?
                                        <img src={liked} alt="liked" width="20px" />
                                        :
                                        <img src={like} alt="like" width="20px" />
                                    }
                                </div>
                                {comment.likes.length!=0 &&  <div className={style.like_count}>{comment.likes.length}</div> }
                            </div>
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


    function onLikeClick(comment:Comment){
        if(!amILikedComment(comment, me)){
            dispatch(likeComment(comment, me.pk));
        }else{
            const like = comment.likes.find(l=>l.user.pk===me.pk);
            like && dispatch(removeLikeComment(comment, like));
        }
    }
}
