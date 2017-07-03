import React, { Component } from 'react'
import { usersRef } from '../config/constants.js';
import firebase from 'firebase';



export default class FieldDashboard extends Component {
    myUserId = "";
    constructor(){
        super();

        var myUserId = firebase.auth().currentUser.uid;
        var myFields = firebase.database().ref("main/").orderByKey().on("child_added", function(snapshot) {
        console.log(snapshot.key);
});
        
        
        //('main/' + myUserId)
        
        //.orderByChild('name').on("child_added", function(dataSnapshot) {
        //    var name = snapshot.child("name").val();

        

        console.log(myUserId);
        console.log(myFields);
        
    }

    checkUser(){


    }

render () {

    
    
    return (
       
        <h1> HEllo </h1>
     



        )

    }
}