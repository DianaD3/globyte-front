import './index.css';
import { ReactComponent as BellIcon } from './icons/bell.svg';
import { ReactComponent as MessengerIcon } from './icons/messenger.svg';
import { ReactComponent as CaretIcon } from './icons/caret.svg';
import { ReactComponent as PlusIcon } from './icons/plus.svg';
import { ReactComponent as CogIcon } from './icons/cog.svg';
import { ReactComponent as ChevronIcon } from './icons/chevron.svg';
import { ReactComponent as ArrowIcon } from './icons/arrow.svg';
import { ReactComponent as BoltIcon } from './icons/bolt.svg';

import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import TextField from '@material-ui/core/TextField';

import axios from 'axios';
const url = 'https://globyteapi.azurewebsites.net'


function GlobyteNavbar(props) {
  const [token, setToken] = useState(undefined)
  const [username, setUsername] = useState(undefined)

  useEffect(() => {
    if(!token){
      setUsername(undefined);
      props.onChange(token);
    }
    else {
      console.log(token)
      axios.post(`http://${url}/auth/getCurrentUser`, {}, {headers: {'Authorization': token}}).then(res => {
        const response = res.data;
        console.log(response)
        if(!response.err){
          setUsername(response.user.username);
          props.onChange(token);
          //refreshPage()
        }
      })
    }
  }, [token])

  function handleChange(newToken){
    setToken(newToken);
  }

  return (
    <Navbar>
      <a>{token ? `\nHello, ${username ? username : '...'}!` : 'Welcome!'}</a>
      <NavItem icon={<CaretIcon />}>
        {token ? <DropdownLogoutMenu onChange={handleChange}></DropdownLogoutMenu> : <DropdownAuthMenu onChange={handleChange}></DropdownAuthMenu>}
      </NavItem>
    </Navbar>
  );

}

function Navbar(props) {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
}

function NavItem(props) {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-item">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a>

      {open && props.children}
    </li>
  );
}

function refreshPage() {
  window.location.reload(false);
}

function DropdownLogoutMenu(props) {

  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const [formData, setFormData] = useState([])
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
  }, [])

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    return (
      <a href="#" className="menu-item" onClick={props.onClick}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  function DropdownButton(props) {
    return (
      <a href="#" className="menu-item" onClick={props.onClick}>
        {props.children}
      </a>
    );
  }

  function DropdownField(props) {
    return (
      <a href="#" className='dd-field' onChange={(e) => {let newFormData = formData; newFormData[props.id]=e.target.value; setFormData(newFormData)}}>
          <TextField id={props.id} className='dd-Field' label={props.fieldName} fullWidth size='small' style={{ margin: 1 }} variant="outlined" />
      </a>
    )
  }

  function DropdownPasswordField(props) {
    return (
      <a href="#" onChange={(e) => {let newFormData = formData; newFormData[props.id]=e.target.value; setFormData(newFormData)}}>
          <TextField id={props.id} label={props.fieldName} fullWidth type='password' size='small' style={{ color:'white' }} variant="outlined" />
      </a>
    )
  }


  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem
            leftIcon={<PlusIcon />}
            rightIcon={<ChevronIcon />}
            onClick = {() => {props.onChange(undefined)}}>
            Log out
          </DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
}

function DropdownAuthMenu(props) {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const [formData, setFormData] = useState([])
  const dropdownRef = useRef(null);

  const login = () => {
    console.log(formData)
    axios.post(`http://${url}/auth/login`, formData, {crossdomain: true}).then(res => {
      const response = res.data;
      console.log(response)
      if(!response.err){
        props.onChange(response.token)
        //refreshPage()
      }
    })
  }

  const register = () => {
    console.log(formData)
    axios.post(`http://${url}/auth/register`, formData, {crossdomain: true}).then(res => {
      const response = res.data;
      console.log(response)
      if(!response.err){
        //refreshPage()
      }
    })
  }

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
  }, [])

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    return (
      <a href="#" className="menu-item" onClick={props.onClick}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  function DropdownButton(props) {
    return (
      <a href="#" className="menu-item" onClick={props.onClick}>
        {props.children}
      </a>
    );
  }

  function DropdownField(props) {
    return (
      <a href="#" className='dd-field' onChange={(e) => {let newFormData = formData; newFormData[props.id]=e.target.value; setFormData(newFormData)}}>
          <TextField id={props.id} className='dd-Field' label={props.fieldName} fullWidth size='small' style={{ margin: 1 }} variant="outlined" />
      </a>
    )
  }

  function DropdownPasswordField(props) {
    return (
      <a href="#" onChange={(e) => {let newFormData = formData; newFormData[props.id]=e.target.value; setFormData(newFormData)}}>
          <TextField id={props.id} label={props.fieldName} fullWidth type='password' size='small' style={{ color:'white' }} variant="outlined" />
      </a>
    )
  }

  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem
            leftIcon={<PlusIcon />}
            rightIcon={<ChevronIcon />}
            onClick = {() => {setActiveMenu("login"); setFormData({})}}>
            Log in
          </DropdownItem>
          <DropdownItem
            leftIcon={<PlusIcon />}
            rightIcon={<ChevronIcon />}
            onClick = {() => {setActiveMenu("register"); setFormData({})}}>
            Register
          </DropdownItem>

        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'login'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem onClick = {() => {setActiveMenu("main"); setFormData({})}} leftIcon={<ArrowIcon />}>
            <h2>Log in</h2>
          </DropdownItem>
          <DropdownField id='email' fieldName='email'></DropdownField>
          <DropdownPasswordField id='password' fieldName='password'></DropdownPasswordField>
          <DropdownButton onClick = {() => login()}><h3>Log in</h3></DropdownButton>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'register'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem onClick = {() => {setActiveMenu("main"); setFormData({})}} leftIcon={<ArrowIcon />}>
            <h2>Register</h2>
          </DropdownItem>
          <DropdownField id='username' fieldName='username'></DropdownField>
          <DropdownField id='email' fieldName='email'></DropdownField>
          <DropdownPasswordField id='password' fieldName='password'></DropdownPasswordField>
          <DropdownButton onClick = {() => register()}><h3>Register</h3></DropdownButton>
        </div>
      </CSSTransition>
    </div>
  );
}

