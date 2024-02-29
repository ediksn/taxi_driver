import React from "react";
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight, Platform } from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Header, Row, Input, List } from "native-base";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Head from '../componentes/Header/Header.js'
import store from '../redux/store'
import {BackHandler, ToastAndroid} from 'react-native'
import Menu from '../componentes/Menu/Menu'
import moment from 'moment'
import {withNavigationFocus} from 'react-navigation'
import 'moment/locale/es'
import {server} from '../componentes/Api'
import { ScrollView } from "react-native-gesture-handler";
import Notificacion from "../componentes/Modals/Notificacion.js";
import Mensaje from "../componentes/Modals/Mensajes.js";
import NetInfo from '@react-native-community/netinfo'
class Notificaciones extends React.Component{
    constructor(){
        super()
        this.state={
            noti:[],
            mensaje:'',
            visible:false,
            notifi:{},
            conexion:'',
            show:false
        }
        this.changePage = this.changePage.bind(this)
        this.setmensaje=this.setmensaje.bind(this)
        this.abrirNoti=this.abrirNoti.bind(this)
        this.getNoti()
    }
    changePage(data){
        this.props.navigation.navigate(data)
    }
    handleBackPress = () => {
       this.changePage(store.getState().location)
       return true
    }

    componentDidUpdate(prevProps){
        if(this.props.isFocused!==prevProps.isFocused&&!this.props.isFocused){
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)    
        }
        if(this.props.isFocused!==prevProps.isFocused&&this.props.isFocused){
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)    
        }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        )
            
        NetInfo.isConnected.fetch().done(isConnected=>{
            if(isConnected===true){
              this.setState({conexion:'conectado'})
              this.getNoti()
            }
            else{
              this.setState({conexion:'desconectado'})
            }
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount(){
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        )
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    }

    _handleConnectivityChange=isConnected=>{
        if(isConnected===true){
            this.setState({conexion:'conectado'})
        }
        else{
            this.setState({
                conexion:'desconectado', 
                mensaje:'Su dispositivo no tiene una conexion a internet',
                visible:true
            })
        }
    }

    setmensaje(data){
        this.setState({show:data})
    }

    abrirNoti(data){
        this.setState({visible:data})
    }

    getNoti(){
        if(this.state.conexion==='conectado'){
            fetch(`${server}/notificaciones/chofer/`+store.getState().id_user.toString(),{
                method:'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type':'application/json',
                  'Authorization': 'Bearer '+store.getState().token.toString()
                }
            })
            .then(res=>{
                let data = JSON.parse(res._bodyInit)
                this.setState({
                    noti:data
                })
            })
            .catch(error=>{
                alert(error)
            })
        }
    }

    openNotif(data){
        this.setState({
            notifi:data,
            visible:true
        })
        if(!data.vista&this.state.conexion==='conectado'){
            fetch(`${server}/notificaciones/`,{
                method:'PUT',
                headers: {
                  Accept: 'application/json',
                  'Content-Type':'application/json',
                  'Authorization': 'Bearer '+store.getState().token.toString()
                },
                body:JSON.stringify({
                    _id:data._id,
                    vista:true
                })
            })
            .then(res=>{
                this.getNoti()
            })
            .catch(error=>{
                alert(error)
            })
        }
    }

    mostrar(){
        let arr =[]
        for(let i =0; i<this.state.noti.length;i++){
            arr.push(
                <TouchableHighlight
                    key={'list'+i} 
                    onPress={()=>this.openNotif(this.state.noti[i])} 
                    underlayColor={'transparent'}
                >
                    <View style={this.state.noti[i].vista?styles.content:styles.content_b}>
                        <View style={styles.contenido}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                                <View style={{flexDirection: 'column', marginLeft:10}}>
                                    <Text style={this.state.noti[i].vista?estilo.titulo:estilo.titulo_b}>{this.state.noti[i].titulo}</Text>
                                    <Text numberOfLines={2} style={this.state.noti[i].vista?estilo.cuerpo:estilo.cuerpo_b}>{this.state.noti[i].cuerpo}</Text>
                                    <Text style={this.state.noti[i].vista?estilo.fecha:estilo.fecha_b}>{moment(this.state.noti[i].fecha).format('DD-MM-YYYY')}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }
        return arr
    }

    render()
        {
            return (
                <Container>
                <Mensaje visible={this.state.show} setmensaje={this.setmensaje} mensaje={this.state.mensaje}/>
                <Notificacion visible={this.state.visible} abrirNoti={this.abrirNoti} noti={this.state.notifi}/>
                <Head
                    changePage={this.changePage}
                    navigation={this.props.navigation}
                    name='Notificaciones'/>
                    <View style={styles.vista}>
                        <ScrollView style={{width:ancho, height:alto}}>
                            {this.mostrar()}
                        </ScrollView>
                    </View>
                </Container>
            )
        }
}

export default withNavigationFocus(Notificaciones)

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const styles = StyleSheet.create({
    content: {
        width: ancho,
        height: alto*0.12,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row',
        backgroundColor: '#D6D6D6',
        marginTop:alto*0.006
    },
    content_b:{
        width: ancho,
        height: alto*0.12,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row',
        backgroundColor: 'grey',
        marginTop:alto*0.006
    },
    contenido:{
        width: ancho*0.88,
        height: alto*0.15,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection: 'row',
    },
    vista: {
        alignItems:'center',
        backgroundColor:'#e9e9e9',
        borderRadius:10,
        height: alto*0.85,
        width: ancho
    }
})
const estilo = StyleSheet.create({
    titulo:{
        fontSize:16, 
        color:'#E75553', 
    },
    titulo_b:{
        fontSize:16, 
        color:'#E75553', 
        fontWeight:'bold'
    },
    cuerpo:{
        fontSize:14
    },
    cuerpo_b:{
        fontSize:14,
        fontWeight:'bold'
    },
    fecha:{
        fontSize:12
    },
    fecha_b:{
        fontSize:12,
        fontWeight:'bold'
    },
    open: {
        width: ancho,
        height: alto*0.4,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row',
        backgroundColor: '#D6D6D6',
        marginTop:alto*0.006
    },
    item:{
        paddingLeft:10,
        marginVertical:5,
        borderWidth:1,
        borderColor:'red',
        height:Dimensions.get('window').height*0.09,
        width:Dimensions.get('window').width*0.95,
        borderRadius:50,
        alignItems:'center',
        justifyContent:'center'
    },
    cont:{
        paddingLeft:0,
        marginVertical:5, 
        flexDirection:'row', 
        height:Dimensions.get('window').height*0.09,
        width:Dimensions.get('window').width*0.7,
        alignItems:'center',
        justifyContent:'space-between'
    },
    text:{
        color:'white',
        fontSize:15,
        textAlign:'center'
    },
    content:{
        width:Dimensions.get('window').width,
        height: (Dimensions.get('window').height)-(Dimensions.get('window').height*0.2),
        backgroundColor:'#e9e9e9',
        borderRadius:10,
        justifyContent:'flex-start',
        alignItems:'center'
    },
    icon:{
        fontSize:60,
        color:'#fff'
    },
    body:{
        marginLeft:0
    }
})