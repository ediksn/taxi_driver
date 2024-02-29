import React from "react";
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight, Platform, ScrollView, Image, NativeModules } from "react-native";
import { Container, CheckBox,Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Header, Row, Input } from "native-base";
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
import ImageCropPicker from "react-native-image-crop-picker";
import NetInfo from '@react-native-community/netinfo'
import { setLocation } from "../redux/actions.js";
class Perfil extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            filePath: {},
            placa:'',
            modelo:'',
            marca:'',
            color:'',
            tipo:'',
            id:'',
            mensaje: '',
            actualizar: false,
            mostrarmensaje: false,
            images:[],
            visible:false,
            editar:false,
            extras:[],
            cadena:'',
            ext:[],
            conexion:''
        }
        this.changePage = this.changePage.bind(this)
        this.setmensaje = this.setmensaje.bind(this)
        this.pickSingleWithCamera = this.pickSingleWithCamera.bind(this)
        this.getVehiculo()
    }

    componentDidUpdate(prevProps){
        if(this.props.isFocused!==prevProps.isFocused&&this.props.isFocused){
            this.getVehiculo()
        }
    }

    componentDidMount(){
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
          )
            
          NetInfo.isConnected.fetch().done(isConnected=>{
            if(isConnected===true){
              this.setState({conexion:'conectado'})
              this.getVehiculo()
            }
            else{
              this.setState({conexion:'desconectado'})
            }
        })   
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress) 
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

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        )
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    setmensaje(data) {
        this.setState({mostrarmensaje: data})
    }
    changePage(data){
        this.props.navigation.navigate(data)
    }
    pickSingleWithCamera() {
        ImageCropPicker.openCamera({
            cropping: true,
            multiple:true
        })
        .then(image => {
            let imagen ={
                uri: image.path, 
                height: image.height,
                width: image.width, 
                mime:image.mime
            }
            this.setState({
                images:[ ...this.state.images,imagen]
            })
        })
        .catch(e => alert(e));
    }
    chooseFile(){
        ImagePicker.openPicker({
            waitAnimationEnd:true,
            multiple:true
        })
        .then(images => {
            let arr=this.state.images
            images.forEach(i => {
                arr.push({ uri: i.path, width: i.width, height: i.height, mime: i.mime})
            })
            this.setState({
                images:arr
            })
        })
        .catch(error=>alert(error))
    }

    getExtras(){
        if(this.state.conexion==='conectado'){
            fetch(`${server}/extra`,{
                method:'GET',
                headers: {
                Accept: 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+store.getState().token.toString()
                }
            })
            .then(response=>{
                let data = JSON.parse(response._bodyInit)
                this.setState({
                    extras:data
                })
                this.checked()
            })
            .catch(error=>{
                alert(error)
            })
        }
    }

    guardar(){
        if(this.state.conexion==='conectado'){
            if(this.state.actualizar) {
                this.setState({visible:true})
                fetch(server + '/vehiculo/', {
                    method:'POST',
                    headers:{
                        Accept: 'application/json',
                        'Content-Type':'application/json',
                        'Authorization': 'Bearer '+store.getState().token.toString()
                    },
                    body:JSON.stringify({
                        modelo:this.state.modelo,
                        marca:this.state.marca,
                        placa:this.state.placa,
                        color:this.state.color,
                        tipo:this.state.tipo,
                        owner: store.getState().id_user.toString(),
                        extras:this.state.ext.length>0?this.state.ext:[]
                    })
                })
                .then(res=>{
                    this.setState({
                        visible:false,
                        mensaje:'Se han guardado los datos del vehículo exitosamente'
                    })
                    this.getVehiculo()
                    this.setmensaje(true)
                })
                .catch(error=>{
                    this.setState({visible:false})
                    alert(error)
                })
            }else{
                this.setState({visible:true})
                fetch(server + '/vehiculo/', {
                    method:'PUT',
                    headers:{
                        Accept: 'application/json',
                        'Content-Type':'application/json',
                        'Authorization': 'Bearer '+store.getState().token.toString()
                    },
                    body:JSON.stringify({
                        modelo:this.state.modelo,
                        marca:this.state.marca,
                        placa:this.state.placa,
                        color:this.state.color,
                        tipo:this.state.tipo,
                        extras:this.state.ext.length>0?this.state.ext:[],
                        _id:this.state.id,
                    })
                })
                .then(res=>{
                    this.setState({
                        visible:false,
                        mensaje:'Se han guardado los datos del vehículo exitosamente',
                    })
                    this.setmensaje(true)
                })
                .catch(error=>{
                    this.setState({visible:false})
                    alert(error)
                })
            }
        }
    }

    createFormData=(foto)=>{
        const data = new FormData()
        foto.forEach((element, index) => {
            data.append('foto'+index,{
                name:'foto'+index,
                uri:element.uri,
                type:element.mime?element.mime:'image/jpeg'
            })
        });
        data.append('_id', this.state.id)
        return data
    }

    saveImagenes(){
        if(this.state.conexion==='conectado'){
            if(!this.state.actualizar){
                this.setState({visible:true})
                fetch(server + '/vehiculo/', {
                    method:'PUT',
                    headers:{
                        Accept: 'application/json',
                        'Content-Type':'multipart/form-data',
                        'Authorization': 'Bearer '+store.getState().token.toString()
                    },
                    body: this.createFormData(this.state.images)
                })
                .then(res=>{
                    this.setState({
                        visible:false,
                        mensaje:'Imagenes guardadas',
                        mostrarmensaje:true
                    })
                    this.getVehiculo()
                })
                .catch(error=>{
                    this.setState({
                        visible:false
                    })
                    alert(error)
                })
            }
            else{
                this.setState({
                    mensaje:'Debe registrar las caracteristicas del vehiculo',
                    mostrarmensaje:true
                })
            }
        }
    }

    getVehiculo(){
        if(this.state.conexion==='conectado'){
            this.setState({visible:true})
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
                    actualizar:data.vehiculo?false:true,
                    placa: data.vehiculo&&data.vehiculo.placa?data.vehiculo.placa:'',
                    modelo: data.vehiculo&&data.vehiculo.modelo?data.vehiculo.modelo:'',
                    marca: data.vehiculo&&data.vehiculo.marca?data.vehiculo.marca:'',
                    tipo: data.vehiculo&&data.vehiculo.tipo?data.vehiculo.tipo:'',
                    color:data.vehiculo&&data.vehiculo.color?data.vehiculo.color:'',
                    id: data.vehiculo&&data.vehiculo._id?data.vehiculo._id:'',
                    images:data.vehiculo&&data.vehiculo.images?data.vehiculo.images:[],
                    ext:data.vehiculo&&data.vehiculo.extras.length>0?data.vehiculo.extras:[],
                    visible:false
                })
                this.getExtras()
                let editar
                if(this.state.images.length>0){
                    for(let i = 0; i<this.state.images.length;i++){
                        if(this.state.images[i].status!=='Pendiente'){
                            editar=true
                        }
                    }
                }else{
                 editar=true   
                }
                this.setState({
                    editar:editar
                })
            })
            .catch(error=>{
                this.setState({visible:false})
                alert(error)
            })
        }
    }

    quitarImagen(i){
        let arr
        arr = this.state.images
        arr.splice(i,1)
        this.setState({images:arr})
    }

    mostrarImagenes(){
        let arr =[]
        if(this.state.images.length!==0){
            this.state.images.map((i,index)=>{
                arr.push(
                    <View key ={'img'+i} style={{marginTop:10}}>
                        {!i.status||i.status!=='Pendiente'?
                        <View style={style.icon_cont}>
                            <Icon
                                name='close'
                                style={style.close}
                                onPress={()=>this.quitarImagen(index)}
                            />
                        </View>
                        :null}
                        <View style={{marginLeft:20}} key={i.url}>{this.renderImage(Platform.OS==='ios'?{...i}:i)}</View>
                    </View>
                )
            })
            return arr
        }
        else{
            return arr=null
        }
    }

    checked(){
        for(let i = 0; i<this.state.ext.length;i++){
            for(let j = 0;j< this.state.extras.length;j++){
                if(this.state.extras[j].nombre.toString()===this.state.ext[i].toString()){
                    this.setState({['check'+j]:true})
                }
            }
        }
    }

    renderExtras(){
        let arr=[]
        for(let i =0;i<this.state.extras.length;i++){
            arr.push(
                <View key={'e'+i} style={estilo.razon}>
                    <Text>{this.state.extras[i].nombre}</Text>
                    <CheckBox
                        color='red'
                        style={{marginRight:10}}
                        checked={this.state['check'+i]}
                        onPress={()=>{
                            if(this.state['check'+i]===true){
                                this.setState({['check'+i]:false})
                            }
                            else{
                                this.setState({['check'+i]:true})
                            }
                            this.addOpcion(this.state.extras[i].nombre)
                        }} 
                    />  
                </View>
            )
        }
        return arr
    }

    addOpcion(data){
        let arr = this.state.ext
        let cent= false
        for(let i=0;i<arr.length;i++){
            if(data===arr[i]){
                arr.splice(i,1)
                cent=true
                this.setState({
                    cadena:this.state.cadena.replace(data,'')
                })
            }
        }
        if(!cent){
            arr.push(data)
            this.setState({
                cadena:this.state.cadena+data
            })
        }
        this.setState({
            ext:arr
        })
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
            return (
                <Container>
                    <Head
                        changePage={this.changePage}
                        name='Detalles del Taxi'
                        token={store.getState().token}    
                    > 
                    </Head>
                    <ScrollView>
                    <Cargando visible={this.state.visible}/>
                    <Mensaje visible={this.state.mostrarmensaje} mensaje={this.state.mensaje} setmensaje={this.setmensaje}/>
                        <View style={{marginTop: 0}}>
                            <View style={{alignItems:'center'}}>
                                <View style={{alignItems:'center'}}>
                                    <View style={estilo.item}>
                                        <Icon
                                            name='car'
                                            style={{color:'#E84546'}}
                                        />
                                        <Input placeholder='Placa' value={this.state.placa}
                                            onChangeText={text=>this.setState({placa:text})}>
                                        </Input>
                                    </View>
                                    <View style={estilo.item}>
                                        <Icon
                                            name='car'
                                            style={{color:'#E84546'}}
                                        />
                                        <Input placeholder='Marca' value={this.state.marca}
                                            onChangeText={text=>this.setState({marca:text})}>
                                        </Input>
                                    </View>
                                    <View style={estilo.item}>
                                        <Icon
                                            name='car'
                                            style={{color:'#E84546'}}
                                        />
                                        <Input placeholder='Modelo' value={this.state.modelo}
                                            onChangeText={text=>this.setState({modelo:text})}>
                                        </Input>
                                    </View>
                                    <View style={estilo.item}>
                                        <Icon
                                            name='car'
                                            style={{color:'#E84546'}}
                                        />
                                        <Input placeholder='Color' value={this.state.color}
                                            onChangeText={text=>this.setState({color:text})}>
                                        </Input>
                                    </View>
                                    <View style={estilo.item}>
                                        <View style={{flexDirection:'row', width:ancho*0.3, justifyContent:'space-around'}}>
                                            <CheckBox
                                                color='red'
                                                checked={this.state.tipo==='Taxi'?true:false}
                                                onPress={()=>this.setState({tipo:'Taxi'})}
                                            />
                                            <Text>Taxi</Text>
                                        </View>
                                        <View style={{flexDirection:'row', width:ancho*0.3, justifyContent:'space-around'}}>
                                            <CheckBox
                                                color='red'
                                                checked={this.state.tipo==='Moto'?true:false}
                                                onPress={()=>this.setState({tipo:'Moto'})}
                                            />
                                            <Text>Moto</Text>
                                        </View>
                                    </View>
                                    <View style={estilo.extras}>
                                        <Text style={{color:'white', textAlign:'center', fontSize:15}}>
                                            Extras
                                        </Text>
                                    </View>
                                    <View style={[estilo.check,{height:'auto'}]}>
                                        {this.renderExtras()}
                                    </View>
                                </View>
                                <TouchableHighlight underlayColor={'transparent'} onPress={()=>this.guardar()}>
                                    <View style={{alignSelf:'center'}}>
                                        <Button
                                            onPress={()=>this.guardar()}
                                            style={{justifyContent:'center', width:Dimensions.get('window').width*0.95}}
                                            dark
                                            rounded
                                        >
                                            <Text style={{textAlign:'center'}}>Guardar datos</Text>
                                        </Button>
                                    </View>
                                </TouchableHighlight>
                                <View style={estilo.detalles}>
                                    <Text style={{color:'white', textAlign:'center', fontSize:20}}>
                                        Imagenes
                                    </Text>
                                </View>
                                <View style={{alignItems:'center', width:ancho}}>
                                    <View style={{justifyContent:'center', width:ancho}}>
                                        <ScrollView>
                                            {this.mostrarImagenes()}
                                        </ScrollView>
                                    </View>
                                    {this.state.editar?
                                    <View style={{justifyContent:'center', width:ancho*0.9, marginTop:10}}>
                                        <View style={estilo.botones}>
                                            <Button
                                                style={estilo.btn} 
                                                title="Tomar Foto" 
                                                rounded
                                                dark
                                                onPress={()=>this.pickSingleWithCamera()}>
                                                <Text style={{textAlign:'center'}}>Tomar foto</Text>
                                            </Button>
                                            <Button
                                                style={estilo.btn} 
                                                title='Seleccionar archivo'
                                                rounded
                                                dark
                                                onPress={()=>this.chooseFile()}
                                            >
                                                <Text style={{textAlign:'center'}}>Seleccionar</Text>
                                            </Button>
                                        </View>
                                    </View>
                                    :null}
                                    {this.state.editar?
                                    <TouchableHighlight underlayColor={'transparent'} onPress={()=>this.saveImagenes()} >
                                        <View style={{
                                            alignSelf:'center',
                                            marginTop:10,
                                            marginBottom:10
                                        }}>
                                            <Button
                                                style={{alignItems:'center',justifyContent:'center', width:ancho*0.95}}
                                                dark
                                                rounded
                                                onPress={()=>this.saveImagenes()}
                                            >
                                                <Text style={{textAlign:'center'}}>Guardar imagenes</Text>
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
    razon:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:Dimensions.get('window').height*0.02,
        width: Dimensions.get('window').width*0.8
    },
    detalles:{
        width:ancho,
        height:Dimensions.get('window').height*0.05,
        backgroundColor:'#E84546', 
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20, 
        justifyContent:'center',
        marginTop:10
    },
    extras:{
        width:ancho,
        height:Dimensions.get('window').height*0.04,
        backgroundColor:'#818181', 
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
        justifyContent:'space-around'
    },
    check:{
        borderColor:'red',
        borderRadius:10,
        borderWidth:1,
        paddingLeft:10,
        marginVertical:5, 
        flexDirection:'column',
        width:Dimensions.get('window').width*0.95,
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