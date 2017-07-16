import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {Dialog} from 'primereact/components/dialog/Dialog';
import UpdateField from './UpdateField.js';
import '../styles/CurrentFieldDisplay.css';
import * as moment from 'moment';

export default class CurrentFieldDisplay extends Component{

    constructor(props){
        super(props);
        this.state = Object.assign({
            fieldSnapshot: props.fieldSnapshot,
            currentField: props.highlightedField,
            field: {},
            fieldChosen: false,
            chartLoaded: false,
            dialogVisible: false
        });
        this.onDialogHide = this.onDialogHide.bind(this);
        this.renderChart = this.renderChart.bind(this);
        this.showUpdate = this.showUpdate.bind(this);
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

    onDialogHide(e){
        this.setState({
            dialogVisible: false
        });
    }

    showUpdate(){
        this.setState({
            dialogVisible: true
        });
    }

    renderChart(doc){
    let field = this.state.field;
    let chartData = [];
    
    let HP = field.HP_list;
    HP = HP.concat(field.HP_pre_list);
    let RF = field.RF_list;
    RF = RF.concat(field.RF_pre_list);
    let ET = field.ET_list;
    ET = ET.concat(field.ET_pre_list);
    let DP = field.DP_list;
    DP = DP.concat(field.DP_pre_list);
    let RO = field.RO_list;
    RO = RO.concat(field.RO_pre_list);   

    HP.map( (f,i) => {
        let HP_RF_data = Object.assign({
            'WaterLevel': parseFloat(f),
            'Rainfall': parseFloat(RF[i]),
            'Run-off': parseFloat(RO[i]),
            'Evaporation': parseFloat(ET[i]),
            'Seepage': parseFloat(DP[i]),
            index: moment().day(i - 29).format("DD-MM")
            });
        chartData.push(HP_RF_data);
    });
    
    
    var margins = {top: 2, right: 10, left: 0, bottom: 0};
    
    ReactDOM.render(
    <div>
        <div className="chartContainer">
            <p id="waterlvl">Water level in the field</p>
            <ResponsiveContainer>
            <AreaChart data={chartData}
                margin={margins}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Area type='monotone' dataKey='WaterLevel' stroke='#FF5722' fill='#FF5722' />
            </AreaChart>
            </ResponsiveContainer>
        </div>

        <div className="chartContainer">
        <p id="rainfall">Rainfall</p>
        <ResponsiveContainer>
            <AreaChart data={chartData}
                margin={margins}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Area type='monotone' dataKey='Rainfall' stroke='#8884d8' fill='#8884d8' />
            </AreaChart>    
        </ResponsiveContainer>
        </div>

        <div className="chartContainer">
        <p id="loss">Losses</p>
        <ResponsiveContainer>
            <AreaChart data={chartData}
                margin={margins}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Area type='monotone' dataKey='Seepage' stackId="1" stroke='#4CAF50' fill='#4CAF50' />
                <Area type='monotone' dataKey='Evaporation' stackId="2" stroke='#3F51B5' fill='#3F51B5' />
                <Area type='monotone' dataKey='Run-off' stackId="3" stroke='#F44336' fill='#F44336' />
            </AreaChart>    
        </ResponsiveContainer>
        </div>
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
        if(nextProps.highlightedField !== this.state.currentField || nextState.chartLoaded !== this.state.chartLoaded || nextState.dialogVisible !== this.state.dialogVisible){
            return true;
        }
        return false;
    }

    render(){
        let name = this.state.fieldChosen ? this.state.field.name : null;
         
        return (
        <div id="currentFieldData">
            <Dialog header={name} onHide={this.onDialogHide} visible={this.state.dialogVisible} width="500px" modal={false}>
                {this.state.fieldChosen && <UpdateField hideDialog={this.onDialogHide} currentField={this.state.field} fieldId={this.state.currentField} />}
            </Dialog>    
            <div>
            <h3>{name}</h3>
            <div id="chart"></div>
                { !this.state.chartLoaded ? 
                        <div>
                            <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
                            <span className="sr-only">Loading...</span>
                        </div>    
                    : null
                }
            <a id="update" onClick={this.showUpdate} className="btn btn-success">Update</a>
            <a onClick={this.props.close} className="btn btn-danger">Close</a>
            </div>
        </div>
        );
    }


}