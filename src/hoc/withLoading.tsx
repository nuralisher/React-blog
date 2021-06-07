import React, { Component, ComponentType } from 'react'
import Loading from '../components/Loading';


export default function withLoading<WCProps>(WrappedComponent : ComponentType<WCProps> ){
    return (props: any)=>{
        const {isLoading, ...restProps } = props;
        if(isLoading){
            return( 
                <>
                    <WrappedComponent {...restProps} />
                    <Loading/>
                </>
            )
        }

        return <WrappedComponent {...restProps} />
    }
}

