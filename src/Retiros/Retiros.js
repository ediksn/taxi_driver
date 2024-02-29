import React from "react";
import {withNavigationFocus} from 'react-navigation'
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight, ScrollView } from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Input } from "native-base";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Head from '../componentes/Header/Header.js'
import store from '../redux/store'
import {BackHandler, ToastAndroid} from 'react-native'
import Mensaje from '../componentes/Modals/Mensajes'
import Cargando from '../componentes/Modals/Cargando'
import {server} from '../componentes/Api'
import moment from "moment";
import NetInfo from '@react-native-community/netinfo'
import { setLocation } from "../redux/actions.js";

class Retiros extends React.Component {
  constructor(){
    super()
    this.state={
      location:'MisReservas',
      saldo:0,
      selec:'',
      monto:'',
      visible:false,
      mensaje:'',
      opcion:'',
      bloqueado:0,
      paypal:'',
      cuenta:'',
      loading:false,
      conexion:''
    }
    this.changePage = this.changePage.bind(this)
    this.setmensaje=this.setmensaje.bind(this)
    this.limpiar=this.limpiar.bind(this)
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
        'connectionChange',
        this._handleConnectivityChange
      )
        
      NetInfo.isConnected.fetch().done(isConnected=>{
        if(isConnected===true){
          this.setState({conexion:'conectado'})
        }
        else{
          this.setState({conexion:'desconectado'})
        }
    })
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.getSaldo()
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

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectivityChange
    )
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentDidUpdate(prevProps){
    if(this.props.isFocused!==prevProps.isFocused){
        this.getSaldo()
    }
  }

  shouldComponentUpdate(nextProps){
      if(this.props.isFocused!==nextProps.isFocused){
          return true
      }
      else{
          return true
      }
  }

  handleBackPress = () => {
    store.dispatch(setLocation('Retiros'))
    this.changePage('Retiros')
    return true
  }

  changePage(data) {
    //alert(data)
    this.props.navigation.navigate(data)
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
            this.setState({
                saldo:data.saldo,
                bloqueado:data.bloqueado?data.bloqueado:0,
                paypal:data.paypal?data.paypal:'',
                cuenta:(data.num_cuenta&&data.nom_banc&&data.tipo_cuenta)?'si':''
            })
        })
        .catch(error=>alert(error)) 
    }
}

