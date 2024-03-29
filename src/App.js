import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import {  ScaleControl,
          ZoomControl,
          RotationControl } from "react-mapbox-gl";

import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import MomentUtils from '@date-io/moment';

import axios from 'axios';

import Button from '@material-ui/core/Button';
  import './index.css';
import { forEach } from 'gl-matrix/src/gl-matrix/vec3';

import GlobyteNavbar from './GlobyteNavbar.js'
import { grey } from '@material-ui/core/colors';

const url = 'http://localhost:5000'
const { token, mapStyles } = require('./config.json');

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiZGlhbmFkMyIsImEiOiJjam9qdTVpODUwOGQ2M2xwanBrcnNrczdoIn0.17CYLLGtE45Y3rkNkSCSSA"
});


const mapStyle = {
  flex: 1
};



const layerPaint = {
  'heatmap-weight': {
    property: 'name',
    type: 'exponential',
    stops: [[0, 0], [5, 2]]
  },
  // Increase the heatmap color weight weight by zoom level
  // heatmap-intensity is a multiplier on top of heatmap-weight
  'heatmap-intensity': {
    stops: [[0, 0], [5, 1.2]]
  },
  // Color for heatmap.  Domain is 0 (low) to 1 (high).
  // Begin color ramp at 0-stop with a 0-transparancy color
  // to create a blur-like effect.
  'heatmap-color': [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(33,102,172,0)',
    0.25,
    'rgb(103,169,207)',
    0.5,
    'rgb(209,229,240)',
    0.8,
    'rgb(253,219,199)',
    1,
    'rgb(239,138,98)',
    2,
    'rgb(178,24,43)'
  ],
  // Adjust the heatmap radius by zoom level
  'heatmap-radius': {
    stops: [[0, 1], [5, 50]]
  }
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'wrap',
  },
  card: {
    position: 'absolute',
    top: 80,
    left: 40,
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 250,
  },
  button: {
    margin: theme.spacing.unit,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 250,
  },
});

class App extends PureComponent {

  

  constructor() {
    super();
    this.state = {
      selectedLayer: '',
      selectedStartDate: '1960-01-01',
      selectedEndDate: '2020-06-25',
      center:[25,45],
      layerData:null,
      loggedIn: false,
      loading: false
    };
    this.handleLayerChange = this.handleLayerChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.getData = this.getData.bind(this);
  }

  getData() {
    this.setState({loading: true})
    if(this.state.selectedStartDate>this.state.selectedEndDate){
      alert("Data de început nu poate fi mai mare decât cea de sfârșit.")
      this.setState({loading: false})
    }
    if(this.state.selectedLayer === ""){
      alert("Vă rugăm selectați tipul dezastrului natural.")
      this.setState({loading: false})
    }
    else{
    axios.get(`${url}/get/layer/time/${this.state.selectedLayer}/${this.state.selectedStartDate}/00:00:00/${this.state.selectedEndDate}/00:00:00`, {crossdomain: true})
      .then(res => {
        const response = res.data; 
        console.log(response)
        if(!response || response.features.length == 0){
          alert("Nu există date pentru perioada și tipul selectat.")
        }
        
        this.setState({ layerData: response });
        this.setState({loading: false})
      })
    }
  }

  // get the name of the layers
  getLayers(token) { 
    if(token){
      this.state.loggedIn = true
      
    }
    else {
      this.state.loggedIn = false
    }
    axios.get(`${url}/get/layers`, {crossdomain: true, headers: {Authorization: token} })
      .then(res => {
        const response = res.data;
        console.log(response);
        this.setState({ layers: response.layers });
      })
  }

  renderListOfLayers() {
    return this.state.layers ? this.state.layers.map((layer, i) => {
      return (
        <MenuItem
          key={i}
          value={layer}>
          {layer}
        </MenuItem>
      );
    }) : [];
  }
  
  onStyleLoad = (map) => {
    this.getLayers();
    const { onStyleLoad } = this.props;
    return onStyleLoad && onStyleLoad(map);
  }

  handleLayerChange = (event) => {
    this.setState({selectedLayer: event.target.value });
  };

  handleStartDateChange = (event) => {
    this.setState({ selectedStartDate: event.target.value });
  };
  handleEndDateChange = (event) => {
    this.setState({ selectedEndDate: event.target.value });
  };


  render() {
    const { classes } = this.props;
    return (
        <div>
        <GlobyteNavbar onChange={this.getLayers.bind(this)}></GlobyteNavbar>
        <div className={classes.root}>
            <Map style="mapbox://styles/mapbox/dark-v9"
            containerStyle={{
                height: "100vh",
                width: "100vw"
            }}
            showUserLocation={true}
            center={this.state.center}
            zoom={[1]}
            onStyleLoad={this.onStyleLoad}>
            <div style={{position: 'absolute', right: 0, top:0}}>
                <ScaleControl />
                <ZoomControl />
                <RotationControl style={{"top":80}} />
            </div>

            {this.state.layerData && <Layer type="heatmap" paint={layerPaint}>
                {this.state.layerData.features.map((el, index) => (
                <Feature key={index} coordinates={el.geometry.coordinates} properties={el.properties} />
                ))}
            </Layer>} 
            </Map>
            <Card className={classes.card}>
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">ANALIZĂ</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                <div>
                  
                <Typography variant="body1" gutterBottom>
                    Selectați următoarele informații:
                </Typography>

                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="layers">Tipul dezastrului natural</InputLabel>
                    <Select
                        value={this.state.selectedLayer}
                        onChange={this.handleLayerChange}
                        inputProps={{
                        name: 'layer',
                        id: 'layers',
                    }}>
                        {this.renderListOfLayers()}
                    </Select>
                </FormControl>

                <div>
                  {!this.state.loggedIn && <a style={{fontSize: 13, color: grey, }}>Atenție: Vă rugăm să vă autentificați pentru a vedea mai multe tipuri de dezastre și rapoartele de analiză!</a>}
                </div>

                <Typography variant="body1" gutterBottom style={{"marginTop":"40px"}}>
                    Selectați Data Inițială:
                </Typography>
                <TextField
                    id="date"
                    type="date"
                    value={this.state.selectedStartDate}
                    onChange={this.handleStartDateChange}
                    className={classes.textField}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />
                    
                
                <Typography variant="body1" gutterBottom style={{"marginTop":"40px"}}>
                    Selectați Data Finală:
                </Typography>
                <TextField
                    id="date"
                    type="date"
                    value={this.state.selectedEndDate}
                    onChange={this.handleEndDateChange}
                    className={classes.textField}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />

                    <Button variant="contained"  color="primary" className={classes.button} onClick={this.getData}>
                    {this.state.loading ? "Se încarcă..." : "AFIȘARE"} 
                </Button>
                    
                </div>
                    
                </ExpansionPanelDetails>
            </ExpansionPanel>
            </Card>
            {this.state.loggedIn && <iframe width="100%" height="600" marginTop="10px" src="https://app.powerbi.com/view?r=eyJrIjoiYzIyODE4NzUtNzAzNi00ODE5LTgwNTUtYWVhMDJlNjZkY2ZmIiwidCI6ImIzMmI3Y2UwLTg4ZGUtNGEzMi1hMGQzLTY5YTM0OGRiZmUwZSIsImMiOjl9&pageName=ReportSection" frameborder="0" allowFullScreen="true"></iframe>}
        </div>
        </div>
    );
  }
}

export default withStyles(styles) (App);
