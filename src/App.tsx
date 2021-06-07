import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Blogs from './components/Blogs';
import { Route, Switch } from 'react-router';
import BlogDetail from './components/BlogDetail';
import Login from './components/Login';
import BlogCreate from './components/BlogCreate';
import { getUser } from './api/api';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType } from './local/actionType';
import Loading from './components/Loading';
import BlogEdit from './components/BlogEdit';
import Signup from './components/Signup';

function App() {
  const dispatch = useDispatch();
  const isInitialized:Boolean = useSelector((state:any) => state.appReducer.isInitialized);

  useEffect(()=>{
    dispatch({type: ActionType.setInitialized, initializedValue: false })
    getUser().then((response)=>{
        dispatch({type: ActionType.setUser, user: response.data});
    }).finally(()=>{
      dispatch({type: ActionType.setInitialized, initializedValue: true });
    })
  }, []);

  if(!isInitialized){
    return <Loading/>
  }

  return (
  <>

    <Switch>
      <Route path='/blogs/:id/edit' render={()=><BlogEdit/> } />
      <Route path='/blogs/:id' render={()=><BlogDetail/> } />
      <Route path='/blogs' render={()=><Blogs/> } />
      <Route path='/blogCreate' render={()=><BlogCreate/>} />
    </Switch>

    
    <Switch>
      <Route path='/login' render={()=><Login/>}/>
      <Route path='/signup' render={()=><Signup/>}/>
      <Navbar/>
    </Switch>
    </>
  );
}

export default App;
