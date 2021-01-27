import React, { Fragment, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Loader from "../layout/Loader"
import MetaData from "../layout/MetaData"

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux"
import { userLogin, clearErrors } from "../../actions/userActions"

const Login = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { isAuthenticated, loading, error } = useSelector(state => state.user)

  //testar error
  useEffect(() => {
    if (isAuthenticated) {
      history.push("/")
    }

    if (error) {
      alert.error(error)
      dispatch(clearErrors());
    }

  }, [dispatch, error, alert, isAuthenticated, history])

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(userLogin(email, password))
  }
  
  return (
    <Fragment>
      <div className="container container-fluid">
        {loading ? (<Loader /> ) : (
          <Fragment>
            <MetaData title="Login" />
            <div className="row wrapper">
              <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={handleSubmit}>
                  <h1 className="mb-3">Login</h1>
                  <div className="form-group">
                    <label htmlFor="email_field">Email</label>
                    <input type="email" id="email_field" className="form-control" value={email} onChange={(e) => { setEmail(e.target.value)}} required/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password_field">Password</label>
                    <input type="password" id="password_field" className="form-control" value={password} onChange={(e) => {setPassword(e.target.value)}} required/>
                  </div>
                  <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>
                  <button id="login_button" type="submit" className="btn btn-block py-3">LOGIN</button>
                  <Link to="/signup" className="float-right mt-3">New User?</Link>
                </form>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}

export default Login