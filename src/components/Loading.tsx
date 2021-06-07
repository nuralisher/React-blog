import React, { ReactElement } from 'react'
import style from '../css/modal.module.css'
import loadingGif from '../images/loadingGif.gif'

interface Props {
    
}

export default function Loading({}: Props): ReactElement {
    return (
        <div className={style.background} >
            <div className={style.content} >
                <img src={loadingGif} alt="loading..." />
            </div>
        </div>
    )
}
