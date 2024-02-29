import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet, Image,Platform} from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Input } from "native-base";
import {withNavigationFocus} from 'react-navigation'
import store from '../../redux/store'
import Mensaje from '../Modals/Mensajes'
import Cargando from './Cargando'
import ImagePicker from 'react-native-image-crop-picker'
import ImageCropPicker from 'react-native-image-crop-picker'
import {server, sock} from '../Api'
class ImagenModal extends Component{
    constructor(){
        super()
        this.state={
            imagen:null,
            visible:false,
            mensaje:'',
            loading:false
        }
        this.setmensaje=this.setmensaje.bind(this)
    }

    componentDidUpdate(prevProps){
        if(this.props.isFocused!==prevProps.isFocused){
            this.setState({imagen:this.props.img})
        }
    }

    renderImage(){
        return(
            <Image
                style={estilo.img}
                source={
                    Platform.OS==='ios'?this.replaceUri(this.state.imagen===null?{...this.props.img}:{...this.state.imagen}):
                    this.replaceUri(this.state.imagen===null?this.props.img:this.state.imagen)
                }
            />
        )
    }

    replaceUri(imagen){
        let img = imagen
        if(img&&img.url){
            img.uri=sock+img.url
        }
        return img
    }

    saveImagen(){
        this.setState({
            loading:true
        })
        const createFormData=(foto)=>{
            const data = new FormData()
            data.append('image',{
                name:'foto',
                uri:foto.uri,
                type:foto.mime
            })
            data.append('_id', store.getState().id_user.toString())
            return data
        }
        fetch(server + '/chofer/', {
            method:'PUT',
            headers:{
                Accept: 'application/json',
                'Content-Type':'multipart/form-data',
                'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body: createFormData(this.state.imagen)
        })
        .then(res=>{
            this.props.getDatos()
            this.setState({
                loading:false,
                mensaje:'Imagen de perfil guardada exitosamente',
                visible:true
            })
        })
        .catch(error=>alert(data))
    }

    pickSingleWithCamera(cropping) {
        ImageCropPicker.openCamera({
          cropping: cropping,
          width: 500,
          height: 200,
          multiple:true
        }).then(image => {
          this.setState({
            imagen:{ uri: image.path, width: image.width, height: image.height, mime: image.mime}
          });
        }).catch(e => alert(e));
      }
    chooseFile = () => {
        ImagePicker.openPicker({
            height:200,
            width:500,
            waitAnimationEnd:true,
          }).then(image => {
            this.setState({
                imagen:{ uri: image.path, width: image.width, height: image.height, mime: image.mime}
            })
          }).catch(error=>alert(error))
      };

    setmensaje(data) {
        this.setState({visible: data})
    }

    render(){
        return(
        <Modal
          visible={this.props.visible}
          transparent={true}
        >
        <Cargando visible={this.state.loading}/>
        <Mensaje visible={this.state.visible} mensaje={this.state.mensaje} setmensaje={this.setmensaje}/>
          <View style={{
            flex:1,
            flexDirection:'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:'#000000c2'}}>
            <View 
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor:'#fff',
                borderRadius: 25,
                height:Dimensions.get('window').height*0.6,
                width:Dimensions.get('window').width - 40
              }}
            >
                <View style={estilo.titulo}>
                    <Icon
                        name='images'
                        style={{color:'white'}}
                    />
                    <Text style={estilo.text}>
                       Selecionar imagen de perfil
                    </Text>
                </View>
                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <View>
                        {this.renderImage()}
                    </View>
                    <View style={estilo.botones}>
                        <Button
                            rounded
                            dark
                            onPress={()=>this.pickSingleWithCamera()}
                            style={estilo.boton_1}

                        >
                            <Text style={{textAlign:'center'}}>Tomar foto</Text>
                        </Button>
                        <Button
                            rounded
                            dark
                            onPress={()=>this.chooseFile()}
                            style={estilo.boton_1}
                        >
                            <Text style={{textAlign:'center'}}>Seleccionar</Text>
                        </Button>
                    </View>
                </View>
                <View style={estilo.botone}>
                    <Button
                        style={{marginBottom:alto*0.01}} 
                        onPress={()=>{
                            this.props.abrirModal(false)
                        }}
                        rounded
                        danger
                    >
                            <Text style={{color:'white', textAlign:'center'}}>Cerrar</Text>
                    </Button>
                    <Button
                        style={{marginBottom:alto*0.01}} 
                        onPress={()=>this.saveImagen()}
                        rounded
                        danger
                    >
                            <Text style={{color:'white', textAlign:'center'}}>Aceptar</Text>
                    </Button>
                </View>
            </View>
          </View>
        </Modal>
        )
    }
}

export default withNavigationFocus(ImagenModal)

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const estilo = StyleSheet.create({
  
    text: {
        color:'white'
    },
    titulo:{
        width:Dimensions.get('window').width - 40,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#E84546',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection:'row'
    },
    razon:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    boton_1:{
        marginTop:1,
        height:30,
        width:ancho*0.35,
        justifyContent:'center'
    },
    text_env:{

    },
    botones:{
        flexDirection:'row', 
        justifyContent:'space-around', 
        width:Dimensions.get('window').width*0.8
    },
    botone:{
        flexDirection:'row', 
        justifyContent:'space-around', 
        width:Dimensions.get('window').width*0.6
    },
    icono:{
        color:'black',
        fontSize:30
    },
    icon:{
        color:'green',
        fontSize:30
    },
    img:{
        width: 300, 
        height: 200, 
        resizeMode: 'contain',
        marginVertical:10,
        borderRadius:Platform.OS==='ios'?100:200
    }
})