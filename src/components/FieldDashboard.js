import React, { Component } from 'react'
import { usersRef } from '../config/constants.js';
import firebase from 'firebase';
import DisplayWorldWind from './DisplayWorldWind.js';
import Weather from './Weather.js';
//import MyFieldDisplay from './MyFieldDisplay.js';

var onlyFields = [];
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
            onlyFields: [],
            fields: null,
        });
      this.filterFields = this.filterFields.bind(this);  
        
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
  
    render () { 
        
        var onlyFields = this.state.filteredUsers !== [] ? this.state.filteredUsers.map((field) =>
        <li> {field.name} </li> 
            ) : null;
            
            return (
           <div>
        {   this.state.filteredUsers  &&
            <div>
             <ul>{onlyFields}</ul>    
              </div>
        }
        </div>
        
        )    
    }

}



     //let that = this;
       // usersRef.once("value").then (function(dataSnapshot) {
        //    let items = [];
         //   items.push(Object.values(dataSnapshot.val()));
         //   that.setState({
         //       items: items[0]
         //   });
         //    console.log(items[0]);
         //    var myUserId = firebase.auth().currentUser.uid;
         //    console.log(myUserId);
        //    var filteredUsers = items[0].filter( (item) =>  item.owner_id === myUserId );
       // console.log(filteredUsers);
       // var oneMore;
      //      var filteredValues = filteredUsers.forEach(function(object){
      //          oneMore = object.name;
       //         console.log(oneMore);
      //      });
//
      //      this.setState({
     //           oneMore: oneMore
      //      });
     //   }.bind(this));