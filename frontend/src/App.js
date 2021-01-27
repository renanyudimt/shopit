import { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

import Home from "./components/pages/Home";
import ProductDetails from "./components/pages/ProductDetails"
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup"
import Profile from "./components/pages/Profile";

import ProtectedRoute from "./components/route/ProtectedRoute"

import { loadUser } from "./actions/userActions";
import store from "./store";

import './App.css';

function App() {
  useEffect(() => {
    store.dispatch(loadUser())
  })

  return (
    <Router>
      <div className="App">
        <Header />
        <Route path="/" component={Home} exact />
        <Route path="/search/:keyword" component={Home} />
        <Route path="/product/:id" component={ProductDetails} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/signup" component={Signup} exact />
        <ProtectedRoute path="/profile" component={Profile} exact />
        <Footer />
      </div>
    </Router>
   
  );
}

export default App;
