import React from "react";
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight, Platform, ScrollView, Image, NativeModules } from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Header, Row, Input } from "native-base";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Head from '../componentes/Header/Header.js'
import store from '../redux/store'
import {BackHandler, ToastAndroid} from 'react-native'
import Menu from '../componentes/Menu/Menu'
import ImagePicker from 'react-native-image-crop-picker'
import {withNavigationFocus} from 'react-navigation'
import Mensaje from '../componentes/Modals/Mensajes'
import Cargando from '../componentes/Modals/Cargando'
import {server, sock} from '../componentes/Api'
import ImageCropPicker from "react-native-image-crop-picker"
import NetInfo from '@react-native-community/netinfo'
class Documentos extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            filePath: {},
            id:'',
            mensaje: '',
            actualizar: false,
            mostrarmensaje: false,
            images:[],
            ident:null,
            licen:null,
            matricula:null,
            seguro:null,
            visible:false,
            editar:true,
            conexion:''
        }
        this.changePage = this.changePage.bind(this)
        this.setmensaje = this.setmensaje.bind(this)
        this.pickSingleWithCamera = this.pickSingleWithCamera.bind(this)
        this.getVehiculo()
    }

    setmensaje(data) {
        this.setState({mostrarmensaje: data})
    }
    changePage(data){
        this.props.navigation.navigate(data)
    }
    
    componentDidMount(){
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
          )
            
          NetInfo.isConnected.fetch().done(isConnected=>{
            if(isConnected===true){
                this.setState({conexion:'conectado',loading:false})
                this.getVehiculo()
            }
            else{
                this.setState({conexion:'desconectado',loading:false})
            }
        }) 
    }

    componentDidUpdate(prevProps){
        if(this.props.isFocused!==prevProps.isFocused){
            this.getVehiculo()
        }
    }

    componentWillUnmount() {
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

    pickSingleWithCamera(estado) {
        switch(estado){
            case 'images':
            break
            case 'ident':
                ImageCropPicker.openCamera({
                    cropping: true,
                })
                .then(image => {
                    this.setState({
                        ident:{ uri: image.path, width: image.width, height: image.height, mime: image.mime, status:'check'}
                    })
                })
                .catch(e => alert(e))
            break
            case 'licen':
                ImageCropPicker.openCamera({
                    cropping: true,
                })
                .then(image => {
                    this.setState({
                        licen:{ uri: image.path, width: image.width, height: image.height, mime: image.mime, status:'check'}
                    })
                })
                .catch(e => alert(e))
            break
            case 'matricula':
                ImageCropPicker.openCamera({
                    cropping: true,
                })
                .then(image => {
                    this.setState({
                        matricula:{ uri: image.path, width: image.width, height: image.height, mime: image.mime, status:'check'}
                    })
                })
                .catch(e => alert(e))
            break
            case 'seguro':
                ImageCropPicker.openCamera({
                    cropping: true,
                })
                .then(image => {
                    this.setState({
                        seguro:{ uri: image.path, width: image.width, height: image.height, mime: image.mime, status:'check'}
                    })
                })
                .catch(e => alert(e))
            break
            default:
        }
    }
    chooseFile(estado){
        switch(estado){
            case 'ident':
                ImagePicker.openPicker({
                    waitAnimationEnd:true,
                })
                .then(image => {
                    this.setState({
                        ident:{ uri: image.path, width: image.width, height: image.height, mime: image.mime, status:'check'}
                    })
                })
                .catch(error=>alert(error))
            break
            case 'licen':
                ImagePicker.openPicker({
                    waitAnimationEnd:true,
                })
                .then(image => {
                    this.setState({
                        licen:{ uri: image.path, width: image.width, height: image.height, mime: image.mime, status:'check'}
                    })
                })
                .catch(error=>alert(error))
            break
            case 'matricula':
                ImagePicker.openPicker({
                    waitAnimationEnd:true,
                })
                .then(image => {
                    this.setState({
                        matricula:{ uri: image.path, width: image.width, height: image.height, mime: image.mime, status:'check'}
                    })
                })
                .catch(error=>alert(error))
            break
            case 'seguro':
                ImagePicker.openPicker({
                    waitAnimationEnd:true,
                })
                .then(image => {
                    this.setState({
                        seguro:{ uri: image.path, width: image.width, height: image.height, mime: image.mime, status:'check'}
                    })
                })
                .catch(error=>alert(error))
            break
            default:
        }
    }

    saveDocuments(){
        if(this.state.seguro!==null||this.state.matricula!==null||this.state.ident!==null||this.state.licen!==null){
            if((this.state.ident!==null&this.state.ident.status!==null&&
            (this.state.ident.status==='Rechazado'||
            this.state.ident.status==='check'))||
            (this.state.licen!==null&&this.state.licen.status!==null&&
            (this.state.licen.status==='Rechazado'||
            this.state.licen.status==='check'))||
            (this.state.matricula!==null&&this.state.matricula.status!==null&&
            (this.state.matricula.status==='Rechazado'||
            this.state.matricula.status==='check'))||
            (this.state.seguro!==null&&this.state.seguro.status!==null&&
            (this.state.seguro.status==='Rechazado'||
            this.state.seguro.status==='check'))
            ){
                this.setState({visible:true})
                const data = new FormData()
                    if(this.state.matricula){
                        data.append('matricula',{
                            name:'matricula',
                            uri:this.state.matricula.uri,
                            type:this.state.matricula.mime?this.state.matricula.mime:'image/jpeg'
                        })
                    }
                    if(this.state.seguro){
                        data.append('seguro',{
                            name:'seguro',
                            uri:this.state.seguro.uri,
                            type:this.state.seguro.mime?this.state.seguro.mime:'image/jpeg'
                        })
                    }
                    if(this.state.ident){
                        data.append('iden',{
                            name:'iden',
                            uri:this.state.ident.uri,
                            type:this.state.ident.mime?this.state.ident.mime:'image/jpeg'
                        })
                    }
                    if(this.state.licen){
                        data.append('licen',{
                            name:'licen',
                            uri:this.state.licen.uri,
                            type:this.state.licen.mime?this.state.licen.mime:'image/jpeg'
                        })
                    }
                    data.append('_id', store.getState().id_user.toString())
                    fetch(server + '/chofer/documents', {
                        method:'PUT',
                        headers:{
                            Accept: 'application/json',
                            'Content-Type':'multipart/form-data',
                            'Authorization': 'Bearer '+store.getState().token.toString()
                        },
                        body:data
                    })
                    .then(res=>{
                        this.setState({
                            visible:false,
                            mensaje:'Imagenes guardadas',
                            mostrarmensaje:true,
                        })
                        this.getVehiculo()
                    })
                    .catch(error=>alert(error))
            }
            else{
                this.setState({
                    mensaje:'No puede realizar modificaciones',
                    mostrarmensaje:true
                })    
            }
        }
        else{
            this.setState({
                mensaje:'Debe seleccionar al menos un documento para subir',
                mostrarmensaje:true
            })
        }
    }

    getVehiculo(){
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
                if(data.message === 'No existen vehiculos') {
                    this.setState({actualizar: true, loading: false})
                }else{
                    this.setState({
                        id: data.vehiculo&&data.vehiculo._id?data.vehiculo._id:'',
                        images:data.vehiculo&&data.vehiculo.images?data.vehiculo.images:[],
                        ident:data.iden?data.iden:null,
                        documents:data.documents?data.documents:[],
                        licen:data.licen?data.licen:null,
                        matricula:data.matricula?data.matricula:null,
                        seguro:data.seguro?data.seguro:null,
                        loading: false,
                    })
                    if(!data.seguro||((data.seguro.status&&data.seguro.status!=='Pendiente'))||
                    (!data.matricula||(data.matricula.status&&data.matricula.status!=='Pendiente'))||
                    (!data.licen||(data.licen.status&&data.seguro.status!=='Pendiente'))||
                    (!data.iden||(data.iden.status&&data.iden.status!=='Pendiente'))){
                        this.setState({editar:true})
                    }
                    else{
                        this.setState({editar:false})
                    }
                }
            })
            .catch(error=>alert(error))
        }
    }

    quitarImagen(tipo,i=0){
        let arr
        switch(tipo){
            case 'mat':
                this.setState({matricula:null})
                break
            case 'seg':
                this.setState({seguro:null})
                break
            case 'img':
                arr = this.state.images
                arr.splice(i,1)
                this.setState({images:arr})
                break
            case 'ident':
                this.setState({ident:null})
                break
            case 'licen':
                this.setState({licen:null})
                break
            default:
        }       
    }

    mostrarImagen(imagen,tipo){
        if(Platform.OS === 'ios' && Object.keys(imagen).length < 1){
            imagen = null
        }
        if(imagen !== null ){
            return(
                <View style={{marginTop:10}}>
                    {imagen.status!=='Pendiente'||imagen.status==='check'?
                        <View style={style.icon_cont}>
                            <Icon
                                name='close'
                                style={style.close}
                                onPress={()=>this.quitarImagen(tipo)}
                            />
                        </View>
                    :null
                    }
                    <View style={{marginLeft:20}} >{this.renderImage(imagen)}</View>
                </View>
            )
        }
    }

    remplazarUri(imagen){
        let img = imagen
        if(img.url){
            img.uri=sock+img.url
        }
        return img
    }

    renderImage(image) {
        return <Image style={{width: 200, height: 200, resizeMode: 'contain',marginVertical:10}} source={this.remplazarUri(image)} />
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
                        token={store.getState().token}
                        name='Documentos'> 
                    </Head>
                    <ScrollView>
                    <Cargando visible={this.state.visible}/>
                    <Mensaje visible={this.state.mostrarmensaje} mensaje={this.state.mensaje} setmensaje={this.setmensaje}/>
                        <View style={{marginTop: 0, marginBottom:2}}>
                            <View style={{alignItems:'center'}}>
                                <View style={estilo.detalles}>
                                    <Text style={{color:'white', textAlign:'center', fontSize:20}}>
                                        Documentos personales
                                    </Text>
                                </View>
                                <View style={{alignItems:'center', width:ancho}}>
                                    <View style={{justifyContent:'center', width:ancho*0.9, marginTop:10}}>
                                        <View style={{justifyContent:'center', width:ancho}}>
                                            <Text style={{textAlign:'center', fontWeight:'bold'}}>Cédula</Text>
                                        </View>
                                        <View style={{justifyContent:'center', width:ancho}}>
                                            {this.mostrarImagen(Platform.OS==='ios'?{...this.state.ident}:this.state.ident,'ident')}
                                        </View>
                                        {this.state.ident===null||this.state.ident.status!=='Pendiente'?
                                            <View style={estilo.botones}>
                                                <Button
                                                    style={estilo.btn} 
                                                    title="Tomar Foto" 
                                                    rounded
                                                    danger
                                                    onPress={()=>this.pickSingleWithCamera('ident')}>
                                                    <Text style={{textAlign:'center'}}>Tomar foto</Text>
                                                </Button>
                                                <Button
                                                    style={estilo.btn} 
                                                    title='Seleccionar archivo'
                                                    rounded
                                                    danger
                                                    onPress={()=>this.chooseFile('ident')}
                                                >
                                                    <Text style={{textAlign:'center'}}>Seleccionar</Text>
                                                </Button>
                                            </View>
                                            :null}
                                    </View>
                                    <View style={{justifyContent:'center', width:ancho*0.9, marginTop:10}}>
                                        <View style={{justifyContent:'center', width:ancho}}>
                                            <Text style={{textAlign:'center', fontWeight:'bold'}}>Licencia de conducir</Text>
                                        </View>
                                        <View style={{justifyContent:'center', width:ancho}}>
                                            {this.mostrarImagen(Platform.OS==='ios'?{...this.state.licen}:this.state.licen,'licen')}
                                        </View>
                                        {this.state.licen===null||this.state.licen.status!=='Pendiente'?
                                        <View style={estilo.botones}>
                                            <Button
                                                style={estilo.btn} 
                                                title="Tomar Foto" 
                                                rounded
                                                danger
                                                onPress={()=>this.pickSingleWithCamera('licen')}>
                                                <Text style={{textAlign:'center'}}>Tomar foto</Text>
                                            </Button>
                                            <Button
                                                style={estilo.btn} 
                                                title='Seleccionar archivo'
                                                rounded
                                                danger
                                                onPress={()=>this.chooseFile('licen')}
                                            >
                                                <Text style={{textAlign:'center'}}>Seleccionar</Text>
                                            </Button>
                                        </View>
                                        :null}
                                    </View>
                                    <View style={{justifyContent:'center', width:ancho*0.9, marginTop:10}}>
                                        <View style={{justifyContent:'center', width:ancho}}>
                                            <Text style={{textAlign:'center', fontWeight:'bold'}}>Matrícula</Text>
                                        </View>
                                        <View style={{justifyContent:'center', width:ancho}}>
                                            {this.mostrarImagen(Platform.OS==='ios'?{...this.state.matricula}:this.state.matricula,'mat')}
                                        </View>
                                        {this.state.matricula===null||this.state.matricula.status!=='Pendiente'?
                                            <View style={estilo.botones}>
                                                <Button
                                                    style={estilo.btn} 
                                                    title="Tomar Foto" 
                                                    rounded
                                                    danger
                                                    onPress={()=>this.pickSingleWithCamera('matricula')}>
                                                    <Text style={{textAlign:'center'}}>Tomar foto</Text>
                                                </Button>
                                                <Button
                                                    style={estilo.btn} 
                                                    title='Seleccionar archivo'
                                                    rounded
                                                    danger
                                                    onPress={()=>this.chooseFile('matricula')}
                                                >
                                                    <Text style={{textAlign:'center'}}>Seleccionar</Text>
                                                </Button>
                                            </View>
                                            :null}
                                    </View>
                                    <View style={{justifyContent:'center', width:ancho*0.9, marginTop:10}}>
                                        <View style={{justifyContent:'center', width:ancho}}>
                                            <Text style={{textAlign:'center', fontWeight:'bold'}}>Seguro del vehículo</Text>
                                        </View>
                                        <View style={{justifyContent:'center', width:ancho}}>
                                            {this.mostrarImagen(Platform.OS==='ios'?{...this.state.seguro}:this.state.seguro,'seg')}
                                        </View>
                                        {this.state.seguro===null||this.state.seguro.status!=='Pendiente'?
                                            <View style={estilo.botones}>
                                                <Button
                                                    style={estilo.btn} 
                                                    title="Tomar Foto" 
                                                    rounded
                                                    danger
                                                    onPress={()=>this.pickSingleWithCamera('seguro')}>
                                                    <Text style={{textAlign:'center'}}>Tomar foto</Text>
                                                </Button>
                                                <Button
                                                    style={estilo.btn} 
                                                    title='Seleccionar archivo'
                                                    rounded
                                                    danger
                                                    onPress={()=>this.chooseFile('seguro')}
                                                >
                                                    <Text style={{textAlign:'center'}}>Seleccionar</Text>
                                                </Button>
                                            </View>
                                            :null}
                                    </View>
                                    {this.state.editar?
                                    <TouchableHighlight underlayColor='transparent' onPress={()=>this.saveDocuments()}>
                                        <View style={{justifyContent:'center', width:ancho*0.9, marginTop:10, marginBottom:10}}>
                                            <Button
                                                rounded
                                                dark
                                                style={{justifyContent:'center', width:ancho*0.9}}
                                                onPress={()=>this.saveDocuments()}
                                            >
                                                <Text style={{textAlign:'center'}}>Guardar</Text>
                                            </Button>
                                        </View>
                                    </TouchableHighlight>
                                    :null}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </Container>
            )
        }
    }
}

