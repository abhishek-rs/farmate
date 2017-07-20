import React, { Component } from 'react';
import '../styles/InputWorldWind.css';
const WorldWind = window.WorldWind;

export default class InputWorldWind extends Component {
    constructor(props){
        super(props);
        this.state = Object.assign({
            isDrawEnabled: props.isDrawEnabled,
            currentLatitude: null,
            currentLongitude: null,
            lat_shape: props.lat_shape,
            long_shape: props.long_shape,
            alt_shape: props.alt_shape
        })
        this.getPosition = this.getPosition.bind(this);
        this.handlePick = this.handlePick.bind(this);
        this.reRenderPaths = this.reRenderPaths.bind(this);
    }

    getPosition(position){
	    this.setState({
		    currentLatitude: position.coords.latitude,
		    currentLongitude: position.coords.longitude
        }, ()=> {
            let goToAnimator = new WorldWind.GoToAnimator(this.wwd);
            goToAnimator.travelTime = 7000;
            goToAnimator.goTo(new WorldWind.Position(position.coords.latitude, position.coords.longitude, 50000))
        });
    }

    componentDidMount(){
        this.wwd = new WorldWind.WorldWindow("canvasOne");
        this.wwd.addLayer(new WorldWind.BMNGOneImageLayer());
        this.wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer());
        var clickRecognizer= new WorldWind.ClickRecognizer(this.wwd, this.handlePick);
        var tapRecognizer = new WorldWind.TapRecognizer(this.wwd, this.handlePick);
        this.wwd.addLayer(new WorldWind.CompassLayer());
        this.pathsLayer = new WorldWind.RenderableLayer();
        this.pathsLayer.displayName = "Paths";
        this.wwd.addLayer(this.pathsLayer);
        this.wwd.addLayer(new WorldWind.ViewControlsLayer(this.wwd));
        this.coords = new WorldWind.CoordinatesDisplayLayer(this.wwd);
        window.navigator.geolocation.getCurrentPosition(this.getPosition);
        //this.wwd.addLayer(this.coords);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            isDrawEnabled: nextProps.isDrawEnabled,
            lat_shape: nextProps.lat_shape,
            long_shape: nextProps.long_shape,
            alt_shape: nextProps.alt_shape,
        }, () => this.reRenderPaths());
    }

    handlePick(event){
        if(this.state.isDrawEnabled){
           // let position = new WorldWind.Position(this.coords.terrainPosition.latitude, this.coords.terrainPosition.longitude, this.coords.terrainPosition.altitude);
        //    let paths = this.state.pathPositions.slice();
        //    paths.push(position);
            let lats = this.state.lat_shape;
            lats.push(this.coords.terrainPosition.latitude);
            let longs = this.state.long_shape;
            longs.push(this.coords.terrainPosition.longitude);
            let alts = this.state.alt_shape;
            alts.push(this.coords.terrainPosition.altitude);
            this.setState({ 
                lat_shape: lats,
                long_shape: longs,
                alt_shape: alts
            });
            this.reRenderPaths();
        }
        
    }

    reRenderPaths(){
        let pathPositions = [];
        this.pathsLayer.removeAllRenderables();
        for ( let i=0; i < this.state.lat_shape.length; i++){
            let position = new WorldWind.Position(this.state.lat_shape[i], this.state.long_shape[i], this.state.alt_shape[i]);
            pathPositions.push(position);
        }
        var paths = new WorldWind.Path(pathPositions, null);
        paths.altitudeMode = WorldWind.CLAMP_TO_GROUND;
        paths.followTerrain = true;
        paths.extrude = true;
        paths.useSurfaceShapeFor2D = true; 
        var pathAttributes = new WorldWind.ShapeAttributes(null);
        pathAttributes.outlineColor = WorldWind.Color.BLUE;
        pathAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);
        pathAttributes.drawVerticals = paths.extrude; // draw verticals only when extruding
        paths.attributes = pathAttributes;
        this.pathsLayer.addRenderable(paths);
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