import React, { Component } from 'react'
import { usersRef } from '../config/constants.js';
import ReactiveWorldWind from './ReactiveWorldWind.js';
import '../styles/Dashboard.css';

export default class Dashboard extends Component {
    users=[];
  
    constructor(){
        super();
        this.state = Object.assign({
            items: []
        });
    }

    componentWillMount() {
        usersRef.on("child_added", function(dataSnapshot) {
            this.items=[];
            this.items.push(dataSnapshot.val());
            this.setState({
                items: this.items
            });
        }.bind(this));
    }
  
    render () {
        const { items } = this.state;
        items.map( i => this.users.push(i.crop_type + '\n'));
        return (
            <div id="dashboard">
              <p className="intro">
                  {this.users}
              </p>
              <div id="globe-holder">
                <ReactiveWorldWind></ReactiveWorldWind>
              </div>
              <a href="/farmate/newfield" className="btn btn-success">Create new field</a>
            </div> 
        )
    }
}