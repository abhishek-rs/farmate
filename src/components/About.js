import React, { Component } from 'react'
//import DisplayWorldWind from './DisplayWorldWind.js';
import '../styles/About.css';

export default class About extends Component {

render(){
    return(
    <div id="container">
        <div id="about">
            <div id="about-wrapper">
                <div id="page-section">
                    <h1>Welcome to Farmate </h1>
                    <p className="quotes"> A platform helping you keep track of the irrigation of your fields</p>
                    </div>
                     <div id ="page-section">
                    <p> 70% of all freshwater worldwide is used for irrigation practices. Due to freshwater shortage that already exists and is predicted to get worse.
                    </p>
                     <p>Farmate is a platform build on <a href="https://worldwind.arc.nasa.gov"> NASA World Wind </a> for the <a href="http://www.nasaeuropachallenge.com">NASA Europa Challenge </a>. 
                     The goal of this platform is to enable farmers to keep track of the water levels on their fields helping to save water on irrigation.
                    </p>
                </div>
                 <div id ="page-section">
                    <h1> How it works </h1>
                      <div className="how">
                         <div className="how-container">
                            <img className="number" src="/farmate/images/nasa-fun4.png" />
                                <div className="how-text"> <p>Join farmate. </p>
                                    <p className="fun"> Create a free account on farmate by registering.
                                 </p>
                                <p> Add your field to our map. Our system will tell you how much to irrigate each day to keep the optimum water level. You can add more than 1 field to keep track of all the different crop types and fields that you have. </p> <p className="fun"> The calculations are performed based on your inputs when you first create the field and the latest agriculture engineering formulas.
                                  </p>
                                 <p> See the fields and irrigation levels of your neighbours on the map and communicate your needs together better.
                                </p>
                                <p className="fun">You can also see the weather and rainfall predictions on the dashboard to be able to plan your farming actions better.
                                 </p>
                                </div>
                         </div>
                    </div>
              </div>
                <div id="page-section">
                     <a href="/farmate/register" className="btn btn-info">Register now</a>
                </div>
                
            </div>
        </div>
         <div id="bottom-page">
             <div id="background-section">
                    <h1>Background</h1>
                    <p>Farmate employs various mathematical models based on latest research to predict the current water level. A variety of APIs are used to get the necessary data for the predictions.</p>
                    <p> To validate our idea we engaged in discussions in online farming forums with the farmer community. We also collaborated with Matti Kummu, Assistant Professor at Water development research group at Aalto University. We received a lot of positive feedback on our project. </p>
                    <h5 className="quotes">"When is this platform going to launch?"" - user from <a href="www.ozfarmer.com.au"> ozfarmer.com.au </a> </h5>
                    <h5 className="quotes">"A system helping me keep better track of irrigation would be really useful" - user from <a href="https://thefarmingforum.co.uk/index.php"> thefarmingforum.co.uk </a> </h5>
                    
                </div>
               <div id="we">
                      <h1>Who we are</h1>
                      <p>A group of Aalto students who believe that resourceful and sustainable farming is the future.
                      </p>
                     
                     <div id="team">
                         <div id="person-image"> <img src="/farmate/images/thomas.jpg" /> 
                        <h4 id="person-text">Thomas</h4> </div> 
                         <div id="person-image"> <img src="/farmate/images/abhishek.jpg" /> 
                        <h4 id="person-text">Abhishek</h4> </div>  
                        <div id="person-image"> <img src="/farmate/images/mildaa.jpg" /> 
                        <h4 id="person-text">Milda</h4></div>  
                    </div>
                </div>
                <div id="partners">
                     <h1>Partners </h1>
                     <div id="logos">
                        <img id="logostyle" src="/farmate/images/aaltoo.png"/>
                        <img id="logostyle" src="/farmate/images/EIT.png"/>
                    </div>
                </div>
  
</div>
</div>
 )    
}
}
