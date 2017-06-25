import React, { Component } from 'react'
import Request from 'superagent';
import ReactAnimatedWeather from 'react-animated-weather'

const defaults = {
  		icon: 'CLEAR_DAY',
  		color: 'goldenrod',
  		size: 512,
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
	var small1 = that.state.currentWeather.icon.split('-')[0].toUpperCase();
	var small2 = that.state.currentWeather.icon.split('-')[1].toUpperCase();
	var smallsolution = [];
	smallsolution.push(small1, small2);
	that.realSolution = smallsolution.join('_');
	console.log(that.realSolution); 
	that.setState({
		iconDefined: true
	})
}
	}
});
		}

	
  
			
render() {
	const { latitude, longitude, currentWeather } = this.state;
	
	console.log(this.realSolution)
	
	let icon = null;
	this.state.iconDefined = ( this.realSolution !== "")
	if (this.state.iconDefined) {
	icon = <ReactAnimatedWeather
		  
			icon={this.realSolution}
   		 
			color={defaults.color}
   		 
			size={defaults.size}
   		 
			animate={defaults.animate}
  		/>;
		  
		  
	}
		  else {
		  icon = null;
	}
	
  return (
      <div id= "">
		 <div> 
			Temperature {currentWeather.temperature} 
		</div>
		<div>
			
			<icon/>
	
		</div>
		<div>
			Humidity {currentWeather.humidity}
		</div>
		<div>
			Wind Speed {currentWeather.windSpeed}
		</div>

		  
		  </div>
    );
  }
}




