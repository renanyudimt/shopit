import React, { Fragment } from 'react'
import { Route, Redirect, useLocation  } from "react-router-dom"
import { useSelector } from "react-redux"

export const LoggedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useSelector(state => state.userReducer)
  console.log("logged route")
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

export const CheckoutRoute = ({ component: Component, ...rest }) => {
  const location = useLocation();

  //authorization to enter this page
  const authorization = location.state ? location.state.map(item => (item.authorization))[0] : false ;
  console.log("authorization", authorization)
  return (  
    <Fragment>
      <Route {...rest } render={ routeProps => (
        authorization ? (
          <Component {...routeProps } />
        ) : (
          <Redirect to="/" />
        )
      )}/>
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

