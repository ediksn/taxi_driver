import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet, Platform} from "react-native";
import { Button, Body, Content,Text, Card, CardItem, Input, Spinner } from "native-base";
import store from '../../redux/store'
import {server} from '../Api'
export default class Confirmacion extends Component{
    constructor(){
        super()
        this.state={
            valoracion: 1,
            comentario:''
        }
    }
    
    cambiarValoracion(data){
        this.setState({valoracion: data})
    }

    valorar(){
        fetch(`${server}/reserva/valoracion`,{
            method:'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body:JSON.stringify({
              val_dri: this.state.valoracion,
              comen_dri: this.state.comentario,
              _id: this.props.reserva._id
            })
          })
          .then(response=>{
              this.setState({valoracion: 1})
            this.props.valorarViaje(false)
          })
          .catch(error=>{
            alert(error)
          })
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
                paddingBottom: 100,
                borderRadius: 25,
                height:Dimensions.get('window').height / 2.5,
                width:Dimensions.get('window').width - 40
              }}
            >
                <View style={style.titulo}>
                    <Text style={style.text}>
                        Confirmacion de Codigo
                    </Text>
                </View>
                    <View style={style.coment}>
                        <Input 
                            placeholder='Ingresa el codigo'
                            maxLength={6}
                            keyboardType='numeric'
                            onChangeText={text=>this.props.setcodigo(text)}
                            style={
                                Platform.OS === 'ios'?
                                {width:'70%'}:
                                null
                            }    
                        >
                        </Input>
                    </View>
                <View style={{justifyContent:'space-between', alignItems:'center', marginTop:5, flexDirection:'row'}}>
                    <Button 
                        onPress={()=>{
                            this.props.cerrar()
                        }}
                        rounded
                        style={{backgroundColor:'#E84546',justifyContent:'center'}}>
                            <Text style={{color:'white', textAlign:'center'}}>Cancelar</Text>
                    </Button>
                    <Button
                        onPress={()=>this.props.confirmar()}
                        style={this.props.confirmar_btn?style.btn_cargando:style.btn}
                        rounded
                        danger
                        disabled={this.props.confirmar_btn? true:false}
                    >
                        <Spinner color='#fff' style={this.props.confirmar_btn?style.cargando:style.nocargando}/>
                        <Text style={{color:'white', textAlign:'center'}}>Aceptar</Text>
                    </Button>
                </View>
            </View>
          </View>
        </Modal>
        )
    }
}
const style = StyleSheet.create({
    btn:{
        justifyContent:'center',
        backgroundColor:'#E84546'
    },
    btn_cargando: {
        width:Dimensions.get('window').width *0.40
    },
    cargando:{
        marginLeft: 20,
        width:20,
        height: 20,
        fontSize: 10
    },
    nocargando:{
        display: 'none'
    },
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
    },
    estrellas: {
        flexDirection: 'row'
    },
    coment:{
        justifyContent:'center',
        alignItems:'center',
        width: Dimensions.get('window').height*0.3,
        height: Dimensions.get('window').height*0.10,
        borderWidth:1,
        borderColor:'red',
        borderRadius:15
    }
})