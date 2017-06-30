import React, { Component } from 'react';
import '../styles/ReactiveWorldWind.css';
const WorldWind = window.WorldWind;

export default class ReactiveWorldWind extends Component {
    constructor(props){
        super(props);
        this.state = Object.assign({
            pathPositions: [],
            isDrawEnabled: props.isDrawEnabled,
            currentLatitude: null,
            currentLongitude: null,
        })
        this.lat_shape = props.lat_shape;
        this.long_shape = props.long_shape;
        this.getPosition = this.getPosition.bind(this);
        this.handlePick = this.handlePick.bind(this);
    }

    getPosition(position){
	    this.setState({
		    currentLatitude: position.coords.latitude,
		    currentLongitude: position.coords.longitude
        });
    }

    componentDidMount(){
        this.wwd = new WorldWind.WorldWindow("canvasOne");
        this.wwd.addLayer(new WorldWind.BMNGOneImageLayer());
        this.wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer());
        var clickRecognizer= new WorldWind.ClickRecognizer(this.wwd, this.handlePick);
        var tapRecognizer = new WorldWind.TapRecognizer(this.wwd, this.handlePick);
        this.wwd.addLayer(new WorldWind.CompassLayer());
        this.coords = new WorldWind.CoordinatesDisplayLayer(this.wwd);
        window.navigator.geolocation.getCurrentPosition(this.getPosition);
        this.wwd.goTo(new WorldWind.Location(this.state.currentLatitude, this.state.currentLongitude));
        console.log(this.state.currentLatitude,this.state.currentLongitude);
        //this.wwd.addLayer(this.coords);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            isDrawEnabled: nextProps.isDrawEnabled
        })
    }

    handlePick(event){
        console.log(this.state.isDrawEnabled);
        if(this.state.isDrawEnabled){
            let position = new WorldWind.Position(this.coords.terrainPosition.latitude, this.coords.terrainPosition.longitude, this.coords.terrainPosition.altitude);
            let paths = this.state.pathPositions.slice();
            paths.push(position);
            this.setState({ pathPositions: paths })
        }
        var path = new WorldWind.Path(this.state.pathPositions, null);
        path.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        path.followTerrain = true;
        path.extrude = true;
        path.useSurfaceShapeFor2D = true; 

        
        var pathAttributes = new WorldWind.ShapeAttributes(null);
        pathAttributes.outlineColor = WorldWind.Color.BLUE;
        pathAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);
        pathAttributes.drawVerticals = path.extrude; // draw verticals only when extruding
        path.attributes = pathAttributes;

        var pathsLayer = new WorldWind.RenderableLayer();
        pathsLayer.displayName = "Paths";
        pathsLayer.addRenderable(path);

        this.wwd.addLayer(pathsLayer);
        this.wwd.addLayer(new WorldWind.ViewControlsLayer(this.wwd));

        this.wwd.redraw();
    }

    render(){
        return(
            <div id="ww">
                <canvas id="canvasOne">
                    Your browser does not support HTML5 Canvas.
                </canvas>
            </div>
        )
    }
}