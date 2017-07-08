import React, { Component } from 'react';
import {Chart} from 'react-d3-core'
import {LineChart} from 'react-d3-basic'
import ReactDOM from 'react-dom'

export default class CurrentFieldDisplay extends Component{

    constructor(props){
        super(props);
        this.state = Object.assign({
            fieldSnapshot: props.fieldSnapshot,
            currentField: props.selectedField,
            field: {},
            fieldChosen: false
        });
        this.renderChart = this.renderChart.bind(this);
        this.changeField = this.changeField.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            fieldSnapshot: nextProps.fieldSnapshot,
            currentField: nextProps.highlightedField,
        }, () => {
            this.changeField(this.state.fieldSnapshot);
        })
    }

    renderChart(doc){
    let field = this.state.field;
    let chartData = [];

    field.IR_list.map( (f,i) => {
        let IRdata = Object.assign({
            IR: parseInt(f),
            index: i
            });
        chartData.push(IRdata);
    });
     
    console.log(chartData);
    var width = 700;
    var height = 300;
    var margins = {left: 100, right: 100, top: 50, bottom: 50};
    var title = "Irrigation levels";
    var chartSeries = [
      {
        field: 'IR',
        name: 'IR',
        color: '#fff',
        style: {
          "strokeWidth": 2,
          "strokeOpacity": .2,
          "fillOpacity": .2
        }
      }
    ];
    
    var x = function(d) {
      return d.index;
    }.bind(this);

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

    changeField(snapshot){
        let fields = Object.values(snapshot.val());
        let ids = Object.keys(snapshot.val());
        let chosenField;
        ids.map(
            (f, i) => {
            if(this.state.currentField === f){
                chosenField = i;
            }   
        });

        this.setState({
           field: fields[chosenField],
           fieldChosen: fields[chosenField] === undefined ? false : true
        }, () => {
            if(this.state.fieldChosen)
                this.renderChart('chart')
        });
    }

    render(){
        let name = this.state.fieldChosen ? this.state.field.name : null; 
        return (
            <div>
            <div>{name}</div>
            <div id="chart"></div>
            </div>
        );
    }


}