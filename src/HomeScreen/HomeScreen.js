import React, {Component, Fragment} from "react";
import { AppState,Modal, StatusBar, StyleSheet, Dimensions, TouchableHighlight, PermissionsAndroid, TextInput, AsyncStorage, Picker, Image, Platform} from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, View, Header } from "native-base";
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import Sound from 'react-native-sound'
import Head from '../componentes/Header/Header.js'
import Menu from '../componentes/Menu/Menu.js'
import Base from '../componentes/Base/Base'
import BaseC from '../componentes/Base/BaseChofer'
import Confirmacion from '../componentes/Base/Confirmacion'
import LastTrip from '../componentes/Base/LastTrip'
import store from '../redux/store'
import {BackHandler, ToastAndroid} from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import io from "socket.io-client";
import Solicitud from "../componentes/Solicitud"
import {server, sock} from '../componentes/Api'
import Directions from "../componentes/Directions"
import Cliente from "../componentes/Base/Cliente"
import Detalle from '../componentes/Modals/Detalles'
import Detalles from '../componentes/Base/Detalles' 
import { getPixelSize } from "../utils";
import BotonDetalles from "../componentes/Base/BotonesDetalles"
import Valorar from '../componentes/Modals/Valorar'
import Cancel from '../componentes/Modals/Cancelacion'
import Mensaje from '../componentes/Modals/Mensajes'
import markerImage from "../../src/assets/images/fin.png";
import Tarifa from "../componentes/Base/Tarifa"
import firebase from 'react-native-firebase';
import {withNavigationFocus} from 'react-navigation'
import 'moment-timezone';
import moment from 'moment'
import { createOpenLink } from 'react-native-open-maps';
import OpenMap from "react-native-open-map";
import Cargando from '../componentes/Modals/Cargando'
import NetInfo from '@react-native-community/netinfo'
import { setLocation } from "../redux/actions.js";
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
// let config = {  
//   apiKey: 'AIzaSyBRpCCElS01eGX097g5r66aCbGf65piKCA',
//   authDomain: 'apolo-taxi-547f9.firebaseapp.com',
//   databaseURL: 'https://apolo-taxi-547f9.firebaseio.com/',
//   projectId: 'apolo-taxi-547f9',
//   storageBucket: 'apolo-taxi-547f9.appspot.com',
//   messagingSenderId: '133377262328'
// };
// let app = firebase.initializeApp(config); 
// const db = app.database();  
class HomeScreen extends React.Component {
  constructor(){
    super()
    this.state={
      loading: true,
      estatus:'buscar',
      modalVisible: false,
      watch:true,
      count: 30,
      res: null,
      userId: null,
      location: 'Home',
      locationResult:null,
      locationResult2:null,
      destinoruta: {
        latitude: null,
        longitude:  null,
        latitudeDelta:  null,
        longitudeDelta:  null
      },
      position: null,
      cliente: null,
      punto:[],
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      viaje: {
        reserva: null
      },
      cliente: null,
      imagenmapa: null,
      mostrarruta: false,
      valorar: false,
      cancelacion: false,
      mensaje: '',
      mostrarmensaje: false,
      detalle:false,
      choferid:'',
      token: null,
      conexion:'',
      appState:AppState.currentState,
      pago:'Pendiente'
    }
    if (this.hasLocationPermission() || Platform.OS === 'ios') {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            locationResult:{
              latitude: position.coords.latitude,
              longitude:position.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,                  
            },
            locationResult2:{ 
              latitude: position.coords.latitude,
              longitude:position.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,                  
            }
          })
        })
    }
    this.marcador = this.marcador.bind(this)
    this.cambiarEstado = this.cambiarEstado.bind(this)
    this.setModalVisible = this.setModalVisible.bind(this)
    this.changePage = this.changePage.bind(this)
    this.cambiarMostrarRuta = this.cambiarMostrarRuta.bind(this)
    this.changecancelacion = this.changecancelacion.bind(this)
    this.setmensaje = this.setmensaje.bind(this)
    this.valorarViaje = this.valorarViaje.bind(this)
    this.terminado = this.terminado.bind(this)
    this.verDetalle = this.verDetalle.bind(this)
    this.limpiarViaje=this.limpiarViaje.bind(this)
  }
  setModalVisible(visible) {
    this.contador()
    this.setState({modalVisible:!isNaN(this.state.count)&&visible===true?true:false})
  }

  contador() {
    let inicio = moment()
    let limite = moment(this.state.viaje.limite)
    let contador = Math.round(limite.diff(inicio, 'seconds', true))
    if(contador <= 0) {
      this.setState({modalVisible: false});
    }else{
      this.setState({count: contador})
      setTimeout(() => {
        this.contador()
      }, 1000)
    }
  }
  async hasLocationPermission() {
    try{
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
          title: 'Permiso para usar GPS',
          message:'Apolo Taxi requiere que autorices'+
          'el uso del GPS del dispositivo',
          buttonNegative:'Cancel',
          buttonPositive:'OK'
        }
      )
      if(granted===PermissionsAndroid.RESULTS.GRANTED){
        return true
      }
      else{
        return false
      }   
    }
    catch(error){
      return false
    }
  }
  takeSnapshot () {
    takeSnapshotAsync(this.map, {
      width: 1000,
      height: 1000,
    }).then(res => alert(res));
  };
  setmensaje(data) {
    this.setState({mostrarmensaje: data, mensaje: ''})
  }
  getUserId = async () => {
    let data = {
        userId: '',
        token: ''
    };
    try {
      data.userId = await AsyncStorage.getItem('userId');
      data.token = await AsyncStorage.getItem('token');
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
    return data;
  }
  actfcmtoken(tok) {
    if(this.state.conexion==='conectado'){
      fetch(server + '/chofer/',{
        method:'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+store.getState().token.toString()
        },
        body: JSON.stringify({
          _id: store.getState().id_user,
          fcmtoken:tok
        })
      })
      .then((response)=>{
      })
      .catch(error=>{
        alert(error)
      })
    }
  }
  getfcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        //alert(fcmToken)
        this.actfcmtoken(fcmToken)
      }
  }

  getDatos(){
    if(this.state.conexion==='conectado'){
      fetch(server + '/chofer/'+store.getState().id_user.toString(),{
        method:'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+store.getState().token.toString()
        }
      })
      .then(res=>{
        let data = JSON.parse(res._bodyInit)
        if(data.estatus==='Disponible'){
          this.setState({viaje:{reserva:null}})
        }
        this.setState({choferid: data._id})
        firebase.database().goOnline();
        const ref = firebase.database().ref('/chofer');
        // ref.child(store.getState().id_user).on('value',data=>{
        //   if(data.val()){
        //     ref.child(store.getState().id_user).on('child_changed',snapshot=>{
        //       if(snapshot.val()&&snapshot.val()!==store.getState().token){
        //         this.setState({mensaje:'Ha iniciado sesion en otro dispositivo', mostrarmensaje:true})
        //       }
        //     })
        //   }
        // })
        ref.child(store.getState().id_user.toString()).on('value', data => {
          if(data.val()&&data.val().reserva) {
            firebase.database().ref('/reserva/' + data.val().reserva.toString()).on('value', reser => {
              if(reser.val()){
                if(reser.val().estatus==='Pendiente'&&(!this.state.viaje.reserva || 
                  this.state.viaje.reserva=== null)&&!this.state.modalVisible){
                  this.setState({
                    count:30,
                    viaje:{
                      reserva:reser.val(), 
                      limite:reser.val().limite
                    },
                    cliente:reser.val().user,
                    ida_vuelta:reser.val().ida_vuelta
                  })
                  this.setModalVisible(true)
                  this.getMapImage(reser.val().origen)
                  this.getLocation()
                }
                else if(reser.val().estatus==='Iniciado'&&this.state.estatus!=='Viajando'){
                  this.setState({estatus: 'Viajando', mostrarmensaje: true, mensaje: 'El Viaje a iniciado', viaje:{reserva:reser.val()}})
                  this.cambiarMostrarRutaDestino(true, reser.val().destino)
                  this.getLocation()
                }
                else if(reser.val().estatus==='Terminado'&&this.state.estatus!=='buscar'){
                  this.setState({
                    detalle: true,
                    ida_vuelta:false, 
                    estatus: 'buscar', 
                    mostrarruta: false,
                    viaje:{reserva:reser.val()} 
                  })
                  this.getLocation()
                }
                else if(reser.val().estatus==='Abortado'&&this.state.estatus!=='buscar'){
                  this.setState({
                    estatus: 'buscar',
                    ida_vuelta:false, 
                    mostrarruta: false, 
                    mensaje: 'El cliente ha cancelado el viaje', 
                    mostrarmensaje: true
                  })
                  this.getLocation()
                  this.limpiarViaje()
                }
              }
           })
          }
          if(data.val()){
            ref.child(store.getState().id_user).on('child_changed',snapshot=>{
              if(data.val().token!==store.getState().token){
                this.setState({mensaje:'Ha iniciado sesion en otro dispositivo', mostrarmensaje:true})
              }
            })
            ref.child(store.getState().id_user.toString()).on('child_removed',snapshot=>{
              if(this.state.viaje.reserva !== null && this.state.viaje.reserva){
                if(!this.state.detalle&&!this.state.valorar&&snapshot.val()===this.state.viaje.reserva._id){
                  this.limpiarViaje()
                }
              }else if(snapshot.val() === data.val().token){
                this.setState({mensaje:'Su usuario ha sido eliminado', mostrarmensaje:true})
              }
            })
          }
        })
      })
      .catch(error=>alert(error))
    }
  }

  componentDidMount() {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
      interval: 10000,
      notificationTitle:'Appolo Taxi Driver Esta usando el GPS',
      notificationText:'',
      fastestInterval: 10000,
      activitiesInterval: 10000,
      startForeground:true,
      notificationsEnabled:false,
      stopOnStillActivity: false,
      url: server + '/chofer/location',
      httpHeaders: {
        Accept: 'application/json',
        'Content-Type':'application/json',
        'Authorization': 'Bearer '+store.getState().token.toString()
      },
      // customize post properties
      postTemplate: {
        _id: store.getState().id_user,
        orientacion:'@bearing',
        map:{
          lat: '@latitude',
          lng: '@longitude'
        },
        cliente:this.state.viaje.reserva?this.state.viaje.reserva.user:null
      }
    });

    BackgroundGeolocation.on('location',location=>{
      this.position(location)
    })

    BackgroundGeolocation.start()

    let sound = new Sound('sound.mp3', Sound.MAIN_BUNDLE, error=>{
      if(error)alert(error.message)
    })
    if(Platform.OS === 'ios'){
      sound.setVolume(1.0)
    }
    AppState.addEventListener('change',this._handleAppStateChange)
    
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
      
    NetInfo.isConnected.fetch().done(isConnected=>{
      if(isConnected===true){
        this.setState({conexion:'conectado'})
        this.getDatos()
      }
      else{
        this.setState({conexion:'desconectado'})
      }
    })
    
      
    this.getfcmToken()
    firebase.notifications().getInitialNotification()
    .then(notificationOpen => {
      if (notificationOpen) {
        // App was opened by a notification
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
       // const notification: Notification = notificationOpen.notification;  
      }
    });
    firebase.notifications().onNotification(notification => {
      sound.play()
      //alert(JSON.stringify(notification));
      //alert(jsonify(notification));
      //this.setState({mensaje: notification, mostrarmensaje: true})
    })
    firebase.notifications().onNotificationOpened(notificationOpen => {
      if(notificationOpen.notification._data.tipo){
        let tipo = notificationOpen.notification._data.tipo
        let datos
        let ref = firebase.database().ref('/chofer'); 
        if(notificationOpen.notification._data.data){
          datos = notificationOpen.notification._data.data
        }
        if(tipo==='viaje'){
          ref.child(store.getState().id_user.toString()).child('reserva').once('value').then(data => {
            if(data.val()) {
              firebase.database().ref('/reserva/'+data.val().toString()).once('value',reser =>{
                if(reser.val()){
                  if(reser.val().estatus==='Pendiente'&&!this.state.modalVisible){
                    datos=JSON.parse(datos)
                    this.setState({count:30,viaje: {reserva:reser.val(),limite:datos.limite},cliente:reser.val().user,ida_vuelta:reser.val().ida_vuelta})
                    this.setModalVisible(true)
                    this.getMapImage(reser.val().origen)
                    this.getLocation()
                  }
                }
              })
            }
            else{
              this.setState({estatus: 'buscar',ida_vuelta:false, mostrarruta: false, mensaje: 'El cliente ha cancelado el viaje', mostrarmensaje: true})
              this.getLocation()
            }
          })
        }
        else if(tipo==='iniciado'){
          if(this.state.estatus!=='Viajando'){
            ref.child(store.getState().id_user.toString()).child('reserva').once('value').then(data => {
              if(data.val()) {
                firebase.database().ref('/reserva/' + data.val().toString()).then(reser =>{
                  if(reser.val() && reser.val().estatus === 'Iniciado'){
                    this.setState({estatus: 'Viajando', mostrarmensaje: true, mensaje: 'El Viaje a iniciado', viaje:{reserva:reser.val()}})
                    this.cambiarMostrarRutaDestino(true,reser.val().destino)
                    this.getLocation()
                  }
                })
              }    
            })
          }
        }
        else if(tipo==='terminado'){
          ref.child(store.getState().id_user.toString()).child('reserva').once('value').then(data => {
            if(data.val()) {
              firebase.database().ref('/reserva/' + data.val().toString()).then(reser =>{
                if(reser.val()){
                  if(reser.val().estatus === 'Terminado'&&this.state.estatus!=='buscar'){
                    this.setState({detalle: true,ida_vuelta:false, estatus: 'buscar', mostrarruta: false,viaje:{reserva:reser.val()} })
                    this.getLocation()
                  }
                }
              })
            }
          })
        }
        else if(tipo==='abort'){
          if(this.state.estatus!=='buscar'){
            this.setState({
              estatus: 'buscar',
              ida_vuelta:false, 
              mostrarruta: false, 
              mensaje: 'El cliente ha cancelado el viaje', 
              mostrarmensaje: true
            })
            this.getLocation()
            if(this.head){this.head.showSwitch()}
            if(this.lasTrip){this.lasTrip.getLastViajes()}
            this.limpiarViaje()
          }
        }
        else if(tipo==='vencida'){
          if(this.state.estatus!=='buscar'){
            this.setState({mensaje:datos, mostrarmensaje:true, ida_vuelta:false, estatus:'buscar'})
            if(this.head){this.head.showSwitch()}
            if(this.lasTrip){this.lasTrip.getLastViajes()}
            this.limpiarViaje()
          }
        }
        else if(tipo==='act'){
          this.setState({mensaje:datos, mostrarmensaje:true})
        }
        else if(tipo==='dev'){
          this.setState({mensaje:datos, mostrarmensaje:true})
        }
      } else if(store.getState().token!==''){
        this.props.navigation.navigate('Notificaciones')
      }
    });
    this.getstate()
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
      //alert(fcmToken)
    });
    //this.socket = io(sock)
    const connectionConfig = {
      jsonp: false,
      reconnection: true,
      reconnectionDelay: 100,
      reconnectionAttempts: 100000,
      transports: ['websocket'], // you need to explicitly tell it to use websockets
    };
    
    this.socket = io(sock, connectionConfig);
    this.socket.on('connect', data => {
      this.getUserId().then(response => {
        if(response.userId && response.token) {
          this.setState({
            token: response.token,
            userId:response.userId
          })
          this.socket.emit('chofer', response.userId)
          //this.setState({userId: response.userId})      
        }
      })
    });
    this.socket.on('viaje', data2 =>{
      try {
        const ref = firebase.database().ref('/chofer');
        ref.child(store.getState().id_user.toString()).once('value').then(data => {
          if(data.val().reserva) {
            firebase.database().ref('/reserva/' + data2.reserva._id.toString()).once('value').then(reser => {
              if(reser.val()){
                if(reser.val().estatus==='Pendiente'&&
                (!this.state.viaje.reserva || this.state.viaje.reserva=== null)&&!this.state.modalVisible){
                  try {
                    this.setState({count: 30})
                    this.setState({viaje: {
                      limite: reser.val().limite,
                      detalle:false, 
                      reserva:reser.val()}, 
                      cliente: reser.val().user._id,
                      ida_vuelta:reser.val().ida_vuelta
                    })
                    this.setModalVisible(true)
                    this.getMapImage(reser.val().origen)
                    this.getLocation()
                  } catch (error) {
                    alert(error)
                  }
                }
              }
            })
          }
          else{
            this.setState({
              estatus: 'buscar',
              ida_vuelta:false, 
              mostrarruta: false, 
              mensaje: 'El cliente ha cancelado el viaje', 
              mostrarmensaje: true
            })
            this.getLocation()
          }
        })
      } catch (error) {
        alert(error)
      }
    })
    this.socket.on('act',data=>{
      sound.play()
      if(this.head){this.head.showSwitch()}
      this.setState({mensaje:data, mostrarmensaje:true})
    })
    this.socket.on('init', data =>{
      sound.play()
      firebase.database().ref('/chofer/'+this.state.choferid).once('value',data=>{
        if(data.val() && data.val().reserva){
          firebase.database().ref('/reserva/'+data.val().reserva.toString()).once('value',reser=>{
            if(reser.val()){
              this.setState({estatus: 'Viajando', mostrarmensaje: true, mensaje: 'El Viaje a iniciado'})
              this.cambiarMostrarRutaDestino(true,reser.val().destino)
              this.getLocation()
            }
          })
        }
      })
    })
    // this.socket.on('finish', data =>{
    //   if(this.state.estatus!=='buscar'){
    //     alert('con el socket')
    //     sound.play()
    //     this.setState({detalle: true,ida_vuelta:false, estatus: 'buscar', mostrarruta: false,viaje:{reserva:data} })
    //     this.getLocation()
    //   }
    // })
    this.socket.on('abortado', data =>{
      sound.play()
      this.setState({
        estatus: 'buscar',
        ida_vuelta:false, 
        mostrarruta: false, 
        mensaje: 'El cliente ha cancelado el viaje', 
        mostrarmensaje: true
      })
      this.getLocation()
      if(this.head){this.head.showSwitch()}
      if(this.lasTrip){this.lasTrip.getLastViajes()}
      this.limpiarViaje()
    })
    this.socket.on('vencio',data=>{
      sound.play()
      if(this.head){this.head.showSwitch()}
      if(this.lasTrip){this.lasTrip.getLastViajes()}
      this.setState({mensaje:data, mostrarmensaje:true, ida_vuelta:false, estatus:'buscar'})
    })
    this.socket.on('dev',data=>{
      if(data.chofer === store.getState().id_user){
        this.setState({mensaje:data.nota, mostrarmensaje:true})
      }
    })
    this.socket.on('pagado',data=>{
      this.setState({pago:data.estatus})
      if(data.tipo){
        this.setState(prevState=>({
          viaje:{
            ...prevState.viaje,
            reserva:{
              ...prevState.viaje.reserva,
              tipo:data.tipo
            }
          }
        }))
      }
    })
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.getLocation()
    this.getLocation2()
    this.setState({loading: false})
    //this.getMapImage()
  }

