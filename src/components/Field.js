import React, { Component } from 'react';

export default class Field extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="field">
                <h1>{this.props.field.name}</h1>
            </div>
        );
    }
}