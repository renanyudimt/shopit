import React, { Fragment } from 'react'
import { Route, Redirect } from "react-router-dom"
import { useSelector } from "react-redux"

const ProtectedRoute = ({ component: Component, ...rest }) => {
  
  const { isAuthenticated, loading, user } = useSelector(state => state.user)

  return (
    <Fragment>
      {!loading && (
        <Route {...rest} render={props => {
          if (!isAuthenticated) {
            return <Redirect to="/login" />
          }

          return <Component {...rest } />
        }} />
      )}
    </Fragment>
  )
}

export default ProtectedRoute