import React, { Component} from 'react'
import { View, StyleSheet, Switch, TouchableHighlight, Dimensions } from 'react-native'
import { Icon, Text, Container} from "native-base";
import store from '../../redux/store'
import {setLocation} from '../../redux/actions'
import Api from '../Api'
export default class Head extends Component{ 
    constructor() {
        super();
        this.state = {
           switch1Value: false,
        }
     }
     toggleSwitch1 = (value) => {
         
        this.setState({switch1Value: value})
        fetch(Api + '/chofer/', {
            method:'PUT',
            headers:{
                Accept: 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body: JSON.stringify({
                estatus:value,
            })
        })
        .then((response)=>{
            let data = response._bodyText
            data = JSON.parse(data)
        })
        .catch(error=>{
            alert(JSON.stringify(error))
        })
     }
     
    render(){
        return(
            <View style={style.fondo}>
                <TouchableHighlight underlayColor={'transparent'} onPress={()=>{
                    this.props.changePage('Home')
                    store.dispatch(setLocation('Home'))
                }}>
                    <View style={style.boton}>
                        <View style={this.props.seleccionado == 'home' ? style.seleccionado : style.icono}>
                            <Icon style={this.props.seleccionado == 'home' ? style.icon_seleccionado : style.icon} name='home' />
                        </View>
                        <Text style={this.props.seleccionado == 'home' ? style.tipo_text_seleccionado : style.tipo_text}>Inicio</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'transparent'} onPress={()=>{
                        this.props.changePage('Ganancias')
                        store.dispatch(setLocation('Ganancias'))
                    }}>
                    <View style={style.boton}>
                        <View style={this.props.seleccionado == 'ganancias' ? style.seleccionado : style.icono} >
                            <Icon style={this.props.seleccionado == 'ganancias' ? style.icon_seleccionado : style.icon} name='stats' />
                        </View>
                        <Text style={this.props.seleccionado == 'ganancias' ? style.tipo_text_seleccionado : style.tipo_text}>Ganancias</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'transparent'} onPress={()=>{
                    this.props.changePage('Perfil')
                    store.dispatch(setLocation('Perfil'))
                }}>       
                <View style={style.boton}>
                    <View style={this.props.seleccionado == 'perfil' ? style.seleccionado : style.icono}>
                        <Icon style={this.props.seleccionado == 'perfil' ? style.icon_seleccionado : style.icon} name='person' />
                    </View>
                    <Text style={this.props.seleccionado == 'perfil' ? style.tipo_text_seleccionado : style.tipo_text}>Perfil</Text>
                </View>
                </TouchableHighlight>
            </View>
        )
    }
}

const style = StyleSheet.create({
    seleccionado: {
        justifyContent: 'center',
        alignItems: 'center',
        width:60,
        color: '#E84546',
        height:60,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: 'red'
    },
    fondo:{
        flexDirection: 'row',
        height: 100,
        width:Dimensions.get('window').width,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: Dimensions.get('window').height*0.01
    },
    boton:{
        justifyContent: 'center',
        alignItems: 'center',  
        color: '#E84546'
    },
    textred:{
        color: '#E84546'
    },
    tipo_text: {
        fontSize: 8
    },
    tipo_text_seleccionado: {
        fontSize: 8,
        color: '#E84546'
    },
    icon_seleccionado:{
        fontSize:40,
        color: '#E84546'
    },
    icon:{
        fontSize:40,
        color: '#5F5F5F'
    },
    icono:{
        justifyContent: 'center',
        alignItems: 'center',
        width:60,
        color: '#5F5F5F',
        height:60,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: '#5F5F5F'
    }
})