import React from "react";
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight, ScrollView } from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle } from "native-base";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Head from '../componentes/Header/Header.js'
import store from '../redux/store'
import {BackHandler, ToastAndroid} from 'react-native'
import Menu from '../componentes/Menu/Menu'
import {server} from '../componentes/Api'
import moment from "moment";
import {withNavigationFocus} from 'react-navigation'
import Cargando from '../componentes/Modals/Cargando'
import NetInfo from '@react-native-community/netinfo'
import Mensaje from '../componentes/Modals/Mensajes'
import NavigationService from "../../NavigationService/NavigationService.js";
import { setLocation } from "../redux/actions.js";
class Ganancias extends React.Component {
  constructor(){
    super()
    this.state={
      location:'MisReservas',
      arr:[],
      loading: true,
      loading2: true,
      trans:{
          fecha: '',
          transacciones: [],
          total: 0
      },
      saldo:0,
      mensaje:'',
      visible:false,
      conexion:''
    }
    this.changePage = this.changePage.bind(this)
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
        'connectionChange',
        this._handleConnectivityChange
      )
        
      NetInfo.isConnected.fetch().done(isConnected=>{
        if(isConnected===true){
          this.setState({conexion:'conectado',loading:false,loading2:false})
          this.ganacias()
          this.getSaldo()
        }
        else{
          this.setState({conexion:'desconectado',loading:false,loading2:false})
        }
    }) 
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentDidUpdate(prevProps){
    if(this.props.isFocused!==prevProps.isFocused){
        this.ganacias()
        this.getSaldo()
    }
    if(this.props.isFocused!==prevProps.isFocused&&this.props.isFocused===true){
        store.dispatch(setLocation('Ganancias'))
    }
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectivityChange
    )
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
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

  handleBackPress = () => {
    if(store.getState().location==='Documentos'||store.getState().location==='Retiros'||
    store.getState().location==='Cuentas'||store.getState().location==='Vehiculos'||
    store.getState().location==='Historial'){
      NavigationService.navigate('Perfil')
      return true
    }
  }
  changePage(data) {
    //alert(data)
    this.props.navigation.navigate(data)
  }

  setTotal(){
    let fecha = new Date()
    if(this.state.trans.fecha===moment(fecha).format('DD-MM')){
        return(
          <View style={styles.barra_titulo}>
              <Text style={{color: '#fff'}}>Total de Hoy</Text>
          </View>
        )
    }
    else if(this.state.trans.fecha===moment(fecha).subtract(1,'days').format('DD-MM')){
      return(
          <View style={styles.barra_titulo}>
              <Text style={{color: '#fff'}}>Total de Ayer</Text>
          </View>
        )
    }
    else if(this.state.trans.fecha===moment(fecha).subtract(2,'days').format('DD-MM')){
      return(
          <View style={styles.barra_titulo}>
              <Text style={{color: '#fff'}}>Total de {this.state.trans.fecha}</Text>
          </View>
        )
    }
    else if(this.state.trans.fecha===moment(fecha).subtract(3,'days').format('DD-MM')){
      return(
          <View style={styles.barra_titulo}>
              <Text style={{color: '#fff'}}>Total de {this.state.trans.fecha}</Text>
          </View>
        )
    }
    else {
      return(
          <View style={styles.barra_titulo}>
              <Text style={{color: '#fff'}}>Total</Text>
          </View>
        )
    }
}

  setText(){
      let fecha = new Date()
      if(this.state.trans.fecha===moment(fecha).format('DD-MM')){
          return(
            <View style={styles.barra_titulo}>
                <Text style={{color: '#fff'}}>Viajes de Hoy</Text>
            </View>
          )
      }
      else if(this.state.trans.fecha===moment(fecha).subtract(1,'days').format('DD-MM')){
        return(
            <View style={styles.barra_titulo}>
                <Text style={{color: '#fff'}}>Viajes de Ayer</Text>
            </View>
          )
      }
      else if(this.state.trans.fecha===moment(fecha).subtract(2,'days').format('DD-MM')){
        return(
            <View style={styles.barra_titulo}>
                <Text style={{color: '#fff'}}>Viajes de {this.state.trans.fecha}</Text>
            </View>
          )
      }
      else if(this.state.trans.fecha===moment(fecha).subtract(3,'days').format('DD-MM')){
        return(
            <View style={styles.barra_titulo}>
                <Text style={{color: '#fff'}}>Viajes de {this.state.trans.fecha}</Text>
            </View>
          )
      }
      else {
        return(
            <View style={styles.barra_titulo}>
                <Text style={{color: '#fff'}}>Viajes </Text>
            </View>
          )
      }
  }

