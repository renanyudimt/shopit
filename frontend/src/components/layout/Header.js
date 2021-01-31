import React, { useEffect, Fragment } from "react"
import { Route, Link, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useAlert } from "react-alert"
import { Dropdown } from "react-bootstrap"
import Search from "./Search";
import { userLogout, clearLogout } from "./../../actions/userActions"

function Header() {
  const history = useHistory();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { user, loading, logout } = useSelector((state) => state.userReducer);
  const { cartItems } = useSelector((state) => state.cartReducer);

  const handleLogout = () => {
    dispatch(userLogout());
    alert.success("Logged out successfully")
  }

  useEffect(() => {
    /**
     * ao inves de fazer isso eu poderia controlar o state isAuthenticated pra redirecionar, dentro do useEffect() de cada pagina que eu nao quisesse 
     * que fosse acessada por um usuario nao logado, igual tem em login(), mas preferi fazer assim porque sempre que eu deslogar, vou cair na home.
     */
    if (logout) {
      dispatch(clearLogout())
      history.push('/')
    }
  }, [dispatch, history, logout])

  return (
    <Fragment>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <Link to="/">
              <img src="/images/logo.png" alt="logo"/>
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          {/*passando o contexto de pagina, assim consigo ter acesso a funcoes como "push" dentro do Search component*/}
          <Route render={({ history }) => <Search history={history} />} /> 
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center is-flex is-align-center">
          <Link to="/cart" style={{ textDecoration: 'none' }} className="mr-3">
            <span id="cart" className="ml-3">Cart</span>
            <span className="ml-1" id="cart_count">{ cartItems.length }</span>
          </Link>

          {user ? (

            <Dropdown>
              <Dropdown.Toggle className="text-white" variant="" id="dropdown-basic">
                <figure className="avatar avatar-nav">
                  <img src={user.avatar && user.avatar.url} alt={user && user.name} className="rounded-circle" />
                </figure>
                <span>{user && user.name}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
              {user && user.role !== "admin" ? (
                <Link to="/orders" style={{ textDecoration: 'none' }} className="dropdown-item" role="button">Orders</Link>
              ) : (
                <Link to="/dashboard" style={{ textDecoration: 'none' }} className="dropdown-item" role="button">Dashboard</Link>
              ) }
                <Link to="/profile" style={{ textDecoration: 'none' }} className="dropdown-item" role="button">Profile</Link>
                <Link to="#" style={{ textDecoration: 'none' }} className="dropdown-item" role="button" onClick={ handleLogout }>Logout</Link>
              </Dropdown.Menu>
            </Dropdown> ) : !loading && (
            <Link to="/login"><button className="btn" id="login_btn">Login</button></Link>
          )}
        </div>
      </nav>
    </Fragment>
  )
}

export default Header;