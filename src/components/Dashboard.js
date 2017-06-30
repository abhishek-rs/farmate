import React, { Component } from 'react'
import { usersRef } from '../config/constants.js';
import ReactiveWorldWind from './ReactiveWorldWind.js';
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
        items.map( i => this.users.push(i.crop_type + '\n'));
        return (
            <div id="dashboard">
              <p className="intro">
                  {this.users}
              </p>
         <Col xs={12}>
             <Col xs={12} sm={4} lg={4}>
                    <div id="weather-holder">
                     <Weather></Weather>
                     </div>
              </Col>
              <Col xs={12} sm={8} lg={6}>
                    <div id="globe-holder">
                     <ReactiveWorldWind></ReactiveWorldWind>
                    </div>
                </Col>
            <Col xs={12} sm={1} lg={1} lgOffset={10}>
              <a href="/farmate/newfield" className="btn btn-success">Create new field</a>
            </Col>
                
        </Col>
            </div> 
        )
    }
}