export default GlobyteNavbar;

//---------------------------------------------------------

// import React, { Component, PureComponent } from 'react';
// import ReactDOM from 'react-dom';
// import {  ScaleControl,
//           ZoomControl,
//           RotationControl } from "react-mapbox-gl";

// import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
// import { withStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import Card from '@material-ui/core/Card';
// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import TextField from '@material-ui/core/TextField';
// import MomentUtils from '@date-io/moment';

// import axios from 'axios';

// import Button from '@material-ui/core/Button';
// import logo from './logo.svg';
// import './App.css';
// import { forEach } from 'gl-matrix/src/gl-matrix/vec3';

// const url = 'localhost:5000'
// const data = require('./heatmapData.json');
// const data2 = require('./data-test.json');
// const { token, mapStyles } = require('./config.json');

// const Map = ReactMapboxGl({
//   accessToken: "pk.eyJ1IjoiZGlhbmFkMyIsImEiOiJjam9qdTVpODUwOGQ2M2xwanBrcnNrczdoIn0.17CYLLGtE45Y3rkNkSCSSA"
// });


// const mapStyle = {
//   flex: 1
// };



// const layerPaint = {
//   'heatmap-weight': {
//     property: 'name',
//     type: 'exponential',
//     stops: [[0, 0], [5, 2]]
//   },
//   // Increase the heatmap color weight weight by zoom level
//   // heatmap-ntensity is a multiplier on top of heatmap-weight
//   'heatmap-intensity': {
//     stops: [[0, 0], [5, 1.2]]
//   },
//   // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
//   // Begin color ramp at 0-stop with a 0-transparancy color
//   // to create a blur-like effect.
//   'heatmap-color': [
//     'interpolate',
//     ['linear'],
//     ['heatmap-density'],
//     0,
//     'rgba(33,102,172,0)',
//     0.25,
//     'rgb(103,169,207)',
//     0.5,
//     'rgb(209,229,240)',
//     0.8,
//     'rgb(253,219,199)',
//     1,
//     'rgb(239,138,98)',
//     2,
//     'rgb(178,24,43)'
//   ],
//   // Adjust the heatmap radius by zoom level
//   'heatmap-radius': {
//     stops: [[0, 1], [5, 50]]
//   }
// };

