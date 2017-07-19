import React, { Component } from 'react'
//import DisplayWorldWind from './DisplayWorldWind.js';
import '../styles/About.css';

export default class About extends Component {

render(){
    return(
    <div id="container">
        <div id="about">
            <div id="about-wrapper">
                <div id="welcome">
                    <h1>Welcome to Farmate </h1>
                    <h4> A platform helping you keep track of the irrigation of your fields</h4>
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
                <div id="background">
                    <h3>Background</h3>
                    <p> 70% of all freshwater worldwide is used for irrigation practices. Of this roughly 45% is used for the irrigation of ricefields. Due to freshwater shortage that already exists and is predicted to get worse we decided to develop Farmate. Farmate is a platform build on NASA World Wind (https://worldwind.arc.nasa.gov/) for the NASA Europa Challenge (http://www.nasaeuropachallenge.com/). The goal of this platform is to enable farmers to keep tracker of the water levels on their fields. Which in turn would cause water saving on irrigation.
                    </p>
                    <p> To validate our idea we engaged in discussions in online farming forums with the farmer community. We also collaborated with Matti Kummu, Assistant Professor at Water development research group at Aalto University. We received a lot of positive feedback on our project. </p>
                    <h5>"When is this platform going to launch?"" - user from <a href="www.ozfarmer.com.au"> ozfarmer.com.au </a> </h5>
                    <h5>"A system helping me keep better track of irrigation would be really useful" - user from <a href="https://thefarmingforum.co.uk/index.php"> thefarmingforum.co.uk </a> </h5>
                    <p>Farmate employs various mathematical models based on latest research to predict the current water level. A variety of APIs are used to get the necessary data for the predictions.</p>
                </div>
            </div>
        </div>
        <div id="bottom-page">
               <div id="we">
                      <h3>Who we are</h3>
                      <p>A group of Aalto students who believe that resourceful and sustainable farming is the future.
                      </p>
                      <h3>Thomas</h3> <br />  <h3>Abhishek</h3> <h3>Milda</h3>
                     <div id="team">
                         <div id="person-image"> <img src="/images/thomas.jpg" /> 
                         </div>
                         <div id="person-image"> <img src="/images/abhishek.jpg" /> 
                         </div>
                        <div id="person-image"> <img src="/images/mildaa.jpg" /> 
                        </div>
                    </div>
                </div>
                <div id="partners">
                     <h3>Partners </h3>
                     <div id="logos">
                        <img id="aalto" src="/images/aaltoo.png"/>
                        <img id="aalto" src="/images/EIT.png"/>
                    </div>
                </div>
        </div>
    </div>

 )    
}


}