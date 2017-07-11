import React, { Component } from 'react'
import Request from 'superagent';
import ReactAnimatedWeather from 'react-animated-weather'
import '../styles/Weather.css'
import ReactDOM from 'react-dom'

const iconBridge = {
	'clear sky': 'CLEAR_DAY',
	'clear-night': 'CLEAR_NIGHT',
	'few clouds': 'PARTLY_CLOUDY_DAY',
	'scattered clouds': 'PARTLY_CLOUDY_NIGHT',
	'broken clouds': 'CLOUDY',
	'shower rain': 'RAIN',
	'rain': 'SLEET',
	'thunderstorm': 'RAIN',
	'snow': 'SNOW',
	'wind': 'WIND',
	'mist': 'FOG'
};

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
		latitude: position.coords.latitude,
		longitude: position.coords.longitude
	});
	this.getCurrentWeather();
}

getCurrentWeather(){
	let baseUrl = 'http://api.openweathermap.org/data/2.5/weather?appid=cbbea6373c90b88fa24a0e125e8e765b';
	var that = this;
	Request.get(baseUrl + "&lat=" + this.state.latitude + "&lon=" + this.state.longitude)
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
			
	<div id = "weatherWidget" >
		<div id="summaryWeather">
		<h2> {weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)} </h2>
		<h4> {weather.name}, {weather.sys.country} </h4>
		</div>
		<div id="icon">
			<ReactAnimatedWeather icon={iconBridge[this.state.currentWeather.weather[0].description]} color={defaults.color} size={defaults.size} animate={defaults.animate} />
		</div>
		<div id = "temperature"> 
			<h4> Temperature { Math.round((weather.main.temp - 273) * 100) / 100} °C</h4>
		</div>
		<div id="humidity">
			<h4> Humidity {weather.main.humidity}% </h4>
		</div>
		<div id="windSpeed">
			<h4> Wind Speed {weather.wind.speed} m/s </h4>
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




