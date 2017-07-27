import React, { Component } from 'react'
import Request from 'superagent';
import ReactAnimatedWeather from 'react-animated-weather'
import '../styles/Weather.css'
import ReactDOM from 'react-dom'

const defaults = {
  		icon: 'CLEAR_DAY',
  		color: 'white',
  		size: 200,
  		animate: true
};
 
export default class Weather extends Component { 
	
constructor() {
	super();
	var iconResponse = "";
	this.state = Object.assign({
			latitude: null,
			longitude: null,
			dataReceived: false,
			currentWeather: {}
	});
		
	this.getPosition = this.getPosition.bind(this);
	this.getCurrentWeather = this.getCurrentWeather.bind(this);
    window.navigator.geolocation.getCurrentPosition(this.getPosition);
}

getPosition(position){
	this.setState({
	//	latitude: position.coords.latitude,
	//	longitude: position.coords.longitude
		latitude: 12.534182, 
		longitude: 76.876796
	});
	this.getCurrentWeather();
}

getCurrentWeather(){
	let baseUrl = 'https://api.apixu.com/v1/current.json?key=5cc4c4116ec54fb98a0153211171407&q=';
	var that = this;
	Request.get(baseUrl + this.state.latitude + "," + this.state.longitude)
			.end(function(err, res){
				if(err) 
					console.log(err);
				else{
					that.setState({
						currentWeather: res.body,
						dataReceived: true
				});
		}
	});
}

			
render() {

let weather = this.state.currentWeather;

  return (
    <div> { this.state.dataReceived  ? 
			
	<div id="weatherWidget" >
		
		<div id="holder">
			<div id="icon">
				<img src={'https:' + weather.current.condition.icon} />	
			</div>
			<div id="sub-holder">
				<div id="summaryWeather">
					<h2> It's {weather.current.condition.text } </h2>
					<h4> in {weather.location.name}, {weather.location.country} </h4>
				</div>
				<div id="temperature"> 
					<h4> Temperature <span className="content">{ weather.current.temp_c }°C</span></h4>
					<h6> (Feels like { weather.current.feelslike_c } °C)</h6>
				</div>
				<div id="humidity">
					<h4> Humidity <span className="content">{weather.current.humidity}%</span> </h4>
				</div>
				<div id="windSpeed">
					<h4> Wind Speed <span className="content">{weather.current.wind_mph} mph</span> </h4>
				</div>
			</div>
		</div>	  
	</div>
	: 
	<div id="weather-loader">
        <i className="fa fa-circle-o-notch fa-spin fa-5x fa-fw"></i><br />
        <span>Looking at the clouds...</span>
    </div>
	
	}
	
	</div>
	);
  }
}




