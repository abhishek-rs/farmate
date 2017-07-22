import React, { Component } from 'react';
import '../styles/Field.css';
import * as moment from 'moment';

export default class Field extends Component {
    constructor(props){
        super(props);
        this.selectedStyle = {
            border: '4px solid #d62347'
        }
    }

    render(){
        let field = this.props.field;
        let id = this.props.id;
        let style = this.props.isSelected ? this.selectedStyle : { border : 'none' };
        return (
            <div style={style} onClick={() => this.props.handleClick(id)} className="field">
                <div className="holder">
			        <div className="icon">
				        <img src="/images/rice.png" />	
			        </div>
			        <div className="sub-holder">
				        <div className="field-details">
					        <h4> {field.name} </h4>
					        <p> ( {field.area} hectares)</p>
                            <p> Last irrigated on <span className="btn btn-info">{moment(field.date_irrigation).format("MMMM Do YYYY, h:mm a")}</span> </p>
				        </div>
				    </div>
				</div>
			</div>
		);
    }
}