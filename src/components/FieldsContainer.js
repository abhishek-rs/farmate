import React, { Component } from 'react';
import { dataRef } from '../config/constants.js';
import { getUserId } from '../firebaseHelpers/auth';
import Field from './Field.js';

export default class FieldsContainer extends Component {
    constructor(props){
        super(props);
        this.state = Object.assign({
            fieldSnapshot: props.fieldSnapshot,
            selectedField: props.selectedField,
            fields: []
        });
        this.getFields = this.getFields.bind(this);
        this.handlePick = this.handlePick.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            fieldSnapshot: nextProps.fieldSnapshot,
            highlightedField: nextProps.selectedField,
        }, () => {
            this.getFields(this.state.fieldSnapshot);
        })
    }

    getFields(snapshot){
        let fields = Object.values(snapshot.val());
        let ids = Object.keys(snapshot.val());
        let allFieldBoundaries = [];
        let ownerid = getUserId();
        let currentUserFields = fields.filter((f) => f.owner_id == ownerid );
        this.setState({
            fields: currentUserFields,
        });
    }

    componentWillMount(){
    }

    handlePick(){

    }

    render(){
        console.log(this.state.fields);
        let Fields = this.state.fields !== []
                        ? this.state.fields.map( (f) =>
                                <Field field={f} />
                        )
                        : null;

         return  (
            <div id="field-container">
                {Fields}    
            </div>
        );
    }  
}