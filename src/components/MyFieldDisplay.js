import React, { Component } from 'react';
import FieldDashboard from './FieldDashboard.js';
import '../styles/MyFieldDisplay.css'

export default class MyFieldDisplay extends Component {

//constructor(props){
//    super(props);
//    this.state = Object.assign({
  //    filteredUsers: props.filteredUsers,
//    });
//}


render(){
  return (
  <div id="fieldinfo" >
  <ul> 
  <p onClick={this.props.onClick} className="fieldtitle"> Field Name: {this.props.field.name}</p>

  <p> Crop Type: {this.props.field.crop_type} </p>
  <p>Last irrigated: Cannot read our database </p>
</ul>
</div>

  )

}

}



