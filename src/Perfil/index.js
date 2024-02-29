import React from "react";
import {withNavigationFocus} from 'react-navigation'
import { Linking, StyleSheet, Dimensions, TouchableHighlight, Platform, ScrollView, AsyncStorage, Image } from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Header, Row, Input } from "native-base";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Head from '../componentes/Header/Header.js'
import ImagenModal from '../componentes/Modals/Imagen'
import store from '../redux/store'
import {server,sock} from '../componentes/Api'
import {BackHandler, ToastAndroid} from 'react-native'
import Menu from '../componentes/Menu/Menu'
import Mensaje from '../componentes/Modals/Mensajes'
import { TextInput } from "react-native-gesture-handler";
import Cargando from '../componentes/Modals/Cargando'
import NetInfo from '@react-native-community/netinfo'
import { setLocation } from "../redux/actions.js";
import firebase from 'react-native-firebase'
import Confirmacion from '../componentes/Modals/Confirmacion'
import NavigationService from '../../NavigationService/NavigationService'
import Condiciones from "../componentes/Modals/Condiciones.js";
import Politicas from "../componentes/Modals/Politicas.js";

class Perfil extends React.Component{
    constructor(){
        super()
        this.state={
            loading: true,
            user:{},
            telefono:'',
            telf:'',
            pass:'',
            password:'',
            nombre:'',
            apellido:'',
            email:'',
            unidad:'',
            saldo:0,
            match:'',
            mensaje: '',
            iden:'',
            mostrarmensaje: false,
            valor:1,
            vaijes:1,
            imagen:null,
            visible:false,
            conexion:'',
            registrarse_btn:false,
            confirmar_btn:false,
            mostrarconfirmar:false,
            confirmResult:null,
            cont:30,
            conditions:false,
            polit:false
        }
        this.changePage = this.changePage.bind(this)
        this.setmensaje = this.setmensaje.bind(this)
        this.abrirModal=this.abrirModal.bind(this)
        this.getDatos = this.getDatos.bind(this)
        this.cerrar=this.cerrar.bind(this)
        this.setcodigo=this.setcodigo.bind(this)
        this.confirmar=this.confirmar.bind(this)
        this.cerrarTerminos=this.cerrarTerminos.bind(this)
        this.cerrarPoliticas=this.cerrarPoliticas.bind(this)
    }

    setmensaje(data) {
        this.setState({mostrarmensaje: data})
    }

    shouldComponentUpdate(nextProps, nextState){
        if((nextState.password!==this.state.password &&
            nextState.password===''&&this.state.pass==='')||(
            nextState.pass!==this.state.pass &&
            nextState.pass===''&&this.state.password===''
            )){
            this.setState({
                match:''
            })
            return true
        }

        if((nextState.pass!=='' && 
            this.state.pass!== nextState.pass && 
            nextState.pass.length===1)||(
            this.state.pass!== nextState.pass && 
            nextState.pass.length===this.state.password.length+1)||(
            this.state.pass!== nextState.pass && 
            nextState.pass.length===this.state.password.length-1)
            ){
            this.setState({
                match:'no'
            })
            return true
        }
        if(this.state.pass!==nextState.pass && nextState.pass===this.state.password){
           
            this.setState({
                match:'si'
            })
            return true
        }
        return true
    }

