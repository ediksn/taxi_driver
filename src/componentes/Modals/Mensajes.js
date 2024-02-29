import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet, AsyncStorage} from "react-native";
import { Icon, Button,Text} from "native-base";
import store from '../../redux/store'
import {createToken, createId, setLocation} from '../../redux/actions'
import {server} from '../Api'
import NavigationService from '../../../NavigationService/NavigationService'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
export default class Mensaje extends Component{
    constructor(){
        super()
    }
    
    salir(){
        AsyncStorage.setItem('token','')
        AsyncStorage.setItem('userId','')
        AsyncStorage.removeItem('estado')
        store.dispatch(createToken(''))
        store.dispatch(createId(''))
        store.dispatch(setLocation('Login'))
        this.props.setmensaje(false)
        if(store.getState().conexion==='conectado'){
            fetch(`${server}/cliente/`, {
                method:'PUT',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '+store.getState().token.toString()
                },
                body:JSON.stringify({
                    _id:store.getState().id_user,
                    fcmtoken:''
                })
            })
            .then(res=>{
            })
            .catch(error=>alert(error))
        }
        BackgroundGeolocation.stop()
        NavigationService.navigate('Login')
    }

    botones(){
        if(this.props.confirm){
            return(
                <View style={{alignItems:'center', flexDirection:'row', width:300, justifyContent:'space-around'}}>
                    <Button
                        style={{marginBottom:alto*0.01}} 
                        onPress={()=>{
                            this.props.setmensaje(false)
                        }}
                        rounded
                        danger>
                            <Text style={{color:'white', textAlign:'center'}}>Cancelar</Text>
                    </Button>
                    <Button
                        style={{marginBottom:alto*0.01}} 
                        onPress={()=>{
                            this.props.terminar()
                        }}
                        rounded
                        danger>
                            <Text style={{color:'white', textAlign:'center'}}>Finalizar</Text>
                    </Button>
                </View>
            )
        }
        else if(typeof(this.props.mensaje)==='string'&&this.props.mensaje.includes('verificamos tu numero de telefono')){
            return(
                null
            )
        }
        else{
            return(
                <View>
                    <Button
                        style={{marginBottom:alto*0.01}} 
                        onPress={()=>{
                            if(this.props.mensaje.includes('otro dispositivo')||this.props.mensaje.includes('ha sido eliminado')){
                                this.salir()
                            }else{
                                this.props.setmensaje(false)
                            }
                        }}
                        rounded
                        danger>
                            <Text style={{color:'white', textAlign:'center'}}>Cerrar</Text>
                    </Button>
                </View>
            )
        }
    }

    render(){
        return(
        <Modal
          visible={this.props.visible}
          transparent={true}
        >
          <View style={{
            flex:1,
            flexDirection:'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:'#000000c2'}}>
            <View 
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor:'#fff',
                borderRadius: 25,
                height:'auto',
                width:Dimensions.get('window').width - 40
              }}
            >
                <View style={estilo.titulo}>
                    <Icon
                        name='time'
                        style={{color:'white'}}
                    />
                    <Text style={estilo.text}>
                      Informacion
                    </Text>
                </View>
                <View style={{justifyContent:'flex-start'}}>
                    <View style={estilo.razon}>
                        <View style={{height:60}}></View>
                        <Text style={{fontSize:20, textAlign:'center'}}>{this.props.mensaje}</Text>
                        <View style={{height:60}}></View>
                    </View>
                </View>
                {this.botones()}
            </View>
          </View>
        </Modal>
        )
    }
}

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const estilo = StyleSheet.create({
  
    text: {
        color:'white'
    },
    titulo:{
        width:Dimensions.get('window').width - 40,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#E84546',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection:'row'
    },
    razon:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    boton_1:{
        marginTop:1,
        height:30,
        width:Dimensions.get('window').width*0.3,
        backgroundColor:'#676767'
    },
    boton_2:{
        marginTop:1,
        height:30,
        justifyContent:'center',
        width:Dimensions.get('window').width*0.3
    },
    text_env:{

    },
    botones:{
        flexDirection:'row', 
        justifyContent:'center', 
        width:Dimensions.get('window').width*0.7
    },
    icono:{
        color:'black',
        fontSize:30
    },
    icon:{
        color:'green',
        fontSize:30
    }
})