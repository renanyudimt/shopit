import { BrowserRouter as Router, Route } from "react-router-dom"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

import Home from "./components/pages/home";
import ProductDetails from "./components/pages/ProductDetails"

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Route path="/" component={Home} exact></Route>
        <Route path="/product/:id" component={ProductDetails} exact></Route>
        <Footer />
      </div>
    </Router>
   
  );
}

export default App;
