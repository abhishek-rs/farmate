import React, { Component } from 'react'
import { dataRef } from '../config/constants.js';
import DisplayWorldWind from './DisplayWorldWind.js';
import CurrentFieldDisplay from './CurrentFieldDisplay.js';
import Weather from './Weather.js';
import '../styles/Dashboard.css';
import {Row, Col} from 'react-bootstrap';

export default class Dashboard extends Component {
  
    constructor(){
        super();
        this.state = Object.assign({
            items: [],
            fieldSnapshot: {},
            highlightedField: null,
        });
    }

    componentWillMount(){
        let that = this;
        dataRef.once('value').then(
            (snapshot) => 
                    that.setState({
                        fieldSnapshot: snapshot,
                        })
        );
    }

    changeSelection(fieldId){
        this.setState({
            highlightedField: fieldId
        });
    }
  
    render () {
        return (
            <div id="dashboard">
                <div id="left-panel">
                     <Weather></Weather>
                </div>
                <div id="globe-holder">
                     <DisplayWorldWind fieldSnapshot={this.state.fieldSnapshot} updateSelection={this.changeSelection.bind(this)} highlightedField={this.state.highlightedField}></DisplayWorldWind>
                </div>
                <div id="right-panel">
                    <CurrentFieldDisplay fieldSnapshot={this.state.fieldSnapshot} updateSelection={this.changeSelection.bind(this)} highlightedField={this.state.highlightedField}/>
                    <a href="/farmate/newfield" className="btn btn-success">Create new field</a>
                </div>
        
            </div> 
        )
    }
}