    changePage(data){
        this.props.navigation.navigate(data)
    }
    componentDidUpdate(prevProps) {
        if(this.props.isFocused !== prevProps.isFocused&&this.props.isFocused===true){
            this.getDatos()
            store.dispatch(setLocation('Perfil'))
            BackHandler.addEventListener('hardwareBackPress',this.handleBackPress)
        }
        if(this.props.isFocused !== prevProps.isFocused&&!this.props.isFocused){
            BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress)
        } 
    }

    componentDidMount(){
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
        BackHandler.addEventListener('hardwareBackPress',this.handleBackPress)
    }

    componentWillUnmount(){
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        )
        BackHandler.removeEventListener('hardwareBackPress',this.handleBackPress)
    }
    
    handleBackPress(){
        if(store.getState().location==='Documentos'||store.getState().location==='Retiros'||
        store.getState().location==='Cuentas'||store.getState().location==='Vehiculos'||
        store.getState().location==='Historial'){
            NavigationService.navigate('Perfil')
            return true
        }
        if(store.getState().location==='Perfil'){
            NavigationService.navigate('Home')
            store.dispatch(setLocation('Home'))
            return true
        }
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

    guardar(){
        if(this.state.conexion==='conectado'){
            if(this.state.pass!==this.state.password){
    
            }else if(this.state.pass===''&&this.state.password===''){
                fetch(server + '/chofer/', {
                    method:'PUT',
                    headers:{
                        Accept: 'application/json',
                        'Content-Type':'application/json',
                        'Authorization': 'Bearer '+store.getState().token.toString()
                    },
                    body:JSON.stringify({
                        nombre:this.state.nombre,
                        apellido:this.state.apellido,
                        email:this.state.email,
                        identificacion:this.state.iden,
                        telefono:this.state.telefono
                    })
                })
                .then(res=>{
                    this.setState({
                        pass:'',
                        password:'',
                        mensaje: 'Se han guardado sus datos exitosamente'
                    })
                    
                    this.setmensaje(true)
                })
                .catch(error=>{
                    alert(error)
                })
            }
            else{
                fetch(server + '/chofer/', {
                    method:'PUT',
                    headers:{
                        Accept: 'application/json',
                        'Content-Type':'application/json',
                        'Authorization': 'Bearer '+store.getState().token.toString()
                    },
                    body:JSON.stringify({
                        nombre:this.state.nombre,
                        apellido:this.state.apellido,
                        email:this.state.email,
                        telefono:this.state.telefono,
                        password:this.state.password,
                        identificacion:this.state.iden
                    })
                })
                .then(res=>{
                    this.setState({
                        pass:'',
                        password:'',
                        loading: false,
                        mensaje: 'Se han guardado sus datos exitosamente'
                    })
                    this.setmensaje(true)
                })
                .catch(error=>{
                    this.setState({loading: false})
                    alert(error)
                })
            }
        }
    }

    estrellas(){
        let arr=[]
        for(let i=1; i<6; i++){
            if(i<=this.state.valor){
                arr.push(
                    <Icon key={'icon'+i} style={{fontSize: 20, color: '#E84546'}} name='star' />
                )
            }
            else{
                arr.push(<Icon key={'icon'+i} style={{fontSize: 20, color: '#E84546'}} name='star-outline' />)
            }
        }
        return arr
    }

    setcodigo(text) {
        this.setState({codigo: text})
    }

    confirmar () {
        this.setState({confirmar_btn: true})
        const { codigo, confirmResult } = this.state;
        if (confirmResult && this.state.codigo.length) {
          confirmResult.confirm(this.state.codigo)
            .then((user) => {
                this.setState({confirmar_btn: false, mostrarconfirmar:false});
                this.guardar()
            })
            .catch(error =>{ 
                this.setState({
                    confirmar_btn: false, 
                    mostrarmensaje:true, 
                    mensaje: `Codigo incorrecto, por favor verifica y intenta nuevamente` 
                })
            });
        }else{
            this.setState({mostrarmensaje:true, mensaje: `Informacion incompleta` })
        }
    }

    cerrar() {
        this.setState({mostrarconfirmar: false})
    }

    contar(){
        if(this.state.cont>0){
            let num = this.state.cont
            num--
            this.setState({
                cont:num, 
                mensaje: 'Espera mientras verificamos tu numero de telefono. '
                +'\n Tiempo restante para pasar a verificación manual '+num.toString()+' segundos'})
            setTimeout(()=>{
                this.contar()
            }
            ,1000)
        }
        else{
            this.setState({cont: 30})
            this.setState({mostrarmensaje:false})
        }
    }

    validartelefono(){
        this.setState({registrarse_btn: true})
        let tlf = ''
        if(this.state.telefono== '4123800046' || this.state.telefono== '4145010693') {
            tlf = '+58' + this.state.telefono
        }else{
            tlf = '+1' + this.state.telefono
        }
        firebase.auth().signInWithPhoneNumber(tlf)
        .then(confirmResult => {
            this.setState({ 
                registrarse_btn:false, 
                confirmResult: confirmResult, 
                mostrarconfirmar: true, 
                mostrarmensaje:true, 
                mensaje: 'Se te a enviado un codigo de verificacion!' 
            })
        })
        .catch(error => {
            this.setState({
            registrarse_btn:false, 
            mostrarmensaje:true, 
            mensaje: `Sign In With Phone Number Error: ${error.message}` 
        })
    });
    }

    validartelefono2() {
        this.setState({mostrarcargando:true})
        let tlf = ''
        if(this.state.telefono== '4123800046' || this.state.telefono== '4145010693') {
            tlf = '+58' + this.state.telefono
        }else{
            tlf = '+1' + this.state.telefono
        }
        firebase.auth()
            .verifyPhoneNumber(tlf, 15, false)
            .on('state_changed', (phoneAuthSnapshot) => {
                switch (phoneAuthSnapshot.state) {
                case firebase.auth.PhoneAuthState.CODE_SENT:
                    console.log('code sent');
                    this.contar()
                    this.setState({loading:false,mostrarmensaje: true, })
                    break;
                case firebase.auth.PhoneAuthState.ERROR: 
                    console.log('verification error');
                    this.setState({loading:false,mostrarmensaje: true, mensaje:phoneAuthSnapshot.error})
                    console.log(phoneAuthSnapshot.error);
                    break;
                case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: 
                    console.log('auto verify on android timed out');
                    this.setState({cont: 0})
                    this.validartelefono()
                    this.setState({loading:false})
                    break;
                case firebase.auth.PhoneAuthState.AUTO_VERIFIED: 
                    console.log('auto verified on android');
                    this.setState({loading:false,mostrarmensaje: true, mensaje: 'Hemos verificado tu numero exitosamente'})
                    this.guardar()
                    console.log(phoneAuthSnapshot);
                    break;
                }
            }, (error) => {
                console.log(error);
                this.setState({loading:false,mostrarmensaje: true, mensaje: error})
                console.log(error.verificationId);
            },(phoneAuthSnapshot) =>{
                this.setState({loading:false})
                console.log(phoneAuthSnapshot);
            });
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
                let sal = parseFloat(data.saldo)
                this.setState({
                    user:data,
                    nombre: data.nombre,
                    apellido:data.apellido,
                    email:data.email,
                    iden: data.identificacion,
                    loading: false,
                    unidad:data.unidad?data.unidad:'',
                    telefono:data.telefono?data.telefono:'',
                    telf:data.telefono?data.telefono:'',
                    saldo:sal.toFixed(0),
                    valor: Math.round(data.valor / data.viajes),
                    imagen:data.imagen?data.imagen:null
                })
            })
            .catch(error=>{
                this.setState({loading:false})
                alert(error)
            })
        }
    }

    replaceUri(imagen){
        let img = imagen
        if(img&&img.url){
            img.uri=sock+img.url
        }
        return img
    }

    renderImagen(){
        if(this.state.imagen===null||this.state.imagen.status!=='Aceptado'){
            return(
                <View style={style.icono}>
                    <Icon style={{fontSize: 100, color: '#fff',bottom:Platform.OS==='ios'?8:0}} name='contact' />
                </View>
            )
        }
        else{
            return(
                <View style={style.icono}>
                    <Image 
                        style={style.img} 
                        source={this.replaceUri(Platform.OS==='ios'?{...this.state.imagen}:this.state.imagen)} 
                    />
                </View>
            )
        }
    }

    abrirModal(data){
        this.setState({visible:data})
    }

    cerrarTerminos(data){
        this.setState({conditions:data})
    }

    cerrarPoliticas(data){
        this.setState({polit:data})
    }

    render()
        {
        if(this.state.loading) {
            return (<Cargando/>);
        }else{
            return (
                <Container>
                    <Head
                        changePage={this.changePage}
                        navigation={this.props.navigation}
                        token={store.getState().token}
                        name='Perfil'> 
                    </Head>
                    <ScrollView>
                    <Confirmacion confirmar_btn={this.state.confirmar_btn} cerrar={this.cerrar} setcodigo={this.setcodigo} confirmar={this.confirmar} visible={this.state.mostrarconfirmar}/>
                    <ImagenModal visible={this.state.visible} abrirModal={this.abrirModal} getDatos={this.getDatos} img ={this.state.imagen}/>
                    <Mensaje visible ={this.state.mostrarmensaje} mensaje={this.state.mensaje} setmensaje={this.setmensaje}/>
                    <Condiciones visible={this.state.conditions} cerrarTerminos={this.cerrarTerminos}/>
                    <Politicas visible={this.state.polit} cerrarPoliticas={this.cerrarPoliticas}/>
                        <View style={style.vista}>
                            <View style={style.caja}>
                                <View style={style.cont_btn}>
                                    <Text style={{fontSize: 20, color: '#636363'}}>RD$ 
                                    <Text style={{fontSize: 20, color: '#E83C3D'}}>{this.state.saldo?parseFloat(this.state.saldo).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                                    :0}</Text>
                                    </Text>
                                </View>
                                <TouchableHighlight underlayColor={'transparent'} 
                                    onPress={()=>{
                                        if(this.state.imagen===null||this.state.imagen.status!=='Pendiente'){
                                            this.abrirModal(true)}
                                        }}
                                >
                                    {this.renderImagen()}
                                </TouchableHighlight>
                                <View style={style.cont_btn}>
                                    <View style={style.estrellas}>
                                        {this.estrellas()}
                                    </View>
                                    {this.state.unidad!==''?
                                        <Text style={{color:'red', fontWeight:'bold'}}>
                                            Unidad:  
                                            <Text style={{color:'black'}}>
                                                {this.state.unidad}
                                            </Text>
                                        </Text>
                                    :null}
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop: 0}}>
                            <View>
                                <View style={estilo.detalles}>
                                    <Text style={{color:'white', textAlign:'center', fontSize:20}}>
                                        Detalles de perfil
                                    </Text>
                                </View>
                                <View style={{paddingLeft:Dimensions.get('window').width*0.02}}>
                                    <View style={estilo.item}>
                                        <Icon
                                            name='contact'
                                            style={{color:'#E84546'}}
                                        />
                                        <Input placeholder='Nombre' value={this.state.nombre}
                                            onChangeText={text=>{
                                                if(text.split(" ").length<3){
                                                    this.setState({nombre:text})
                                                }
                                            }}
                                        >
                                        </Input>
                                    </View>
                                    <View style={estilo.item}>
                                        <Icon
                                            name='contact'
                                            style={{color:'#E84546'}}
                                        />
                                        <Input placeholder='Apellido' value={this.state.apellido}
                                            onChangeText={text=>{
                                                if(text.split(" ").length<3){
                                                    this.setState({apellido:text})
                                                }
                                            }}
                                        >
                                        </Input>
                                    </View>
                                    <View style={estilo.item}>
                                        <Icon
                                            name='contact'
                                            style={{color:'#E84546'}}
                                        />
                                        <Input placeholder='Identificacion' value={this.state.iden}
                                            onChangeText={text=>this.setState({iden:text})}
                                        >
                                        </Input>
                                    </View>
                                    <View style={estilo.item}>
                                        <Icon
                                            name='ios-mail'
                                            style={{color:'#E84546'}}
                                        />
                                        <Input placeholder='Correo' value={this.state.email}
                                            onChangeText={text=>this.setState({email:text})}
                                        >
                                        </Input>
                                    </View>
                                    <View style={estilo.item}>
                                        <Icon
                                            name='call'
                                            style={{color:'#E84546'}}
                                        />
                                        <Input placeholder='Número de teléfono' value={this.state.telefono}
                                            onChangeText={text=>this.setState({telefono:text})}
                                        >
                                        </Input>
                                    </View>
                                    <View style={this.state.match!==''&&this.state.match==='no'?estilo.item:estilo.item2}>
                                        <Icon
                                            name='lock'
                                            style={this.state.match!==''&&this.state.match==='no'?style.iconu:style.icon}
                                        />
                                        <Input placeholder='Contraseña'
                                            onChangeText={text=>this.setState({password:text})}
                                        >
                                        </Input>
                                    </View>
                                    <View style={this.state.match!==''&&this.state.match==='no'?estilo.item:estilo.item2}>
                                        <Icon
                                            name='lock'
                                            style={this.state.match!==''&&this.state.match==='no'?style.iconu:style.icon}
                                        />
                                        <Input placeholder='Confirmar contraseña'
                                            onChangeText={text=>{
                                                this.setState({pass:text})
                                            }}
                                        >
                                        </Input>
                                    </View>
                                </View>
                                <View style={estilo.conf}>
                                    <Text style={{color:'white', textAlign:'center', fontSize:20}}>
                                        Configuracion
                                    </Text>
                                </View>
                                <View>
                                    <TouchableHighlight underlayColor="transparent"
                                        onPress={()=>{
                                            store.dispatch(setLocation('Documentos'))
                                            this.changePage('Documentos')}}
                                    >
                                        <View style={estilo.cong_item}>
                                            <View style={estilo.container}>
                                                <View style={estilo.left_item}>
                                                    <Icon
                                                        name='list'
                                                        style={{color:'red', marginRight: ancho*0.05}}
                                                    />
                                                    <Text numberOfLines={1} style={[estilo.conf_text,{width:ancho*0.6}]}>Documentos personales</Text>
                                                </View>
                                                <Icon
                                                    name='ios-arrow-forward'
                                                    style={{paddingLeft:Dimensions.get('window').width*0.3, color:'red', fontSize:20}}
                                                />
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor="transparent"
                                        onPress={()=>{
                                            store.dispatch(setLocation('Cuentas'))
                                            this.changePage('Cuentas')}}
                                    >
                                        <View style={estilo.cong_item}>
                                            <View style={estilo.container}>
                                                <View style={estilo.left_item}>
                                                    <Icon
                                                        name='wallet'
                                                        style={{color:'red', marginRight: ancho*0.05}}
                                                    />
                                                    <Text style={estilo.conf_text}>Cuentas</Text>
                                                </View>
                                                <Icon
                                                    name='ios-arrow-forward'
                                                    style={{paddingLeft:Dimensions.get('window').width*0.3, color:'red', fontSize:20}}
                                                />
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        underlayColor="transparent" 
                                        onPress={()=>{
                                            store.dispatch(setLocation('Retiros'))
                                            this.changePage('Retiros')}}
                                    >
                                        <View style={estilo.cong_item}>
                                            <View style={estilo.container}>
                                                <View style={estilo.left_item}>
                                                    <Icon
                                                        name='cash'
                                                        style={{color:'red', marginRight: ancho*0.05}}
                                                    />
                                                    <Text style={estilo.conf_text}>Retiros</Text>
                                                </View>
                                                <Icon
                                                    name='ios-arrow-forward'
                                                    style={{paddingLeft:Dimensions.get('window').width*0.3, color:'red', fontSize:20}}
                                                />
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                    {/* <View style={estilo.cong_item}>
                                        <View style={estilo.container}>
                                            <View style={estilo.left_item}>
                                                <Icon
                                                    name='globe'
                                                    style={{color:'red', marginRight:ancho*0.05}}
                                                />
                                                <Text style={estilo.conf_text}>Seleccionar Idioma</Text>
                                            </View>
                                            <Icon
                                                name='ios-arrow-forward'
                                                style={{paddingLeft:Dimensions.get('window').width*0.3, color:'red', fontSize:20}}
                                            />
                                        </View>
                                    </View> */}
                                    {/* <View style={estilo.cong_item}>
                                        <View style={estilo.container}>
                                            <View style={estilo.left_item}>
                                                <Icon
                                                    name='people'
                                                    style={{color:'red', marginRight:ancho*0.05}}
                                                />
                                                <Text style={estilo.conf_text}>Invitar amigos</Text>
                                            </View>
                                            <Icon
                                                name='ios-arrow-forward'
                                                style={{paddingLeft:Dimensions.get('window').width*0.3, color:'red', fontSize:20}}
                                            />
                                        </View>
                                    </View> */}
                                    <TouchableHighlight 
                                        underlayColor="transparent"
                                        onPress={()=>{
                                            store.dispatch(setLocation('Vehiculos'))
                                            this.changePage('Vehiculos')}}>
                                        <View style={estilo.cong_item}>
                                            <View style={estilo.container}>
                                                <View style={estilo.left_item}>
                                                    <Icon
                                                        name='car'
                                                        style={{color:'red', marginRight:ancho*0.05}}
                                                    />
                                                    <Text style={estilo.conf_text}>Detalles del Taxi</Text>
                                                </View>
                                                <Icon
                                                    name='ios-arrow-forward'
                                                    style={{paddingLeft:Dimensions.get('window').width*0.3, color:'red', fontSize:20}}
                                                />
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={()=>{
                                        store.dispatch(setLocation('Historial'))
                                        this.changePage('Historial')}
                                    }>
                                        <View style={estilo.cong_item}>
                                            <View style={estilo.container}>
                                                <View style={estilo.left_item}>
                                                    <Icon
                                                        name='folder-open'
                                                        style={{color:'red', marginRight:ancho*0.05}}
                                                    />
                                                    <Text style={estilo.conf_text}>Historial de Viajes</Text>
                                                </View>
                                                <Icon
                                                    name='ios-arrow-forward'
                                                    style={{paddingLeft:Dimensions.get('window').width*0.3, color:'red', fontSize:20}}
                                                />
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight 
                                        underlayColor='transparent'
                                        onPress={()=>Linking.openURL('mailto:soporte@appolotaxi.com')}
                                    >
                                        <View style={estilo.cong_item}>
                                            <View style={estilo.container}>
                                                <View style={estilo.left_item}>
                                                    <Icon
                                                        name='help-buoy'
                                                        style={{color:'red', marginRight:ancho*0.05}}
                                                    />
                                                    <Text style={estilo.conf_text}>Soporte</Text>
                                                </View>
                                                <Icon
                                                    name='ios-arrow-forward'
                                                    style={{paddingLeft:Dimensions.get('window').width*0.3, color:'red', fontSize:20}}
                                                />
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight 
                                        underlayColor='transparent'
                                        onPress={()=>this.setState({conditions:true})}
                                    >
                                        <View style={estilo.cong_item}>
                                            <View style={estilo.container}>
                                                <View style={estilo.left_item}>
                                                    <Icon
                                                        name='paper'
                                                        style={{color:'red', marginRight:ancho*0.05}}
                                                    />
                                                    <Text numberOfLines={1} style={[estilo.conf_text,{width:ancho*0.6}]}>Términos y Condiciones</Text>
                                                </View>
                                                <Icon
                                                    name='ios-arrow-forward'
                                                    style={{paddingLeft:Dimensions.get('window').width*0.3, color:'red', fontSize:20}}
                                                />
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight 
                                        underlayColor='transparent'
                                        onPress={()=>this.setState({polit:true})}
                                    >
                                        <View style={estilo.cong_item}>
                                            <View style={estilo.container}>
                                                <View style={estilo.left_item}>
                                                    <Icon
                                                        name='list'
                                                        style={{color:'red', marginRight:ancho*0.05}}
                                                    />
                                                    <Text style={estilo.conf_text}>Políticas de seguridad</Text>
                                                </View>
                                                <Icon
                                                    name='ios-arrow-forward'
                                                    style={{paddingLeft:Dimensions.get('window').width*0.3, color:'red', fontSize:20}}
                                                />
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                <TouchableHighlight
                                    underlayColor={'transparent'}
                                    onPress={()=>{
                                        if(this.state.telf!==this.state.telefono){
                                            this.setState({loading:true},this.validartelefono2())
                                        }else{
                                            this.setState({loading:true},this.guardar())
                                        }
                                    }}
                                >
                                    <View style={{alignSelf:'center', marginTop:5,marginBottom:5}}>
                                        <Button
                                            onPress={()=>{
                                                if(this.state.telf!==this.state.telefono){
                                                    this.setState({loading:true},this.validartelefono2())
                                                }else{
                                                    this.setState({loading:true},this.guardar())
                                                }
                                            }}
                                            style={{justifyContent:'center', width:Dimensions.get('window').width*0.95}}
                                            dark
                                            rounded
                                        >
                                            <Text style={{textAlign:'center'}}>Guardar</Text>
                                        </Button>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </ScrollView>
                </Container>
            )
        }
    }
}

