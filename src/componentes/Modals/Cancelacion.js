import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet} from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem } from "native-base";
import store from '../../redux/store'
import {server} from '../Api'
export default class Cancel extends Component{
    constructor(){
        super()
        this.state={
            razon:'',
            item:''
        }
    }
    
    setRazon(text, num){
        this.setState({razon:text, item:num})
    }
    
    cancelar(){
        fetch(`${server}/reserva`,{
            method:'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body:JSON.stringify({
              estatus: 'Cancelada',
              razonCancel: this.state.razon,
              _id: this.props.reserva.reserva._id
            })
          })
          .then(res=>{
            this.setRazon('',0)
            this.props.changecancelacion(false)
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
                <View style={estilo.titulo}>
                    <Icon
                        name='time'
                        style={{color:'white'}}
                    />
                    <Text style={estilo.text}>
                    Motivo de cancelacion
                    </Text>
                </View>
                <View style={{justifyContent:'flex-start'}}>
                    <View style={estilo.razon}>
                        <Text>1. Cab delay</Text>
                        <Icon
                            name='ios-checkmark-circle'
                            onPress={()=>this.setRazon('Cab delay',1)}
                            style={this.state.item==1?estilo.icon:estilo.icono}
                        />
                    </View>
                    <View style={estilo.razon}>
                        <Text>2. El controlador no repondio</Text>
                        <Icon
                            name='ios-checkmark-circle'
                            onPress={()=>this.setRazon('El controlador no repondio',2)}
                            style={this.state.item==2?estilo.icon:estilo.icono}
                        />
                    </View>
                    <View style={estilo.razon}>
                        <Text>3. Se muestra un direccion larga</Text>
                        <Icon
                            name='ios-checkmark-circle'
                            onPress={()=>this.setRazon('Se muestra un direccion larga',3)}
                            style={this.state.item==3?estilo.icon:estilo.icono}
                        />
                    </View>
                    <View style={estilo.razon}>
                        <Text>4. Cambio el plan de viaje</Text>
                        <Icon
                            name='ios-checkmark-circle'
                            onPress={()=>this.setRazon('Cambio el plan de viaje',4)}
                            style={this.state.item==4?estilo.icon:estilo.icono}
                        />
                    </View>
                    <View style={estilo.razon}>
                        <Text>5. Reserva en error</Text>
                        <Icon
                            name='ios-checkmark-circle'
                            onPress={()=>this.setRazon('Reserva en error',5)}
                            style={this.state.item==5?estilo.icon:estilo.icono}
                        />
                    </View>
                    <View style={estilo.razon}>
                        <Text>6. Otro</Text>
                        <Icon
                            name='ios-checkmark-circle'
                            onPress={()=>this.setRazon('Otro',6)}
                            style={this.state.item==6?estilo.icon:estilo.icono}
                        />
                    </View>
                </View>
                
                <View >
                    <Button 
                        onPress={()=>{
                            this.cancelar()
                        }}
                        rounded
                        style={estilo.boton}>
                            <Text style={{color:'white', textAlign:'center'}}>OK</Text>
                    </Button>
                </View>
            </View>
          </View>
        </Modal>
        )
    }
}
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
        justifyContent:'space-between'
    },
    boton:{
        backgroundColor:'#676767',
        justifyContent:'center', 
        marginTop:1,
        height:30
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