export default withNavigationFocus(Documentos)

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
    icon_cont:{
        borderRadius:15,
        justifyContent:'flex-start', 
        alignItems:'flex-start',
        backgroundColor:'red',
        width:30,
        height:30,
        borderRadius:5,
        marginLeft:10
    },
    close:{
        color:'white', 
        fontSize:30,
        width:30,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:6
    },
    cont_btn:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    vista: {
        alignItems: 'center',
        margin: 0,
        flex: 1,
        backgroundColor: '#00000000',
        marginTop: 30,
        marginBottom: 30
    },
    caja: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 25,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width - 30,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    }
})
const estilo = StyleSheet.create({
    detalles:{
        width:ancho,
        height:Dimensions.get('window').height*0.05,
        backgroundColor:'#E84546', 
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20, 
        justifyContent:'center',
        marginTop:10
    },
    item:{
        paddingLeft:10,
        marginVertical:5,
        borderWidth:1,
        borderColor:'red', 
        flexDirection:'row', 
        height:Dimensions.get('window').height*0.05,
        width:Dimensions.get('window').width*0.95,
        borderRadius:50,
        alignItems:'center',
        justifyContent:'center'
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
    btn:{
        width:ancho*0.4,
        height:alto*0.05,
        justifyContent:'center'
    },
    botones:{
        justifyContent:'center', 
        flexDirection:'row', 
        justifyContent:'space-around',
        width:ancho*0.9    
    }
})