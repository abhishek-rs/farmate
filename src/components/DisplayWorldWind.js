import React, { Component } from 'react';
import '../styles/ReactiveWorldWind.css';
import { dataRef } from '../config/constants.js';

const WorldWind = window.WorldWind;

export default class DisplayWorldWind extends Component {
    constructor(props){
        super(props);
        this.state = Object.assign({
            field_ids: [],
            fieldNames: [],
            fieldSnapshot: props.fieldSnapshot,
            highlightedPolygon: {},
            fields: [],
            highlightedField: props.highlightedField,
        });
        this.getPosition = this.getPosition.bind(this);
        this.reRenderFields = this.reRenderFields.bind(this);
        this.getFields = this.getFields.bind(this);
        this.handlePick = this.handlePick.bind(this);
    }

    getPosition(position){
            this.wwd.goTo(new WorldWind.Position(position.coords.latitude, position.coords.longitude, 5000))    
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            fieldSnapshot: nextProps.fieldSnapshot,
            highlightedField: nextProps.highlightedField,
        }, () => {
            this.getFields(this.state.fieldSnapshot);
            this.reRenderFields();
        })
    }

    handlePick(e){
        let x = e.clientX,
            y = e.clientY;

        let pickList = this.wwd.pick(this.wwd.canvasCoordinates(x, y));
        if(pickList.objects.length > 1){
            let pickedField = pickList.objects[0].userObject;
            if(this.state.highlightedPolygon !== {}){
                let polygon = this.state.highlightedPolygon;
                polygon.highlighted = false;
                this.setState({
                    highlightedPolygon : polygon
                });
            } 
            pickedField.highlighted = true;
        
            this.setState({
                highlightedField: pickedField.userProperties.id,
                highlightedPolygon: pickedField
            });
            this.props.updateSelection(pickedField.userProperties.id);
        }
    }

    componentWillMount(){
       
    }

    reRenderFields(){
        let fieldsToDisplay = this.state.fields;
        let that = this; 
        this.fieldsLayer.removeAllRenderables();
        fieldsToDisplay.map(
            (f, i) => {
                let polygon = new WorldWind.Polygon(f, null);
                polygon.altitudeMode = WorldWind.ABSOLUTE;
                polygon.extrude = true; // extrude the polygon edges to the ground
                polygon.displayName = this.state.fieldNames[i];
                polygon.userProperties = {'id': this.state.field_ids[i]};
                let polygonAttributes = new WorldWind.ShapeAttributes(null);
                polygonAttributes.drawInterior = true;
                polygonAttributes.drawOutline = true;
                polygonAttributes.outlineColor = WorldWind.Color.BLUE;
                polygonAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);
                polygonAttributes.drawVerticals = polygon.extrude;
                polygonAttributes.applyLighting = true;
                polygon.attributes = polygonAttributes;
                
                // Create and assign the polygon's highlight attributes.
                let highlightAttributes = new WorldWind.ShapeAttributes(polygonAttributes);
                highlightAttributes.outlineColor = WorldWind.Color.RED;
                highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.5);
                polygon.highlightAttributes = highlightAttributes;
                
                if(that.state.highlightedField == polygon.userProperties.id){
                    polygon.highlighted = true;
                    this.setState({
                        highlightedPolygon: polygon
                    });
                }
                // Add the polygon to the layer and the layer to the World Window's layer list.
                that.fieldsLayer.addRenderable(polygon);
        });        
    }

    getFields(snapshot){
        let fields = Object.values(snapshot.val());
        let fieldNames = [];
        let ids = Object.keys(snapshot.val());
        let allFieldBoundaries = [];
        fields.map(
            (f) => {
                let fieldBoundaries = [];
                let lats = f.lat_shape;
                let longs = f.long_shape;
                let alts = f.alt_shape;
                for( let i=0; i < lats.length - 1; i++){
                    let position = new WorldWind.Position(lats[i], longs[i], alts[i]);
                    fieldBoundaries.push(position);
                }
                allFieldBoundaries.push(fieldBoundaries);
                fieldNames.push(f.name);
        });
        this.setState({
            field_ids: ids,
            fields: allFieldBoundaries,
            fieldNames: fieldNames
        }, ()=> this.reRenderFields());
        
    }

    componentDidMount(){
        this.wwd = new WorldWind.WorldWindow("canvasTwo");
        this.wwd.addLayer(new WorldWind.BMNGOneImageLayer());
        this.wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer());
        var clickRecognizer= new WorldWind.ClickRecognizer(this.wwd, this.handlePick);
        var tapRecognizer = new WorldWind.TapRecognizer(this.wwd, this.handlePick);
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
