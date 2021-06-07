import { FORM_ERROR } from 'final-form'
import React, { Dispatch, ReactElement, useEffect, useRef, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router'
import { postBlog } from '../api/api'
import style from '../css/blogcreate.module.css'
import { ActionType } from '../local/actionType'
import { User } from '../local/interface'
import formStyle from '../css/form.module.css'
import withLoading from '../hoc/withLoading'
import withLoginRedirect from '../hoc/withLoginRedirect'


export default function BlogCreateContainer(): ReactElement {
    const dispatch = useDispatch();
    const isLogged:boolean = useSelector((state:any) => state.userReducer.isLogged);
    const me:User = useSelector((state:any) => state.userReducer.currentUser);
    const isLoading:boolean = useSelector((state:any)=> state.appReducer.isLoading);
    const [createdBlog, setCreatedBlog] = useState({isCreated: false, id: ""});
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setCreatedBlog({isCreated: false, id:""});
        ref.current?.focus();
    }, [])

    if(createdBlog.isCreated){
        return <Redirect to={`/blogs/${createdBlog.id}`} />
    }

    return <BlogCreateWrapp 
        isLoading={isLoading} 
        isLogged={isLogged} 
        dispatch={dispatch} 
        onCreateBlog={onCreateBlog} 
        me={me} 
        initialValues={{}}
        forwardRef={ref}
        />

    function onCreateBlog(value:  {isCreated:boolean, id: string}){
        setCreatedBlog(value);
    }
}


const BlogCreateWrapp = withLoginRedirect(withLoading(BlogCreate))

interface Props {
    dispatch: Dispatch<any>,
    onCreateBlog: (value: {isCreated:boolean, id: string} )=>void,
    me: User,
    initialValues: any,
    forwardRef: React.RefObject<HTMLInputElement>,
}

function BlogCreate({dispatch, onCreateBlog, me , initialValues, forwardRef}: Props): ReactElement{
    return (
        <div className={style.container} >
            <Form
                onSubmit={submitHandler}
                initialValues={initialValues}
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
                    return errors;
                }}
                render={({handleSubmit , submitError, submitting})=>(
                    <form onSubmit={handleSubmit} >
                        <div className={style.form_header}>
                            <h2>Create a new blog</h2>
                            <div className={style.header_description}>
                                Write a blog on a topic that you want, and share it with friends!
                            </div>
                        </div>
                        <Field name="title">
                                {({input, meta})=>(
                                    <div className={style.field} >
                                    <label>Title:</label>
                                    <input ref={forwardRef} {...input} className={`${formStyle.input} ${meta.error && meta.touched && formStyle.red_input}`} type="text" placeholder="Title" />
                                    {meta.error && meta.touched && <div className={formStyle.error} >{meta.error}</div> }
                                    <div className={style.field_description} >Title will be shown in the list of blogs. In the title write topic of your blog</div>
                                    </div>
                                )}
                            </Field>
                            <Field name="description">
                                {({input, meta})=>(
                                    <div className={style.field} >
                                    <label>Description:</label>
                                    <textarea onInput={autoResize} {...input} className={`${formStyle.input} ${meta.error && meta.touched && formStyle.red_input}`} placeholder="Description" />
                                    {meta.error && meta.touched && <div className={formStyle.error} >{meta.error}</div> }
                                    <div className={style.field_description} >Description will be shown in the list of blogs. Here write short description of your blog</div>
                                    </div>
                                )}
                            </Field>
                            <Field name="body">
                                {({input, meta})=>(
                                    <div className={style.field}>
                                    <label>Body:</label>
                                    <textarea onInput={autoResize} {...input} className={`${formStyle.input} ${meta.error && meta.touched && formStyle.red_input}`} placeholder="Body" />
                                    {meta.error && meta.touched && <div className={formStyle.error} >{meta.error}</div> }
                                    <div className={style.field_description} >Body will not be shown in the list of blogs. In the body write all about of your blog</div>
                                    </div>
                                )}
                            </Field>
                            {submitError && <div className={formStyle.error} >{submitError}</div> }
                            <div className={formStyle.buttons_box}>
                                <button type="submit" disabled={submitting} className={`${formStyle.btn} ${formStyle.btn_short}`}>Post</button>
                            </div>
                    </form>
                )}
            />
        </div>
    )


    function autoResize(e:any){
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }

    async function submitHandler(values: any){
        dispatch({type: ActionType.setLoading, loadingValue: true });
        let error; 
        await postBlog(
            {author_id: me.pk, 
            title: values.title.trim(),
            description: values.description.trim(), 
            body: values.body.trim(),
            }
        ).then((response)=>{
            onCreateBlog({isCreated: true, id:response.data.id})
        }).catch((e)=>{
            error = e.toString();
        }).finally(()=>{
            dispatch({type: ActionType.setLoading, loadingValue: false });
        })

        if(error){
            return {[FORM_ERROR] : error};
        }
    }
}