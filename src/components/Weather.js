import React, { Component } from 'react'
import Request from 'superagent';

export default class Weather extends Component {

	constructor() {
			super();
    	this.state = Object.assign({
				latitude: null,
				longitude: null,
				currentWeather: {
					temperature: null
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
		Request.get(baseUrl + this.state.latitude + "," + this.state.longitude)
				.set('Access-Control-Allow-Origin', '*')
				.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
				.set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
				.end(function(err, res){
					if(err) 
						console.log(err);
					else{
						that.setState({
							currentWeather: res.body.currently
						})
					}
   		});
		}

  
			
render() {
	const { latitude, longitude, currentWeather } = this.state;
	console.log(currentWeather);
  return (
      <div>Helllo weather {latitude} {longitude} {currentWeather.temperature}</div>
    );
  }
}