// const styles = theme => ({
//   root: {
//     flexGrow: 1,
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   card: {
//     position: 'absolute',
//     top: 80,
//     left: 40,
//     maxWidth: 345,
//   },
//   media: {
//     height: 140,
//   },
//   formControl: {
//     margin: theme.spacing.unit,
//     minWidth: 250,
//   },
//   button: {
//     margin: theme.spacing.unit,
//   },
//   selectEmpty: {
//     marginTop: theme.spacing.unit * 2,
//   },
//   textField: {
//     marginLeft: theme.spacing.unit,
//     marginRight: theme.spacing.unit,
//     width: 250,
//   },
// });

// class App extends PureComponent {

  

//   constructor() {
//     super();
//     this.state = {
//       selectedLayer: '',
//       selectedStartDate: '2010-05-01',
//       selectedEndDate: '2010-05-25',
//       center:[25,45],
//       layerData:null
//     };
//     this.handleLayerChange = this.handleLayerChange.bind(this);
//     this.handleStartDateChange = this.handleStartDateChange.bind(this);
//     this.handleEndDateChange = this.handleEndDateChange.bind(this);
//     this.getData = this.getData.bind(this);
//   }

//   getData() {
//     axios.get(`http://${url}/get/layer/time/${this.state.selectedLayer}/${this.state.selectedStartDate}/00:00:00/${this.state.selectedEndDate}/00:00:00`, {crossdomain: true})
//       .then(res => {
//         const response = res.data;
//         this.setState({ layerData: response });
//       })
//   }

//   getLayers() {
//     axios.get(`http://${url}/get/layers`, {crossdomain: true })
//       .then(res => {
//         const response = res.data;
//         console.log(response);
//         this.setState({ layers: response.layers });
//       })
//   }
//   renderListOfLayers() {
//     return this.state.layers ? this.state.layers.map((layer, i) => {
//       return (
//         <MenuItem
//           key={i}
//           value={layer}>
//           {layer}
//         </MenuItem>
//       );
//     }) : [];
//   }
  
//   onStyleLoad = (map) => {
//     this.getLayers();
//     const { onStyleLoad } = this.props;
//     return onStyleLoad && onStyleLoad(map);
//   }

//   handleLayerChange = (event) => {
//     this.setState({selectedLayer: event.target.value });
//   };

//   handleStartDateChange = (event) => {
//     this.setState({ selectedStartDate: event.target.value });
//   };
//   handleEndDateChange = (event) => {
//     this.setState({ selectedEndDate: event.target.value });
//   };



//   render() {
//     const { classes } = this.props;
//     return (
      
//       <div className={classes.root}>
//         <AppBar position="static" color="default" style={{backgroundColor:'#fff'}}>
//           <Toolbar>
//             <img alt="logo" src="./logo.png" style={{"height":"40px",width:"auto" }}/>
//             <div>
//               <IconButton
//                 aria-label="account of current user"
//                 aria-controls="menu-appbar"
//                 aria-haspopup="true"
//                 onClick={handleMenu}
//                 color="inherit"
//               >
//                 <AccountCircle />
//               </IconButton>
//               <Menu
//                 id="menu-appbar"
//                 anchorEl={anchorEl}
//                 anchorOrigin={{
//                   vertical: 'top',
//                   horizontal: 'right',
//                 }}
//                 keepMounted
//                 transformOrigin={{
//                   vertical: 'top',
//                   horizontal: 'right',
//                 }}
//                 open={open}
//                 onClose={handleClose}
//               >
//                 <MenuItem onClick={handleClose}>Profile</MenuItem>
//                 <MenuItem onClick={handleClose}>My account</MenuItem>
//               </Menu>
//             </div>
//           </Toolbar>
//         </AppBar>
//         <Map style="mapbox://styles/mapbox/dark-v9"
//           containerStyle={{
//             height: "100vh",
//             width: "100vw"
//           }}
//           showUserLocation={true}
//           center={this.state.center}
//           zoom={[1]}
//           onStyleLoad={this.onStyleLoad}>
//           <div style={{position: 'absolute', right: 0, top:0}}>
//               <ScaleControl />
//               <ZoomControl />
//               <RotationControl style={{"top":80}} />
//           </div>

//         {this.state.layerData && <Layer type="heatmap" paint={layerPaint}>
//             {this.state.layerData.features.map((el, index) => (
//               <Feature key={index} coordinates={el.geometry.coordinates} properties={el.properties} />
//             ))}
//           </Layer>} 
//         </Map>
//         <Card className={classes.card}>
//           <ExpansionPanel>
//             <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography variant="h6">ANALYSIS</Typography>
//             </ExpansionPanelSummary>
//             <ExpansionPanelDetails>
//               <div>
//               <Typography variant="body1" gutterBottom>
//                 Select Layer Data:
//               </Typography>
//               <FormControl className={classes.formControl}>
//                 <InputLabel htmlFor="layers">Layers</InputLabel>
//                   <Select
//                     value={this.state.selectedLayer}
//                     onChange={this.handleLayerChange}
//                     inputProps={{
//                     name: 'layer',
//                     id: 'layers',
//                   }}>
//                     <MenuItem value="">
//                       <em>None</em>
//                     </MenuItem>
//                     {this.renderListOfLayers()}
//                   </Select>
//               </FormControl>
//               <Typography variant="body1" gutterBottom style={{"marginTop":"40px"}}>
//                 Select Start Date:
//               </Typography>
//               <TextField
//                 id="date"
//                 type="date"
//                 value={this.state.selectedStartDate}
//                 onChange={this.handleStartDateChange}
//                 className={classes.textField}
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 />
                
              
//               <Typography variant="body1" gutterBottom style={{"marginTop":"40px"}}>
//                 Select End Date:
//               </Typography>
//               <TextField
//                 id="date"
//                 type="date"
//                 value={this.state.selectedEndDate}
//                 onChange={this.handleEndDateChange}
//                 className={classes.textField}
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 />

//                 <Button variant="contained" color="primary" className={classes.button} onClick={this.getData}>
//                 RUN
//               </Button>
                
//               </div>
                
//             </ExpansionPanelDetails>
//           </ExpansionPanel>
//         </Card>
//       </div>
//     );
//   }
// }

// export default withStyles(styles) (App);
