import React from 'react'
import { Route, Redirect } from 'express'

const PrivateRoute = ({ children, ...rest }) => {
    return (
        <Route 
            {...rest} 
            render={({ location })=> (
            localStorage.getItem('token')
                ? children
                : <Redirect to={{ pathname: '/login', state: {from: location } }} />
        )} />
    )
}

export default PrivateRoute