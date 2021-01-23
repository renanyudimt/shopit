import { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails"
import Login from "./components/user/Login";
import Signup from "./components/user/Signup"

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
        <Footer />
      </div>
    </Router>
   
  );
}

export default App;
