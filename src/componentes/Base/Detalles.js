import React, { Component} from 'react'
import { View, StyleSheet, Switch, Dimensions } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem } from "native-base";
import store from '../../redux/store'
import server from '../Api'
export default class Detalles extends Component{ 
    constructor() {
        super();
        this.state = {
           switch1Value: false,
        }
     }
    render(){
        return(
            <View style={{backgroundColor: '#E84546'}}>
                <Header transparent style={style.fondo}>
                    <Body style={{justifyContent:"center",alignItems:'center'}}>
                        <Title style={{color:'white'}}>Detalles del Viaje</Title>
                    </Body>
                </Header>
            </View>
        )
    }
}

const style = StyleSheet.create({
    icono:{
        marginBottom: 50,
        borderWidth: 0,
        borderColor: '#676767',
        borderRadius: 84,
        backgroundColor: '#676767',
        width:84,
        height:84,
        justifyContent: 'center',
         alignItems: 'center'
    },
    cont_btn:{
        flexDirection: 'row',
        justifyContent: 'center',
         alignItems: 'center'
    },
    vista: {
        alignItems: 'center',
        position: 'absolute',
        top:40,
        backgroundColor: '#00000000'
    },
    caja: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 25,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width - 30,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    fondo:{
        backgroundColor:'#E84546',
        justifyContent:'center',
        alignItems:'center'
    }
})