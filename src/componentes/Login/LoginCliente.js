import React from "react";
import { StatusBar, Keyboard,StyleSheet, Dimensions, TouchableHighlight, AsyncStorage, Image, PermissionsAndroid } from "react-native";
import { Header, Container,Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Form, Item, Input, Spinner } from "native-base";
import HomeScreen from '../../HomeScreen/index'
import Registro from '../../Registro'
import {createAppContainer, createStackNavigator, withNavigationFocus} from 'react-navigation'
import store from '../../redux/store'
import Mensaje from '../Modals/Mensajes'
import {  createId,createToken, setLocation } from "../../redux/actions";
import {server, socket} from '../Api'
import NetInfo from '@react-native-community/netinfo'
import Password from "./Password";

class Login extends React.Component {
    static navigatorStyle={
        disabledBackGesture:true
    }

  constructor(){
    super()
    this.state={
      estatus: false,
      login_btn: false,
      visible:false,
      mensaje:'',
      conexion:'',
      ver:false
    }
    this.setmensaje=this.setmensaje.bind(this)
    this.hasLocationPermission()
  }
  static navigationOptions = {
    header:null
}
async hasLocationPermission() {
    try{
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
          title: 'Permiso para usar GPS',
          message:'Apolo Taxi requiere que autorices'+
          'el uso del GPS del dispositivo',
          buttonNegative:'Cancel',
          buttonPositive:'OK'
        }
      )
      if(granted===PermissionsAndroid.RESULTS.GRANTED){
        return true
      }
      else{
        return false
      }   
    }
    catch(error){
      return false
    }
}
async componentWillMount() {
    this.setState({ isReady: true });
    this.getUserId().then(response => {
      if(response.userId && response.token) {
          this.setState({token:response.token})
          store.dispatch(createToken(response.token)) 
          store.dispatch(createId(response.userId))
          this.validar()
      }else{
        this.setState({token:'no'})
      }
    })
  }

    getUserId = async () => {
        let data = {
            userId: '',
            token: ''
        };
        try {
            data.userId = await AsyncStorage.getItem('userId') || null;
            data.token = await AsyncStorage.getItem('token') || null;
        } catch (error) {
        // Error retrieving data
            console.log(error.message);
        }
        return data;
    }
  
    componentDidMount(){
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

    componentDidUpdate(prevProps){
        if(this.props.isFocused===true&&store.getState().location==='Login'){
            this.validar()
        }
    }

    validar(){
        if(this.state.conexion==='conectado'){
            fetch(server + '/chofer/validar', {
                method:'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    'authorization': 'Bearer '+store.getState().token.toString()
                }
            })
            .then((response)=>{
                let data = JSON.parse(response._bodyText)
                if(data.status.toString()==='denied'){
                    this.setState({
                        token:'no'
                    })
                }
                else{
                    this.setState({
                        token:store.getState().token.toString()
                    })
                    this.props.navigation.navigate('Home')
                    store.dispatch(setLocation('Home'))
                }
            })
            .catch(error=>alert(error))
        }
    }

  setmensaje(data){
      this.setState({visible:data})
  }

  inicio () {
    return <Button
    onPress={()=>{
        Keyboard.dismiss()
        if(this.state.conexion==='conectado'){
            this.setState({login_btn: true})
            fetch(server + '/chofer/login', {
                method:'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    telefono:this.state.telefono,
                    password: this.state.password
                })
            })
            .then((response)=>{
                let data = response._bodyText
                data = JSON.parse(data)
                this.setState({login_btn: false})
                if(data.status.toString()=='denied'){
                    this.setState({
                        visible:true,
                        mensaje:data.message
                    })
                }
                else{
                    AsyncStorage.setItem('token',data.token)
                    AsyncStorage.setItem('userId',data.id)
                    AsyncStorage.setItem('location','Home')
                    store.dispatch(createToken(data.token))
                    store.dispatch(createId(data.id))
                    store.dispatch(setLocation('Home'))
                    this.setState({
                        telefono:'',
                        password:''
                    })
                    this.props.navigation.navigate('Home')
                    store.dispatch(setLocation('Home'))
                }
            })
            .catch(error=>{
                this.setState({login_btn: false})
                alert(error)
            })
        }
    }}
    style={this.state.login_btn?[styles.btn_cargando, styles.boton]:[styles.btn, styles.boton]}
    disabled={this.state.login_btn? true:false}
    >
    <Spinner color='#fff' style={this.state.login_btn?styles.cargando:styles.nocargando}/>
    <Text style={{fontSize: 12, margin: 0, color:'white'}}>
        Iniciar Sesión
    </Text>
