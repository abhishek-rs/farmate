import React, { Component } from 'react'
import $ from 'jquery';


export default class Weather extends Component {
            
        	//getInitialState: function (json){

				//longitude = json.coord.lon;
				//latitude = json.coord.lat;

				//navigator.geolocation.getCurrentPosition(function(pos){
  				//console.log(pos)
				//});

	constructor(props) {
    	super(props);

    	this.state = {currentWeather: []};
  }

  	componentDidMount() {
    	this.Weather();
  }

  	Weather() {
    	return $.getJSON('https://api.darksky.net/forecast/60fbca80e3ea637d16165b32680026d7/42.3601,-71.0589/')
      	.then((data) => {
        this.setState({ currentWeather: data.currently });
      });
  }

			// componentDidMount() {

           // $.getJSON( "https://api.darksky.net/forecast/60fbca80e3ea637d16165b32680026d7/42.3601,-71.0589", function(error, response, body) {
              // if(!error && response.statusCode ==200){
     			//	var currentWeather = JSON.parse(body); //this is KEY
     			//	console.log(currentWeather["currently"]["summary"]);
     			//}

				
				//});

                //var myObject = JSON.parse(myjsonstring);     
      //  }
//Dark sky 
//key: 60fbca80e3ea637d16165b32680026d7
//"https://api.darksky.net/forecast/60fbca80e3ea637d16165b32680026d7" + latitude + ',' + longitude when I can get latitude dio cane

render() {
    const weatherNow = this.state.currentWeather.map((item, i) => {
      return <div>
        <h1>{item.summary}</h1>
      </div>
    });

    return <div id="layout-content" className="layout-content-wrapper">
      <div className="weather-display">{ weatherNow }</div>
    </div>
  }
}




