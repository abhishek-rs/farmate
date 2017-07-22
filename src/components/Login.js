
import React, { Component } from 'react'
import { login, resetPassword } from '../firebaseHelpers/auth'
import '../styles/Login.css';

function setErrorMsg(error) {
  return {
    loginMessage: error
  }
}

export default class Login extends Component {
  state = { loginMessage: null }
  handleSubmit = (e) => {
    e.preventDefault()
    login(this.email.value, this.pw.value)
      .catch((error) => {
          this.setState(setErrorMsg('Invalid username/password.'))
        })
  }
  resetPassword = () => {
    resetPassword(this.email.value)
      .then(() => this.setState(setErrorMsg(`Password reset email sent to ${this.email.value}.`)))
      .catch((error) => this.setState(setErrorMsg(`Email address not found.`)))
  }
  render () {
    return (
      <div className="login-container">
       <video className="background-video" loop muted autoPlay>
          <source src="/images/test.mp4" type="video/mp4" />
      </video>
      <div id="login-form" className="col-sm-6">
       <div className="welcome">
      <h1>Welcome to Farmate!</h1>
        <h4 className="italic"> A platform helping you keep track of the irrigation of your fields</h4>
     </div>
        <h2 className="form-login"> Login </h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input className="form-control" ref={(email) => this.email = email} placeholder="Email"/>
          </div>
          <div className="form-group">
            <input type="password" className="form-control" placeholder="Password" ref={(pw) => this.pw = pw} />
          </div>
          {
            this.state.loginMessage &&
            <div className="alert alert-danger" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.loginMessage} <a onClick={this.resetPassword} className="alert-link">Forgot Password?</a>
            </div>
          }
          <button id="buttonstyle" type="submit" className="btn btn-success">Login</button>
        </form>
        <br />
        <br />
        
        <div className="welcome">
        <h4 className="italic">If this is your first time visiting farmate, learn more about it by visiting the <a className="btn btn-info" href="/farmate/about">About</a> section.</h4>
        <h4 className="italic">Built using NASA's WorldWind application for NASA Europa Challenge 2017</h4>
        </div>
      </div>
      </div>
    )
  }
}