</Button>
  }
    render() {
        if(!this.state.isReady){
            return null
        }
        if(this.state.token==='no'){
            return (
            <Container>
                <Header style={styles.header}>
                        <Title style={{color:'white'}}>Iniciar Sesión</Title>
                </Header>
                <Content style={style.fondo}>
                <Mensaje visible={this.state.visible} mensaje={this.state.mensaje} setmensaje={this.setmensaje}/>
                    <View>
                        <Image
                            resizeMode= 'contain'
                            style={styles.logo}
                            source={require('../../assets/images/logo.png')}
                        />
                        <View>
                            <View style={style.content}>
                                <Icon style={{color: '#E84546', paddingLeft: 10 }} name='call' />
                                <Input placeholder='Numero Movil' 
                                    value={this.state.telefono}
                                    keyboardType='numeric'
                                    maxLength={10}
                                    onChangeText={(text)=>{this.setState({telefono:text})}}/>
                            </View>
                            <View style={style.content}>
                                <Icon style={{color: '#E84546', paddingLeft: 10 }} name='lock' />
                                <Input  placeholder='Contraseña'
                                    secureTextEntry={!this.state.ver}
                                    value={this.state.password}
                                    onChangeText={(text)=>{this.setState({password:text})}}
                                >
                                </Input>
                                <Icon style={{color: '#E84546', paddingLeft: 10 }} name={this.state.ver?'eye-off':'eye'} 
                                    onPress={()=>this.setState({ver:!this.state.ver})}
                                />
                            </View>
                        </View>
                        {/* <View style={{justifyContent:'center'}}>
                            <Text style={{color: '#E84546', textAlign:'center',fontSize: 12}}>Se te olvido tu Contraseña?</Text>
                        </View> */}
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', margin:20}}>
                            <Button 
                                style={this.state.login_btn?[styles.btn_cargando, styles.boton]:[styles.btn, styles.boton]}
                                disabled={this.state.login_btn? true:false}
                                onPress={()=>this.props.navigation.navigate('Registro')}
                            >
                                <Text style={{fontSize: 12, margin: 0}}>Registrarse</Text>
                            </Button>
                            {this.inicio()}
                        </View>
                        <View style={{justifyContent:'center'}}>
                            <TouchableHighlight underlayColor='transparent'
                                onPress={()=>this.props.navigation.navigate('Password')}
                            >
                                <Text style={{textAlign:'center', color:'#E84546', fontWeight:'bold'}}>¿Olvido su contraseña?</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Content>
            </Container>
            );
        }
        else{
            return (
                <View style={estilo.vista}>
                    <Spinner color='red' style={estilo.cargando}/>
                </View>
            )
        }
    }
}

const appNavigator = createStackNavigator(
    {
    Login:withNavigationFocus(Login),
    Password:Password,
    Home: HomeScreen,
    Registro: Registro
    },
    {
        headerMode:"none",
        navigationOptions:{
            headerVisible:false,
        },
        defaultNavigationOptions:{
            gesturesEnabled:false,
        },
    } 
)

export default createAppContainer(appNavigator)

const alto =  Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const estilo = StyleSheet.create({
  cargando:{
    fontSize:100,
    width:ancho*0.3,
    height:alto*0.3
  },
  vista:{
    width:ancho,
    height:alto,
    alignItems:'center',
    justifyContent:'center'
  }
})

const styles = StyleSheet.create({
    cargando:{
        marginLeft: 0,
        width:20,
        height: 20,
        fontSize: 10
    },
    nocargando:{
        display: 'none'
    },
    btn:{
        width:ancho*0.40,
        justifyContent:'center'
    },
    btn_cargando: {
        width:ancho*0.40
    },
    boton: {
        backgroundColor: '#E84546',
        borderRadius: 25,
        height: 35,
        fontSize: 10,
        padding: 5
    },
    logo:{
        width: Dimensions.get('window').width,
        height: 150
    },
    header:{
        backgroundColor: '#E84546',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'red'
    }
   });

   const style = StyleSheet.create({
    precio: {
        fontWeight: 'normal',
        color: '#E84546'
    },
    texto:{
        color: '#818181',
        fontSize: 12,
        fontWeight: 'normal'
    },
    costo: {
        color: '#818181',
        fontWeight: 'bold',
        textAlign: 'right'
    },
    view:{
        margin: 0
    },
    text: {
        color:'white'
    },
    titulo:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        backgroundColor: '#E84546',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        
    },
    fondo:{
        marginBottom: -1,
        margin:0,
        marginHorizontal: 0,
        backgroundColor:'#FFFFFF',
        height: Dimensions.get('window').height,
        width:Dimensions.get('window').width + 1
    },
    content:{
        flex: 1,
        paddingLeft: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        height:50,
        paddingHorizontal: 20,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 5,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 25,
        backgroundColor: '#fff'
    }
})