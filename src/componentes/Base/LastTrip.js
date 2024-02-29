import React, { Component} from 'react'
import { View, StyleSheet, Dimensions, AsyncStorage } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, List } from "native-base";
import {server} from '../Api'
import store from '../../redux/store'
import {withNavigationFocus} from 'react-navigation'
import { createToken } from '../../redux/actions';
import NetInfo from '@react-native-community/netinfo'
import Mensaje from '../Modals/Mensajes'
class LastTrip extends Component{
    constructor(){
        super()
        this.state={
            ultimos:[],
            ready:false,
            mensaje:'',
            visible:false,
            conexion:''
        }
        this.setmensaje=this.setmensaje.bind(this)
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
        this.setState({ready:true})
        this.getLastViajes()
    }

    componentDidUpdate(prevProps){
        if(this.props.isFocused!==prevProps.isFocused&&this.props.isFocused===true){
            this.getLastViajes()
        }
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

    lisViajes(){
        if(this.state.ultimos.length===0){
            return(
                null
            )
        }
        else{
            return(
                <List
                    dataArray={this.state.ultimos}
                    renderRow={data=>{
                        return(
                            <View style={style.content}>
                                <View style={{flexDirection:'row'}}>
                                    {data.val_cli!=='undefined'?this.valoracion(data.val_cli):this.valoracion(0)}
                                </View>
                                <View >
                                    <Text style={style.costo}>
                                        RD$
                                         <Text style={style.precio}> 
                                         {data.costo!==undefined?data.costo.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'):''}
                                        </Text>
                                    </Text>
                                    <Text style={style.texto}>{data.estatus}</Text>
                                </View>
                            </View>
                        )
                    }}
                />
            )
        }
    }

    getLastViajes(){
        if(this.state.conexion==='conectado'||this.props.conexion==='conectado'){
            if(this.props.token!==null||store.getState().token===''){
                let token = store.getState().token?store.getState().token.toString():this.props.token.toString()
                fetch(server + '/reserva/driver', {
                method:'GET',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '+token
                }
                })
                .then(res=>{
                    let data = JSON.parse(res._bodyInit)
                    let arr=[]
                    if(data.length>0){
                        for(let i = 0; i<data.length; i++){
                            if(data[i].estatus==='Terminado'){
                                arr.push(data[i])
                            }
                        }
                        if(arr.length>1){
                            let vec = []
                            vec.push(arr[0])
                            vec.push(arr[1])
                            if(this.state.ready){
                                this.setState({
                                    ultimos:vec
                                })
                            }
                            else{
                                this.state={
                                    ultimos:vec
                                }
                            }
                        }
                    }
                })
                .catch(error=>alert(error))
            }
        }
    }

    valoracion(numero){
        numero=Math.round(numero)
        let arr=[]
        for(let i = 0; i<5;i++){
            if(i<=numero){
                arr.push(<Icon key={'icon'+i} style={{fontSize: 20, color: '#E84546'}} name='star' />)
            }
            else{
                arr.push(<Icon key={'icon'+i} style={{fontSize: 20, color: '#E84546'}} name='star-outline' />)
            }
        }
        return arr
    }

    render(){
        if(this.state.ultimos.length===0){
            return(
                <View></View>
            )
        }
        else{
            return(
                <View style={style.view}>
                <Mensaje 
                    visible={this.state.visible} 
                    mensaje={this.state.mensaje} 
                    setmensaje={this.setmensaje}
                />
                    <Card style={style.fondo}>
                        <View style={style.titulo}>
                            <Text style={style.text}>
                                {this.state.ultimos.length>0?'Ultimos 2 viajes':''}
                            </Text>
                        </View>
                        {this.lisViajes()}
                    </Card>
                </View>
            )
        }
    }
}

export default withNavigationFocus(LastTrip)

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
        height: 170,
        width:Dimensions.get('window').width + 1
    },
    content:{
        flex: 1,
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
        backgroundColor: '#D6D6D6'
    }
})