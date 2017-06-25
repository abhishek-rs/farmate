import React, { Component } from 'react' 
import ReactDOM from 'react-dom'
import '../styles/NewField.css'
import {Chart} from 'react-d3-core'
import {LineChart} from 'react-d3-basic'
import {InputText} from 'primereact/components/inputtext/InputText'
import ReactiveWorldWind from './ReactiveWorldWind'

export default class NewField extends Component {

constructor(){
    super();
    this.makeArrayOf = this.makeArrayOf.bind(this);
    this.state = Object.assign({
        formdata : {
            name: "",
            HP: 0,
            soiltype: 0,
            area: 0,
            croptype: "rice",
            dike_height:0,
            irrigation_today: "",
            lat_shape: [],
            long_shape: [],
            lat_center: 0,
            long_center: 0,
            owner_id: "",
            IR_rec: 0,
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
            desired_depth_chart: this.makeArrayOf(7, 30),
            critical_depth_chart: this.makeArrayOf(3, 30),
        },
        dataEntered: false,
    });
    this.renderChart = this.renderChart.bind(this);
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
            <ReactiveWorldWind />
            <div id="inputs">
                <div id="form"></div>
                <div id="desired-depth-chart"></div>
                <div id="critical-depth-chart"></div>
            </div>
        </div>
    )
}

}