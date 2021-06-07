import React from 'react'
import { Redirect } from 'react-router';

export default function withLoginRedirect<WCProps>(WrappedComponent: React.ComponentType<WCProps> ){
    return function (props:any){
        const {isLogged, ...restProps} = props;

        if(!isLogged){
            return <Redirect to='login' /> 
        }

        return <WrappedComponent {...restProps} />
    }
}