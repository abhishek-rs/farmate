import React, { Component } from 'react'
import { usersRef } from '../config/constants.js';
import ReactiveWorldWind from './ReactiveWorldWind.js';

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
            <div>
              Logged in successfully.
              <p className="App-intro">
                  {this.users}
              </p>
              <ReactiveWorldWind></ReactiveWorldWind>
            </div> 
        )
    }
}