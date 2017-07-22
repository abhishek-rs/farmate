import React, { Component } from 'react'
import { usersRef } from '../config/constants.js';
import firebase from 'firebase';
import DisplayWorldWind from './DisplayWorldWind.js';
import MyFieldDisplay from './MyFieldDisplay.js';


export default class FieldDashboard extends Component {
    
   // users=[];
    constructor(props){
        super(props);
        this.state = Object.assign({
            fieldSnapshot: props.fieldSnapshot,
            receivedProps: false,
            currentField: null,
            filteredUsers: [],
            field:  {},
            fieldChosen: false,
            items: [],
            field: null,
        });
            this.onlyFields = [];
      this.filterFields = this.filterFields.bind(this);  
      this.handleClick = this.handleClick.bind(this); 
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({
            fieldSnapshot: nextProps.fieldSnapshot,
            currentField: nextProps.highlightedField,
            receivedProps: true
     }, () => {
            this.filterFields();
     })
    
    }

    filterFields(){
        let items = [];
        items.push(Object.values(this.state.fieldSnapshot.val()));
        this.setState({
             items: items[0]
         });
         console.log(items[0]);
            
        var myUserId = firebase.auth().currentUser.uid;
            console.log(myUserId);
        var filteredUsers = items[0].filter( (item) =>  item.owner_id === myUserId );
        console.log(filteredUsers);
  //  var oneMore;
   // var filteredValues = filteredUsers.forEach(function(object){
  //  fieldName = object.name;
   // console.log(fieldName);
 //  }); console.log(filteredValues);
     
        this.setState({
       filteredUsers: filteredUsers,     
    });
   
    }

    handleClick() {
     //  event.currentTarget.style.backgroundColor = '#ccc';
        // event.preventDefault()
        console.log("click");
        //var el = event.target
    }
  
    render () { 
        
        let onlyFields = this.state.filteredUsers !== [] ? this.state.filteredUsers.map((field) =>
          <MyFieldDisplay field={field} onClick={this.handleClick}> </MyFieldDisplay>  
            ) : null;
            
            return (
           <div>
        {   onlyFields  &&
                <div>
            
                { onlyFields }
             
                </div>
        }
       
           </div>
        
        )    
    }

}


