import React, { Component } from 'react' 
import ReactDOM from 'react-dom'
import { InputText } from 'primereact/components/inputtext/InputText'
import { Calendar } from 'primereact/components/calendar/Calendar'
import { getUserId } from '../firebaseHelpers/auth'
import { dataRef } from '../config/constants.js';
import * as moment from 'moment';
export default class UpdateField extends Component {

    constructor(props){
        super(props);
        this.state = Object.assign({
            currentField: props.currentField,
        });

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e, attribute){
        let formdata = this.state.currentField;
        if(attribute == "date_irrigation"){
            formdata.date_irrigation = e.value;
            formdata.day_irrigation = e.value.getDate();
            formdata.month_irrigation = e.value.getMonth();
            formdata.year_irrigation = e.value.getFullYear();            
        }
        else if(attribute == "IR"){
            let currentDate = moment().local();
            let duration = moment.duration(currentDate.diff(formdata.date_irrigation));
            let days = duration.asDays().toFixed(0);
            let IR_in_L = e.target.value * 1000;
            let area_in_m2 = parseInt(formdata.area) * 10000;
            formdata.IR_list[29 - days] = IR_in_L;
            formdata.HP_list[29 - days] = (parseFloat(formdata.HP_list[29 - days]) + (e.target.value / area_in_m2) * 100).toFixed(2);
            formdata.HP = days > 0 ? parseFloat(formdata.HP) + (e.target.value / area_in_m2) * 100 : formdata.HP; 
    }
        else if(attribute == "HP"){
            formdata.HP = e.target.value;
            formdata.HP_list[29] = e.target.value;  
        }
        else 
            formdata[attribute]=e.target.value;

        this.setState({
            currentField: formdata
        });
    }

    handleSubmit(e) {
        let formdata = this.state.currentField;
        formdata.lat_center = formdata.lat_shape[0];
        formdata.long_center = formdata.long_shape[0]; 
        formdata.HP_list[29] = formdata.HP;
        let newPostKey = dataRef.push().key;
        let updates = {};
        updates[newPostKey] = formdata;
        dataRef.update(updates);
        this.props.history.push('/dashboard');
    }

    render(){
        return (
            <form id="update-form" onSubmit={this.handleSubmit}>
                <p data-tip="You can change the name of the field here">Name of field</p>
                <InputText value={this.state.currentField.name} name="name" placeholder="e.g. My rice field" onChange={(e) => this.handleChange(e, 'name')} />    
                
                <p data-tip="Date of last irrigation">Last irrigation date</p>
                <Calendar tabindex="0" placeholder="Calendar" onChange={(e) => this.handleChange(e, 'date_irrigation')} ></Calendar>

                <p data-tip="Irrigation in cubic m. on the selected date.">How much did you irrigate? (in cubic mt.)</p>
                <InputText name="IR" type="number" placeholder="0" onChange={(e) => this.handleChange(e, 'IR')} />

                <p data-tip="If the displayed water level is incorrect, please update it here. This will help us improve our suggestions for future.">Water level post irrigation (cms)</p>
                <InputText name="HP" type="number" value={this.state.currentField.HP} onChange={(e) => this.handleChange(e, 'HP')} />

                <a className="btn btn-success" onClick={this.handleSubmit}>Update</a>
            </form>
        );
    }

}