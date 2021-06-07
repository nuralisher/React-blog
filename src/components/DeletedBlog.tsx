import React, { ReactElement } from 'react'
import modal from '../css/modal.module.css'
import form from '../css/form.module.css'
import { Link } from 'react-router-dom'

interface Props {
    blogTitle: string,
}

export default function BlogDeleteContainer({blogTitle, }: Props): ReactElement {
    return (
        <div className={modal.background}>
            <div className={`${modal.modal} ${modal.modal_maxsize}`} onClick={(e)=>{e.stopPropagation()}} >
                <div className={form.header} >Blog "{blogTitle}" was deleted</div>
                <div className={`${form.buttons_box} ${form.buttons_centered}`}>
                    <Link to='/blogs' 
                        className={`${form.btn} ${form.btn_short} ${form.btn_very_short}`} >Ok</Link>
                </div>
            </div>
        </div>
    )
}
