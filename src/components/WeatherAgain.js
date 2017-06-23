import React, { Component } from 'react'
import axios from 'axios'

export default class WeatherAgain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      daily: null
    };
  }

componentDidMount() {
 if (navigator.geolocation){
  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    var th = this;
    this.serverRequest =
      axios.get(`https://api.darksky.net/forecast/60fbca80e3ea637d16165b32680026d7/42.3601,-71.0589?units=auto`)
        .then(result => {
          th.setState({
            daily: result.currently.summary,
            loading: false,
            error: null
          });
        })
      .catch(err => {
        // Something went wrong. Save the error in state and re-render.
        this.setState({
          loading: false,
          error: err
        });
      });
  };
  function error() {
    console.log( 'geolocation error' )
  };
  navigator.geolocation.getCurrentPosition(success.bind(this), error);
 }
}
render() {
    return (
      <div>
          <p> Something daily={this.state.daily} </p>
      </div>
  ) 
}

}
