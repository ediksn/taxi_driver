import React, { Component} from 'react'
import { View, StyleSheet, Switch, AsyncStorage, Dimensions, TouchableHighlight, Platform } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem,Spinner, Fab} from "native-base";
import store from '../../redux/store'
import NavigationService from '../../../NavigationService/NavigationService'
import {withNavigationFocus} from 'react-navigation'
import {createId,createToken, setLocation} from '../../redux/actions'
import {server, sock} from '../Api'
import Logout from '../Modals/Logout'
import io from "socket.io-client";
import NetInfo from '@react-native-community/netinfo'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
class Head extends Component{ 
    constructor() {
        super();
        this.state = {
           switch1Value: false,
           visible:false,
           mensaje:'',
           spinner: false,
           hide:true,
           cant:0,
           token:store.getState().token,
           userId:store.getState().id_user,
           conexion:'',
           lock:false,
           estatus:''
        }
        this.logout=this.logout.bind(this)
        this.setmensaje = this.setmensaje.bind(this)
     }
     
     componentDidMount(){
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
          )
            
          NetInfo.isConnected.fetch().done(isConnected=>{
            if(isConnected===true){
              this.setState({conexion:'conectado'})
              this.showSwitch()
              this.getNoti()
            }
            else{
              this.setState({conexion:'desconectado'})
            }
        })


