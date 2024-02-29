import React from "react";
import {withNavigationFocus} from 'react-navigation'
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight, Platform } from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Header, Row, Input, List } from "native-base";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Head from '../componentes/Header/Header.js'
import store from '../redux/store'
import {BackHandler, ToastAndroid} from 'react-native'
import Menu from '../componentes/Menu/Menu'
import moment from 'moment'
import 'moment/locale/es'
import {server} from '../componentes/Api'
import { ScrollView } from "react-native-gesture-handler";
import NetInfo from '@react-native-community/netinfo'
import Mensaje from "../componentes/Modals/Mensajes.js";
import { setLocation } from "../redux/actions.js";

class ListRetiros extends React.Component{
    constructor(){
        super()
        this.state={
            retiros:[],
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
              this.setState({conexion:'conectado'})
              this.getRetiros()
            }
            else{
              this.setState({conexion:'desconectado'})
            }
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
    componentDidUpdate(prevProps) {
        if(this.props.isFocused !== prevProps.isFocused&&this.props.isFocused){
            this.getRetiros()
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        }
        if(this.props.isFocused !== prevProps.isFocused&&!this.props.isFocused){
            this.getRetiros()
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        }
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
        this.setState({visible:data})
    }

    getRetiros(){
        if(this.state.conexion==='conectado'){
            fetch(`${server}/retiros/chofer/${store.getState().id_user.toString()}`,{
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
                    retiros:data
                })
            })
            .catch(error=>{
                alert(error)
            })
        }
    }

    render()
        {
            return (
                <Container>
                <Mensaje visible={this.state.visible} setmensaje={this.setmensaje} mensaje={this.state.mensaje}/>
                <Head
                    changePage={this.changePage}
                    navigation={this.props.navigation}
                    name='Retiros'/>
                    <View style={styles.vista}>
                    <ScrollView style={{width:ancho*0.95, height:alto}}>
                        <List
                            dataArray={this.state.retiros}
                            renderRow={data=>{
                                    return(
                                        <View style={styles.content}>
                                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                                                <View style={{flexDirection: 'column'}}>
                                                    <Text style={{fontSize:14}}>{moment(data.fecha).format('DD MM YYYY')}</Text>
                                                    <Text style={{fontSize:10, color: '#E75553'}}>{data.tipo}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={{fontSize:14}}>RD$ 
                                                    <Text style={{color: '#E75553'}}>{data.monto.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                                                </Text>
                                                <Text style={{fontSize:10, color: '#828282'}}>{data.estatus}</Text>
                                            </View>
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

export default withNavigationFocus(ListRetiros)

const ancho = Dimensions.get('window').width
const alto = Dimensions.get('window').height

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
        width: '100%',
        height: 70,
        borderRadius: 25,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection: 'row',
        borderColor:'red',
        borderWidth:1,
        backgroundColor: '#D6D6D6',
        marginTop:'2%'
    },
    vista: {
        alignItems:'center',
        backgroundColor:'#e9e9e9',
        borderRadius:10,
        paddingHorizontal: 20,
        height: alto*0.9,
        width: ancho
    }
})
const estilo = StyleSheet.create({
    detalles:{
        height:alto*0.05,
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
        height:alto*0.09,
        width:ancho*0.95,
        borderRadius:50,
        alignItems:'center',
        justifyContent:'center'
    },
    cont:{
        paddingLeft:0,
        marginVertical:5, 
        flexDirection:'row', 
        height:alto*0.09,
        width:ancho*0.7,
        alignItems:'center',
        justifyContent:'space-between'
    },
    conf:{
        height:alto*0.05,
        backgroundColor:'#818181', 
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20, 
        justifyContent:'center'
    },
    cong_item:{
        marginVertical:alto*0.005,
        backgroundColor:'#e9e9e9', 
        borderBottomRightRadius:25, 
        borderTopRightRadius:25,
        height:alto*0.04,
        width:ancho*0.95,
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
        height:alto*0.06
    },
    tab:{
        backgroundColor:'#E84546',
        height:alto*0.06
    },
    tab_h:{
        backgroundColor:'#E84546',
        height:alto*0.06,
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15
    },
    tab_a:{
        backgroundColor:'#818181',
        height:alto*0.06,
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15
    },
    text:{
        color:'white',
        fontSize:15,
        textAlign:'center'
    },
    content:{
        width:ancho,
        height: (alto)-(alto*0.2),
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