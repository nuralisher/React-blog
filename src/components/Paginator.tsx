import React, { ReactElement } from 'react'
import style from '../css/paginator.module.css'
import nav from '../css/navbar.module.css'

interface Props {
    pageNumber: number,
    currentPage: number,
    goToPage: (value:string)=>void,
}

export default function Paginator({pageNumber, currentPage, goToPage}: Props): ReactElement {
    if(pageNumber<2){
        return <></>
    }
    console.log(currentPage);

    return (
        <div className={style.paginator} >
            <option disabled={currentPage===1}
                onClick={(e)=>goToPage(e.currentTarget.value)} 
                className={`${nav.nav_item} ${currentPage===1 && nav.disabled_nav}`}
                value="prev">
                    &#60;&#60;
            </option>
            {[2,1,0,-1,-2].map((i)=>(
                currentPage-i>=1 && currentPage-i<=pageNumber && 
                <option
                    onClick={(e)=>goToPage(e.currentTarget.value)}
                    value={currentPage-i}
                    className={`${style.page} ${nav.nav_item} ${i===0 && nav.active_nav}`} >
                        {currentPage-i}
                </option>
            ))
            }
            <option disabled={currentPage===pageNumber}
                onClick={(e)=>goToPage(e.currentTarget.value)}
                className={`${nav.nav_item} ${currentPage===pageNumber && nav.disabled_nav}`}
                value="next">
                    &#62;&#62;
            </option>
        </div>
    )
}
