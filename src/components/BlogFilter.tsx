import React, { ReactElement } from 'react'
import { Field, Form } from 'react-final-form'
import form from '../css/form.module.css'
import style from '../css/bloglist.module.css'
import searchIcon from '../images/loupe.svg'

interface Props {
    searchText: string,
    onSearch: (values:{search: string})=>void,
    orderBy: ()=>void,
}

export default function BlogFilter({ searchText, onSearch, orderBy, }: Props): ReactElement {
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
                        <div className={form.order_box} >
                            <button type="button" className={form.order_btn} >Order by</button>
                            <div className={form.dropdown} >
                                <div>New first</div>
                                <div>Old first</div>
                            </div>
                        </div>
                    </form>
                )}
            />
        </div>
    )
}
