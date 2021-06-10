import { FORM_ERROR } from 'final-form';
import React, { Dispatch, ReactElement, useEffect, useRef, useState } from 'react'
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useRouteMatch } from 'react-router-dom';
import style from '../css/blogcreate.module.css';
import formStyle from '../css/form.module.css';
import withLoading from '../hoc/withLoading';
import withLoginRedirect from '../hoc/withLoginRedirect';
import { Blog, User } from '../local/interface';
import { loadBlog, removeBlog, updateBlog } from '../redux/blogReducer';
import BlogDelete from './BlogDelete';
import DeletedBlog from './DeletedBlog';

export default function BlogEditContainer(): ReactElement {
    const dispatch = useDispatch();
    const isLogged:boolean = useSelector((state:any) => state.userReducer.isLogged);
    const isLoading:boolean = useSelector((state:any)=> state.appReducer.isLoading);
    const me:User = useSelector((state:any) => state.userReducer.currentUser);
    const blog:Blog = useSelector((state:any)=> state.blogReducer.selectedBlog);
    let match = useRouteMatch<{id:string}>();
    const [isSaved, setIsSaved] = useState(false);
    const ref = useRef<HTMLTextAreaElement>(null);
    const descriptionField = useRef<HTMLTextAreaElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(()=>{
        dispatch(loadBlog(match.params.id, me, autoResize));
    }, [])

    if(isSaved){
        return <Redirect to={`/blogs/${match.params.id}`} />
    }

    return (
        <>
            {!isDeleted ?
            <BlogEditWrapp 
                dispatch={dispatch}
                onSaveBlog={onSaveBlog}
                me={me}
                blog={blog}
                isLoading={isLoading}
                isLogged={isLogged}
                autoResize={autoResize}
                forwardRef={ref}
                descriptionField={descriptionField}
                openModal={openModal}

            />
            :
            <DeletedBlog blogTitle={blog.title}/>
            }
            {showModal && <BlogDelete onDelete={onDelete} closeModal={closeModal} blogTitle={blog.title} />}
        </>
    )

    function onSaveBlog(value:boolean){
        setIsSaved(value);
    }

    function autoResize(){
        if(ref.current){
            ref.current.style.height='auto';
            ref.current.style.height=ref.current.scrollHeight+'px';
        }
        if(descriptionField.current){
            descriptionField.current.style.height='auto';
            descriptionField.current.style.height = descriptionField.current.scrollHeight+'px';
        }
    }

    function openModal(){
        setShowModal(true);
    }

    function closeModal(){
        setShowModal(false);
    }

    async function onDelete(){
        setShowModal(false);
        let error = "";
        const setError=(e:any)=>{error=e}
        await dispatch(removeBlog(setDeleted, blog.id, setError));
        error && console.log(error);
        
    }

    function setDeleted(){
        setIsDeleted(true);
    }
}


const BlogEditWrapp = withLoginRedirect(withLoading(BlogEdit));

interface Props {
    dispatch: Dispatch<any>,
    onSaveBlog: (value: boolean )=>void,
    me: User,
    blog: Blog,
    autoResize: ()=>void,
    forwardRef: React.RefObject<HTMLTextAreaElement>,
    openModal: ()=>void,
    descriptionField: React.RefObject<HTMLTextAreaElement>,
}

function BlogEdit({dispatch, onSaveBlog, me, blog, autoResize, forwardRef, descriptionField, openModal}:Props){
    return (
        <div className={style.container} >
            <Form
                onSubmit={submitHandler}
                initialValues={{title: blog.title, description: blog.description, body: blog.body}}
                validate={values=>{
                    const errors:any = {};
                    if(values.title?.length>50){
                        errors.title = 'Title can not be more than 50 characters';
                    }
                    if(values.description?.length>150){
                        errors.description = 'Description can not be more than 150 characters';
                    }
                    if(!values.title?.trim()){
                        errors.title = 'Title is required';
                    }
                    if(!values.description?.trim()){
                        errors.description = 'Description is required';
                    }
                    if(!values.body?.trim()){
                        errors.body = 'Body is required';
                    }

                    if(values.body?.trim()===blog.body?.trim() 
                    && values.title?.trim()===blog.title?.trim()
                    && values.description?.trim()===blog.description?.trim()){
                        errors.button = 'Not changed';
                    }

                    return errors;
                }}
                render={({handleSubmit , submitError, submitting})=>(
                    <form onSubmit={handleSubmit} >
                        <div className={style.form_header}>
                            <h2>Edit your blog</h2>
                            <div className={style.header_description}>
                                Edit your blog, and click save to save changes
                            </div>
                        </div>
                        <Field name="title">
                                {({input, meta})=>(
                                    <div className={style.field} >
                                    <label>Title:</label>
                                    <input {...input} className={`${formStyle.input} ${meta.error && meta.touched && formStyle.red_input}`} type="text" placeholder="Title" />
                                    {meta.error && meta.touched && <div className={formStyle.error} >{meta.error}</div> }
                                    <div className={style.field_description} >Title will be shown in the list of blogs. In the title write topic of your blog</div>
                                    </div>
                                )}
                            </Field>
                            <Field name="description">
                                {({input, meta})=>(
                                    <div className={style.field} >
                                    <label>Description:</label>
                                    <textarea ref={descriptionField} onInput={autoResize} {...input} className={`${formStyle.input} ${meta.error && meta.touched && formStyle.red_input}`} placeholder="Description" />
                                    {meta.error && meta.touched && <div className={formStyle.error} >{meta.error}</div> }
                                    <div className={style.field_description} >Description will be shown in the list of blogs. Here write short description of your blog</div>
                                    </div>
                                )}
                            </Field>
                            <Field name="body">
                                {({input, meta})=>(
                                    <div className={style.field}>
                                    <label>Body:</label>
                                    <textarea ref={forwardRef} onInput={autoResize} {...input} className={`${formStyle.input} ${meta.error && meta.touched && formStyle.red_input}`} placeholder="Body" />
                                    {meta.error && meta.touched && <div className={formStyle.error} >{meta.error}</div> }
                                    <div className={style.field_description} >Body will not be shown in the list of blogs. In the body write all about of your blog</div>
                                    </div>
                                )}
                            </Field>
                            {submitError && <div className={formStyle.error} >{submitError}</div> }
                            <Field name="button">
                                {({input, meta})=>(
                                <div className={formStyle.buttons_box}>
                                    <button type="submit" disabled={submitting || meta.error} 
                                        className={`${formStyle.btn} ${formStyle.btn_short}`}>Save</button>
                                    <button onClick={openModal} className={`${formStyle.btn} ${formStyle.btn_short} ${formStyle.btn_danger}`}>Delete</button>
                                </div>
                                )}
                            </Field>
                    </form>
                )}
            />
        </div>
    )

    async function submitHandler(values: any){
        let error = "";
        const setError=(e:any)=>{error=e}
        await dispatch(updateBlog(blog, me, values, onSaveBlog, setError));
        if(error){
            return {[FORM_ERROR] : error};
        }
    }
}