import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase";
import { usersRef, firebaseAuth } from './config/constants.js';
class App extends Component {
users=[];
constructor(){
  super();
  this.state = Object.assign({
      items: []
    });
  
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
        </div>
        <p className="App-intro">
          {this.users}
        </p>
      </div>
    );
  }
}

export default App;
