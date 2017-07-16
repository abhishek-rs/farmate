import React, { Component } from 'react';
import FieldDashboard from './FieldDashboard.js';

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
  
  <p onClick={this.props.onClick}> {this.props.field.name} </p>


  </div>

  )

}

}



