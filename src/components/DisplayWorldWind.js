import React, { Component } from 'react';
import '../styles/InputWorldWind.css';
import { dataRef } from '../config/constants.js';
import { getUserId } from '../firebaseHelpers/auth';

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
            let goToAnimator = new WorldWind.GoToAnimator(this.wwd);
            goToAnimator.travelTime = 7000;
            if(position.code === 1){
                alert("Please reload and allow location to help us customize the map for you. The map will go to default location (Helsinki) now.")
                goToAnimator.goTo(new WorldWind.Position(60.177375, 24.803298, 3000))
            }
            else goToAnimator.goTo(new WorldWind.Position(position.coords.latitude, position.coords.longitude, 3000))
    //     goToAnimator.goTo(new WorldWind.Position(12.534182, 76.876796, 3000));        
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
        this.textLayer.removeAllRenderables();
        fieldsToDisplay.map(
            (f, i) => {
                let polygon = new WorldWind.Polygon(f, null);
                let fieldName = f[0] ? new WorldWind.GeographicText(f[0], this.state.fieldNames[i]) : undefined;
                polygon.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                polygon.extrude = true; // extrude the polygon edges to the ground
                polygon.displayName = this.state.fieldNames[i];
                polygon.userProperties = {'id': this.state.field_ids[i]};
                let polygonAttributes = new WorldWind.ShapeAttributes(null);
                let textAttributes = new WorldWind.TextAttributes(null);
                textAttributes.font = new WorldWind.Font(30, 'normal', 'normal', 'normal', 'sans-serif', 'center');
                textAttributes.color = new WorldWind.Color(1,1,1, 1);
                polygonAttributes.drawInterior = true;
                polygonAttributes.drawOutline = true;
                polygonAttributes.outlineColor = WorldWind.Color.BLUE;
                polygonAttributes.outlineWidth = 1.5;
                polygonAttributes.interiorColor = this.state.ownerIds[i] === getUserId() ? new WorldWind.Color(0, 1, 1, 0.5) : new WorldWind.Color(1, 0, 0, 0.5);
                polygonAttributes.drawVerticals = polygon.extrude;
                polygonAttributes.applyLighting = true;
                polygon.attributes = polygonAttributes;
                
                // Create and assign the polygon's highlight attributes.
                let highlightAttributes = new WorldWind.ShapeAttributes(polygonAttributes);
                highlightAttributes.outlineColor = WorldWind.Color.GREEN;
                highlightAttributes.outlineWidth = 1.5;
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
                fieldName ? 
                fieldName.attributes = textAttributes
                : null;
                fieldName ? 
                this.textLayer.addRenderable(fieldName)
                : null;
        });        
    }

    getFields(snapshot){
        let fields = Object.values(snapshot.val());
        let fieldNames = [];
        let ownerIds = [];
        let ids = Object.keys(snapshot.val());
        let allFieldBoundaries = [];
        fields.map(
            (f) => {
                let fieldBoundaries = [];
                let lats = f.lat_shape;
                let longs = f.long_shape;
                let alts = f.alt_shape;
                for( let i=0; i < lats.length - 1; i++){
                    let position = new WorldWind.Position(lats[i], longs[i], 20);
                    fieldBoundaries.push(position);
                }
                allFieldBoundaries.push(fieldBoundaries);
                fieldNames.push(f.name);
                ownerIds.push(f.owner_id);
        });
        this.setState({
            field_ids: ids,
            fields: allFieldBoundaries,
            fieldNames: fieldNames,
            ownerIds: ownerIds
        }, ()=> this.reRenderFields());  
    }

    componentDidMount(){
        this.wwd = new WorldWind.WorldWindow("canvasTwo");
        this.wwd.addLayer(new WorldWind.BMNGOneImageLayer());
        this.wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer());
        var clickRecognizer= new WorldWind.ClickRecognizer(this.wwd, this.handlePick);
        var tapRecognizer = new WorldWind.TapRecognizer(this.wwd, this.handlePick);
        this.fieldsLayer = new WorldWind.RenderableLayer();
        this.textLayer = new WorldWind.RenderableLayer();
        this.fieldsLayer.displayName = "Fields";
        this.wwd.addLayer(this.fieldsLayer);
        this.wwd.addLayer(this.textLayer);
        this.coords = new WorldWind.CoordinatesDisplayLayer(this.wwd);
        window.navigator.geolocation.getCurrentPosition(this.getPosition, this.getPosition);
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
