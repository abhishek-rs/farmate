import React, { Component } from 'react';
import '../styles/ReactiveWorldWind.css';
const WorldWind = window.WorldWind;

export default class DisplayWorldWind extends Component {
    constructor(props){
        super(props);
        this.state = Object.assign({
            currentLatitude: null,
            currentLongitude: null,
        })
        this.getPosition = this.getPosition.bind(this);
        this.reRenderFields = this.reRenderFields.bind(this);
    }

    getPosition(position){
	    this.setState({
		    currentLatitude: position.coords.latitude,
		    currentLongitude: position.coords.longitude
        }, ()=> {
            this.wwd.goTo(new WorldWind.Position(this.state.currentLatitude, this.state.currentLongitude, 5000))    
        });
    }

    componentWillReceiveProps(nextProps){
    /*    this.setState({
            
    }, () => this.reRenderFields());
    */
    }

    reRenderFields(){
    }

    componentDidMount(){
        this.wwd = new WorldWind.WorldWindow("canvasTwo");
        this.wwd.addLayer(new WorldWind.BMNGOneImageLayer());
        this.wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer());
    //    var clickRecognizer= new WorldWind.ClickRecognizer(this.wwd, this.handlePick);
    //    var tapRecognizer = new WorldWind.TapRecognizer(this.wwd, this.handlePick);
        this.wwd.addLayer(new WorldWind.CompassLayer());
        this.fieldsLayer = new WorldWind.RenderableLayer();
        this.fieldsLayer.displayName = "Fields";
        this.wwd.addLayer(this.fieldsLayer);
        this.wwd.addLayer(new WorldWind.ViewControlsLayer(this.wwd));
        this.coords = new WorldWind.CoordinatesDisplayLayer(this.wwd);
        window.navigator.geolocation.getCurrentPosition(this.getPosition);
        //this.wwd.addLayer(this.coords);
    }

    render(){
        return(
            <div id="dww">
                <canvas id="canvasTwo">
                    Your browser does not support HTML5 Canvas.
                </canvas>
            </div>
        )
    }

}
