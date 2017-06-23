import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase";
import { usersRef, firebaseAuth } from './config/constants.js';
import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import WeatherAgain from './components/WeatherAgain'
import { logout } from './firebaseHelpers/auth'
import { firebaseAuth } from './config/constants'

class App extends Component {
users=[];

constructor(){
  super();
  this.state = Object.assign({
      items: []
    });
}


function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}
}

componentWillMount() {
  
  /* var config = {
    apiKey: "AIzaSyDbWlGG-aqzoePURjVEbAWeOVjXrqNXI_I",
    authDomain: "farmate-f4c81.firebaseapp.com",
    databaseURL: "https://farmate-f4c81.firebaseio.com",
    projectId: "farmate-f4c81",
    storageBucket: "farmate-f4c81.appspot.com",
    messagingSenderId: "48710733747"
  };
  firebase.initializeApp(config);
*/
 // this.firebaseRef = firebase.database().ref("users");
  usersRef.on("child_added", function(dataSnapshot) {
    this.items=[];
    this.items.push(dataSnapshot.val());
    this.setState({
      items: this.items
    });
  }.bind(this));
}

render() {

    const { items } = this.state;
    
    console.log(items);
    items.map( i => this.users.push(i.crop_type + '\n'));
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Farmate</h2>
    return this.state.loading === true ? <h1>Loading</h1> : (
      <BrowserRouter>
        <div>
          <nav className="navbar navbar-default navbar-static-top">
            <div className="container">
              <div className="navbar-header">
                <Link to="/" className="navbar-brand">Farmate</Link>
              </div>
              <ul className="nav navbar-nav pull-right">
                <li>
                  {this.state.authed
                    ? <button
                        style={{border: 'none', background: 'transparent'}}
                        onClick={() => {
                          logout()
                        }}
                        className="navbar-brand">Logout</button>
                    : <span>
                        <Link to="/login" className="navbar-brand">Login</Link>
                        <Link to="/register" className="navbar-brand">Register</Link>
                      </span>}
                </li>
              </ul>
            </div>
          </nav>
          <div className="container">
            <div className="row">
              <Switch>
                <Route path='/' exact component={Login} />
                <PublicRoute authed={this.state.authed} path='/login' component={Login} />
                <PublicRoute authed={this.state.authed} path='/register' component={Register} />
                <PrivateRoute authed={this.state.authed} path='/dashboard' component={Dashboard} />
                <PublicRoute authed={this.state.authed} path='/weather' component={WeatherAgain} />
                <Route render={() => <h3>No Match</h3>} />
              </Switch>
            </div>
          </div>

        </div>
        <p className="App-intro">
          {this.users}
        </p>
      </div>
    );
  }
}

export default App;
