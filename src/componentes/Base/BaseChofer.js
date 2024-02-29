import React, { Component} from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem } from "native-base";
export default class BaseC extends Component{ 
    render(){
        return(
            <View style={style.view}>
            <Card 
                style={style.fondo}>
                <Button
                    primary>
                    <Text>Buscando Choferes</Text>
                </Button>
            </Card>
            </View>
        )
    }
}

const style = StyleSheet.create({
    view:{
    alignItems: 'center'
    },
    fondo:{
        margin:0,
        backgroundColor:'red',
        height: 150,
        width:Dimensions.get('window').width
    }
})