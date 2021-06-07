import React, { ReactElement, useEffect, useState } from 'react'
import style from '../css/paginator.module.css'
import nav from '../css/navbar.module.css'

interface Props {
    pageCount: number,
    currentPage: number,
    goToPage: (value:string)=>void,
    portionSize?: number,
}

export default function Paginator({pageCount, currentPage, goToPage, portionSize=5}: Props): ReactElement {


    const [portionNumber, setPortionNumber] = useState(Math.ceil(currentPage/portionSize));

    let pages:number[] = [];
    for(let i=1; i<=pageCount; i++){
        pages.push(i);
    }
    
    let leftPortionPageNumber = (portionNumber-1)*portionSize+1;
    let rightPortionPageNumber = portionNumber*portionSize;

    if(pageCount<2){
        return <></>
    }

    return (
        <div className={style.paginator} >
            {portionNumber===1 ||
            <option
                onClick={(e)=>setPortionNumber(prn=>prn-1)} 
                className={`${nav.nav_item}`}
                value="prev">
                    &#60;&#60;
            </option>}
            {pages.filter(i=> i>=leftPortionPageNumber && i<=rightPortionPageNumber).map((p)=>(
                <option
                    onClick={(e)=>goToPage(e.currentTarget.value)}
                    value={p}
                    className={`${style.page} ${nav.nav_item} ${p===currentPage && nav.active_nav}`} >
                        {p}
                </option>
            ))
            }
           {portionNumber===Math.ceil(pageCount/portionSize) ||
           <option
                onClick={(e)=>setPortionNumber(prn=>prn+1)}
                className={`${nav.nav_item}`}
                value="next">
                    &#62;&#62;
            </option>
            }
        </div>
    )
}
