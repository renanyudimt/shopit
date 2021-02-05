import { useEffect, useState } from "react";
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
import Confirm from "./components/pages/Confirm"
import Payment from "./components/pages/Payment"
import Success from "./components/pages/Success"
import Orders from "./components/pages/Orders"

import { LoggedRoute, NotLoggedRoute, CheckoutRoute } from "./components/route/AlternativeRoutes"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { loadUser } from "./actions/userActions";
import store from "./store";

import './App.css';
import axios from "axios";

function App() {

  const [stripeApiKey, setStripeApiKey ] = useState("")

  useEffect(() => {
    store.dispatch(loadUser())
    async function getStripeApi() {
      const { data } = await axios.get("http://localhost:4000/api/v1/stripeapi")
      setStripeApiKey(data.stripeApiKey)
    }
    getStripeApi();
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
        <Route path="/password/reset/:token" component={RedefinePassword} exact />
        <Route path="/cart" component={Cart} exact />
        <CheckoutRoute path="/shipping" component={Shipping} exact/>
        <CheckoutRoute path="/confirm" component={Confirm} exact/>
        {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <CheckoutRoute path="/payment" component={Payment} exact/>
          </Elements>
        )}
        <CheckoutRoute path="/success" component={Success} exact/>
        <LoggedRoute path="/orders" component={Orders} exact />
        <Footer />
      </div>
    </Router>
   
  );
}

export default App;
