import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet} from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Input } from "native-base";
import store from '../../redux/store'
import {server} from '../Api'
export default class Notificacion extends Component{
    constructor(){
        super()
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
                borderRadius: 15,
                height:alto*0.6,
                width:ancho*0.85
              }}
            >
                <View style={{justifyContent:'flex-start'}}>
                    <View style={estilo.razon}>
                        <Text style={{
                            fontSize:16, 
                            fontWeight:'bold',
                            marginTop:10,
                            width:ancho*0.8,
                            textAlign:'center'
                        }}>
                            {this.props.noti.titulo}
                        </Text>
                        <Text style={{
                            fontSize:14, 
                            textAlign:'justify',
                            marginTop:5,
                            width:ancho*0.8
                        }}>
                            {this.props.noti.cuerpo}
                        </Text>
                    </View>
                </View>
                <View >
                    <Button
                        style={{marginBottom:alto*0.01}} 
                        onPress={()=>{
                            this.props.abrirNoti(false)
                        }}
                        rounded
                        danger>
                            <Text style={{color:'white', textAlign:'center'}}>Cerrar</Text>
                    </Button>
                </View>
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
        flexDirection:'column',
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