  transacciones(){
    resul =[]
    for(let i =0; i< this.state.trans.transacciones.length;i++){
        resul.push(
            <View style={styles.monto}>
                <Text>RD$ {this.state.trans.transacciones[i] ? 
                    this.state.trans.transacciones[i].toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') :'0.00'}
                </Text>
            </View>
        )
    }
    return resul
  }

  fechas () {
      arr = []
        for (let i = 0; i < this.state.arr.length; i++) {
            arr.push(
                <TouchableHighlight
                    key={'touch'+i} 
                    underlayColor={'transparent'}
                    onPress={()=>
                    {
                        this.setText()
                        this.setState({
                        trans:
                        {
                            fecha: this.state.arr[i].fecha, 
                            transacciones: this.state.arr[i].transacciones, 
                            total: this.state.arr[i].total
                        }})}}>
                    <View style={styles.botonfecha}>
                        <Text style={{fontSize: 15, color: '#fff'}}>{this.state.arr[i].fecha}</Text>
                    </View>
                </TouchableHighlight>
            )
        }
        return arr
    }

getSaldo(){
    if(this.state.conexion==='conectado'){
        fetch(server + '/chofer/'+store.getState().id_user.toString(), {
            method:'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+store.getState().token.toString()
            }
        })
        .then(res=>{
            let data = JSON.parse(res._bodyInit)
            this.setState({saldo:data.saldo, loading: false})
        })
        .catch(error=>{
            this.setState({loading: false})
            alert(error)
        }) 
    }
}
ganacias(){
    if(this.state.conexion==='conectado'){
        fetch(server + '/stats/chofer', {
            method:'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+store.getState().token.toString()
            }
        })
        .then(res=>{
            let data = JSON.parse(res._bodyInit)
            this.setState({arr:data.data, trans:data.data[0], loading2: false})
        })
        .catch(error=>{
            this.setState({loading2: false})
            alert(error)
        })
    }
}

setmensaje(data){
    this.setState({visible:data})
}

  render() {
      if(this.state.loading && this.state.loading2) {
        return (<Cargando/>);
      }else{
        return (
        <Container>
            <Mensaje visible={this.state.visible} setmensaje={this.setmensaje} mensaje={this.state.mensaje}/>
            <Head 
                style={styles.head}
                navigation={this.props.navigation}
                name='Mis Ganancias'
                conexion={this.state.conexion}
                token={store.getState().token} 
            />
            <View style={{width:Dimensions.get('window').width, alignItems:'center'}}>
                <Menu seleccionado={'ganancias'} changePage={this.changePage}/>
            </View>
            <ScrollView>
            <View style={styles.barra}>
                <Text>RD$ </Text><Text style={styles.red}>{this.state.saldo.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
            </View>
            {this.setText()}
            <View style={{alignItems: "center"}}>
                <View style={styles.cajaicono}>
                    <Icon style={{color: '#676767', fontSize: 80}}
                        name='car'
                    />
                </View>
                <View style={styles.cajatexto}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>{this.state.trans.transacciones.length} Viajes</Text>
                </View>
            </View>
            <View style={styles.cajafechas}>
                {this.fechas()}
            </View>
            {this.transacciones()}
            {this.setTotal()}
            <View style={{marginHorizontal: 20, justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.total_ganancia}>
                    <View>
                        <Text style={{fontSize: 23, color: '#818181' }}>RD$ 
                            <Text style={{color: '#E84040', fontSize: 23,fontSize: 20,}}>
                            {this.state.trans.total?
                                this.state.trans.total.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') :'0.00'}
                            </Text>
                        </Text>
                        <Text style={{fontSize: 12, color: '#818181' }}>Ganancias</Text>
                    </View>
                </View>
            </View>
            </ScrollView>
        </Container>
        );
    }
  }
}

export default withNavigationFocus(Ganancias)

const styles = StyleSheet.create({
    total_ganancia: {
        width: Dimensions.get('window').width - 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        height:70,
        paddingHorizontal: 20,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 5,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 25,
        backgroundColor: '#D6D6D6'
    },
    monto: {
        width: Dimensions.get('window').width - 20,
        height: 30,
        backgroundColor: '#E9E9E9',
        marginTop: 5,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        justifyContent: 'center'
    },
    botonfecha: {
        width: Dimensions.get('window').width / 4.5,
        height: 30,
        backgroundColor: '#E84546',
        marginHorizontal: 5,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    cajafechas:{
        marginTop:15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: 20
    },
    cajatexto: {
        width: Dimensions.get('window').width / 3,
        height: 25,
        backgroundColor: '#E84546',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cajaicono: {
        width: Dimensions.get('window').width / 3,
        height: 80,
        backgroundColor: '#E9E9E9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    barra: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#E9E9E9',
        width: Dimensions.get('window').width,
        height: 35
    },
    barra_titulo: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#818181',
        width: Dimensions.get('window').width,
        height: 35,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        color: '#fff'
    },
    barra_semana: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#E84546',
        width: Dimensions.get('window').width,
        height: 35,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        color: '#fff',
        marginTop: 20
    },
    red: {
        color: '#E84546'
    },
    content: {
        flex: 1,
        alignItems: 'center',
        marginBottom:0,
        marginHorizontal: 0,
        marginVertical: 0
    },
    base:{
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 0
    },
        map: {
        position:'absolute',
        width: Dimensions.get('window').width,
        height:Dimensions.get('window').height,
        flex:1
    },
    head:{
        backgroundColor:'red',
    }
   });