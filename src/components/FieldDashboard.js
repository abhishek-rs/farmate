import React, { Component } from 'react'
import { usersRef } from '../config/constants.js';
import firebase from 'firebase';
import DisplayWorldWind from './DisplayWorldWind.js';
import Weather from './Weather.js';


export default class FieldDashboard extends Component {
    
   // users=[];
 
  
    constructor(){
        super();
        this.state = Object.assign({
            items: [],
            oneMore: null
        });
        
    }
   // var usersRef = firebase.database().ref('users'); var mainRef = firebase.database().ref('main');
//var adaRef = usersRef.child('ada'); 
//var adaFirstNameRef = adaRef.child('name/first');
//var path = adaFirstNameRef.toString();
// path is now 'https://sample-app.firebaseio.com/users/ada/name/first'

    componentWillMount() {
     let that = this;
        usersRef.once("value").then (function(dataSnapshot) {
            let items = [];
            items.push(Object.values(dataSnapshot.val()));
            that.setState({
                items: items[0]
            });
             console.log(items[0]);
             var myUserId = firebase.auth().currentUser.uid;
             console.log(myUserId);
            var filteredUsers = items[0].filter( (item) =>  item.owner_id === myUserId );
        console.log(filteredUsers);
        var oneMore;
            var filteredValues = filteredUsers.forEach(function(object){
                oneMore = object.name;
                console.log(oneMore);
            });

            this.setState({
                oneMore: oneMore
            });
        }.bind(this));
    }

  
    render () {
        
        return (
             <div>
            <h1> Hello </h1>
           
                <p> {this.state.oneMore}   </p>
            
            </div>
        
        )    
    }

}



   // this.checkUser = this.checkUser.bind(this);
    



        //var myUserId = firebase.auth().currentUser.uid;
       // var myFields = firebase.database().ref("main/").orderByKey().on("child_added");
     
        
        //('main/' + myUserId)
        
        //.orderByChild('name').on("child_added", function(dataSnapshot) {
        //    var name = snapshot.child("name").val();

        

        //console.log(myUserId);
        //console.log(myFields);

