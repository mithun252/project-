import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ProductList from './components/Products/ProductList';
import SellForm from './components/Sell/SellForm';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Switch>
            <Route exact path="/" component={ProductList} />
            <Route path="/category/:category" component={ProductList} />
            <Route path="/sell" component={SellForm} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