_handleConnectivityChange=isConnected=>{
    if(isConnected===true){
      this.setState({conexion:'conectado'})
    }
    else{
        this.setState({
          conexion:'desconectado', 
          mensaje:'Su dispositivo no tiene una conexion a internet',
          mostrarmensaje:true
        })
    }
  }

  limpiarViaje(){
    this.setState({viaje:{reserva:null},pago:'Pendiente'}) 
    if(this.head){this.head.showSwitch()}
    if(this.lasTrip){this.lasTrip.getLastViajes()}
  }

  getMapImage(origen) {
    if(this.state.conexion==='conectado'){
      fetch("https://maps.googleapis.com/maps/api/staticmap?center="+origen.lat+","+origen.lng+"&zoom=19&size=1000x1000&maptype=roadmap&markers=color:blue%7Clabel:S%7C"+origen.lat+","+origen.lng+"&key=AIzaSyCeheP7N3nMtkIeE2P56lW1umQM1fyHCwE", {
        method:'GET',
        headers:{
            Accept: 'application/json',
            'Content-Type':'application/json'
        }
      })
      .then((response)=>{
        this.setState({imagenmapa: response.url})
      })
      .catch(error=>{
          alert(JSON.stringify(error))
      })
    }
  }
  emitir(data) {
  }
  getstate = async () => {
    try {
      let data =  await AsyncStorage.getItem('state');
      this.setState(JSON.parse(data))
      //alert(JSON.stringify(data))
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
    return data;
  }
  componentDidUpdate(prevProps){
    AsyncStorage.setItem('state', JSON.stringify(this.state))
    //alert(this.state.y)
    //this.getLocation()
    //this.position()
    if(this.props.isFocused!==prevProps.isFocused&&this.props.isFocused){
      store.dispatch(setLocation('Home'))
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    }
  }
  cambiarMostrarRuta(data) {
    this.setState({
      mostrarruta: data,
      destinoruta: {
        latitude: this.state.viaje.reserva.origen.lat,
        longitude: this.state.viaje.reserva.origen.lng
      }
    })
  }
  cambiarMostrarRutaDestino(data,destino) {
    this.setState({
      mostrarruta: data,
      destinoruta: {
        latitude: destino.lat,
        longitude: destino.lng
      }
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    return Object.keys(this.state).map(key => {
     if(this.state[key] != nextState[key]) {
       if(key != 'count' ) {
        //alert(key + '==' + nextState[key])
       }
       return true
     }else{
      return false
     }
    })
  }
  mapopenorigen() {
    //alert(JSON.stringify(this.state.viaje.reserva.origen.lng))
    OpenMap.show({
      latitude: this.state.viaje.reserva.origen.lat,
      longitude: this.state.viaje.reserva.origen.lng,
      cancelText: 'Cerrar',
      actionSheetTitle: 'Selecciona la apicacion',
      actionSheetMessage: 'Aplicaciones Disponibles'
    });
    //createOpenLink({ latitude: parseFloat(this.state.viaje.reserva.origen.lat), longitude: parseFloat(this.state.viaje.reserva.origen.lng), travelType:'drive' });
  }
  mapopendestino() {
    //alert(JSON.stringify(this.state.viaje.reserva.origen.lng))
    OpenMap.show({
      latitude: this.state.viaje.reserva.destino.lat,
      longitude: this.state.viaje.reserva.destino.lng,
      cancelText: 'Cerrar',
      actionSheetTitle: 'Selecciona la apicacion',
      actionSheetMessage: 'Aplicaciones Disponibles'
    });
    //createOpenLink({ latitude: parseFloat(this.state.viaje.reserva.origen.lat), longitude: parseFloat(this.state.viaje.reserva.origen.lng), travelType:'drive' });
  }
  centrarmapa() {
    if(this.mapView){
      this.mapView.animateToRegion({
        latitude:this.state.position.coords.latitude, 
        longitude: this.state.position.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005 
      })
    }
  }
  mostrarBase(){
    switch(this.state.estatus){
      case '':
        return <LastTrip token={this.state.token} conexion={this.state.conexion}/>
      break;
      case 'buscar':
        return <LastTrip onRef={ref=>this.lasTrip=ref} token={this.state.token} conexion={this.state.conexion}/>
      break;
      case 'confirmar':
        return <Confirmacion cambiarEstado={this.cambiarEstado}/>
      break;
      case 'Aceptado':
      return(
        <View
        style={{
          marginBottom:30, 
          width:ancho,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
        <View>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={()=>
            this.centrarmapa()
            }>
            <Icon style={{fontSize: 45, color: '#E84546'}} name='locate' />
          </TouchableHighlight>
          </View>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={()=>this.llegado()}
          >
            <View>
              <Button  
                rounded 
                onPress={()=>{this.llegado()}} 
                style={{
                  backgroundColor: 'black',
                  width:ancho*0.6,
                  justifyContent:'center'
                }}>
                <Text>He Llegado</Text>
              </Button>
            </View>
          </TouchableHighlight>
          <View>
            <TouchableHighlight
              underlayColor={'transparent'}
              onPress={()=>
                this.mapopenorigen()
                }>
              <Icon style={{fontSize: 45, color: '#E84546'}} name='navigate' />
            </TouchableHighlight>
          </View>
        </View> 
        ) 
      break; 
      case 'Llegado':
      return(
        <TouchableHighlight
          underlayColor='transparent'
          onPress={()=>{this.iniciar()}}
        >
          <Button  
            rounded 
            onPress={()=>{this.iniciar()}} 
            style={{
              marginBottom:30, 
              backgroundColor: 'black',
              width:ancho*0.6,
              justifyContent:'center'
            }}>
            <Text>Iniciar Viaje</Text>
          </Button>
        </TouchableHighlight>
        ) 
      break; 
      case 'Viajando':
        return (
          <View>
            <TouchableHighlight
            style={{marginLeft: 20, width: 40}}
              onPress={()=>
                this.mapopendestino()
                }>
              <Icon style={{fontSize: 40, color: '#E84546'}} name='navigate' />
            </TouchableHighlight>
            <Tarifa terminado={this.terminado} viaje={this.state.viaje}/>
          </View>
          )
      break;
      default:
    }
}

terminado () {
  if(this.state.conexion==='conectado'){
    this.setState({loading:true})
    fetch(server + '/reserva/', {
      method:'PUT',
      headers:{
          Accept: 'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+store.getState().token.toString()
      },
      body: JSON.stringify({
        estatus: 'Terminado',
        _id: this.state.viaje.reserva._id
      })
    })
    .then(res=>{
      let data = res._bodyText
      this.setState({loading:false})
      this.cambiarEstado('')
    })
    .catch(error=>{
      this.setState({loading:false})
      alert(error)})
  }

}
iniciar(){
  if(this.state.conexion==='conectado'){
    fetch(`${server}/reserva`,{
      method:'PUT',
      headers: {
          Accept: 'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+store.getState().token.toString()
        },
        body:JSON.stringify({
          estatus: 'Iniciado',
          _id: this.state.viaje.reserva._id
        })
      })
      .then(res=>{
        //this.cambiarEstado('Viajando')
        const ref = firebase.database().ref('/chofer/'+this.state.choferid.toString())
          .once('value',data=>{
            if(data.val() && data.val().reserva){
              firebase.database().ref('/reserva/'+data.val().reserva.toString()).once('value',reser=>{
                if(reser.val()){
                  this.setState({estatus: 'Viajando', mostrarmensaje: true, mensaje: 'El Viaje a iniciado'})
                  this.cambiarMostrarRutaDestino(true,reser.val().destino)
                  this.getLocation()
                }
              })
            }
          })
      })
      .catch(error=>{
        alert(error)
      })
  }
}
llegado() {
  if(this.state.conexion==='conectado'){
    fetch(`${server}/reserva/llegado/` + this.state.viaje.reserva._id,{
      method:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type':'application/json',
        'Authorization': 'Bearer '+store.getState().token.toString()
      }
    })
    .then(res=>{
      this.cambiarEstado('Llegado')
    })
    .catch(error=>{
      alert(error)
    })
  }
}
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    AppState.removeEventListener('change', this._handleAppStateChange)
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
  }

  _handleAppStateChange=nextState=>{
    if(this.state.appState.match(/inactive|background/)&&nextState==='active'){
      firebase.database().goOnline();
      const ref = firebase.database().ref('/chofer');
      ref.child(this.state.choferid.toString()).on('value', data => {
        if(data.val()&&data.val().reserva) {
          firebase.database().ref('/reserva/' + data.val().reserva.toString()).on('value', reser => {
            if(reser.val()){
              if(reser.val().estatus==='Pendiente'&&this.state.viaje.reserva===null){
                this.setState({count:30,viaje: reser.val(),cliente:reser.val().user,ida_vuelta:reser.val().ida_vuelta})
                this.setModalVisible(true)
                this.getMapImage(reser.val().origen)
                this.getLocation()
              }
              else if(reser.val().estatus==='Iniciado'&&this.state.estatus!=='Viajando'){
                this.setState({estatus: 'Viajando', mostrarmensaje: true, mensaje: 'El Viaje a iniciado', viaje:{reserva:res.val()}})
                this.cambiarMostrarRutaDestino(true, reser.val().destino)
                this.getLocation()
              }
              else if(reser.val().estatus==='Terminado'&&this.state.estatus!=='buscar'){
                this.setState({detalle: true,ida_vuelta:false, estatus: 'buscar', mostrarruta: false,viaje:{reserva:reser.val()} })
                this.getLocation()
              }
              else if(reser.val().estatus==='Abortada'&&this.state.estatus!=='buscar'){
                this.setState({estatus: 'buscar',ida_vuelta:false, mostrarruta: false, mensaje: 'El cliente ha cancelado el viaje', mostrarmensaje: true})
                this.getLocation()
                this.limpiarViaje()
              }
            }
          })
        }
      })
    }
  }

  handleBackPress = () => {
    if(store.getState().location==='Home'){
      BackHandler.exitApp()
      return true
    }
    else if(store.getState().location==='Documentos'||store.getState().location==='Retiros'||
    store.getState().location==='Cuentas'||store.getState().location==='Vehiculos'||
    store.getState().location==='Historial'){
      this.props.navigation.navigate('Perfil')
      return true
    }  
  }

  marcador(e){
      this.setState({
       punto:[
         ...this.state.punto,
         {
           coordinate:e.nativeEvent.coordinate
         }
       ]
      })
  }
  cambiarEstado(estado){
    this.setState({
      estatus:estado,
      count : 0
    })
  }
  changePage(data) {
    //alert(data)
    this.props.navigation.navigate(data)
  }
  getLocation(){
    //alert(this.state.watch)
    //alert('se ejeecuta actualizacion')
    //if(this.state.watch==true){
      if (this.hasLocationPermission() || Platform.OS === 'ios') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setState({
              locationResult:{
                latitude: position.coords.latitude,
                longitude:position.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,                  
              },
              locationResult2:{
                latitude: position.coords.latitude,
                longitude:position.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,                  
              }
            })
          },
          (error) => {
            // See error code charts below.
            //alert('se ejecuta esto')
            // alert(error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      }
      
    //}
  }
  getLocation2(){
    if (this.hasLocationPermission() || Platform.OS === 'ios') {
      navigator.geolocation.watchPosition(
        (position) => {
          this.setState({position: position})
          this.position(position)
          // alert('se ejecuta watch postion')
        },
        (error) => {
            // See error code charts below.
            // alert(error.message);
        },
        { 
          enableHighAccuracy: true, 
          timeout: this.state.estatus==='Viajando'?1000:10000, 
          interval: this.state.estatus==='Viajando'?1000:10000, 
          distanceFilter: 1 ,
          useSignificantChanges:true
        }
      );
    } 
  }

  position(pos){
    if(this.state.conexion==='conectado'){
      if(store.getState().token!==null){
        fetch(server + '/chofer/',{
          method:'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer '+store.getState().token.toString()
          },
          body: JSON.stringify({
            _id: store.getState().id_user,
            orientacion:pos.coords ? pos.coords.heading : pos.bearing,
            map:{
              lat: pos.coords ? pos.coords.latitude : pos.latitude,
              lng: pos.coords ? pos.coords.longitude : pos.longitude
            },
            cliente:this.state.viaje.reserva?this.state.viaje.reserva.user:null
          })
        })
        .then(res=>{
          if(this.state.estatus==='Viajando'){
            fetch(server + '/reserva/recorrido',{
              method:'PUT',
              headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+store.getState().token.toString()
              },
              body: JSON.stringify({
                _id: this.state.viaje.reserva._id,
                puntos:{
                  lat: pos.coords ? pos.coords.latitude : pos.latitude,
                  lng: pos.coords ? pos.coords.longitude : pos.longitude
                }
              })
            })
            .then()
            .catch(error=>alert(error))
          }
        })
        .catch(error=>{
          alert(error)
        })
      }
    }
  }

  onClose() {
    console.log('Modal just closed');
  }

  onOpen() {
    console.log('Modal just opened');
  }
  changecancelacion(data) {
    this.setState({cancelacion: data, mostrarruta: false, estatus:'buscar', mostrarmensaje: true, mensaje: 'Haz Cancelado el viaje'})
  }
  onClosingState(state) {
    console.log('the open/close of the swipeToClose just changed');
  }

  centrar(){
    this.mapView.animateToRegion(this.state.locationResult)
  }

  mostrarHeader(){
    if(this.state.estatus === 'Aceptado' || this.state.estatus === 'Llegado') {
      return (
        <View style={{width: ancho}}>
            <Detalles style={{backgroundColor: 'red'}} /> 
            <BotonDetalles changecancelacion={this.changecancelacion} reserva={this.state.viaje}/>  
        </View>
      )
    } else if(this.state.estatus === 'Viajando'){
      return (
        <View style={{width: Dimensions.get('window').width}}>
          <Detalles style={{backgroundColor: 'red', }} /> 
        </View>
      )
    }else{
      return(
        <View style={{width: Dimensions.get('window').width}}>
          <Head transparent
            token={this.state.token}
            userId={this.state.userId}
            navigation={this.props.navigation}
            conexion={this.state.conexion}
            limpiarViaje={this.limpiarViaje}
            name='Home'
            onRef={ref=>this.head=ref} 
          />
          {this.head?this.head.showSwitch():null}
          <View style={{width:Dimensions.get('window').width, alignItems:'center', marginTop:Platform.OS==='ios'?-7:0}}>
            <Menu seleccionado={'home'} changePage={this.changePage}/>
            <TouchableHighlight
                style={{alignSelf:'flex-end',marginTop:5, marginRight:5}}
                onPress={()=>{
                  this.centrar()}
                }
              >
                <Icon name='locate' style={{fontSize:ancho*0.12,color:'#E84546'}} onPress={()=>this.centrar()}/>
              </TouchableHighlight>
          </View>
        </View>
        )
    }
  }
  valorarViaje(data) {
    if(!data) {
      if(Platform.OS==='android'){
        this.setState({valorar: data, mostrarmensaje: true, mensaje: 'Haz finalizado el viaje exitosamente'})
      }else{
        this.setState({valorar:data})
        setTimeout(()=>{
          this.setState({ mostrarmensaje: true, mensaje: 'Haz finalizado el viaje exitosamente'})
          },1000
        )
      }
    }else{
      this.setState({valorar: data})
    }
  }

  verDetalle(data){
    if(Platform.OS==='android'){
      this.setState({detalle:data, valorar:data?data:true,pago:!data?'Pendiente':this.state.pago})
    }else{
      this.setState({detalle:false})
      setTimeout(()=>{
        this.setState({
          valorar:data?data:true,
          pago:!data?'Pendiente':this.state.pago
        })
      },1000
      )
    }
  } 
  
  render() {
    if (this.state.token == null) {
      return null
    }else{
      if(this.state.loading){
          return (<Cargando/>);
      }else{
    return (
      <View style={styles.content}>
        <Detalle visible={this.state.detalle} viaje={this.state.viaje} verDetalle={this.verDetalle} pago={this.state.pago}/>
        <Valorar valorarViaje={this.valorarViaje} limpiarViaje={this.limpiarViaje} visible= {this.state.valorar} reserva={this.state.viaje.reserva}/>
        <Mensaje setmensaje={this.setmensaje} visible={this.state.mostrarmensaje} mensaje={this.state.mensaje}/>
        <Cancel reserva={this.state.viaje} visible={this.state.cancelacion} limpiarViaje={this.limpiarViaje} changecancelacion={this.changecancelacion}/>
        <View style={styles.content}>
          {this.state.locationResult2!==null? 
            <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                //style={styles.map}
                style={this.state.estatus === '' ? styles.map : styles.map_viaje}
                initialRegion={this.state.locationResult2}
                showsUserLocation={true}
                showsMyLocationButton={false}
                ref={el => (this.mapView = el)}
                onRegionChangeComplete={region=>this.setState({locationResult2:region})}
            >
              {this.state.mostrarruta && (
                <Fragment>
                  <Directions
                    strokeColor='#ca0f27'
                    origin={this.state.locationResult}
                    destination={this.state.destinoruta}
                    onReady={result => {
                      this.mapView.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          right: getPixelSize(50),
                          left: getPixelSize(50),
                          top: getPixelSize(50),
                          bottom: getPixelSize(200)
                        }
                      });
                    }}
                  />
                  <Marker
                    coordinate={this.state.destinoruta}
                  >
                    <Image 
                      source={require('../../src/assets/images/llegada.png')} 
                      resizeMode='contain'
                      style={{height:40, width:35}}
                    />
                  </Marker>
                  <Marker
                    coordinate={this.state.locationResult}
                  >
                    <Image 
                      source={require('../../src/assets/images/inicio.png')} 
                      resizeMode='contain'
                      style={{height:40, width:35}}
                    />
                  </Marker>
                </Fragment>
              )}
              {this.state.ida_vuelta && this.state.mostrarruta&&this.state.estatus==='Viajando'&&(
                <Fragment>
                  <Directions
                    strokeColor='#3629dc'
                    origin={this.state.destinoruta}
                    destination={this.state.locationResult}
                    onReady={result => {
                      this.mapView.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          right: getPixelSize(50),
                          left: getPixelSize(50),
                          top: getPixelSize(50),
                          bottom: getPixelSize(200)
                        }
                      });
                    }}
                  />
                </Fragment>
              )}
            </MapView>
          :null}
            {this.mostrarHeader()}
            <View>
              <Solicitud 
                limpiarViaje={this.limpiarViaje} 
                imagenmapa={this.state.imagenmapa} 
                viaje={this.state.viaje} 
                count={this.state.count} 
                state={this.state.modalVisible} 
                cambiarMostrarRuta={this.cambiarMostrarRuta} 
                setModalVisible={this.setModalVisible} 
                cambiarEstado={this.cambiarEstado}
              />
            </View>
            <View style={[
              styles.base,
              Platform.OS==='ios'?
              {
                position:'absolute',
                bottom:5
              }:
              null
            ]}>
              {this.mostrarBase()}
            </View>
        </View>
      </View>
    );
  }
  }
  }
}

export default withNavigationFocus(HomeScreen)

let cl=true
const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const styles = StyleSheet.create({
    menu: {
      height:10
    },
    content: {
        flex: 1,
        alignItems: 'center',
        marginBottom:0,
        marginHorizontal: 0,
        marginVertical: 0
    },
    base:{
        position: 'absolute',
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 0,
        bottom: 0,
        marginTop: 0
    },
    map: {
        position:'absolute',
        width: Dimensions.get('window').width,
        height:Dimensions.get('window').height - 180,
        flex:1,
        marginTop: 160
    },
    map_viaje:{
      borderWidth: 0,
      position:'absolute',
      width: Dimensions.get('window').width,
      height:Dimensions.get('window').height - 80,
      flex:1,
      marginTop: 80
    }
   });