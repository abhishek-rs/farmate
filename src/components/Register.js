import React, { Component } from 'react'
import { auth } from '../firebaseHelpers/auth'
import '../styles/Login.css';

function setErrorMsg(error) {
  return {
    registerError: error.message
  }
}

export default class Register extends Component {
  state = { registerError: null }
  handleSubmit = (e) => {
    e.preventDefault()
    auth(this.email.value, this.pw.value)
      .catch(e => this.setState(setErrorMsg(e)))
  }
  render () {
    return (
      <div className="login-container">
       <video className="background-video" loop muted autoPlay>
          <source src="/farmate/images/test.mp4" type="video/mp4" />
      </video>
      <div id="login-form" className="col-sm-6">
        <div className="welcome">
      <h1>Register to Farmate!</h1>
      <h4 className="italic"> Become part of a community that believes in sustainable farming today.</h4>
     </div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input className="form-control" ref={(email) => this.email = email} placeholder="Email"/>
          </div>
          <div className="form-group">
            <input type="password" className="form-control" placeholder="Password" ref={(pw) => this.pw = pw} />
          </div>
          {
            this.state.registerError &&
            <div className="alert alert-danger" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.registerError}
            </div>
          }
          <button id="buttonstyle" type="submit" className="btn btn-primary">Register</button>
        </form>
        <br />
        <br />
        
        <div className="welcome">
        <h4 className="italic">If this is your first time visiting farmate, learn more about it by visiting the <a className="btn btn-info" href="/about">About</a> section.</h4>
        <h4 className="italic">Built using NASA's WorldWind application for NASA Europa Challenge 2017</h4>
        </div>
      </div>
      </div>
    )
  }
}