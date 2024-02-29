import React from "react";
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight, AsyncStorage, Image, PermissionsAndroid } from "react-native";
import { Header, Container,Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Form, Item, Input, Spinner } from "native-base";
import HomeScreen from '../../HomeScreen/index'
import Registro from '../../Registro'
import {createAppContainer, createStackNavigator, withNavigationFocus} from 'react-navigation'
import store from '../../redux/store'
import Mensaje from '../Modals/Mensajes'
import {  createId,createToken, setLocation } from "../../redux/actions";
import {server, socket} from '../Api'
import Cargando from "../Modals/Cargando";


export default class Password extends React.Component {
  constructor(){
    super()
    this.state={
      estatus: false,
      login_btn: false,
      visible:false,
      mensaje:'',
      email:'',
      loading:false,
      codigo:'',
      password:'',
      pass:'',
      setPass:false,
      setCodigo:false,
      id:''
    }
    this.setmensaje=this.setmensaje.bind(this)
  }
  static navigationOptions = {
    header:null
}

    recuperar(){
        fetch(server + '/chofer/password/'+this.state.email, {
            method:'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
            }
        })
        .then(response=>{
            let data = JSON.parse(response._bodyText)
            if(data.status.toString()==='denied'){
                this.setState({
                    mensaje:'No existe el usuario con el correo '+this.state.email,
                    visible:true,
                    loading:false,
                    email:''
                })
            }
            else{
                this.setState({
                    mensaje:'Se ha enviado un correo con el codigo para cambiar su contraseña, ingreselo en el campo necesario.',
                    visible:true,
                    loading:false,
                    setCodigo:true,
                    email:'',
                    id:data._id
                })
            }
        })
        .catch(error=>this.setState({loading:false},alert(error)))
    }

    validar(){
        fetch(server + '/chofer/validar/', {
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                _id:this.state.id,
                codigo:this.state.codigo
            })
        })
        .then(response=>{
            let data = JSON.parse(response._bodyText)
            if(data.status.toString()==='denied'){
                this.setState({
                    mensaje:'Codigo invalido, por favor intente nuevamente',
                    visible:true,
                    loading:false,
                    setCodigo:false,
                    codigo:''
                })
            }
            else{
                this.setState({
                    mensaje:'Codigo verificado exitosamente',
                    visible:true,
                    loading:false,
                    setCodigo:false,
                    setPass:true,
                    codigo:''
                })
            }
        })
        .catch(error=>this.setState({loading:false},alert(error)))
    }

    guardar(){
        fetch(server + '/chofer/password/', {
            method:'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                _id:this.state.id,
                password:this.state.password
            })
        })
        .then(res=>{
            res=JSON.parse(res._bodyText)
            if(res.status.toString()==='success'){
                this.setState({
                    loading:false,
                    mensaje:'Su contraseña se ha actualizado exitosamente',
                    visible:true,
                    setPass:false,
                    pass:'',
                    password:''
                })
            }else{
                this.setState({
                    loading:false,
                    mensaje:'Ha ocurrido un error, intente nuevamente',
                    visible:true,
                    setPass:false,
                    pass:'',
                    password:''
                })
            }
        })
        .catch(erro=>(this.setState({loading:false}),alert(error)))
    }

    setmensaje(data){
        this.setState({visible:data})
    }

  
    render() {
        return (
            <Container>
                <Header style={styles.header}>
                        <Title style={{color:'white'}}>Recuperar Contraseña</Title>
                </Header>
                <Content style={style.fondo}>
                <Mensaje visible={this.state.visible} mensaje={this.state.mensaje} setmensaje={this.setmensaje}/>
                <Cargando visible={this.state.loading}/>
                    <View>
                        <View>
                            <Text style={{textAlign:'center', marginTop:30}}>
                            Ingrese el correo electronico que uso para registrarse y le enviaremos un codigo que le servira para cambiar su contraseña
                            </Text>
                        </View>
                        <View style={{marginTop:40}}>
                            {!this.state.setCodigo&&!this.state.setPass?
                            <View style={style.content}>
                                <Icon style={{color: '#E84546', paddingLeft: 10 }} name='mail' />
                                <Input placeholder='Correo' 
                                    value={this.state.email}
                                    keyboardType='email-address'
                                    onChangeText={(text)=>{this.setState({email:text})}}/>
                            </View>:null}
                            {this.state.setCodigo?
                                <View style={style.content}>
                                    <Icon style={{color: '#E84546', paddingLeft: 10 }} name='key' />
                                    <Input placeholder='Codigo' 
                                        value={this.state.codigo}
                                        keyboardType='numeric'
                                        maxLength={6}
                                        onChangeText={(text)=>{this.setState({codigo:text})}}/>
                                </View>:null
                            }
                            {this.state.setPass?
                                <View style={style.content}>
                                    <Icon style={{color: '#E84546', paddingLeft: 10 }} name='lock' />
                                    <Input placeholder='Contraseña' 
                                        value={this.state.password}
                                        onChangeText={text=>this.setState({password:text})}/>
                                </View>:null
                            }
                            {this.state.setPass?
                                <View style={style.content}>
                                    <Icon style={{color: '#E84546', paddingLeft: 10 }} name='lock' />
                                    <Input placeholder='Confirmar contraseña' 
                                        value={this.state.pass}
                                        onChangeText={text=>this.setState({pass:text})}/>
                                </View>:null
                            }
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', margin:20}}>
                            <Button 
                                style={this.state.login_btn?[styles.btn_cargando, styles.boton]:[styles.btn, styles.boton]}
                                disabled={this.state.login_btn? true:false}
                                onPress={()=>this.props.navigation.navigate('Login')}
                            >
                                <Text style={{fontSize: 12, margin: 0}}>Regresar</Text>
                            </Button>
                            <Button 
                                style={this.state.login_btn?[styles.btn_cargando, styles.boton]:[styles.btn, styles.boton]}
                                disabled={this.state.login_btn? true:false}
                                onPress={()=>this.setState({loading:true},()=>{
                                    if(!this.state.setCodigo&&!this.state.setPass){
                                        this.recuperar()
                                    }else if(this.state.setCodigo){
                                        if(this.state.codigo.length<6){
                                            this.setState({
                                                loading:false,
                                                mensaje:'Verifique que haya ingresado el codigo correctamente',
                                                visible:true
                                            })
                                        }else{
                                            this.validar()
                                        }
                                    }else{
                                        if(this.state.pass!==this.state.password||this.state.password==''||this.state.pass===''){
                                            this.setState({
                                                loading:false,
                                                mensaje:'Verifique que ha confirmado su contraseña',
                                                visible:true
                                            })
                                        }else{
                                            this.guardar()
                                        }
                                    }
                                })}
                            >
                                <Text style={{fontSize: 12, margin: 0}}>Aceptar</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

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
        width:Dimensions.get('window').width + 1,
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