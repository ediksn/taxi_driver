import React from "react";
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight, Platform } from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Header, Row, Input, List } from "native-base";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Head from '../componentes/Header/Header.js'
import store from '../redux/store'
import {BackHandler, ToastAndroid} from 'react-native'
import Menu from '../componentes/Menu/Menu'
import moment from 'moment'
import 'moment/locale/es'
import {withNavigationFocus} from 'react-navigation'
import {server} from '../componentes/Api'
import { ScrollView } from "react-native-gesture-handler";
import Cargando from '../componentes/Modals/Cargando'
import NetInfo from '@react-native-community/netinfo'
import Mensaje from "../componentes/Modals/Mensajes.js";
import { setLocation } from "../redux/actions.js";

class Historial extends React.Component{
    constructor(){
        super()
        this.state={
            loading: true,
            reservas:[],
            conexion:'',
            mensaje:'',
            visible:false
        }
        this.changePage = this.changePage.bind(this)
        this.setmensaje=this.setmensaje.bind(this)
    }
    changePage(data){
        this.props.navigation.navigate(data)
    }
    handleBackPress = () => {
        store.dispatch(setLocation('Perfil'))
        this.changePage('Perfil')
        return true
    }
    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
          )
            
          NetInfo.isConnected.fetch().done(isConnected=>{
            if(isConnected===true){
                this.setState({conexion:'conectado',loading:false})
                this.getViajes()
            }
            else{
                this.setState({conexion:'desconectado',loading:false})
            }
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount(){
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        )
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
        this.setState({visible:data})
    }

    componentDidUpdate(prevProps){
        if(this.props.isFocused!==prevProps.isFocused){
            this.getViajes()
        }
    }

    getViajes(){
        if(this.state.conexion==='conectado'){
            fetch(`${server}/reserva/driver`,{
                method:'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type':'application/json',
                  'Authorization': 'Bearer '+store.getState().token.toString()
                }
            })
            .then(res=>{
                let data = JSON.parse(res._bodyInit)
                let arr =[]
                if(!data.message){
                    data.forEach(el => {
                        if(el.estatus==='Terminado'){
                            arr.push(el)
                        }
                    });
                }
                this.setState({
                    loading: false,
                    reservas:arr
                })
            })
            .catch(error=>{
                this.setState({loading:false})
                alert(error)
            })
        }
    }

    render()
        {
        if(this.state.loading) {
            return (<Cargando/>);
        }else{
            return (
                <Container>
                <Mensaje mensaje={this.state.mensaje} visible={this.state.visible} setmensaje={this.setmensaje}/>
                <Head
                    changePage={this.changePage}
                    navigation={this.props.navigation}
                    token={store.getState().token}
                    name='Historial'/>
                    <View style={styles.vista}>
                        <ScrollView style={{width:ancho, height:alto}}>
                            <List
                                dataArray={this.state.reservas}
                                renderRow={data=>{
                                        return(
                                            <View style={styles.content}>
                                                <View style={styles.contenido}>
                                                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                                                        <Icon
                                                            style={estilo.icon}
                                                            name='contact'
                                                        />
                                                        <View style={{flexDirection: 'column', marginLeft:10}}>
                                                            <Text style={{fontSize:14}}>{moment(data.fecha).format('DD MM YYYY')}</Text>
                                                            <Text style={{fontSize:10, color: '#E75553'}}>{data.trans_id&&data.trans_id.tipo?data.trans_id.tipo:''}</Text>
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <Text style={{fontSize:14}}>RD$ 
                                                            <Text style={{color: '#E75553'}}>{data.costo.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                                                        </Text>
                                                        <Text style={{fontSize:10, color: '#E75553'}}>{data.estatus}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.info}>
                                                    <Text numberOfLines={3} style={{textAlign:'left'}}><Text style={{color:'red'}}>Salida:</Text> {data.salida}</Text>
                                                    <Text numberOfLines={3} style={{textAlign:'left'}}><Text style={{color:'red'}}>Llegada:</Text> {data.llegada}</Text>
                                                    <Text style={{textAlign:'left'}}><Text style={{color:'red'}}>Duración:</Text> {data.duracion} min</Text>
                                                    <Text style={{textAlign:'left'}}><Text style={{color:'red'}}>Distancia:</Text> {data.distancia}</Text>
                                                </View>
                                                <View style={{height:20}}></View>
                                            </View>
                                        )
                                    
                                }}
                                
                            />
                        </ScrollView>
                    </View>
                </Container>
            )
        }
    }
}

export default withNavigationFocus(Historial)

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const styles = StyleSheet.create({
    content: {
        marginLeft:10,
        width: ancho*0.93,
        height: 'auto',
        borderRadius: 25,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'column',
        borderColor:'red',
        borderWidth:1,
        backgroundColor: '#D6D6D6',
        marginTop:alto*0.006
    },
    contenido:{
        width: ancho*0.88,
        height: alto*0.1,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection: 'row',
    },
    info:{
        width:ancho*0.88
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
    detalles:{
        height:Dimensions.get('window').height*0.05,
        backgroundColor:'#E84546', 
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20, 
        justifyContent:'center'
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
    conf:{
        height:Dimensions.get('window').height*0.05,
        backgroundColor:'#818181', 
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20, 
        justifyContent:'center'
    },
    cong_item:{
        marginVertical:Dimensions.get('window').height*0.005,
        backgroundColor:'#e9e9e9', 
        borderBottomRightRadius:25, 
        borderTopRightRadius:25,
        height:Dimensions.get('window').height*0.04,
        width:Dimensions.get('window').width*0.95,
        alignItems:'center',
        justifyContent:'space-around',
        flexDirection:'row'
    },
    conf_text:{
        color:'#838383'
    },
    tab_cont:{
        marginTop:1,
        backgroundColor:'#fff0',
        height:Dimensions.get('window').height*0.06
    },
    tab:{
        backgroundColor:'#E84546',
        height:Dimensions.get('window').height*0.06
    },
    tab_h:{
        backgroundColor:'#E84546',
        height:Dimensions.get('window').height*0.06,
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15
    },
    tab_a:{
        backgroundColor:'#818181',
        height:Dimensions.get('window').height*0.06,
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15
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