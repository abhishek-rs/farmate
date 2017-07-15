import React, { Component } from 'react';
import FieldDashboard from './FieldDashboard.js';

export default class MyFieldDisplay extends Component {

constructor(props){
    super(props);
    this.state = Object.assign({
      filteredUsers: props.filteredUsers,
    });
}

componentWillReceiveProps(nextProps){

}

render(){


return (
<div id="what">
{this.props.name}
</div>


)

}

}



