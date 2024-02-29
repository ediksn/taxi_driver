import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet, TouchableHighlight} from "react-native";
import { Header, Button, Text } from "native-base";
import store from '../../redux/store'
import {withNavigationFocus} from 'react-navigation'
import {server} from '../Api'
import Cargando from './Cargando'
class Detalles extends Component{
    constructor(){
        super()
        this.state={
            visible:false,
            loading:false
        }
    }

    componentDidUpdate(prevProps,prevState){
        if(this.props.visible!==prevProps.visible&&this.props.visible===true){
            this.crearTrans()
        }
    }

    crearTrans(){
        if(this.props.viaje.reserva&&this.props.viaje.reserva.user_name){
            fetch(`${server}/trans`,{
                method:'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '+store.getState().token.toString() 
                },
                body:JSON.stringify({
                    cliente: store.getState().id_user,
                    total: this.props.viaje.reserva.total,
                    tipo: 'Efectivo',
                    reserva:this.props.viaje.reserva._id
                })
            })
            .then(res=>{
            })
            .catch(error=>alert(error))
        }
    }

    render(){
        if(!this.props.viaje.reserva||this.props.viaje.reserva===null||!this.props.visible){
            return null
        }
        else{
            //alert(JSON.stringify(this.props.viaje))
            return(
                <Modal
                    visible={this.props.visible}
                    transparent={true}
                >
                    <Cargando visible={this.state.loading}/>
                    <View style={estilo.fondo}>
                        <View 
                        style={estilo.caja}
                        >
                            <View style={{width:ancho,height:alto}}>
                                <Header
                                    style={estilo.head_2}
                                >
                                    <Text style={{textAlign:'center', color:'white', fontSize:20}}>
                                        Detalles del pago
                                    </Text>
                                </Header>
                                <View style={{justifyContent:'flex-start',alignItems:"center", marginTop:20}}>
                                    <View style={estilo.item2}>
                                        <Text style={estilo.text}>Dirección de origen</Text>
                                        <Text numberOfLines={3} style={estilo.text2}>: {this.props.viaje.reserva.salida}</Text>
                                    </View>
                                    <View style={estilo.item2}>
                                        <Text style={estilo.text}>Dirección de destino</Text>
                                        <Text numberOfLines={3} style={estilo.text2}>: {this.props.viaje.reserva.llegada}</Text>
                                    </View>
                                    <View style={estilo.item}>
                                        <Text style={estilo.text}>Distancia total</Text>
                                        <Text style={estilo.text}>: {this.props.viaje.reserva.distancia}</Text>
                                    </View>
                                    <View style={estilo.item}>
                                        <Text style={estilo.text} numberOfLines={2} >
                                            Duración del recorrido (Mins)
                                        </Text>
                                        <Text style={estilo.text}>: {this.props.viaje.reserva.duracion}</Text>
                                    </View>
                                    <View style={estilo.item2}>
                                        <Text numberOfLines={2} style={estilo.text}>
                                        Tarifa por tiempo de espera ({this.props.viaje.reserva.tiempo_espera} Mins)
                                        </Text>
                                        <Text style={estilo.text}>: {this.props.viaje.reserva.costo_tiempo_espera?this.props.viaje.reserva.costo_tiempo_espera:'0'}</Text>
                                    </View>
                                    <View style={estilo.item}>
                                        <Text style={estilo.text}>Costo del viaje</Text>
                                        <Text style={estilo.text}>: {this.props.viaje.reserva.costo.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} $</Text>
                                    </View>
                                    <View style={estilo.item}>
                                        <Text style={estilo.text}>Total</Text>
                                        <Text style={estilo.text}>: 
                                        {this.props.viaje.reserva.total?this.props.viaje.reserva.total.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):''} $
                                        </Text>
                                    </View>
                                    <View style={estilo.item}>
                                        <Text style={estilo.text}>Método de pago</Text>
                                        <Text style={estilo.text}>:  
                                        {this.props.viaje.reserva.tipo? this.props.viaje.reserva.tipo:''} 
                                        </Text>
                                    </View>
                                    {this.props.viaje.reserva.tipo==='Tarjeta'&&
                                    <View style={estilo.item}>
                                        <Text style={estilo.text}>Estatus del pago</Text>
                                        <Text style={[estilo.text,{color:this.props.pago==='Pendiente'?'blue':this.props.pago==='Aprobado'?'green':'red'}]}>:  
                                        {this.props.pago? this.props.pago:''} 
                                        </Text>
                                    </View>}
                                </View>
                                <TouchableHighlight onPress={()=>this.props.verDetalle(false)} underlayColor={'transparent'}>
                                    <View style={estilo.boton}>
                                        <Button
                                            onPress={()=>{
                                                this.props.verDetalle(false)
                                            }}
                                            rounded
                                            dark
                                            style={{justifyContent:'center', alignItems:'center',width:ancho*0.8}}
                                        >
                                            <Text style={{textAlign:'center'}}>
                                                Cerrar
                                            </Text>
                                        </Button>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
            )
        }
    }
}

export default withNavigationFocus(Detalles)

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const estilo = StyleSheet.create({
    head_2:{
        backgroundColor:'#E84546',  
        justifyContent:'center', 
        alignItems:'center',
        height:alto*0.15
    },
    fondo:{
        flex:1,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#000000c2'
    },
    caja:{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#fff',
        borderRadius: 25,
        height:alto,
        width:ancho
    },
    item:{
        marginTop:10,
        marginBottom:10,
        width:ancho*0.9,
        height:20,
        justifyContent:'space-around',
        flexDirection:'row'
    },
    item2:{
        marginTop:20,
        marginBottom:10,
        width:ancho*0.9,
        height:35,
        justifyContent:'space-around',
        flexDirection:'row'
    },
    text:{
        width:ancho*0.45,
        color:'black',
        fontWeight:'bold',
        fontSize:15,
        textAlign:'left'
    },
    text2:{
        width:ancho*0.45,
        height:35,
        color:'black',
        fontWeight:'bold',
        fontSize:15,
        textAlign:'left'
    },
    boton:{
        marginTop:30,
        alignSelf:'center'
    }
})