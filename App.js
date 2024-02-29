import React, { Component } from "react";
import {Dimensions, AsyncStorage, StyleSheet, Text, TextInput, Platform} from 'react-native'
import Login from './src/componentes/Login/LoginCliente'
import store from './src/redux/store'
import NavigationService from './NavigationService/NavigationService'
import {createId,createToken}  from './src/redux/actions'
import {server, sock} from './src/componentes/Api'
import firebase from 'react-native-firebase';
import KeepAwake from 'react-native-keep-awake'
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
export default class AwesomeApp extends Component {
  
  constructor() {
    super();
    this.state = {
      isReady: false,
      tokeb:'',
      valido:false,
      position:{}
    };
  }

  getUserId = async () => {
    let data = {
        userId: '',
        token: ''
    };
    try {
      data.userId = await AsyncStorage.getItem('userId') || null;
      data.token = await AsyncStorage.getItem('token') || null;
    } catch (error) {
      // Error retrieving data
      alert(error.message)
    }
    return data;
  }

  componentDidMount() {
    KeepAwake.activate()
    firebase.messaging().hasPermission()
    .then(enabled => {
      if (enabled) {
        //alert('el usuario tiene permiso')
        // user has permissions
      } else {
        firebase.messaging().requestPermission()
        .then(() => {
          //alert('ha autorizado exitosamente')
          // User has authorised  
        })
        .catch(error => {
          // User has rejected permissions  
        });
      } 
    });
    if(Platform.OS === 'ios'){
      navigator.geolocation.getCurrentPosition(
        (position) => {
        },
        (error) => {
          console.log(error)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    }
  }
  async componentWillMount() {
    this.setState({ isReady: true });
    this.getUserId().then(response => {
      if(response.userId && response.token) {
          this.setState({token:response.token})
          store.dispatch(createToken(response.token)) 
          store.dispatch(createId(response.userId))
          this.validar()
      }else{
        this.setState({token:'no'})
      }
    })
  }

  validar(){
    fetch(server + '/chofer/validar', {
      method:'GET',
      headers: {
        'authorization': 'Bearer '+store.getState().token.toString()
      }
    })
    .then((response)=>{
      let data = JSON.parse(response._bodyText)
      if(data.status.toString()==='denied'){
        this.setState({
          token:'no'
        })
      }
      else{
        this.setState({
          token:store.getState().token.toString()
        })
      }
    })
    .catch(error=>alert(error))
  }

  render() {
    if (!this.state.isReady) {
      return null
    }
    return(
      <Login ref={navigator=>NavigationService.setTopLevelNavigator(navigator)} {...this.props}/>
    )
  }
}

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const estilo = StyleSheet.create({
  vista:{
    height:alto,
    width:ancho,
    justifyContent:'center',
    alignItems:'center'
  },
  cargando:{
    fontSize:100,
    width:ancho*0.3,
    height:alto*0.3
  }
})