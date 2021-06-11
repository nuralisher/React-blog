import React, { ReactElement, useState } from 'react'
import { Field, Form } from 'react-final-form'
import form from '../css/form.module.css'
import style from '../css/bloglist.module.css'
import searchIcon from '../images/loupe.svg'
import selectedIcon from '../images/check.svg'

interface Props {
    searchText: string,
    onSearch: (values:{search: string})=>void,
    orderBy: (value:string)=>void,
    orderByValue:string,
}

export default function BlogFilter({ searchText, onSearch, orderBy, orderByValue }: Props): ReactElement {

    const [showDrop, setShowDrop] = useState(false);

    return (
        <div className={style.filter_block} >
            <Form 
                onSubmit={onSearch}
                initialValues={{search: searchText}}
                validate={values=>{
                    const errors:any = {};
                    if(!values.search?.trim()) errors.search = "Empty search"
                    return errors;
                }}
                render={({handleSubmit , submitError, submitting})=>(
                    <form className={form.searchForm} onSubmit={handleSubmit} >
                        <Field name="search" >
                            {({input, meta})=>(
                                <div className={form.search_input_box }>
                                    <input className={form.search_input} type="text" {...input} placeholder="Search..." />
                                    <button disabled={submitting} type="submit" ><img src={searchIcon} width="15px" alt="Search" /></button>
                                </div>
                            )}
                        </Field>
                        {showDrop && <div onClick={()=>setShowDrop(false)} className={form.dropdown_back}></div>}
                        <div className={form.order_box} >
                            <button onClick={()=>setShowDrop(p=>!p)}
                                type="button"
                                className={`${form.order_btn} ${(orderByValue==="created_at" || orderByValue==="-created_at") && form.order_btn_active }` } >
                                {orderByValue==="-created_at"? <span>New first</span>
                                : orderByValue==='created_at'? <span>Old first</span>
                                : <span>Order by</span>
                                }
                            </button>
                            {showDrop &&
                            <div onClick={(e)=>{e.stopPropagation()}} className={form.dropdown} >
                                <div onClick={()=>{orderByValue==="-created_at"? orderBy("") : orderBy("-created_at")}}
                                    className={`${form.dropdown_option} ${orderByValue==="-created_at" && form.option_active}`} >
                                    <div>New first</div>
                                    {orderByValue==='-created_at' && <img src={selectedIcon} width="13px" ></img> }
                                </div>
                                <div onClick={()=>{orderByValue==="created_at"? orderBy("") : orderBy("created_at")}}
                                    className={`${form.dropdown_option} ${orderByValue==="created_at" && form.option_active}`} >
                                    <div>Old first</div>
                                    {orderByValue==='created_at' && <img src={selectedIcon} width="13px" ></img> }
                                </div>
                            </div>
                            }
                        </div>
                    </form>
                )}
            />
        </div>
    )
}
