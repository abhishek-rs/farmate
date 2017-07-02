import React, { Component } from 'react' 
import ReactDOM from 'react-dom'
import '../styles/NewField.css'
import {Chart} from 'react-d3-core'
import {LineChart} from 'react-d3-basic'
import {InputText} from 'primereact/components/inputtext/InputText'
import {Slider} from 'primereact/components/slider/Slider';
import ReactiveWorldWind from './ReactiveWorldWind'
import ReactTooltip from 'react-tooltip'
import {Calendar} from 'primereact/components/calendar/Calendar'
import {SelectButton} from 'primereact/components/selectbutton/SelectButton'
import {Dialog} from 'primereact/components/dialog/Dialog';
import { getUserId } from '../firebaseHelpers/auth'
import { dataRef } from '../config/constants.js';

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
            day_irrigation: 0,
            day_transplant: 0,
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
    this.renderChart = this.renderChart.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.startDrawing = this.startDrawing.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        formdata.day_transplant = e.value.getDate();
        formdata.month_transplant = e.value.getMonth();
        formdata.year_transplant = e.value.getFullYear();            
    }
    else if(attribute == "date_irrigation"){
        formdata.day_irrigation = e.value.getDate();
        formdata.month_irrigation = e.value.getMonth();
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
//    formdata.HP = formdata.HP * 0.01 * formdata.area * 1000;
    formdata.HP_list[29] = formdata.HP;
    let newPostKey = dataRef.push().key;
    let updates = {};
    updates[newPostKey] = formdata;
    dataRef.update(updates);
    this.props.history.push('/dashboard');
}

startDrawing(e){
    this.setState({
        isEditable: true
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

renderChart(chartData, doc){
    var adaptedChartData = [
 /*   {
        "name": "Darron Weissnat IV",
        "BMI": 20.72,
        "age": 39,
        "birthday": "2005-01-03T00:00:00.000Z",
        "city": "East Russel",
        "married": false,
        "index": 0
    },
    {
        "name": "Pablo Ondricka",
        "BMI": 19.32,
        "age": 38,
        "birthday": "1974-05-13T00:00:00.000Z",
        "city": "Lake Edytheville",
        "married": false,
        "index": 1
    },
    {
        "name": "Mr. Stella Kiehn Jr.",
        "BMI": 16.8,
        "age": 34,
        "birthday": "2003-07-25T00:00:00.000Z",
        "city": "Lake Veronicaburgh",
        "married": false,
        "index": 2
    },
    {
        "name": "Lavon Hilll I",
        "BMI": 20.57,
        "age": 12,
        "birthday": "1994-10-26T00:00:00.000Z",
        "city": "Annatown",
        "married": true,
        "index": 3
    },
    {
        "name": "Clovis Pagac",
        "BMI": 24.28,
        "age": 26,
        "birthday": "1995-11-10T00:00:00.000Z",
        "city": "South Eldredtown",
        "married": false,
        "index": 4
    }*/
    ]; 

    var width = 700;
    var height = 300;
    var margins = {left: 100, right: 100, top: 50, bottom: 50};
    var title = "User sample";
    var chartSeries = [
      {
        field: 'Minimum',
        name: 'BMI',
        color: '#445555',
        style: {
          "strokeWidth": 2,
          "strokeOpacity": .2,
          "fillOpacity": .2
        }
      }
    ];
    
    var x = function(d) {
      return d.index;
    };

ReactDOM.render(
    
      <LineChart
        showXGrid= {true}
        showYGrid= {true}
        margins= {margins}
        title={title}
        data={chartData}
        width={width}
        height={height}
        chartSeries={chartSeries}
        x={x}
      />
    
, document.getElementById(doc));

}

render(){
    return (
        <div id="new-field">
            <ReactTooltip />
            <div id="input-ww">
                <ReactiveWorldWind isDrawEnabled={this.state.isEditable} lat_shape={this.state.formdata.lat_shape} long_shape={this.state.formdata.long_shape} alt_shape={this.state.formdata.alt_shape}/>
            </div>
            <Dialog header="How to plot your field" visible={this.state.dialogVisible} width="350px" modal={true}>
                Start by plotting the first end point of your field and continue by clicking on the next end point, till you are reach the end. You do not need to reconnect the starting and the end point, our app will do that for you. Click 'Done drawing' to finish. You can hit 'Clear' to restart your drawing at any point.   
            </Dialog>

            <div id="inputs">
                <form id="new-form" onSubmit={this.handleSubmit}>
                    
                    <p data-tip="Naming your farm will make it easy to identify later">Name of field</p>
                    <InputText value={this.state.formdata.name} name="name" onChange={(e) => this.handleChange(e, 'name')}/>
                    
                    <p data-tip="Accurate area will help us improve the accuracy of the recommendations">Area (in sq. mts)</p> 
                    <InputText name="area" type="number" value={this.state.formdata.area} onChange={(e) => this.handleChange(e, 'area')}/>

                    <p data-tip="Height of dikes built around the farm, if there are none please enter 0">Dike Height (cms): </p> 
                    <InputText name="dike_height" type="number" value={this.state.formdata.dike_height} onChange={(e) => this.handleChange(e, 'dike_height')}/>
                    
                    <p data-tip="We need to know the initial water level in the field to base the calculations on">Water level(in cms)</p>
                    <InputText name="HP" type="number" value={this.state.formdata.HP} onChange={(e) => this.handleChange(e, 'HP')}/>
                    
                    <p data-tip="Soil type based on grain size. Ranging from (0) fine sand to (5) solid clay.">Soil type</p>
                    <SelectButton key="id" options={this.soil_options} value={this.soil_options[this.state.formdata.soil_type].label} onChange={(e) => this.handleChange(e, 'soil_type')}></SelectButton>

                    <p data-tip="Rice is the only type available now">Crop type</p>
                    <InputText name="crop_type" value="Rice" type="string" readOnly="true"/>
                    
                    <p data-tip="When was the crop planted?">Plantation date</p>
                    <Calendar tabindex="0" onChange={(e) => this.handleChange(e, 'date_transplant')}></Calendar>
    
                    <p data-tip="When was the last irrigation done?">Last irrigation date</p>
                    <Calendar tabindex="0" onChange={(e) => this.handleChange(e, 'date_irrigation')}></Calendar>
    
                    <br />
                    <br />

                    { !this.state.isEditable 
                                        ? <input className="btn btn-info" disabled={this.state.doneDrawing} value="Draw my field" onClick={this.startDrawing} /> 
                                        :  !this.state.doneDrawing
                                        ? <input className="btn btn-info" value="Finish Drawing" onClick={this.finishDrawing} /> : null }

                    { this.state.isEditable && !this.state.doneDrawing ? <input className="btn btn-danger" value="Clear drawing" onClick={this.clearDrawing} /> : null }
                   
                    <br />
                    <br />
                    <input className="btn btn-success" disabled={!this.state.doneDrawing} onClick={this.handleSubmit} value="Submit" />

                </form>
                <div id="desired-depth-chart"></div>
                <div id="critical-depth-chart"></div>
            </div>
        </div>
    )
}

}