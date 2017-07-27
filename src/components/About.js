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
                    <h1 className="welcome-title">Welcome to Farmate </h1>
                    <p className="quotes"> A platform helping farmers to keep track of the irrigation of their fields</p>
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
                            <div className="number"> 1 </div>
                                <div className="how-text"> <p> Create a free account on farmate by registering.
                                                    </p>
                                 </div>
                            </div>
                         
                 
             
                <div className="how-container">
                      <div className="number"> 2 </div>
                    <div className="how-text"><p>Add your field to our map and our system will tell you how much you need to irrigate each day to keep the optimum water level. The calculations are performed based on your inputs when you first create the field and the latest agriculture engineering formulas.
                    </p>
                     </div>
                    </div>
            
                <div className="how-container">
                   <div className="number"> 3 </div>
                     <div className="how-text"> <p>See the fields and irrigation levels of your neighbours on the map and communicate your needs together better.
                    </p> </div>
                    </div>
                        
                    </div>
              </div>
              </div>
              <div>
               <img src="/farmate/images/dashboard-exp.png" />
               </div>
                <div id="page-section">
                     <a href="/farmate/register" className="btn btn-info">Register now</a>
                </div>
                <div id="page-section">
                    <h1>Background</h1>
                    <p>Farmate employs various mathematical models based on latest research to predict the current water level. A variety of APIs are used to get the necessary data for the predictions.
                    Farmate has a python based backend. The frontend is based on react.js, improving the app speed and providing an intuitive interface for the farmer. </p>
                   <p> For detailed documentation on how Farmate was built, the flow charts explaining the formulas and to see the code please visit our </p> <a id="github" className="btn btn-info" href="https://github.com/abhishek-rs/farmate">github repository</a> 
                    <p> We collaborated with Matti Kummu, Assistant Professor at Water development research group at Aalto University. Also, to validate our idea, we engaged in discussions in online farming forums with the farmer community.We received a lot of positive feedback on our project. </p>
                    <h5 className="quotes">"When is this platform going to launch?"" - user from <a href="www.ozfarmer.com.au"> ozfarmer.com.au </a> </h5>
                    <h5 className="quotes">"A system helping me keep better track of irrigation would be really useful" - user from <a href="https://thefarmingforum.co.uk/index.php"> thefarmingforum.co.uk </a> </h5>
                 </div>
               <div id="page-section">
                      <h1>Who we are</h1>
                      <p>A group of Aalto students studying Human Computer Interaction and Design who believe that resourceful and sustainable farming is the future.
                      </p>
                     
                     <div id="team">
                         <div id="person-image"> <img src="/farmate/images/thomas2.png" /> 
                        <h4 id="person-text">Thomas: python & maths</h4> </div> 
                         <div id="person-image"> <img src="/farmate/images/abhishek2.png" /> 
                        <h4 id="person-text">Abhishek: front-end lead</h4> </div>  
                        <div id="person-image"> <img src="/farmate/images/mildaa.png" /> 
                        <h4 id="person-text">Milda: front-end & UX </h4></div>  
                    </div>
                    <h1>Partners </h1>
                </div>
                <div id="partners">
                <div id="logos">
                        <img id="logostyle" src="/farmate/images/aaltoo.png"/>
                        <img id="logostyle" src="/farmate/images/EIT.png"/>
                    </div>
                 <div id="footer">
                     Farmate 2017. All rights reserved. 
                </div>
            </div> 
        </div>
      </div>   




 
)    
}
}
