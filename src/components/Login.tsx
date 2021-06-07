import { FORM_ERROR } from 'final-form';
import React, { Dispatch, ReactElement, useEffect, useRef, useState } from 'react'
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import { getUser, login } from '../api/api';
import style from '../css/form.module.css'
import modal from '../css/modal.module.css'
import withLoading from '../hoc/withLoading';
import { ActionType } from '../local/actionType';

export default function LoginContainer(): ReactElement {
    const ref = useRef<HTMLInputElement>(null);
    const [isRedirect, setIsRedirect] = useState(false);
    const dispatch = useDispatch();
    const isLoading:boolean = useSelector((state:any) => state.appReducer.isLoading);

    useEffect(() => {
        ref.current?.focus();
    }, [])

    if(isRedirect){
        return (
            <Redirect to=""/>
        )
    }

    return <LoginWithLoading isLoading={isLoading} dispatch={dispatch} redirect={redirect} forwardRef={ref} />

    function redirect(){
        setIsRedirect(true);
    }
}

const LoginWithLoading = withLoading(Login);

interface Props {
    dispatch: Dispatch<any>,
    redirect: ()=>void,
    forwardRef: React.RefObject<HTMLInputElement>,
}

function Login({dispatch, redirect , forwardRef,}: Props): ReactElement{

    return (
        <div className={modal.background} >
            <div className={`${modal.modal} ${modal.modal_not_centered_text}`} >
                <h2 className={style.header}>React App</h2>
                <Form
                    onSubmit={onLogin}
                    initialValues={{}}
                    validate={values=>{
                        const errors:any = {};
                        if(!values.username?.trim()){
                            errors.username = 'Username is required';
                        }
                        if(!values.password?.trim()){
                            errors.password = 'Password is required';
                        }
                        return errors;
                    }}
                    render={({handleSubmit , submitError, submitting})=>(
                        <form onSubmit={handleSubmit} className={style.form}>
                            <Field name="username">
                                {({input, meta})=>(
                                    <>
                                    <label>Username:</label>
                                    <input ref={forwardRef} className={`${style.input} ${meta.error && meta.touched && style.red_input}`} {...input} type="text" placeholder="Username" />
                                    {meta.error && meta.touched && <div className={style.error} >{meta.error}</div> }
                                    </>
                                )}
                            </Field>
                            <Field name="password">
                                {({input, meta})=>(
                                    <>
                                    <label>Password:</label>
                                    <input className={`${style.input} ${meta.error && meta.touched && style.red_input}`} {...input} placeholder="Password" type="password"/>
                                    {meta.error && meta.touched && <div className={style.error} >{meta.error}</div> }
                                    </>
                                )}
                            </Field>
                            {submitError && <div className={style.error} >{submitError}</div> }
                            <div className={style.buttons_box}>
                                <button type="submit" disabled={submitting} className={style.btn}>Log in</button>
                            </div>
                        </form>
                    )}
                />

            </div>
        </div>
    )

    async function onLogin(value:any){
        dispatch({type: ActionType.setLoading, loadingValue: true });
        let error = null;

        await login(value).then((response)=>{
            localStorage.setItem('key', response.data.key);
            getUser().then((response)=>{
                dispatch({type: ActionType.setUser, user: response.data})
                redirect();
            })
        }).catch((e)=>{
            for(let key in e?.response?.data){
                console.log(key + " : " + e?.response?.data[key]);
                error = e?.response?.data[key];
            }
        }).finally(()=>{
            dispatch({type: ActionType.setLoading, loadingValue: false })
        });

        if(error){
            return {[FORM_ERROR] : error};
        }
    }

}