import React from "react";
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight } from "react-native";
import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle } from "native-base";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Head from '../componentes/Header/Header.js'
import store from '../redux/store'
import {BackHandler, ToastAndroid} from 'react-native'
export default class MisReservas extends React.Component {
  constructor(){
    super()
    this.state={
      location:'MisReservas'
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    if(this.state.location=='Home'){
        BackHandler.exitApp()
      return true
    }  
  }

  render() {
    return (
      <Container>
        <Head 
            style={styles.head}
            navigation={this.props.navigation}
            name='Mis Reservas' 
        />
        <Text>{this.state.location}</Text>
        <View style={styles.content}>
            <Tabs>
                <Tab heading='Próximas'>
                    <Card style={{backgroundColor:'red'}}>
                        <CardItem>
                            <Icon
                                name='person'
                            />
                            <Body>
                                <Title>25-02-2019</Title>
                                <Subtitle>Taxi</Subtitle>
                            </Body>
                            <Text>
                                20$
                            </Text>
                        </CardItem>
                    </Card>
                    <Card style={{backgroundColor:'red'}}>
                        <CardItem>
                            <Icon
                                name='person'
                            />
                            <Body>
                                <Title>25-02-2019</Title>
                                <Subtitle>Taxi</Subtitle>
                            </Body>
                            <Text>
                                20$
                            </Text>
                        </CardItem>
                    </Card>
                    <Card style={{backgroundColor:'red'}}>
                        <CardItem>
                            <Icon
                                name='person'
                            />
                            <Body>
                                <Title>25-02-2019</Title>
                                <Subtitle>Taxi</Subtitle>
                            </Body>
                            <Text>
                                20$
                            </Text>
                        </CardItem>
                    </Card>
                    <Card style={{backgroundColor:'red'}}>
                        <CardItem>
                            <Icon
                                name='person'
                            />
                            <Body>
                                <Title>25-02-2019</Title>
                                <Subtitle>Taxi</Subtitle>
                            </Body>
                            <Text>
                                20$
                            </Text>
                        </CardItem>
                    </Card>
                </Tab>
                <Tab heading='Anteriores'>
                </Tab>
            </Tabs>
            
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
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