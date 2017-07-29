import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Request from 'superagent';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {Dialog} from 'primereact/components/dialog/Dialog';
import UpdateField from './UpdateField.js';
import '../styles/CurrentFieldDisplay.css';
import { dataRef, database } from '../config/constants.js';

import * as moment from 'moment';
import {ToggleButton} from 'primereact/components/togglebutton/ToggleButton';
import { getUserId } from '../firebaseHelpers/auth';
import {Growl} from 'primereact/components/growl/Growl';

export default class CurrentFieldDisplay extends Component{

    constructor(props){
        super(props);
        this.state = Object.assign({
            fieldSnapshot: props.fieldSnapshot,
            currentField: props.highlightedField,
            field: {},
            fieldChosen: false,
            chartLoaded: false,
            dialogVisible: false,
            updateCheck: false,
            messages: []
        });
        this.userId = getUserId();
        this.onDialogHide = this.onDialogHide.bind(this);
        this.renderChart = this.renderChart.bind(this);
        this.showUpdate = this.showUpdate.bind(this);
        this.changeField = this.changeField.bind(this);
        this.onChangeUpdate = this.onChangeUpdate.bind(this);
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
            dialogVisible: false,
            messages: [{severity:'info', summary:'Success', detail: "Data for Field " + this.state.field.name + " has been updated!"}]
        });
    }

    showUpdate(){
        this.setState({
            dialogVisible: true
        });
    }

    onChangeUpdate(){
        this.setState({
            updateCheck: true
        });
        let formdata = this.state.field;
        formdata.IR_list[29] = formdata.IR_rec;
        let area_in_m2 = parseInt(formdata.area) * 10000;
        formdata.IR_rec = -1;
        formdata.HP_list[29], formdata.HP = (parseFloat(formdata.HP_list[29]) + (formdata.IR_rec / area_in_m2) * 100).toFixed(2);
        let baseUrl = 'https://shekzilla.pythonanywhere.com/api/predict/single_field/';
        let that = this;
        database.ref('main/' + this.state.currentField).set(formdata)
                    .then( () => 
                        Request.get(baseUrl + that.state.currentField)
                        .then( (err, res) => {
                            if(err){
                                console.log('error updating:', err);
                                that.props.updateData();
                            }
                            else{
                                that.props.updateData();
                                console.log('Updated!')
                            }
                        })
        );        
        this.setState({
            messages: [{severity:'info', summary:'Success', detail: "Data for Field " + formdata.name + " has been updated!"}]
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
        let dayDiff = i - 29;
        let HP_RF_data = Object.assign({
            'WaterLevel': parseFloat(f),
            'Rainfall': parseFloat(RF[i]),
            'Run-off': parseFloat(RO[i]),
            'Evaporation': parseFloat(ET[i]),
            'Seepage': parseFloat(DP[i]),
            index: (dayDiff === 0) ? 'Today' : moment().add(dayDiff, 'days').format("DD-MM")
            });
        chartData.push(HP_RF_data);
    });
    
    
    var margins = {top: 2, right: 10, left: 0, bottom: 0};
    
    ReactDOM.render(
    <div>
        <div className="chartContainer">
            <ResponsiveContainer>
            <AreaChart data={chartData}
                margin={margins}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="index" />
                <YAxis label="(cms.) "/>
                <Tooltip />
                <Area type='monotone' dataKey='WaterLevel' stroke='#FF5722' fill='#FF5722' />
            </AreaChart>
            </ResponsiveContainer>
            <p id="waterlvl">Water level in the field</p>
        </div>

        <div className="chartContainer">
        <ResponsiveContainer>
            <AreaChart data={chartData}
                margin={margins}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="index" />
                <YAxis label="(cms.) "/>
                <Tooltip />
                <Area type='monotone' dataKey='Rainfall' stroke='#8884d8' fill='#8884d8' />
            </AreaChart>    
        </ResponsiveContainer>
        <p id="rainfall">Rainfall</p>
        </div>

        <div className="chartContainer">
        <ResponsiveContainer>
            <AreaChart data={chartData}
                margin={margins}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="index" />
                <YAxis label="(cms.)" unit="cms" />
                <Tooltip />
                <Area type='monotone' dataKey='Seepage' stackId="1" stroke='#4CAF50' fill='#4CAF50' />
                <Area type='monotone' dataKey='Evaporation' stackId="2" stroke='#3F51B5' fill='#3F51B5' />
                <Area type='monotone' dataKey='Run-off' stackId="3" stroke='#F44336' fill='#F44336' />
            </AreaChart>    
        </ResponsiveContainer>
        <p id="loss">Losses</p>
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
        if(nextProps.highlightedField !== this.state.currentField 
            || nextState.chartLoaded !== this.state.chartLoaded 
            || nextState.dialogVisible !== this.state.dialogVisible 
            || nextState.field !== this.state.field
            || nextState.currentField !== this.state.currentField
            || nextState.updateCheck !== this.state.updateCheck
            || nextState.fieldSnapshot !== this.state.fieldSnapshot){
            return true;
        }
        return false;
    }

    render(){
        return (
        <div id="currentFieldData">
            <Dialog header={this.state.field.name} onHide={this.onDialogHide} visible={this.state.dialogVisible} width="600px" modal={false}>
                {this.state.fieldChosen && <UpdateField updateData={this.props.updateData} hideDialog={this.onDialogHide} currentField={this.state.field} fieldId={this.state.currentField} />}
            </Dialog>    
            <div>
            <h4>{this.state.field.name} stats: </h4>
            <div id="chart"></div>
                { !this.state.chartLoaded ? 
                        <div>
                            <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
                            <span className="sr-only">Loading...</span>
                        </div>    
                    : null
                }

            { this.state.field.owner_id === this.userId && 
            <div id="update-block">
                <p id="rec">Today's recommended irrigation</p>
                <ToggleButton style={{width:'150px', height: '25px'}} onLabel="Done!" offLabel={this.state.field.IR_rec.toString() + ' m3.'} onIcon="fa-check-square" offIcon="fa-square"
                checked={this.state.field.IR_rec === -1 ? true: this.state.updateCheck } disabled={this.state.field.IR_rec === -1} onChange={this.onChangeUpdate}/>
            </div>
            }
            { this.state.field.owner_id === this.userId &&
            <span><a id="update" onClick={this.showUpdate} className="btn btn-success button">Update</a></span>
            }
            <span><a onClick={this.props.close} className="btn btn-danger button">Close</a></span>
            </div>
        </div>
        );
    }
}