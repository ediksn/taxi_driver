import React from "react";
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
export default class Cuentas extends React.Component {
  constructor(){
    super()
    this.state={
      location:'MisReservas',
      arr:[],
      saldo:0,
      visible:false,
      mensaje:'',
      email:'',
      mail:'',
      match:'',
      nom:'',
      cuenta:'',
      tipo:'',
      nuevo: true,
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
            this.setState({conexion:'conectado',loading:false})
            this.getDatos()
        }
        else{
            this.setState({conexion:'desconectado',loading:false})
        }
    }) 
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectivityChange
    )
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.setState({mail:''})
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
    store.dispatch(setLocation('Perfil'))
    this.changePage('Perfil')
    return true
  }

  shouldComponentUpdate(nextProps, nextState){
    if((nextState.email!==this.state.email &&
        nextState.email===''&&this.state.mail==='')||(
        nextState.mail!==this.state.mail &&
        nextState.mail===''&&this.state.email===''
        )){
        this.setState({
            match:''
        })
        return true
    }

    if((nextState.mail!=='' && 
        this.state.mail!== nextState.mail && 
        nextState.mail===1)||(
        this.state.mail!== nextState.mail && 
        nextState.mail.length===this.state.email.length+1)||(
        this.state.mail!== nextState.mail && 
        nextState.mail.length===this.state.email.length-1)
        ){
        this.setState({
            match:'no'
        })
        return true
    }
    if(this.state.mail!==nextState.mail && nextState.mail===this.state.email){
       
        this.setState({
            match:'si'
        })
        return true
    }
    return true
}

  changePage(data) {
    //alert(data)
    this.props.navigation.navigate(data)
  }


getDatos(){
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
            if(data.paypal) {
                this.setState({nuevo: false})
            }
            this.setState({
                email:data.paypal?data.paypal:'',
                nom:data.nom_banc?data.nom_banc:'',
                cuenta:data.num_cuenta?data.num_cuenta:'',
                tipo:data.tipo_cuenta?data.tipo_cuenta:'',
            })
        })
        .catch(error=>alert(error)) 
    }
}

limpiar(){
    this.setState({
        mail:''
    })
}

