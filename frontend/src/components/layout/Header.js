import React, { Fragment } from "react"
import { Route, Link } from "react-router-dom"
import Search from "./Search";

function Header() {
  return (
    <Fragment>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <Link to="/">
              <img src="/images/logo.png"/>
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          {/*passando o contexto de pagina, assim consigo ter acesso a funcoes como "push" dentro do Searh component*/}
          <Route render={({ history }) => <Search history={history} />} /> 
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <Link to="/login"><button className="btn" id="login_btn">Login</button></Link>
          <span id="cart" className="ml-3">Cart</span>
          <span className="ml-1" id="cart_count">2</span>
        </div>
      </nav>
    </Fragment>
  )
}

export default Header;