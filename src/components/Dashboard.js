import React, { Component } from 'react'
import { usersRef } from '../config/constants.js';
import DisplayWorldWind from './DisplayWorldWind.js';
import Weather from './Weather.js';
import '../styles/Dashboard.css';
import {Row, Col} from 'react-bootstrap';

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
        items.map( i => this.users.push(i.name + '\n'));
        return (
            <div id="dashboard">
                <div id="left-panel">
                     <Weather></Weather>
                </div>
                <div id="globe-holder">
                     <DisplayWorldWind ></DisplayWorldWind>
                </div>
                <div id="right-panel">
                    <a href="/farmate/newfield" className="btn btn-success">Create new field</a>
                </div>
        
            </div> 
        )
    }
}