import React, { Component } from 'react'
import Request from 'superagent';
import ReactAnimatedWeather from 'react-animated-weather'
import '../styles/Weather.css'
import ReactDOM from 'react-dom'
import NodeGeocoder from 'node-geocoder'

const defaults = {
  		icon: 'CLEAR_DAY',
  		color: 'white',
  		size: 200,
  		animate: true
		};
const iconBridge = {
	'clear-day': 'CLEAR_DAY',
	'clear-night': 'CLEAR_NIGHT',
	'partly-cloudy-day': 'PARTLY_CLOUDY_DAY',
	'partly-cloudy-night': 'PARTLY_CLOUDY_NIGHT',
	'cloudy': 'CLOUDY',
	'rain': 'RAIN',
	'sleet': 'SLEET',
	'snow': 'SNOW',
	'wind': 'WIND',
	'fog': 'FOG'
};
var options = {
  provider: 'google',
 
  // Optional depending on the providers 
  httpAdapter: 'https', // Default 
  apiKey: 'AIzaSyAKo7k6M3oKrYokVUchKVFcfFu6CPdLPas', // for Mapquest, OpenCage, Google Premier 
  formatter: null         // 'gpx', 'string', ... 
};
 
var geocoder = NodeGeocoder(options);
export default class Weather extends Component { 
	
constructor() {
	super();

	var iconResponse = "";
	this.state = Object.assign({
			latitude: null,
			longitude: null,
			city: null,
			country: null,
			currentWeather: {
				temperature: null,
				icon: "",
				iconDefined : false
				}
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
	this.getCity();
}

getCity(){
geocoder.reverse({lat:this.state.latitude, lon:this.state.longitude}).then( res =>
	 this.setState({
		 city: res[0].city,
		 country: res[0].country
	 })
)


//console.log(this.state.city);

}



getCurrentWeather(){
	let baseUrl = 'https://api.darksky.net/forecast/60fbca80e3ea637d16165b32680026d7/';
	var that = this;
	Request.get(baseUrl + this.state.latitude + "," + this.state.longitude + "?units=auto")
				.set('Access-Control-Allow-Origin', '*')
				.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
				.set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
				.end(function(err, res){
			if(err) 
				console.log(err);
			else{
				that.setState({
					currentWeather: res.body.currently
			});
		console.log(res.body.currently);

		that.iconResponse = iconBridge[that.state.currentWeather.icon];


that.setState({
			iconDefined: true
		});
	if (that.state.iconDefined) {
	ReactDOM.render(
		<ReactAnimatedWeather
		  
			icon={that.iconResponse}
   		 
			color={defaults.color}
   		 
			size={defaults.size}
   		 
			animate={defaults.animate}
  		/>,
		  document.getElementById('icon')
	);		
}
}
	});
}
			
render() {
	const { latitude, longitude, currentWeather, city, country } = this.state;
  return (
    <div id = "weatherWidget" >
		 <div id="summaryWeather">
			<h2> {currentWeather.summary} </h2>
			<h4> {city}, {country}</h4>
		</div>
		<div id="icon">
			
		</div>
		<div id = "temperature"> 
			<h4> Temperature {currentWeather.temperature} °</h4>
		</div>
		
		<div id="humidity">
			<h4> Humidity {currentWeather.humidity} </h4>
		</div>
		<div id="windSpeed">
			<h4> Wind Speed {currentWeather.windSpeed}  m/s </h4>
		</div>

		  
	</div>
    );
  }
}




