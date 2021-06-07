import React, { ReactElement } from 'react'
import modal from '../css/modal.module.css'
import form from '../css/form.module.css'

interface Props {
    closeModal: ()=>void,
    onDelete: ()=>Promise<void>,
    blogTitle: string,
}

export default function BlogDeleteContainer({closeModal, onDelete, blogTitle}: Props): ReactElement {
    return (
        <div className={modal.background} onClick={closeModal} >
            <div className={`${modal.modal} ${modal.modal_maxsize}`} onClick={(e)=>{e.stopPropagation()}} >
                <div className={form.header} >Are you really want to delete blog "{blogTitle}" ?</div>
                <div className={form.buttons_box}>
                    <button className={`${form.btn} ${form.btn_short} ${form.btn_very_short} ${form.btn_danger}`} 
                        onClick={onDelete} >Delete</button>
                    <button className={`${form.btn} ${form.btn_short} ${form.btn_white} ${form.btn_very_short}`} 
                        onClick={closeModal} >Cancel</button>
                </div>
            </div>
        </div>
    )
}
