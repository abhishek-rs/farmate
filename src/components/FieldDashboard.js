import React, { Component } from 'react'
import { usersRef } from '../config/constants.js';
import firebase from 'firebase';
import DisplayWorldWind from './DisplayWorldWind.js';
import Weather from './Weather.js';
import MyFieldDisplay from './MyFieldDisplay.js';


export default class FieldDashboard extends Component {
    
   // users=[];
    constructor(props){
        super(props);
        this.state = Object.assign({
            fieldSnapshot: props.fieldSnapshot,
            currentField: null,
            field:  {},
            fieldChosen: false,
            items: [],
            oneMore: null
        });
      this.filtersFields = this.filterFields.bind(this);  
    }
  

    componentWillReceiveProps(nextProps) {
        this.setState({
            fieldSnapshot: nextProps.fieldSnapshot,
            currentField: nextProps.highlightedField,
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
    })
   
    }
 


  
    render () {
        return (
             <div>
           <div id="fieldHell">
            <h1> Hello </h1>
           <MyFieldDisplay oneMore={this.state.filteredUsers}> </MyFieldDisplay>
            </div>
            
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