        const connectionConfig = {
            jsonp: false,
            reconnection: true,
            reconnectionDelay: 100,
            reconnectionAttempts: 100000,
            transports: ['websocket'], // you need to explicitly tell it to use websockets
          };
          this.socket = io(sock, connectionConfig);
          this.socket.on('abortado', data =>{
            this.showSwitch()
          })
          this.socket.on('vencio', data=>{
              this.showSwitch()
          })
          this.socket.on('cancel', data=>{
            this.showSwitch()
          })
          this.socket.on('act',data=>{
            this.showSwitch()
          })
     }

     componentWillUnmount(){
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        )
    }

    _handleConnectivityChange=isConnected=>{
        if(isConnected===true){
            this.setState({conexion:'conectado'})
        }
        else{
            this.setState({
                conexion:'desconectado',
            })
        }
    }

     toggleSwitch1 = (value) => {
        //  alert('se ejecuta toggle')
         if(this.state.conexion==='conectado'){
            this.setState({lock:true})
            let state = ''
            if(value){
                state = 'Disponible'
            }else{
                state = 'No Disponible'
            }
            this.setState({switch1Value: value,spinner: true})
            fetch(server +'/chofer/', {
                method:'PUT',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '+this.props.token
                },
                body: JSON.stringify({
                    estatus: state,
                })
            })
            .then((response)=>{
                let data = response._bodyText
                data = JSON.parse(data)
                this.setState({spinner: false, lock:false})
            })
            .catch(error=>{
                this.setState({spinner: false,lock:false})
                alert(JSON.stringify(error))
            })
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.isFocused!==prevProps.isFocused){
            this.getNoti()
            this.showSwitch()
        }
    }

    shouldComponentUpdate(nextProps,nextState){
        if(this.props.isFocused!==nextProps.isFocused){
            this.getNoti()
            this.showSwitch()
            return true
        }
        // if(this.state.switch1Value!==nextState.switch1Value){
        //     alert(this.state.switch1Value+'------'+nextState.switch1Value)
        //     return true
        // }
        return true
    }

    showSwitch(){
        // alert('se ejecuta showswitch')
        if((this.state.conexion==='conectado'||this.props.conexion==='conectado')&&!this.state.lock){
            if(store.getState().token!==''){
                fetch(server +'/chofer/estatus', {
                    method:'GET',
                    headers:{
                        Accept: 'application/json',
                        'Content-Type':'application/json',
                        'Authorization': 'Bearer '+store.getState().token
                    }
                })
                .then((response)=>{
                    let arr = JSON.parse(response._bodyInit)
                    if(arr.estatus&&arr.estatus.toString().toUpperCase() ==='DISPONIBLE') {
                        this.setState({switch1Value: true, hide:false,estatus:arr.estatus})
                    }
                    else if(arr.estatus&&arr.estatus.toString().toUpperCase()==='NO DISPONIBLE'){
                        this.setState({switch1Value: false, hide:false,estatus:arr.estatus})
                    }
                    else{
                        this.setState({hide:true,estatus:arr.estatus})
                    }
                })
                .catch(error=>{
                    alert(error)
                })
            }
        }
    }

    logout(){
        if(this.state.conexion==='conectado'){
            AsyncStorage.setItem('token','')
            AsyncStorage.setItem('userId','')
            store.dispatch(createToken(''))
            store.dispatch(createId(''))
            store.dispatch(setLocation('Login'))
            fetch(server +'/chofer/', {
                method:'PUT',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '+this.props.token
                },
                body:JSON.stringify({
                    estatus:this.state.estatus==='Disponible'||this.state.estatus==='No Disponible'?'No Disponible':this.state.estatus,
                    _id:store.getState().id_user,
                    fcmtoken:''
                })
            })
            .then((response)=>{
            })
            .catch(error=>{
                alert(JSON.stringify(error))
            })
            BackgroundGeolocation.stop()
            NavigationService.navigate('Login')
        }
    }

    setmensaje(data) {
        this.setState({visible: data})
    }

    getNoti(){
        if(this.state.conexion==='conectado'){
            if(this.state.token!==''&&this.state.id_user!==''){
                fetch(`${server}/notificaciones/chofer/`+this.state.userId,{
                    method:'GET',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type':'application/json',
                      'Authorization': 'Bearer '+this.state.token
                    }
                })
                .then(res=>{
                    let data = JSON.parse(res._bodyInit)
                    let cont=0
                    for(let i=0; i<data.length;i++){
                        if(data[i].vista===false){
                            cont++
                        }
                    }
                    this.setState({cant:cont})
                })
                .catch(error=>{
                    alert(error)
                })
            }
        }
    }

    notificaciones(){
        return(
            <TouchableHighlight style={{width:50, marginRight:5}} onPress={()=>this.props.navigation.navigate('Notificaciones')}>
                <View style={{marginBottom:5}}>
                    <Icon
                        name='notifications'
                        style={{color:'white', marginRight:15}}
                    />
                    {this.state.cant > 9 && (
                    <Text style={{
                        marginTop:-23, 
                        marginLeft:3, 
                        fontSize:Platform.OS==='ios'?this.props.name==='Perfil'?18:15:12
                    }}>
                        {this.state.cant===0?'':this.state.cant}
                    </Text>
                    )}
                    {this.state.cant  < 10 && (
                    <Text style={{marginTop:-23, marginLeft:6, fontSize:Platform.OS==='ios'?15:12}}>{this.state.cant===0?'':this.state.cant}</Text>
                    )}
                </View>
            </TouchableHighlight>
        )
    }

    mostrarHeader(){
        switch(this.props.name){
            case 'Perfil':
            return (
                <View>
                <Logout logout={this.logout} visible={this.state.visible} setmensaje={this.setmensaje}/>
                    <Header style={{backgroundColor:'#E84546'}}>
                        <Left style={{marginLeft:Platform.OS==='ios'?10:0}}>
                            <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={()=>{
                                    store.dispatch(setLocation('Home'))
                                    this.props.changePage('Home')}}
                            >
                                <Icon
                                    name='arrow-back'
                                    style={{color:'white'}}
                                    onPress={()=>{
                                        store.dispatch(setLocation('Home'))
                                        this.props.changePage('Home')}}
                                />
                            </TouchableHighlight>
                        </Left>
                        <Body style={{paddingLeft:Platform.OS==='ios'?0:100}}>
                            <Title style={{color:'white'}}>{this.props.name}</Title>
                        </Body>
                        <Right style={{height:'auto', alignItems:'center'}}>
                            {this.notificaciones()} 
                            <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={()=>this.setmensaje(true)}
                                style={{height:'auto'}}
                            >
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <Icon
                                        name='exit'
                                        style={{color:'white'}}
                                        onPress={()=>this.setmensaje(true)}
                                    />
                                </View>
                            </TouchableHighlight>
                        </Right>
                    </Header>
                </View>
            )
            case 'Historial':
            return(
                <View>
                    <Header style={{backgroundColor:'#E84546'}}>
                        <Left style={{marginLeft:Platform.OS==='ios'?10:0}}>
                            <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={()=>{
                                    store.dispatch(setLocation('Perfil'))
                                    this.props.changePage('Perfil')}}
                            >
                                <Icon
                                    name='arrow-back'
                                    style={{color:'white'}}
                                    onPress={()=>{
                                        store.dispatch(setLocation('Perfil'))
                                        this.props.changePage('Perfil')}}
                                />
                            </TouchableHighlight>
                        </Left>
                        <Body style={{marginLeft:Platform.OS==='ios'?0:ancho*0.25, justifyContent:'center'}}>
                            <Title style={{color:'white'}}>{this.props.name}</Title>
                        </Body>
                        <Right>
                            {this.notificaciones()}
                        </Right>
                    </Header>
                </View>
            )
            case 'Detalles del Taxi':
            return(
                <View>
                    <Header style={{backgroundColor:'#E84546'}}>
                        <Left style={{marginLeft:Platform.OS==='ios'?10:0}}>
                            <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={()=>{
                                    store.dispatch(setLocation('Perfil'))
                                    this.props.changePage('Perfil')}}
                            >
                                <Icon
                                    name='arrow-back'
                                    style={{color:'white'}}
                                    onPress={()=>{
                                        store.dispatch(setLocation('Perfil'))
                                        this.props.changePage('Perfil')}}
                                />
                            </TouchableHighlight>
                        </Left>
                        <Body style={{marginLeft:ancho*0.07,justifyContent:'center'}}>
                            <Title style={{width:'130%', color:'white'}}>
                                {this.props.name}
                            </Title>
                        </Body>
                        <Right>
                            {this.notificaciones()}
                        </Right>
                    </Header>
                </View>
            )
            case 'Retiros':
            return(
                <View>
                    <Header style={{backgroundColor:'#E84546'}}>
                        <Left style={{marginLeft:Platform.OS==='ios'?10:0}}>
                            <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={()=>{
                                    store.dispatch(setLocation('Perfil'))
                                    this.props.changePage('Perfil')}}
                            >
                                <Icon
                                    name='arrow-back'
                                    style={{color:'white'}}
                                    onPress={()=>{
                                        store.dispatch(setLocation('Perfil'))
                                        this.props.changePage('Perfil')}}
                                />
                            </TouchableHighlight>
                        </Left>
                        <Body style={{marginLeft:Platform.OS==='ios'?0:ancho*0.25, justifyContent:'center'}}>
                            <Title style={{color:'white'}}>{this.props.name}</Title>
                        </Body>
                        <Right style={{flexDirection:'row'}}>
                            {this.notificaciones()}
                            <Icon
                                name='add'
                                style={{color:'white', fontSize:30}}
                                onPress={()=>{
                                    store.dispatch(setLocation('Retiro'))
                                    this.props.changePage('Retiro')}}
                            />
                        </Right>
                    </Header>
                </View>
            )
            case 'Retiro':
            return(
                <View>
                    <Header style={{backgroundColor:'#E84546'}}>
                        <Left style={{marginLeft:Platform.OS==='ios'?10:0}}>
                            <TouchableHighlight 
                                underlayColor={'transparent'}
                                onPress={()=>{
                                    this.props.limpiar()
                                    store.dispatch(setLocation('Retiros'))
                                    this.props.changePage('Retiros')}
                                }
                            >
                                <Icon
                                    name='arrow-back'
                                    style={{color:'white'}}
                                    onPress={()=>{
                                        this.props.limpiar()
                                        store.dispatch(setLocation('Retiros'))
                                        this.props.changePage('Retiros')}}
                                />
                            </TouchableHighlight>
                        </Left>
                        <Body style={{marginLeft:Platform.OS==='ios'?0:ancho*0.14}}>
                            <Title style={{color:'white'}}>Solicitar retiro</Title>
                        </Body>
                        <Right>
                            {this.notificaciones()}
                        </Right>
                    </Header>
                </View>
            )
            case 'Cuentas':
            return(
                <View>
                    <Header style={{backgroundColor:'#E84546'}}>
                        <Left style={{marginLeft:Platform.OS==='ios'?10:0}}>    
                            <TouchableHighlight 
                                underlayColor={'transparent'}
                                onPress={()=>{
                                    this.props.limpiar()
                                    store.dispatch(setLocation('Perfil'))
                                    this.props.changePage('Perfil')}
                                }
                            >
                                <Icon
                                    name='arrow-back'
                                    style={{color:'white'}}
                                    onPress={()=>{
                                        this.props.limpiar()
                                        store.dispatch(setLocation('Perfil'))
                                        this.props.changePage('Perfil')}}
                                />
                            </TouchableHighlight>
                        </Left>
                        <Body style={{marginLeft:Platform.OS==='ios'?0:ancho*0.17}}>
                            <Title style={{color:'white'}}>{this.props.name}</Title>
                        </Body>
                        <Right>
                            {this.notificaciones()}
                        </Right>
                    </Header>
                </View>
            )
            case 'Documentos':
            return(
                <View>
                    <Header style={{backgroundColor:'#E84546'}}>
                        <Left style={{marginLeft:Platform.OS==='ios'?10:0}}>    
                            <TouchableHighlight 
                                underlayColor={'transparent'}
                                onPress={()=>{
                                    store.dispatch(setLocation('Perfil'))
                                    this.props.changePage('Perfil')}
                                }
                                >
                                <Icon
                                    name='arrow-back'
                                    style={{color:'white'}}
                                    onPress={()=>{
                                        store.dispatch(setLocation('Perfil'))
                                        this.props.changePage('Perfil')}}
                                />
                            </TouchableHighlight>
                        </Left>
                        <Body style={{marginLeft:Platform.OS==='ios'?0:ancho*0.14}}>
                            <Title style={{color:'white', width:'130%'}}>{this.props.name}</Title>
                        </Body>
                        <Right >
                            {this.notificaciones()}
                        </Right>
                    </Header>
                </View>
            )
            case'Notificaciones':
            return(
                <View>
                    <Header style={{backgroundColor:'#E84546'}}>
                        <Left style={{marginLeft:Platform.OS==='ios'?10:0,zIndex:Platform.OS==='ios'?200:5}}>
                            <TouchableHighlight 
                                underlayColor={'transparent'}
                                onPress={()=>{
                                    this.props.navigation.navigate(store.getState().location)}
                                }
                            >
                                <Icon
                                    name='arrow-back'
                                    style={{color:'white'}}
                                    onPress={()=>{
                                        this.props.navigation.navigate(store.getState().location)}}
                                />
                            </TouchableHighlight>
                        </Left>
                        <Body style={{marginLeft:Platform.OS==='ios'?-350:ancho*0.12}}>
                            <Title style={{color:'white'}}>{this.props.name}</Title>
                        </Body>
                    </Header>
                </View>
                )
            default:
            return(
                <View>
                    <Header style={{backgroundColor:'#E84546',alignItems:'center', justifyContent:'center'}}>
                        <Body style={{justifyContent:'center'}}>
                            <Title  style={{color:'white',marginLeft:Platform.OS==='ios'?-70:0}}>{this.props.name}</Title>
                        </Body>
                        <Right style={{flexDirection:'row'}}>
                            {this.notificaciones()}
                            {this.state.hide===false?
                             <Switch value={this.state.switch1Value} onValueChange={this.toggleSwitch1}/>
                             :null}
                        </Right> 
                    </Header>
            </View>
            )
        }
    }

    render(){
        return(
            this.mostrarHeader()
        )
    }
}

export default withNavigationFocus(Head) 

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const style = StyleSheet.create({
    cargando:{
        marginLeft: 20,
        width:20,
        height: 20,
        fontSize: 10
    },
    nocargando:{
        display: 'none'
    },
    fondo:{
        backgroundColor:'#E84546'
    }
})