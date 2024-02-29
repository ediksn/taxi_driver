import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet, TouchableHighlight} from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Input } from "native-base";
import store from '../../redux/store'
import {server} from '../Api'
export default class Valorar extends Component{
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
            this.props.limpiarViaje()
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
                paddingBottom: 20,
                borderRadius: 25,
                height:Dimensions.get('window').height / 2.5,
                width:Dimensions.get('window').width - 40
              }}
            >
                <View style={style.titulo}>
                    <Text style={style.text}>
                    Valoracion del viaje
                    </Text>
                </View>
                    <View style={style.estrellas}>
                        <TouchableHighlight 
                            underlayColor={'transparent'} 
                            onPress={()=>this.cambiarValoracion(1)}>
                            <Icon style={{fontSize: 50, color: '#E84546'}} name={this.state.valoracion >= 1 ? 'star' : 'star-outline'} />
                        </TouchableHighlight>
                        <TouchableHighlight     
                            underlayColor={'transparent'} 
                            onPress={()=>this.cambiarValoracion(2)}>
                            <Icon style={{fontSize: 50, color: '#E84546'}} name={this.state.valoracion >= 2 ? 'star' : 'star-outline'} />
                        </TouchableHighlight>
                        <TouchableHighlight 
                            underlayColor={'transparent'} 
                            onPress={()=>this.cambiarValoracion(3)}>
                            <Icon style={{fontSize: 50, color: '#E84546'}} name={this.state.valoracion >= 3 ? 'star' : 'star-outline'} />
                        </TouchableHighlight>
                        <TouchableHighlight 
                            underlayColor={'transparent'} 
                            onPress={()=>this.cambiarValoracion(4)}>
                            <Icon style={{fontSize: 50, color: '#E84546'}} name={this.state.valoracion >= 4 ? 'star' : 'star-outline'} />
                        </TouchableHighlight>
                        <TouchableHighlight 
                            underlayColor={'transparent'} 
                            onPress={()=>this.cambiarValoracion(5)}>
                            <Icon style={{fontSize: 50, color: '#E84546'}} name={this.state.valoracion >= 5 ? 'star' : 'star-outline'} />
                        </TouchableHighlight>
                    </View>
                    <View style={style.coment}>
                        <Input 
                            placeholder='Deja tu comentario'
                            onChangeText={text=>this.setState({comentario:text})}    
                        >
                        </Input>
                    </View>
                <View style={{justifyContent:'center', alignItems:'center', marginTop:5}}>
                    <Button 
                        onPress={()=>{
                            this.valorar()
                        }}
                        rounded
                        style={{backgroundColor:'#E84546',justifyContent:'center'}}>
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
        width: Dimensions.get('window').height*0.4,
        height: Dimensions.get('window').height*0.16,
        borderWidth:1,
        borderColor:'red',
        borderRadius:15
    }
})