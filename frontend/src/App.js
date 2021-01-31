import { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

import Home from "./components/pages/Home";
import ProductDetails from "./components/pages/ProductDetails"
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup"
import Profile from "./components/pages/Profile";
import UserUpdate from "./components/pages/UserUpdate";
import PasswordUpdate from "./components/pages/PasswordUpdate";
import ForgotPasswordPage from "./components/pages/ForgotPassword";
import RedefinePassword from "./components/pages/RedefinePassword";
import Cart from "./components/pages/Cart"
import Shipping from "./components/pages/Shipping";

import { LoggedRoute, NotLoggedRoute } from "./components/route/AlternativeRoutes"

import { loadUser } from "./actions/userActions";
import store from "./store";

import './App.css';

function App() {
  console.log("app")
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Router>
      <div className="App">
        <Header />
        <Route path="/" component={Home} exact />
        <Route path="/search/:keyword" component={Home} />
        <Route path="/product/:id" component={ProductDetails} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/signup" component={Signup} exact />
        <Route path="/password/forgot" component={ForgotPasswordPage} exact />
        <LoggedRoute path="/profile" component={Profile} exact />
        <LoggedRoute path="/profile/update" component={UserUpdate} exact />
        <LoggedRoute path="/password/update" component={PasswordUpdate} exact />
        <Route path="/cart" component={Cart} exact />
        <LoggedRoute path="/shipping" component={Shipping} exact/>
        <Route path="/password/reset/:token" component={RedefinePassword} exact />
        <Footer />
      </div>
    </Router>
   
  );
}

export default App;
