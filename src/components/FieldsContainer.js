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
            fields: [],
            fieldIds: []
        });
        this.getFields = this.getFields.bind(this);
        this.handlePick = this.handlePick.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            fieldSnapshot: nextProps.fieldSnapshot,
            selectedField: nextProps.selectedField,
        }, () => {
            this.getFields(this.state.fieldSnapshot);
        })
    }

    getFields(snapshot){
        let fields = Object.values(snapshot.val());
        let ids = Object.keys(snapshot.val());
        let relevantFieldIds = [];
        let ownerid = getUserId();
        let currentUserFields = fields.filter((f,i) => {
            if(f.owner_id == ownerid){
                relevantFieldIds.push(ids[i])
                return true;
            }
        });
        this.setState({
            fields: currentUserFields,
            fieldIds: relevantFieldIds
        });
    }

    componentWillMount(){
    }

    handlePick(id){
        this.props.updateSelection(id);
    }

    render(){
        let ids = this.state.fieldIds;
        let Fields = this.state.fields !== []
                        ? this.state.fields.map( (f,i) =>
                                {   
                                    let isSelected = false;
                                    if(ids[i] == this.state.selectedField)
                                        isSelected = true;
                                    return <Field key={ids[i]} field={f} id={ids[i]} isSelected={isSelected} handleClick={this.handlePick}/>
                                })
                        : null;

         return  (
            <div id="field-container">
                {Fields}    
            </div>
        );
    }  
}