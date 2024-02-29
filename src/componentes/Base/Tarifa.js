import React, { Component} from 'react'
import { View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native'
import { Button,Text, Card} from "native-base";
import Mensaje from '../Modals/Mensajes';

export default class Confirmacion extends Component{ 
    constructor(){
        super()
        this.state={
            mensaje:'',
            visible:false
        }
        this.setmensaje=this.setmensaje.bind(this)
    }

    setmensaje(data){
        this.setState({visible:data})
    }

    render(){
        return(
            <View style={style.view}>
            <Mensaje mensaje={this.state.mensaje} confirm ={true} visible={this.state.visible} terminar={this.props.terminado} setmensaje={this.setmensaje}/>
                <Card style={style.fondo}>
                    <View style={style.titulo}>
                        <Text style={style.text}>
                            Tarifa
                        </Text>
                    </View> 
                    <View style={style.content}>
                        <View>
                            <Text>RD$ {this.props.viaje.reserva.costo.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                            <Text style={{color: '#E91D1A', fontSize: 12}}>Tarifa</Text>
                        </View>
                        <View style={{borderColor: '#B0B0B0', borderWidth: 0.5, width: 1, height: 40}}>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 25, color:'#E84546', fontWeight: 'bold'}}>{this.props.viaje.reserva.distancia.replace('km','')}</Text><Text style={{fontSize: 25, color:'#7B7B7B', fontWeight: 'bold'}}>KM</Text>
                        </View>
                    </View>
                    <TouchableHighlight underlayColor='transparent' onPress={()=>this.setState({mensaje:'¿Está seguro que desea terminar el viaje?',visible:true})} >
                        <View style={{alignItems:'center',justifyContent:'center', width:Dimensions.get('window').width}}>
                            <Button  
                                rounded
                                onPress={()=>this.setState({mensaje:'¿Está seguro que desea terminar el viaje?',visible:true})} 
                                style={{
                                    marginBottom:30, 
                                    backgroundColor: 'black',
                                    alignSelf:'center'
                                }}
                                >
                                <Text>Viaje Finalizado</Text>
                            </Button>
                        </View>
                    </TouchableHighlight>
                </Card>
            </View>
        )
    }
}

const style = StyleSheet.create({
    precio: {
        fontWeight: 'normal',
        color: '#E84546'
    },
    texto:{
        color: '#818181',
        fontSize: 12,
        fontWeight: 'normal'
    },
    costo: {
        color: '#818181',
        fontWeight: 'bold',
        textAlign: 'right'
    },
    view:{
        margin: 0
    },
    text: {
        color:'white'
    },
    titulo:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        backgroundColor: '#E84546',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        
    },
    fondo:{
        marginBottom: -1,
        margin:0,
        marginHorizontal: 0,
        backgroundColor:'#FFFFFF',
        height: 170,
        width:Dimensions.get('window').width + 1,
        justifyContent:'center'
    },
    content:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        height:50,
        paddingHorizontal: 20,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 5,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 25,
        backgroundColor: '#D6D6D6'
    }
})