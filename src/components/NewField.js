import React, { Component } from 'react' 
import ReactDOM from 'react-dom'
import '../styles/NewField.css'

import {InputText} from 'primereact/components/inputtext/InputText'
import {Slider} from 'primereact/components/slider/Slider';
import InputWorldWind from './InputWorldWind'
import ReactTooltip from 'react-tooltip'
import {Calendar} from 'primereact/components/calendar/Calendar'
import {SelectButton} from 'primereact/components/selectbutton/SelectButton'
import { Dialog } from 'primereact/components/dialog/Dialog';
import { getUserId } from '../firebaseHelpers/auth'
import { dataRef } from '../config/constants.js';
import * as moment from 'moment';
export default class NewField extends Component {

constructor(){
    super();
    this.makeArrayOf = this.makeArrayOf.bind(this);
    this.state = Object.assign({
        formdata : {
            name: "",
            HP: 0,
            soil_type: 0,
            area: 0,
            crop_type: "rice",
            dike_height:0,
            lat_shape: [],
            long_shape: [],
            alt_shape: [],
            lat_center: 0,
            long_center: 0,
            owner_id: getUserId(),
            IR_rec: 0,
            date_irrigation: "",
            day_irrigation: 0,
            day_transplant: 0,
            date_transplant: "",
            month_irrigation: 0,
            month_transplant: 0,
            year_irrigation: 0,
            year_transplant: 0,
            DP_list: this.makeArrayOf(0, 30),
            IR_rec_list: this.makeArrayOf(0, 30),
            ET_list: this.makeArrayOf(0, 30),
            HP_list: this.makeArrayOf(0, 30),
            IR_list: this.makeArrayOf(0, 30),
            RF_list: this.makeArrayOf(0, 30),
            RO_list: this.makeArrayOf(0, 30),
            HP_pre_list: this.makeArrayOf(0, 5),
            ET_pre_list: this.makeArrayOf(0, 5),
            RF_pre_list: this.makeArrayOf(0, 5),
            DP_pre_list: this.makeArrayOf(0, 5), 
            RO_pre_list: this.makeArrayOf(0, 5),
            desired_depth_chart: this.makeArrayOf(7, 30),
            critical_depth_chart: this.makeArrayOf(3, 30),
        },
        dataEntered: false,
        isEditable: false,
        doneDrawing: false,
        dialogVisible: false
    });
    this.soil_options = [
            {
             id:0, 
             label:'Clay',
             value:'0',
            },
            {
             id:1, 
             label:'1',
             value:'1',
            },
            {
             id:2, 
             label:'2',
             value:'2',
            }, 
            {
             id:3, 
             label:'3',
             value:'3',
            },
            {
             id:4, 
             label:'Fine Sand',
             value:'4',
            },
    ];
    
    this.handleChange = this.handleChange.bind(this);
    this.startDrawing = this.startDrawing.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDialogHide = this.onDialogHide.bind(this);
    this.clearDrawing = this.clearDrawing.bind(this);
    this.finishDrawing = this.finishDrawing.bind(this);
}

componentDidMount(){
  //  this.renderChart('desired-depth-chart');
}

makeArrayOf(value, length) {
  var arr = [], i = length;
  while (i--) {
    arr[i] = value;
  }
  return arr;
}

handleChange(e, attribute){
    let formdata = this.state.formdata;
    if(attribute == "soil_type"){
        formdata[attribute] = e.value;
    }
    else if(attribute == "date_transplant"){
        formdata.date_transplant = moment(e.value).format();
        formdata.day_transplant = e.value.getDate();
        formdata.month_transplant = e.value.getMonth() + 1;
        formdata.year_transplant = e.value.getFullYear();            
    }
    else if(attribute == "date_irrigation"){
        formdata.date_irrigation = moment(e.value).format();
        formdata.day_irrigation = e.value.getDate();
        formdata.month_irrigation = e.value.getMonth()  + 1;
        formdata.year_irrigation = e.value.getFullYear();            
    }
    else
        formdata[attribute]=e.target.value;
    
    this.setState({
        formdata: formdata
    });
}

handleSubmit(e) {
    let formdata = this.state.formdata;
    formdata.lat_center = formdata.lat_shape[0];
    formdata.long_center = formdata.long_shape[0]; 
    formdata.HP_list[29] = formdata.HP;
    let newPostKey = dataRef.push().key;
    let updates = {};
    updates[newPostKey] = formdata;
    dataRef.update(updates);
    this.props.history.push('/dashboard');
}

startDrawing(e){
    this.setState({
        isEditable: true,
        dialogVisible: true
    });
}

onDialogHide(e){
    this.setState({
        dialogVisible: false
    });
}

clearDrawing(){
    let formdata = this.state.formdata;
    formdata.lat_shape = [];
    formdata.long_shape = [];
    formdata.alt_shape = [];
    this.setState({
        formdata: formdata
    });
}

finishDrawing(){
    let formdata = this.state.formdata;
    formdata.lat_shape.push(formdata.lat_shape[0]);
    formdata.long_shape.push(formdata.long_shape[0]);
    formdata.alt_shape.push(formdata.alt_shape[0]);
    this.setState({
        formdata: formdata,
        doneDrawing: true, 
        isEditable: false
    });
}

render(){
    return (
        <div id="new-field">
            <ReactTooltip />
            <div id="input-ww">
                <InputWorldWind isDrawEnabled={this.state.isEditable} lat_shape={this.state.formdata.lat_shape} long_shape={this.state.formdata.long_shape} alt_shape={this.state.formdata.alt_shape}/>
            </div>
            <div className="form-container">
            <Dialog header="How to plot your field" onHide={this.onDialogHide} visible={this.state.dialogVisible} width="350px" modal={true}>
                Click or tap on the map area where you want to start plotting the first point of your field. Continue drawing by clicking on the next field corner point, until you are reach the end. You do not need to reconnect the starting and the end field points, our app will do that for you. Click 'Done drawing' to finish. You can hit 'Clear' to restart drawing anytime.   
            </Dialog>
            <div id="inputs">
                <h3 className="form-title"> Add new field</h3>
                <form id="new-form" onSubmit={this.handleSubmit}>
                    <div className="inputfield" >
                    <p className="text" data-tip="Naming your field will make it easy to identify later">Name of field </p> 
                    <InputText value={this.state.formdata.name} name="name" placeholder="e.g. My rice field" onChange={(e) => this.handleChange(e, 'name')}/>
                    </div>
                     <div className="inputfield" >
                    <p className="text" data-tip="Accurate area will help us improve the accuracy of the recommendations">Area (in hectares)</p> 
                    <InputText name="area" type="number" placeholder="e.g. 20" value={this.state.formdata.area} onChange={(e) => this.handleChange(e, 'area')}/>
                    </div>
                     <div className="inputfield" >
                    <p className="text" data-tip="Height of dikes for controlling the water built around the farm, typically 40-50cm. If there are none please enter 0">Dike Height (cms): </p> 
                    <InputText name="dike_height" type="number" placeholder="" value={this.state.formdata.dike_height} onChange={(e) => this.handleChange(e, 'dike_height')}/>
                    </div>
                     <div className="inputfield" >
                    <p className="text" data-tip="Typically no more than 20cm. We need to know the initial water level in the field to base the calculations on">Water level (in cm) </p> 
                    <InputText name="HP" type="number" placeholder="" value={this.state.formdata.HP} onChange={(e) => this.handleChange(e, 'HP')}/>
                    </div>
                     <div className="inputfield" >
                    <p className="text" data-tip="Soil type based on grain size. Ranging from (0) fine sand to (5) solid clay.">Soil type </p> 
                    <SelectButton className="soil-button" key="id" options={this.soil_options} value={this.soil_options[this.state.formdata.soil_type].label} onChange={(e) => this.handleChange(e, 'soil_type')}></SelectButton>
                     </div>
                      <div className="inputfield" >
                    <p className="text" data-tip="Rice is the only type available now">Crop type </p> 
                    <InputText name="crop_type" value="Rice" type="string" readOnly="true"/>
                    </div>
                     <div className="inputfield" >
                    <p className="calendar-text" data-tip="When was the crop planted?">Plantation date </p> 
                    <Calendar tabindex="0" placeholder="Calendar" onChange={(e) => this.handleChange(e, 'date_transplant')}></Calendar>
                     </div>
                      <div className="inputfield" >
                    <p  className="calendar-text" data-tip="When was the last irrigation done?">Last irrigation date </p> 
                    <Calendar tabindex="0" placeholder="Calendar" onChange={(e) => this.handleChange(e, 'date_irrigation')}></Calendar>
                        </div>
                    <br />
                    <br />
                   
                    { !this.state.isEditable 
                                        ? <a id="buttonjoy" className="btn btn-info" disabled={this.state.doneDrawing} onClick={this.startDrawing}>Draw my field</a> 
                                        :  !this.state.doneDrawing
                                        ? <a id="buttonjoy" className="btn btn-info" onClick={this.finishDrawing}>Finish Drawing</a> : null }

                    { this.state.isEditable && !this.state.doneDrawing ? <a  id="buttonjoy" className="btn btn-danger" onClick={this.clearDrawing}>Clear Drawing</a> : null }
                    <br />
                    <br />
                    <a id="buttonjoy" className="btn btn-success" disabled={!this.state.doneDrawing} onClick={this.handleSubmit}>Submit</a>

                 </form>
                 <a href="/dashboard" className="btn btn-danger" id="backbutton">Back to Dashboard</a>
                  </div>
                <br />
                
               
                <div id="desired-depth-chart"></div>
                <div id="critical-depth-chart"></div>
            </div>
        </div>
    )
}

}