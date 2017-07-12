import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase";
import { usersRef, firebaseAuth } from './config/constants.js';
import 'bootstrap/dist/css/bootstrap.css'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Weather from './components/Weather'
import NewField from './components/NewField'
import FieldDashboard from './components/FieldDashboard'
import { logout } from './firebaseHelpers/auth'
import About from './components/About'
//import { FontAwesome } from 'react-fontawesome';

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/farmate/login', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/farmate/dashboard' />}
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
                <img id="nasa-logo" src="nasa_logo.png"/>
                <Link to="/farmate/dashboard" className="navbar-brand">Farmate</Link>
              </div>
              <ul className="nav navbar-nav pull-right">
                <li>  
                    : <span>
                        <Link to="/farmate/login" className="navbar-brand">Login</Link>
                        <Link to="/farmate/register" className="navbar-brand">Register</Link>
                        <Link to="/farmate/" className="navbar-brand">About</Link>
                      </span>}
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
                <img id="nasa-logo" src="nasa_logo.png"/>
                <Link to="/farmate/dashboard" className="navbar-brand">Farmate</Link>
              </div>
              <ul className="nav navbar-nav pull-right">
                <li>  
                  <Link to="/farmate/" className="navbar-brand">About</Link>
                  <Link to="/farmate/dashboard" className="navbar-brand">Dashboard</Link> 
                   {this.state.authed
                    ? <button
                        style={{border: 'none', background: 'transparent'}}
                        onClick={() => {
                          logout()
                        }}
                        className="navbar-brand">Logout</button>
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
                <Route path='/farmate' exact component={About} />
                <PublicRoute authed={this.state.authed} path='/farmate/login' component={Login} />
                <PublicRoute authed={this.state.authed} path='/farmate/register' component={Register} />
                <PrivateRoute authed={this.state.authed} path='/farmate/dashboard' component={Dashboard} />
                <PrivateRoute authed={this.state.authed} path='/farmate/weather' component={Weather} />
                <PrivateRoute authed={this.state.authed} path='/farmate/newfield' component={NewField} />
                <PrivateRoute authed={this.state.authed} path='/farmate/fieldashboard' component={FieldDashboard} />
               
                <Route render={() => <Redirect to='/farmate/dashboard'/>}/>
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
