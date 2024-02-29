import React, { Component} from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem } from "native-base";
export default class Confirmacion extends Component{ 
    render(){
        return(
            <View style={style.view}>
            <Card style={style.fondo}>
                <CardItem
                    header
                >
                    <Text>
                        Confirma tu recogida en 
                    </Text>
                </CardItem> 
                <Body>
                    <Text>
                        Calle X numero X 
                    </Text>
                </Body>
                <CardItem footer>
                    <Button rounded dark
                    onPress={()=>{
                        this.props.cambiarEstado('buscar')
                    }} >
                        <Text>Confirmar Recogida</Text>
                    </Button>
                </CardItem>
            </Card>
            </View>
        )
    }
}

const style = StyleSheet.create({
    view:{
        margin: 0
    },
    fondo:{
        marginBottom: -1,
        margin:0,
        marginHorizontal: 0,
        backgroundColor:'blue',
        height: 150,
        width:Dimensions.get('window').width + 1
    }
})