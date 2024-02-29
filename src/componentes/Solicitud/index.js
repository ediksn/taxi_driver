import React, { Component} from 'react'
import { View, StyleSheet, Dimensions, Modal, TouchableHighlight, TextInput, Image, Platform } from 'react-native'
import { Button } from "native-base";
import { Header, Title, Left, Icon,  Body, Text } from "native-base";
import store from '../../redux/store'
import {server} from '../Api'
import Mensaje from '../Modals/Mensajes';
import firebase from 'react-native-firebase';
import Cargando from '../Modals/Cargando';
export default class Solicitud extends Component{ 
    constructor(){
        super()
        this.state={
          cuenta: 30,
          loading:false
        }
    }

    cerrar(){
        firebase.database().ref('/chofer/'+store.getState().id_user+'/reserva').set(null)
        fetch(server + '/chofer/', {
            method:'PUT',
            headers:{
                Accept: 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body: JSON.stringify({
                estatus: 'Disponible',
                _id: store.getState().token
            })
        })
        .then(res=>{
            this.props.limpiarViaje()
        })
        .catch(error=>alert(error))
    }

    aceptar() { 
        //alert(JSON.stringify(this.props.viaje))
        const viaje = this.props.viaje
        //alert(viaje.reserva._id)
        fetch(server + '/reserva/', {
            method:'PUT',
            headers:{
                Accept: 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body: JSON.stringify({
                estatus: 'Aceptada',
                _id: viaje.reserva._id
            })
        })
        .then(res=>{
            let data = JSON.parse(res._bodyInit)
            if(data.status){
                this.setState({loading:false})
                this.props.setModalVisible(false)
                this.props.cambiarEstado('buscar')
                this.props.cambiarMostrarRuta(false)
            }
            else{
                this.setState({loading:false})
                this.props.cambiarEstado('Aceptado')
                this.props.cambiarMostrarRuta(true)
                this.props.setModalVisible(!this.props.state)
            }
        })
        .catch(error=>{
            this.setState({loading:false})
            alert(error)
        })
        
    }
    render(){
        return(
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.props.state}
                    onRequestClose={() => {}}
                >
                <Cargando visible={this.state.loading}/>
                <View style={styles.modal}>
                  <View style={styles.container}>
                  <View>     
                        <Header style={{backgroundColor: '#E84546'}}>
                            <Left style={{marginLeft:Platform.OS==='ios'?5:0}}>
                                <Icon 
                                onPress={() => {
                                    this.cerrar()
                                    this.props.setModalVisible(!this.props.state);
                                }}
                                name="close"
                                style={{
                                    zIndex: 200,
                                    color:'#fff'
                                }}
                                />
                            </Left>
                            <Body style={{marginRight:Platform.OS==='ios'?135:0}}>
                                {Platform.OS==='android'?<Title>Solicitud de Viaje</Title>:
                                <Title style={{width:150}}>
                                    <Text style={{color:'white',width:'auto'}}>Solicitud de Viaje</Text>
                                </Title>}
                            </Body>
                        </Header>
                        <View style={styles.cont_input}>
                            <View style={styles.input}> 
                                <View style={{height:10}}></View>
                                <Text numberOfLines={3} style={{textAlign:'center'}}>
                                    {this.props.viaje&&this.props.viaje.reserva?this.props.viaje.reserva.salida:''}
                                </Text>
                                <View style={{height:10}}></View>
                            </View>
                            
                        </View>
                    </View>
                    <View style={styles.map}>
                        <View style={styles.circulo}>
                            <Image
                            style={{borderRadius:Platform.OS==='ios'? ancho-270:ancho - 150, width: ancho - 150, height: ancho - 150}}
                            source={{uri: this.props.imagenmapa}}
                            />
                        </View>
                    </View>
                    <View style={styles.cont_regresiva}>
                        <Text style={styles.regresiva}>{this.props.count}</Text>
                    </View>
                    <View style={styles.cont_regresiva}>
                        <View>
                            <Button rounded dark disabled={this.state.loading}
                                   onPress={() =>this.setState({loading:true},this.aceptar())} >
                                <Text>Aceptar</Text>
                            </Button>
                        </View>
                    </View>
                    </View>
                </View>
              </Modal>
       )
    }
}

const ancho = Dimensions.get('window').width
const alto = Dimensions.get('window').height

const styles = StyleSheet.create({
    cont_regresiva: {
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    regresiva: {
        fontSize: 40,
        color: 'red',
        fontWeight: 'bold'
    },
    map:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width - 150,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    circulo: {
        borderRadius: Dimensions.get('window').width - 138,
        width: Dimensions.get('window').width - 138,
        height: Dimensions.get('window').width - 138,
        borderWidth: 6,
        borderColor: '#D6D6D6',
        zIndex: 3000
    },
    cont_input:{
        width: Dimensions.get('window').width,
        height: 'auto',
        alignItems: 'center'
    },
    input: {
        width: Dimensions.get('window').width - 40,
        marginTop: 20,
        borderRadius: 20,
        backgroundColor: '#fff',
        textAlign:'center'
    },
    modal: {
        backgroundColor: '#000000cf',
        height: Dimensions.get('window').height,
        paddingBottom: 30
      },
      container: {
        flex: 1,
        height: Dimensions.get('window').height - 200,
        flexDirection: 'column',
        justifyContent: 'space-between'
      }
})