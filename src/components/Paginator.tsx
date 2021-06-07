import React, { ReactElement } from 'react'
import style from '../css/paginator.module.css'
import nav from '../css/navbar.module.css'

interface Props {
    pageNumber: number,
    currentPage: number,
}

export default function Paginator({pageNumber, currentPage}: Props): ReactElement {
    if(pageNumber<2){
        return <></>
    }

    return (
        <div className={style.paginator} >
            <option className={nav.nav_item} value="prev">&#60;&#60;</option>
            {[2,1,0,-1,-2].map((i)=>(
                currentPage-i>=1 && currentPage-i<=pageNumber && 
                <option className={`${style.page} ${nav.nav_item} ${i===0 && nav.active_nav}`} >
                    {currentPage-i}
                </option>
            ))
            }
            <option className={nav.nav_item} value="next">&#62;&#62;</option>
        </div>
    )
}
