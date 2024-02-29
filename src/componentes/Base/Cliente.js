import React, { Component} from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem } from "native-base";
import {server} from '../Api'
import store from '../../redux/store'
export default class Cliente extends Component{ 
    cancelar(){
        fetch(`${server}/reserva`,{
            method:'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body:JSON.stringify({
              estatus: 'Abortada',
              _id: this.props.reserva
            })
          })
          .then(response=>{
            this.props.cancelar()
          })
          .catch(error=>{
            alert(error)
          })
    }
    render(){
        return(
            <View style={style.view}>
                <Card style={style.fondo}>
                    <View style={style.titulo}>
                        <Text style={style.text}>
                        nombres
                        </Text>
                    </View> 
                    <View style={style.content}>
                        <View style={style.ancho}>
                            <Text>Modelo y placa</Text>
                        </View>
                        <View style={style.ancho}>
                            <Icon style={{fontSize: 100, color: '#676767'}} name='contact' />
                        </View>
                        <View style={style.ancho}>
                            <View style={style.estrellas}>
                                <Icon style={{fontSize: 20, color: '#E84546'}} name='star' />
                                <Icon style={{fontSize: 20, color: '#E84546'}} name='star' />
                                <Icon style={{fontSize: 20, color: '#E84546'}} name='star' />
                                <Icon style={{fontSize: 20, color: '#676767'}} name='star-outline' />
                                <Icon style={{fontSize: 20, color: '#676767'}} name='star-outline' />
                            </View>
                            <Text>TAXI</Text>
                        </View>
                    </View>
                    <View style={style.botones}>
                     <Button style={style.btn_cancelar} onPress={()=>{
                        this.cancelar()
                    }}>
                        <Icon style={{color: '#fff', marginLeft: 20}} name='close' />
                        <Text>Cancelar</Text>
                     </Button>
                     <Button iconLeft style={style.btn_llamar}>
                        <Icon style={{ color: '#fff',}} name='call' />
                        <Text>Llamar</Text>
                     </Button>
                    </View>
                </Card>
            </View>
        )
    }
}

const style = StyleSheet.create({
    btn_cancelar:{
        backgroundColor: '#676767',
        borderRadius: 25,
        marginBottom: 20,
      
        width:Dimensions.get('window').width / 2.5
    },
    btn_llamar:{
        backgroundColor: '#E84546',
        borderRadius: 25,
        marginBottom: 20,
        width:Dimensions.get('window').width / 2.5
    },
    botones: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    estrellas: {
        flexDirection: 'row'
    },
    ancho: {
        width: Dimensions.get('window').width / 3
    }, 
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
        margin: 0,
        marginLeft: -5,
        width:Dimensions.get('window').width
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
        height: 200,
        width:Dimensions.get('window').width + 1 
    },
    content:{
        flex: 1,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'center',
        height:50,
        paddingHorizontal: 20,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 5,
        backgroundColor: '#fff'
    }
})

