import React, { Component } from 'react';
import {Chart} from 'react-d3-core'
import {LineChart} from 'react-d3-basic'
import ReactDOM from 'react-dom'

export default class CurrentFieldDisplay extends Component{

    constructor(props){
        super(props);
        this.state = Object.assign({
            fieldSnapshot: props.fieldSnapshot,
            currentField: props.highlightedField,
            field: {},
            fieldChosen: false,
            chartLoaded: false
        });
        this.renderChart = this.renderChart.bind(this);
        this.changeField = this.changeField.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.highlightedField !== this.state.currentField){
            this.setState({
                currentField: nextProps.highlightedField,
            }, () => {
                this.changeField(this.state.fieldSnapshot, this.state.currentField);
            })
        }
    }

    renderChart(doc){
    let field = this.state.field;
    let chartData = [];
    console.log(field);
    let HP = field.HP_list;
    HP = HP.concat(field.HP_pre_list);
    let RF = field.RF_list;
    RF = RF.concat(field.RF_pre_list);
    let currentDate = new Date();
    
    console.log(HP);
    HP.map( (f,i) => {
        let HP_RF_data = Object.assign({
            HP: parseFloat(f),
            RF: parseFloat(RF[i]),
            index: currentDate.getDate() - (30 - i)
            });
        chartData.push(HP_RF_data);
    });
     
    var width = 300;
    var height = 200;
    var margins = {left: 20, right: 20, top: 10, bottom: 30};
    var title = "Irrigation levels";
    var chartSeries1 = [
      {
        field: 'HP',
        name: 'HP',
        color: '#fff',
        style: {
          "strokeWidth": 4,
          "strokeOpacity": .8,
          "fillOpacity": .8
        }
      }
    ];

    var chartSeries2 = [
      {
        field: 'RF',
        name: 'RF',
        color: '#fff',
        style: {
          "strokeWidth": 4,
          "strokeOpacity": .8,
          "fillOpacity": .8
        }
      }
    ];
    
    var x = function(d) {
      return d.index;
    }.bind(this);

    ReactDOM.render(
    <div>
      <LineChart
        showXGrid= {true}
        showYGrid= {false}
        margins= {margins}
        title={title}
        data={chartData}
        width={width}
        height={height}
        chartSeries={chartSeries1}
        x={x}
      />

      <LineChart
        showXGrid= {true}
        showYGrid= {false}
        margins= {margins}
        title={title}
        data={chartData}
        width={width}
        height={height}
        chartSeries={chartSeries2}
        x={x}
      />
    </div>
    , document.getElementById(doc));

    }

    changeField(snapshot, selectedField){
        let fields = Object.values(snapshot.val());
        let ids = Object.keys(snapshot.val());
        let chosenField;
        ids.map(
            (f, i) => {
            if(selectedField === f){
                chosenField = i;
            }   
        });

        this.setState({
           field: fields[chosenField],
           fieldChosen: fields[chosenField] === undefined ? false : true
        }, () => {
            if(this.state.fieldChosen){
                this.setState({
                    chartLoaded: true
                }, () => this.renderChart('chart'));
            }
        });
    }

    componentWillMount(){
        this.changeField(this.props.fieldSnapshot, this.props.highlightedField);
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.highlightedField !== this.state.currentField || nextState.chartLoaded !== this.state.chartLoaded){
            return true;
        }
        return false;
    }

    render(){
        let name = this.state.fieldChosen ? this.state.field.name : null; 
        return (
            <div>
            <div>{name}</div>
            <div id="chart"></div>
                { !this.state.chartLoaded ? 
                        <div>
                            <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
                            <span className="sr-only">Loading...</span>
                        </div>    
                    : null}
            </div>
        );
    }


}