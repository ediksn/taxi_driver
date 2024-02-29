import React, { Component} from 'react'
import { View, StyleSheet, Dimensions, TouchableHighlight, Linking, Image, Platform } from 'react-native'
import { Icon, Text } from "native-base";
import logo from '../../../icon.png'
import { sock} from '../Api'
export default class BotonDetalles extends Component{ 
    constructor() {
        super();
        this.state = {
           switch1Value: false,
           imagen:'',
           visible:false
        }
        //this.abrirModal=this.abrirModal.bind(this)
     }

     replaceUri(imagen){
        let img = Platform.OS === 'ios' ? { ...imagen} : imagen
        if(img&&img.url){
            img.uri=sock+img.url
        }
        return img
      }
    llamar(){
        //alert(JSON.stringify(this.props.reserva.reserva.user.telefono))
        Linking.openURL(
            !this.props.reserva.reserva.user_name?  `tel:${this.props.reserva.reserva.user.telefono}` : `tel:${this.props.reserva.reserva.user_tlf}`
        )
    }

    goToYosemite() {
        alert(this.props.reserva)
        //openMap({ latitude: 37.865101, longitude: -119.538330 });
    }
    renderImagen(){
        if(this.props.reserva.reserva
            &&this.props.reserva.reserva.user
            &&this.props.reserva.reserva.user.imagen
            &&this.props.reserva.reserva.user.imagen!==''
            &&!this.props.reserva.reserva.user_name){
            return(
                <View style={style.img}>
                    <Image 
                        style={style.img} 
                        source={this.replaceUri(this.props.reserva.reserva.user.imagen)} 
                    />
                </View>
            )
        }
        else if(this.props.reserva.reserva
            &&this.props.reserva.reserva.user_name){
                return(
                    <View style={style.img}>
                        <Image 
                            style={[style.img,{borderRadius:0}]} 
                            source={logo} 
                        />
                    </View>
                )
        }
        else{
            return(
                <View style={style.icono}>
                    <Icon style={{fontSize: 100, color: '#fff', bottom:Platform.OS==='ios'?8:0}} name='contact' />
                </View>
            )
        }
    }

    nombre(){
        if(this.props.reserva.reserva){
            if(!this.props.reserva.reserva.user_name){
                return(
                    <Text style={{textAlign:'center', color:'white', fontWeight:'bold'}}>
                        {this.props.reserva.reserva.user.nombre+' '+this.props.reserva.reserva.user.apellido}
                    </Text>
                )
            }else{
                return(
                    <Text style={{textAlign:'center', color:'white', fontWeight:'bold'}}>
                        Operador
                    </Text>
                )
            }
        }
    }

    render(){
        return(
                <View style={style.vista}>
                    <View style={style.caja}>
                        <TouchableHighlight underlayColor={'transparent'} onPress={()=>this.llamar()}>
                        <View style={style.cont_btn}>
                            <Icon style={{fontSize: 25, color: '#E84546', marginRight: 10}} name='call' />
                            <Text style={{fontSize: 15, color: '#E84546'}}>Llamada</Text>
                        </View>
                        </TouchableHighlight>
                        {this.renderImagen()}
                        <TouchableHighlight underlayColor={'transparent'} onPress={()=>{this.props.changecancelacion(true)}}>
                            <View style={style.cont_btn}>
                                <Icon style={{fontSize: 25, color: '#E84546', marginRight: 10}} name='close' />
                                <Text style={{fontSize: 15, color: '#E84546'}}>Cancelar</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={style.nombre}>
                        {this.nombre()}
                    </View>
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
        justifyContent:'center',
        marginTop:30,
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
    nombre:{
        width:Dimensions.get('window').width - 80,
        alignItems:'center',
        borderBottomRightRadius:25,
        borderBottomLeftRadius:25,
        height:35,
        backgroundColor:'#E84546',
        justifyContent:'center'
    },  
    img:{
        width: 64, 
        height: 64, 
        borderRadius: 64,
        marginVertical:5
    }
})