retiro(){
    if(this.state.conexion==='conectado'){
        if(this.state.opcion===''){
            this.setState({
                mensaje:'No ha seleccionado alguna opción para su retiro'
            })
            this.setmensaje(true)
        }
        else if(this.state.monto===''){
            this.setState({
                mensaje:'Debe ingresar un monto para su retiro'
            })
            this.setmensaje(true)
        }
        else if(JSON.parse(this.state.monto)>this.state.saldo){
            this.setState({
                mensaje:'Su saldo no es suficiente para retirar la cantidad de '+this.state.monto
            })
            this.setmensaje(true)
        }
        else{
            this.setState({loading:true})
            fetch(server + '/trans/retiro/chofer', {
                method:'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '+store.getState().token.toString()
                },
                body:JSON.stringify({
                    total:this.state.monto,
                    tipo:this.state.opcion,
                    driver:store.getState().id_user
                })
            })
            .then(res=>{
                this.setState({
                    loading:false,
                    mensaje:'Se ha registrado el retiro. Pronto le será aprobado su movimiento',
                    monto:'',
                    selec:'',
                    opcion:''
                })
                this.setmensaje(true)
                this.getSaldo()
            })
            .catch(error=>{
                this.setState({loading:true})
                alert(error)
            }) 
        }
    }
}

    limpiar(){
        this.setState({
            opcion:'',
            selec:'',
            mensaje:'',
            monto:''
        })
    }

    setmensaje(data){
        this.setState({
            visible:data
        })
    }

    textoDatos(){
        if(this.state.paypal===''&&this.state.cuenta===''){
            return(
                <View style={{alignItems:'center', width:ancho}}>
                    <Text style={{textAlign:'center', color:'red'}}>No posee cuentas registradas para hacer algun retiro</Text>
                </View>
            )
        }
        else{
            return(
                <View></View>
            )
        }
    }

    format(num){
        var parts = num.split('.')
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        return parts.join('.')
    }

    setBloqueado(){
        if(this.state.bloqueado!==0){
            return(
                <View style={styles.barra}>
                    <Text style={{textAlign:'center', fontSize:15}}>Saldo bloqueado RD$ </Text>
                    <Text style={styles.red_b}>{this.state.bloqueado.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                </View>
            )
        }
    }

  render() {
    return (
      <Container>
        <Head
            changePage={this.changePage}
            name='Retiro'
            limpiar={this.limpiar}
            token={store.getState().token}
            > 
        </Head>
        <ScrollView>
        <Cargando
            visible={this.state.loading}
        />
        <Mensaje 
            visible={this.state.visible} 
            mensaje={this.state.mensaje} 
            setmensaje={this.setmensaje}
        />
            <View style={{alignItems:'center', width:ancho}}>
                <View style={styles.barra_titulo}>
                    <View style={{justifyContent:'center'}}>
                        <Text style={{textAlign:'center', fontSize:25}}>Saldo disponible para retiro</Text>
                    </View>
                    <View style={styles.barra}>
                        <Text style={{textAlign:'center', fontSize:20}}>RD$ </Text>
                        <Text style={styles.red}>{this.state.saldo.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                    </View>
                    {this.setBloqueado()}
                </View>
                <View style={{alignItems: "center"}}>
                    <View style={styles.botones}>
                        <Button
                            disabled={this.state.paypal===''?true:false}
                            rounded
                            onPress={()=>{
                                if(this.state.paypal!==''){
                                    this.setState({
                                        selec:'1',
                                        opcion:'PayPal'
                                    })
                                }
                            }}
                            style={this.state.selec!=='1'?styles.boton:styles.boton_sele}
                        >
                            <Text style={{textAlign:'center'}}>PayPal</Text>
                        </Button>
                        <Button
                            disabled={this.state.cuenta===''?true:false}
                            rounded
                            onPress={()=>{
                                if(this.state.cuenta!==''){
                                    this.setState({
                                        selec:'2',
                                        opcion:'Cuenta Bancaria'
                                    })
                                }
                            }}
                            style={this.state.selec!=='2'?styles.boton:styles.boton_sele}
                        >
                            <Text style={{textAlign:'center'}}>Cuenta Bancaria</Text>
                        </Button>
                    </View>
                </View>
                <View style={{alignItems: "center"}}>
                    {this.textoDatos()}
                </View>
                <View style={{alignItems:'center', width:ancho}}>
                    <View style={styles.monto}>
                        <View style={styles.input}>
                            <Input placeholder='Monto a retirar'
                                style={{fontSize:20}}
                                keyboardType='numeric'
                                value={this.format(this.state.monto)}
                                onChangeText={text=>{this.setState({
                                    monto:text.replace(/[^0-9\.]+/g, '')})}}
                            ></Input>
                            <Icon
                                name='close'
                                style={{color:'red', fontSize:33}}
                                onPress={()=>{
                                    this.setState({monto:''})}}
                            />
                        </View>
                    </View>
                </View>
                <TouchableHighlight underlayColor={'transparent'} onPress={()=>this.retiro()}>
                    <View style={{alignItems:'center', width:ancho, marginTop:alto*0.09}}>
                        <View style={{justifyContent:'center'}}>
                            <Button 
                                onPress={()=>this.retiro()}
                                rounded 
                                style={styles.bot}>
                                <Text>Solicitar Retiro</Text>
                            </Button>
                        </View>    
                    </View>
                </TouchableHighlight>
            </View>
        </ScrollView>
      </Container>
    );
  }
}

export default withNavigationFocus(Retiros)

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const styles = StyleSheet.create({
    monto: {
        width: ancho*0.9,
        height: alto*0.08,
        borderRadius: 20,
        borderWidth:1,
        borderColor:'red',
        alignItems:'center',
        justifyContent: 'center'
    },
    input:{
        width: ancho*0.8,
        height: alto*0.08,
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'space-between'
    },
    botones:{
        margin:alto*0.1,
        flexDirection:'row',
        width:ancho,
        justifyContent:'space-around'
    },
    boton:{
        width:ancho*0.45, 
        justifyContent:'center',
        backgroundColor:'grey'
    },
    boton_sele:{
        width:ancho*0.45, 
        justifyContent:'center',
        backgroundColor:'red'
    },
    bot:{
        width:ancho*0.9, 
        justifyContent:'center',
        backgroundColor:'black'
    },
    barra: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#E9E9E9',
        width: ancho*0.9,
        height: 35
    },
    barra_titulo: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E9E9E9',
        width: ancho*0.95,
        borderColor:'red',
        borderWidth:1,
        height: alto*0.2,
        marginTop:alto*0.01,
        borderRadius: 20,
        color: '#fff'
    },
    red: {
        color: '#E84546',
        fontSize:20
    },
    red_b: {
        color: '#E84546',
        fontSize:15
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