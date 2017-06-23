import React, { Component } from 'react';

export default class ReactiveWorldWind extends Component {
    
    componentDidMount(){
        const WorldWind = window.WorldWind;
        var wwd = new WorldWind.WorldWindow("canvasOne");
        wwd.addLayer(new WorldWind.BMNGOneImageLayer());
        wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer());

        // Add a compass, a coordinates display and some view controls to the World Window.
        wwd.addLayer(new WorldWind.CompassLayer());
        wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
        wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));
    }

    render(){
        return(
            <canvas id="canvasOne" width="1024" height="768">
                Your browser does not support HTML5 Canvas.
            </canvas>
        )
    }
}