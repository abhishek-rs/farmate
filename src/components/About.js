import React, { Component } from 'react'
//import DisplayWorldWind from './DisplayWorldWind.js';
import '../styles/About.css';

export default class About extends Component {

render(){
    return(
    <div id="container">
        <div id="about">
            <div id="about-wrapper">
                <div className="welcome-wrapper">
                     <h1 className="welcome-title">Welcome to Farmate </h1>
                        <div className="icon-title">
				          <img src="/farmate/images/rice3.png" />	
			           </div>
                </div>
                    <h3 className="sub-title"> A platform helping farmers to keep track of the irrigation of their fields</h3>
                    <div id ="page-section">
                        <p> 70% of all freshwater worldwide is used for irrigation practices. A big freshwater shortage already exists and is predicted to get worse.
                         Farmate is a platform build on <a href="https://worldwind.arc.nasa.gov"> NASA World Wind </a> for the <a href="http://www.nasaeuropachallenge.com">NASA Europa Challenge </a>. 
                         The goal of this platform is to enable farmers to keep track of the water levels on their fields helping to save water on irrigation.
                        </p>
                    </div>
                    <div id ="page-section">
                      <h1 className="title-color"> How it works </h1>
                        <div className="how">
                            <div className="how-container">
                                <div className="number"> 1 </div>
                                <div className="how-text"> <p> Create a free account on farmate by registering, add your field to our map.
                                                            </p>
                                </div>
                            </div>
                            <div className="how-container">
                                 <div className="number"> 2 </div>
                                <div className="how-text"><p>Our system will tell you how much you need to irrigate each day to keep the optimum water level. The calculations are performed based on your inputs when you first create the field.
                                                         </p>
                                </div>
                            </div>
                            <div className="how-container">
                                <div className="number"> 3 </div>
                                     <div className="how-text"> <p>See the fields and irrigation levels of your neighbours on the map and communicate your needs together better.
                                                               </p> 
                                     </div>
                                </div>
                             </div>
                        </div>
                     </div>
                <div>
               </div>
                    <div id="page-section">
                       <a href="/farmate/register" id="about-button" className="btn btn-success">Register now</a>
                    </div>
                    <div id ="page-section">
                      <h1 className="title-color"> Watch the tutorial </h1>
                         <p>  Video goes here </p>
                    </div>
                    <div id="page-section">
                        <h1 className="title-color">Background</h1>
                             <p>Farmate employs various mathematical models based on latest research to predict the current water level. A variety of APIs are used to get the necessary data for the predictions.
                                Farmate has a python based backend. The frontend is based on react.js, improving the app speed and providing an intuitive interface for the farmer. </p>
                            <p> For detailed documentation on how Farmate was built, the flow charts explaining the formulas and to see the code please visit our: </p>
                                <a id="github" className="btn btn-info" href="https://github.com/abhishek-rs/farmate">Github repository</a> 
                                     <p> We collaborated with Matti Kummu, Assistant Professor at Water development research group at Aalto University. Also, to validate our idea, we engaged in discussions in online farming forums with the farmer community. We received a lot of positive feedback on our project. </p>
                                        <div className="quote-box">
                                             <h5 className="big-quote">"</h5>
                                                <div className="quote-position">
                                                    <h5 className="quotes">When is this platform going to launch? - user from <a href="www.ozfarmer.com.au"> ozfarmer.com.au </a> </h5>
                                                    <h5 className="quotes">A system helping me keep better track of irrigation would be really useful - user from <a href="https://thefarmingforum.co.uk/index.php"> thefarmingforum.co.uk </a> </h5>
                                                </div>
                                        </div>
                    </div>
                    <div id="page-section">
                        <h1 className="title-color">Who we are</h1>
                             <p>A group of Aalto students studying Human Computer Interaction and Design who believe that resourceful and sustainable farming is the future.
                            </p>
                                <div id="team">
                                     <div id="person-image"> <img src="/farmate/images/thomas2.png" /> 
                                         <h4 id="person-text">Thomas: Python & Maths</h4> </div> 
                                     <div id="person-image"> <img src="/farmate/images/abhishek2.png" /> 
                                        <h4 id="person-text">Abhishek: Front-end Lead</h4> </div>  
                                     <div id="person-image"> <img src="/farmate/images/mildaa.png" /> 
                                         <h4 id="person-text">Milda: Front-end & UX </h4></div>  
                                </div>
                     </div>
                    <div id="partners">
                        <h1 className="title-color">Partners </h1>
                            <div id="logos">
                                <img id="logostyle" src="/farmate/images/aaltoo.png"/>
                                <img id="logostyle" src="/farmate/images/EIT.png"/>
                             </div>
                    </div>         
                    <div id="footer">
                            Farmate 2017. All rights reserved. 
                    </div>
             
        </div>
    </div>   
)    
}
}