export default withNavigationFocus(Perfil)
const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const style = StyleSheet.create({
    estrellas: {
        flexDirection: 'row'
    },
    icono:{
        marginBottom: 45,
        borderWidth: 0,
        borderColor: '#676767',
        borderRadius: 84,
        backgroundColor: '#676767',
        width:84,
        height:84,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img:{
        width:84,
        height:84,
        borderRadius:Platform.OS==='ios'?40:84
    },
    cont_btn:{
        justifyContent: 'center',
         alignItems: 'center'
    },
    vista: {
        alignItems: 'center',
        margin: 0,
        flex: 1,
        backgroundColor: '#00000000',
        marginTop: 30,
        marginBottom: 30,
    },
    icon:{
        color:'green'
    },
    iconu:{
        color:'#E84546'
    },  
    caja: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 25,
        backgroundColor: '#fff',
        width: ancho - 30,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
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
        flexDirection:'row', 
        height:alto*0.05,
        width:ancho*0.95,
        borderRadius:50,
        alignItems:'center',
        justifyContent:'center'
    },
    item2:{
        paddingLeft:10,
        marginVertical:5,
        borderWidth:1,
        borderColor:'green', 
        flexDirection:'row', 
        height:alto*0.05,
        width:ancho*0.95,
        borderRadius:50,
        alignItems:'center',
        justifyContent:'center'
    },
    conf:{
        height:alto*0.05,
        backgroundColor:'#818181', 
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20, 
        justifyContent:'center'
    },
    left_item:{
        flexDirection:'row',
        justifyContent:'flex-start',
        width:ancho*0.5,
        alignItems:'center'
    },  
    cong_item:{
        marginVertical:alto*0.005,
        backgroundColor:'#e9e9e9', 
        borderBottomRightRadius:25, 
        borderTopRightRadius:25,
        height:alto*0.04,
        width:ancho*0.95,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    },
    container:{
        height:alto*0.04,
        width:ancho*0.88,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row'
    },  
    conf_text:{
        color:'#838383'
    }
})