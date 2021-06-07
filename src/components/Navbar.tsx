import React, { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom'
import { getUser, logout } from '../api/api'
import style from '../css/navbar.module.css'
import { ActionType } from '../local/actionType';
import { User } from '../local/interface';
import write from '../images/edit.svg';

interface Props {
    
}

export default function Navbar({}: Props): ReactElement {
    const isLogged:boolean = useSelector((state:any) => state.userReducer.isLogged);
    const user:User = useSelector((state:any)=> state.userReducer.currentUser);
    const dispatch = useDispatch();

    return (
        <div className={style.navbar} >
            <div className={style.navbar_innner} >
                <div className={style.left} >
                    <NavLink className={`${style.nav_item}`} 
                        activeClassName={`${style.active_nav} ${style.active_nav_bg}`} exact to='/' >Main</NavLink>
                    <NavLink className={`${style.nav_item}`} 
                        activeClassName={`${style.active_nav} ${style.active_nav_bg}`} to='/blogs' >Blogs</NavLink>
                </div>
                <div className={style.right} >
                    {!isLogged ? 
                        <>
                        <NavLink className={style.nav_item}
                            activeClassName={style.active_nav} to='/login' >Log in</NavLink> 
                        <NavLink className={style.nav_item}
                            activeClassName={style.active_nav} to='/signup' >Sign up</NavLink> 
                        </>
                    :
                    <>
                        <NavLink to='/blogCreate' className={`${style.nav_item} ${style.writepost}`}
                            activeClassName={`${style.active_nav} ${style.active_nav_bg}`} > Create Blog </NavLink>
                        <div className={`${style.dropdown} ${style.nav_item}`}>
                            <div className={style.username} >
                                {user.username.substr(0,10)} 
                                {user.username.length>10 && <span>...</span>} 
                            </div>
                            <div className={style.dropdown_content}>
                                <div className={style.dropdown_conntent_inner}>
                                    <NavLink className={style.dropdown_option}
                                        activeClassName={style.active_nav} exact to='/myBlogs' >My blogs</NavLink> 
                                        <div onClick={onLogout} className={`${style.danger_option} ${style.dropdown_option}`}>
                                            Log out
                                        </div>
                                </div>
                            </div>
                        </div>
                    </>  
                    }
                </div>
            </div>
        </div>
    )

    function onLogout(){
        logout().then((response)=>{
            dispatch({type: ActionType.logout});
            localStorage.removeItem('key');
        })
    }
}
