import React, { Fragment, useEffect } from 'react'
import { Route, Redirect } from "react-router-dom"
import { useSelector } from "react-redux"

export const LoggedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useSelector(state => state.userReducer)

  return (
    <Fragment>
      {!loading && (
        <Route {...rest} render={props => {
          if (isAuthenticated === false) {
            return <Redirect to='/login' />
          }

          return <Component {...rest } />
        }} />
      )}
    </Fragment>
  )
}

export const NotLoggedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useSelector(state => state.userReducer)

  return (
    <Fragment>
      {!loading && (
        <Route {...rest} render={props => {
          if (isAuthenticated) {
            return <Redirect to="/" />
          }

          return <Component {...rest } />
        }} />
      )}
    </Fragment>
  )
}

