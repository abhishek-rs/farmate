import React, { Component } from 'react'
//import DisplayWorldWind from './DisplayWorldWind.js';
import '../styles/About.css';

export default class About extends Component {

render(){
    return(
        <div id="about">
            <div id="welcome">
               <h1>Welcome to Farmate </h1>
               <p> A platform helping you keep track of the irrigation of your fields</p>
           </div>
            <div id ="works">
                <h3>How it works </h3>
                <p> Create a free account on farmate by registering.
                </p>
                <p>Add your field to our map and our system will tell you how much you need to irrigate each day to keep the optimum water level. The calculations are performed based on your inputs when you first create the field and the latest agriculture engineering formulas.
                </p>
                 <p>See the fields and irrigation levels of your neighbours on the map and communicate your needs together better.
                 </p>
            </div>
            <div id="features">
                <h3>Awesome features </h3>
                <p>You can more than 1 field to keep track of all the different crop types and fields that you have.
                </p>
                <p> Stay informed: our system will display the overall water level of your field, the rain fall as well as the water loss.
                </p>
                <p>You can also see the weather and rainfall predictions on the dashboard to be able to plan your farming actions better.
                </p>
            </div>
            <div id="we">
                <h3>Who we are</h3>
                <p>A group of Aalto students who believe that resourceful and sustainable farming is the future.
                </p>
            </div>
            <div id="background">
                <h3>Background</h3>
                <p> User research</p>
                <p>Science </p>
            </div>
            <div id="partners">
                <h3>Partners </h3>
                <div id="logos">
                <img id="aalto" src="/images/aaltoo.png"/>
                <img id="aalto" src="/images/EIT.png"/>
                </div>
            </div>
        </div>

    )    
}


}