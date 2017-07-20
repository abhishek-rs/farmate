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
      <div className="container">
       <video className="background-video" loop muted autoPlay>
          <source src="/images/test.mp4" type="video/mp4" />
      </video>
      <div id="login-form" className="col-sm-6 col-sm-offset-3">
        <div className="welcome">
      <h1>Register </h1>
      <h4> Become a part of a community that believes in sustainable farming today.</h4>
     </div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" ref={(email) => this.email = email} placeholder="Email"/>
          </div>
          <div className="form-group">
            <label>Password</label>
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
      </div>
      </div>
    )
  }
}