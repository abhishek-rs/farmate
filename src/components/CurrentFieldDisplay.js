import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {Dialog} from 'primereact/components/dialog/Dialog';
import UpdateField from './UpdateField.js';

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

    ReactDOM.render(
    <div>
        <p>Water level in the field</p>
        <LineChart width={400} height={180} data={chartData}>
            <Line type="monotone" dataKey="HP" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
        </LineChart>
        <p>Rainfall</p>
        
        <LineChart width={400} height={180} data={chartData}>
            <Line type="monotone" dataKey="RF" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
        </LineChart>    
        
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
        <div>
            <Dialog header={name} onHide={this.onDialogHide} visible={this.state.dialogVisible} width="500px" modal={false}>
                {this.state.fieldChosen && <UpdateField hideDialog={this.onDialogHide} currentField={this.state.field} fieldId={this.state.currentField} />}
            </Dialog>    
            <div>
            <div>{name}</div>
            <div id="chart"></div>
                { !this.state.chartLoaded ? 
                        <div>
                            <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
                            <span className="sr-only">Loading...</span>
                        </div>    
                    : null
                }
            <a onClick={this.showUpdate} className="btn btn-success">Update</a>
            </div>
        </div>
        );
    }


}