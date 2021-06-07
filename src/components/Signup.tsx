import React, { Dispatch, ReactElement, useRef, useState } from 'react'
import modal from '../css/modal.module.css';
import form from '../css/form.module.css';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import withLoading from '../hoc/withLoading';
import { ActionType } from '../local/actionType';
import { FORM_ERROR } from 'final-form';
import { getUser, signUp } from '../api/api';

export default function SignupContainer(): ReactElement {
    const dispatch = useDispatch();
    const ref = useRef<HTMLInputElement>(null);
    const [isSigned, setIsSigned] = useState(false);
    const isLoading = useSelector((state:any) => state.appReducer.isLoading);

    if(isSigned){
        return <Redirect to='/' />
    }

    return (
        <SignupWithLoading
            isLoading={isLoading} 
            dispatch={dispatch} 
            redirect={redirect} 
            forwardRef={ref} />
    )

    function redirect(){
        setIsSigned(true);
    }
}

const SignupWithLoading = withLoading(Signup);

interface Props {
    dispatch: Dispatch<any>,
    redirect: ()=>void,
    forwardRef: React.RefObject<HTMLInputElement>,
}

function Signup({dispatch, redirect , forwardRef,}: Props): ReactElement{

    return (
        <div className={modal.background} >
            <div className={`${modal.modal} ${modal.modal_not_centered_text}`} >
                <h2 className={form.header}>React App</h2>
                <Form
                    onSubmit={onSignUp}
                    initialValues={{}}
                    validate={validate}
                    render={({handleSubmit , submitError, submitting})=>(
                        <form onSubmit={handleSubmit} className={form.form}>
                            <Field name="username">
                                {({input, meta})=>(
                                    <>
                                    <label>Username:</label>
                                    <input ref={forwardRef} 
                                        className={`${form.input} ${meta.error && meta.touched && form.red_input}`} 
                                        {...input} type="text" placeholder="Username" />
                                    {meta.error && meta.touched && <div className={form.error} >{meta.error}</div> }
                                    </>
                                )}
                            </Field>
                            <Field name="email">
                                {({input, meta})=>(
                                    <>
                                    <label>Email:</label>
                                    <input className={`${form.input} ${meta.error && meta.touched && form.red_input}`} 
                                        {...input} type="email" placeholder="Email" />
                                    {meta.error && meta.touched && <div className={form.error} >{meta.error}</div> }
                                    </>
                                )}
                            </Field>
                            <Field name="password1">
                                {({input, meta})=>(
                                    <>
                                    <label>Password:</label>
                                    <input className={`${form.input} ${meta.error && meta.touched && form.red_input}`} 
                                        {...input} placeholder="Password" type="password"/>
                                    {meta.error && meta.touched && <div className={form.error} >{meta.error}</div> }
                                    </>
                                )}
                            </Field>
                            <Field name="password2">
                                {({input, meta})=>(
                                    <>
                                    <label>Confirm password:</label>
                                    <input className={`${form.input} ${meta.error && meta.touched && form.red_input}`} 
                                        {...input} placeholder="Password" type="password"/>
                                    {meta.error && meta.touched && <div className={form.error} >{meta.error}</div> }
                                    </>
                                )}
                            </Field>
                            {submitError && <div className={form.error} >{submitError}</div> }
                            <div className={form.buttons_box}>
                                <button type="submit" disabled={submitting} className={form.btn}>Sign up</button>
                            </div>
                        </form>
                    )}
                />

            </div>
        </div>
    )

    function validate(values: any){
        const errors:any = {};
        if(!values.username?.trim()){
            errors.username = 'Username is required';
        }
        if(!values.email?.trim()){
            errors.email = 'Email is required';
        }
        if(!values.password1?.trim()){
            errors.password1 = 'Password is required';
        }
        if(values.password2?.trim()!=values.password1?.trim()){
            errors.password2 = 'Password does not match';
        }
        if(values.password1?.trim().length<8){
            errors.password1 = 'This password is too short. It must contain at least 8 characters';
        }
        if(!values.password2?.trim()){
            errors.password2 = 'Confirm password';
        }
        return errors;
    }

    async function onSignUp(value:any){
        dispatch({type: ActionType.setLoading, loadingValue: true });
        let error:any;

        await signUp(value).then((response)=>{
            localStorage.setItem('key', response.data.key);
            getUser().then((response)=>{
                dispatch({type: ActionType.setUser, user: response.data})
                redirect();
            })
        }).catch((e)=>{
            error = e?.response?.data;
        }).finally(()=>{
            dispatch({type: ActionType.setLoading, loadingValue: false })
        })


        
        for(let key in error){
            return {[FORM_ERROR]: error[key]}
        }

    }


}
