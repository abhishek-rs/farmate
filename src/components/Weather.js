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

	var realSolution="";
	this.state = Object.assign({
			latitude: null,
			longitude: null,
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
		
		
	if( that.state.currentWeather.icon ){
		var iconResponse1 = that.state.currentWeather.icon.split('-')[0].toUpperCase();
		var iconResponse2 = that.state.currentWeather.icon.split('-')[1].toUpperCase();
		var iconResponseSolution = [];
		iconResponseSolution.push(iconResponse1, iconResponse2);
		that.iconResponseSolutionFinal = iconResponseSolution.join('_');
			console.log(that.iconResponseSolutionFinal); 
		that.setState({
			iconDefined: true
		});
	}

	if (that.state.iconDefined) {
	ReactDOM.render(
		<ReactAnimatedWeather
		  
			icon={that.iconResponseSolutionFinal}
   		 
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
	const { latitude, longitude, currentWeather } = this.state;
  return (
    <div id = "weatherWidget" >
		 <div id="summaryWeather">
			<h2> {currentWeather.summary} </h2>
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




