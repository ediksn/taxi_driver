import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet, AsyncStorage, Platform} from "react-native";
import { Icon, Button,Text} from "native-base";
import store from '../../redux/store'
import {createToken, createId, setLocation} from '../../redux/actions'
import {server} from '../Api'
import NavigationService from '../../../NavigationService/NavigationService'
import { ScrollView } from 'react-native-gesture-handler';
export default class Politicas extends Component{
    constructor(){
        super()
    }

    botones(){
        return(
            <View style={{marginLeft:Platform.OS==='ios'?140:120}}>
                <Button
                    style={{marginBottom:alto*0.01}} 
                    onPress={()=>this.props.cerrarPoliticas(false)}
                    rounded
                    danger>
                        <Text style={{color:'white', textAlign:'center'}}>Cerrar</Text>
                </Button>
            </View>
        )
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
                height:'auto',
                width:Dimensions.get('window').width*0.95
              }}
            >
                <ScrollView>
                <View style={{justifyContent:"center", width:'100%'}}>
                    <View style={[estilo.razon,{marginTop:Platform.OS==='ios'?30:5}]}>
                        <View style={{height:60}}></View>
                        <Text style={{fontSize:15, textAlign:'justify'}}>
                        {`Politicas de Seguridad

                        WEBSITE
    Tomamos todas las medidas y precauciones razonables para proteger 
    tu información personal y seguimos las mejores practicas de la industria 
    para asegurar que tu información no sea utilizada de manera inapropiada, alterada o destruida.
                        
    Ciframos la información de tu tarjeta de crédito utilizando la tecnología 
    de capa de puertos seguros o Secur Sockets Layer(SSL), y la almacenamos con el cifrado AES-256. 
    También, seguimos todos los requerimientos del PCI-DSS.
                        
                        PAGOS
    Los métodos de pago utilizados por la empresa son servicios de terceros. Estos servicios de terceros (AZUL), 
    cumplen con todos los estándares de seguridad y cifrado para mantener tu información segura. 
    Solo utilizaran la información necesaria para completar el proceso requerido. 
    También recomendamos leer las Politicas de Privacidad de estos proveedores, 
    para entender mejor como manejan la información suministrada.`}
                        </Text>
                        <View style={{height:60}}></View>
                    </View>
                </View>
                {this.botones()}
                </ScrollView>
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
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:ancho*0.88
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