update(body){
    if(this.state.conexion==='conectado'){
        this.setState({loading:true})
        fetch(server + '/chofer', {
            method:'PUT',
            headers:{
                Accept: 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body:JSON.stringify(body)
        })
        .then(res=>{
            this.setmensaje(true)
            this.setState({
                loading:false,
                mensaje:'Sus datos personales ha sido guardados'
            })
        })
        .catch(error=>{
            this.setState({loading:true})
            alert(error)
        })
    }
}

retiro(){
    if(this.state.nom != '' || this.state.cuenta != '' || this.state.tipo != ''){
        if(this.state.nom===''||this.state.cuenta===''||this.state.tipo===''){
            this.setState({
                mensaje:'Debe completar los datos de su cuenta bancaria'
            })
            this.setmensaje(true)
        }
        else if(this.state.email===''){
            let body ={
                num_cuenta:this.state.cuenta,
                nom_banc: this.state.nom,
                tipo_cuenta: this.state.tipo,
                _id:store.getState().id_user
            }
            this.update(body)
        }
        else if(this.state.match==='no'||(this.state.email!==''&&this.state.mail==='' && this.state.nuevo)){
            this.setState({
                mensaje:'Confirme su datos de PayPal'
            })
            this.setmensaje(true)
        }
        else{
            let body ={
                paypal:this.state.email,
                num_cuenta:this.state.cuenta,
                nom_banc: this.state.nom,
                tipo_cuenta: this.state.tipo,
                _id:store.getState().id_user
            }
            this.setState({mail:''})
            this.update(body)
        }
    }else{
        if(this.state.match==='no'||(this.state.email!==''&&this.state.mail==='')){
            this.setState({
                mensaje:'Confirme su datos de PayPal'
            })
            this.setmensaje(true)
        }
        else{
            let body ={
                paypal:this.state.email,
                _id:store.getState().id_user
            }
            this.setState({mail:''})
            this.update(body)
        }
    }
}

    setmensaje(data){
        this.setState({
            visible:data
        })
    }

  render() {
    return (
      <Container>
        <Head
            changePage={this.changePage}
            name='Cuentas'
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
            <View style={{alignItems:'center',justifyContent:'center', width:ancho}}>
                <View style={styles.barra_titulo}>
                    <View style={{justifyContent:'center'}}>
                        <Text style={{textAlign:'center',color:'white',fontSize:20}}>Cuentas personales</Text>
                    </View>
                </View>
                <View style={{justifyContent:"center",alignItems:'center', marginTop:alto*0.015}}>
                    <View style={styles.monto}>
                        <View style={styles.input}>
                            <Icon
                                name='clipboard'
                                style={{color:'red', fontSize:25}}
                            />
                            <Input placeholder='Nombre del banco'
                                style={{fontSize:15}}
                                value={this.state.nom}
                                onChangeText={text=>this.setState({nom:text})}
                            ></Input>
                        </View>
                    </View>
                    <View style={styles.monto}>
                        <View style={styles.input}>
                            <Icon
                                name='clipboard'
                                style={{color:'red', fontSize:25}}
                            />
                            <Input placeholder='Tipo de cuenta'
                                style={{fontSize:15}}
                                value={this.state.tipo}
                                onChangeText={text=>this.setState({tipo:text})}
                            ></Input>
                        </View>
                    </View>
                    <View style={styles.monto}>
                        <View style={styles.input}>
                            <Icon
                                name='clipboard'
                                style={{color:'red', fontSize:25}}
                            />
                            <Input placeholder='Número de cuenta'
                                style={{fontSize:15}}
                                value={this.state.cuenta}
                                onChangeText={text=>this.setState({cuenta:text})}
                            ></Input>
                        </View>
                    </View>
                </View>
                <View style={styles.barra_titulo}>
                    <View style={{justifyContent:'center'}}>
                        <Text style={{textAlign:'center',color:'white',fontSize:20}}>Dirección de PayPal</Text>
                    </View>
                </View>
                <View style={{justifyContent:"center",alignItems:'center', marginTop:alto*0.015}}>
                    <View style={this.state.match===''||this.state.match==='no'?styles.monto:styles.monto2}>
                        <View style={styles.input}>
                            <Icon
                                name='mail'
                                style={this.state.match===''||this.state.match==='no'?styles.icon:styles.icono}
                            />
                            <Input placeholder='Dirección de PayPal'
                                style={{fontSize:15}}
                                value={this.state.email}
                                onChangeText={text=>this.setState({
                                    email:text})}
                            ></Input>
                        </View>
                    </View>
                    <View style={this.state.match===''||this.state.match==='no'?styles.monto:styles.monto2}>
                        <View style={styles.input}>
                            <Icon
                                name='mail'
                                style={this.state.match===''||this.state.match==='no'?styles.icon:styles.icono}
                            />
                            <Input placeholder='Confirme su dirección de PayPal'
                                style={{fontSize:15}}
                                value={this.state.mail}
                                onChangeText={text=>this.setState({
                                    mail:text})}
                            ></Input>
                        </View>
                    </View>
                </View>
                <View style={{alignItems:'center', width:ancho, marginTop:alto*0.09}}>
                    <View style={{justifyContent:'center'}}>
                        <TouchableHighlight onPress={()=>this.retiro()}>
                            <Button 
                                rounded 
                                onPress={()=>this.retiro()}
                                style={styles.bot}>
                                    <Text>Guardar</Text>
                            </Button>
                        </TouchableHighlight>
                    </View>    
                </View>
            </View>
        </ScrollView>
      </Container>
    );
  }
}

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const styles = StyleSheet.create({
    monto: {
        width: ancho*0.9,
        height: alto*0.06,
        borderRadius: 20,
        borderWidth:1,
        borderColor:'red',
        alignItems:'center',
        justifyContent: 'center',
        marginTop:alto*0.01
    },
    monto2: {
        width: ancho*0.9,
        height: alto*0.06,
        borderRadius: 20,
        borderWidth:1,
        borderColor:'green',
        alignItems:'center',
        justifyContent: 'center',
        marginTop:alto*0.01
    },
    input:{
        width: ancho*0.8,
        height: alto*0.08,
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'space-between'
    },
    icon:{
        color:'red', 
        fontSize:25
    },
    icono:{
        color:'green', 
        fontSize:25
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
        backgroundColor: '#818181',
        borderBottomLeftRadius:25,
        borderBottomRightRadius:25,
        width: ancho,
        height: alto*0.05,
        marginTop:alto*0.009
    },
    red: {
        color: '#E84546',
        fontSize:20
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