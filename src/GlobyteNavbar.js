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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';


import axios from 'axios';
const url = 'http://localhost:5000'


function GlobyteNavbar(props) {
  const [token, setToken] = useState(undefined) 
  const [username, setUsername] = useState(undefined)

  //after set, call this
  //first param is the action, second is who determines the action
  useEffect(() => {
    if(!token){
      setUsername(undefined); 
      props.onChange(token); 
      
    }
    else {
      console.log(token)
      axios.post(`${url}/auth/getCurrentUser`, {}, {headers: {'Authorization': token}}).then(res => {
        const response = res.data;
        console.log(response)
        if(!response.err){ 
          setUsername(response.user.username);  
          props.onChange(token); 
        
        }
      })
    }
  }, [token]) 

  function handleChange(newToken){ 
    setToken(newToken);
    if(!newToken){
      refreshPage();
    }
  }

  return (
    <Navbar>
      <a style={{"alignSelf": "center"}}><h3>{token ? `\nBine ai venit, ${username ? username : '...'}!` : 'Autentificare'}</h3></a>
      <NavItem icon={<CaretIcon />}>
        {token ? <DropdownLogoutMenu onChange={handleChange}></DropdownLogoutMenu> : <DropdownAuthMenu onChange={handleChange}></DropdownAuthMenu>}
      </NavItem>
    </Navbar>
  );

}

function Navbar(props) {
  return (
    <nav className="navbar">
      <img alt="logo" src="./logo.png" style={{margin:"5px 0px 0px 22px","height":"50px",width:"auto", float:"left"}}/>
      
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
            Ieșire din cont
          </DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
}

function DropdownAuthMenu(props) {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const [formData, setFormData] = useState({securityQuestion: "Care este numele celui mai bun prieten?"})
  const [error, setError] = useState(false)
  const [formError, setFormError] = useState(false)
  const dropdownRef = useRef(null);

  const login = () => {
    console.log(formData)
    axios.post(`${url}/auth/login`, formData, {crossdomain: true}).then(res => {
      const response = res.data;
      console.log(response)
      if(!response.err){
        setError(false);
        props.onChange(response.token)
        
      }
      else {
        setError(true)
      }
    })
  }

  const register = () => {
    formData.securityQuestion = formData.securityQuestion || "Care este numele celui mai bun prieten?";
    console.log(formData)
    if(!formData || !formData.email || !formData.username || !formData.password || !formData.securityAnswer || !formData.email.includes('@')){
      setFormError(true)
    }
    else {
      setFormError(false)
      axios.post(`${url}/auth/register`, formData, {crossdomain: true}).then(res => {
        const response = res.data;
        console.log(response)
        if(!response.err){
          setError(false);
          refreshPage()
        }
        else {
          setError(true)
        }
      })
    }

  }

  const changePassword = () => {
    formData.securityQuestion = formData.securityQuestion || "Care este numele celui mai bun prieten?";
    console.log(formData)
    axios.post(`${url}/auth/changePassword`, formData, {crossdomain: true}).then(res => {
      const response = res.data;
      console.log(response)
      if(!response.err){
        setError(false);
        refreshPage()
      }
      else {
        setError(true);
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

  function handleQuestionChange(e) {
    let newFormData = formData; 
    newFormData["securityQuestion"]=e.target.value; 
    setFormData(newFormData);
    console.log(formData)
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
            onClick = {() => {setActiveMenu("login"); setFormData({}); setError(false);}}>
            Accesare cont
          </DropdownItem>
          <DropdownItem
            leftIcon={<PlusIcon />}
            rightIcon={<ChevronIcon />}
            onClick = {() => {setActiveMenu("register"); setFormData({}); setError(false);}}>
            Înregistrare
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
          <DropdownItem onClick = {() => {setActiveMenu("main"); setFormData({}); setError(false);}} leftIcon={<ArrowIcon />}>
            <h3 style={error ? {color: "red", width: "200px"} : {}}>{error ? "Parola sau email incorecte!" : "Accesare cont"}</h3>
          </DropdownItem>
          <DropdownField id='email' fieldName='email'></DropdownField>
          <DropdownPasswordField id='password' fieldName='parola'></DropdownPasswordField>
          {/* {!error || <DropdownItem>Error</DropdownItem>} */}
          <DropdownButton onClick = {() => {login();}}><h3>Conectare</h3></DropdownButton>
          <DropdownButton onClick = {() => {setActiveMenu("forgotPassword"); setFormData({}); setError(false);}}><h3>Ai uitat parola?</h3></DropdownButton>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'register'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem onClick = {() => {setActiveMenu("main"); setFormData({}); setFormError(false); setError(false);}} leftIcon={<ArrowIcon />}>
          <h3 style={error || formError ? {color: "red"} : {}}>{formError ? "Formular invalid" : error ? "Utilizatorul există deja!" : "Înregistrare"}</h3>
          </DropdownItem>
          <DropdownField id='username' fieldName='username'></DropdownField>
          <DropdownField id='email' fieldName='email'></DropdownField>
          <DropdownPasswordField id='password' fieldName='parola'></DropdownPasswordField>
          <a>Care este numele celui mai bun prieten?</a>
          <DropdownField id='securityAnswer' fieldName='răspuns de securitate'></DropdownField>
          <DropdownButton id='registerButton' onClick = {() => register()}><h3>Creeaza cont</h3></DropdownButton>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'forgotPassword'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem onClick = {() => {setActiveMenu("main"); setFormData({}); setError(false);}} leftIcon={<ArrowIcon />}>
            <h3 style={error ? {color: "red"} : {}}>{error ? "Informații invalide!" : "Ai uitat parola?"}</h3>
          </DropdownItem>
          <DropdownField id='email' fieldName='email'></DropdownField>
          <a>Care este numele celui mai bun prieten?</a>
          <DropdownField id='securityAnswer' fieldName='răspuns de securitate'></DropdownField>
          <DropdownPasswordField id='newPassword' fieldName='noua parolă'></DropdownPasswordField>
          <DropdownButton id='changePasswordButton' onClick = {() => changePassword()}><h3>Schimbă parola</h3></DropdownButton>
        </div>
      </CSSTransition>
    </div>
  );
}

export default GlobyteNavbar;