import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase";
import { firebaseAuth } from './config/constants.js';
import 'bootstrap/dist/css/bootstrap.css'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Weather from './components/Weather'
import NewField from './components/NewField'
import { logout } from './firebaseHelpers/auth'
import About from './components/About'
//import { FontAwesome } from 'react-fontawesome';

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

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/dashboard' />}
    />
  )
}

export default class App extends Component {
  state = {
    authed: false,
    loading: true,
  }
  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }
  componentWillUnmount () {
    this.removeListener()
  }
  render() {
    let browserRouter = null;
    if (!this.state.authed) {
      browserRouter =
        <div>
          <nav className="navbar navbar-default navbar-static-top">
            <div className="container">
              <div className="navbar-header">
                <img id="nasa-logo" src="NASA_logo.png"/>
                <Link to="/dashboard" className="navbar-brand">Farmate</Link>
              </div>
              <ul className="nav navbar-nav pull-right">
                <li>  
                     <span>
                        <Link to="/login" className="navbar-brand">Login</Link>
                        <Link to="/register" className="navbar-brand">Register</Link>
                        <Link to="/about" className="navbar-brand">About</Link>
                      </span>
                </li>
              </ul>
            </div>
          </nav>
      </div>
    } else {
    <Route path='/farmate' exact component={Dashboard} />
    browserRouter =
  <div>
    <nav className="navbar navbar-default navbar-static-top">
            <div className="container">
              <div className="navbar-header">
                <img id="nasa-logo" src="NASA_logo.png"/>
                <Link to="/dashboard" className="navbar-brand">Farmate</Link>
              </div>
              <ul className="nav navbar-nav pull-right">
                <li>  
                  <span className="nav-button"><Link to="/about" className="navbar-brand">About</Link></span>
                  <span className="nav-button"><Link to="/dashboard" className="navbar-brand">Dashboard</Link></span> 
                   {this.state.authed
                    ? <span className="nav-button"><button
                        style={{border: 'none', background: 'transparent'}}
                        onClick={() => {
                          logout()
                        }}
                        className="navbar-brand">Logout</button></span>
                    : <span>
                        
                      </span>}
                </li>
              </ul>
            </div>
          </nav>
  </div>
      }
    return this.state.loading === true 
          ? <div id="loading">
            <img src="./images/nasa_spinner.gif" />
            <br />
            <span>The world is getting ready for you...</span>
          </div> 
          : (
      <BrowserRouter>
        <div>
          {browserRouter}
          <div className="container">
            <div className="row">
              <Switch>
                <Route path='/farmate' exact component={Login} />
                <PublicRoute authed={this.state.authed} path='/login' component={Login} />
                <PublicRoute authed={this.state.authed} path='/register' component={Register} />
                <PrivateRoute authed={this.state.authed} path='/dashboard' component={Dashboard} />
                <PrivateRoute authed={this.state.authed} path='/weather' component={Weather} />
                <PrivateRoute authed={this.state.authed} path='/newfield' component={NewField} />
                <Route path='/about' exact component={About} />
                <Route render={() => <Redirect to='/dashboard'/>}/>
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
