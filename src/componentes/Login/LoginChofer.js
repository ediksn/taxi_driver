import React from "react";
import { StatusBar, StyleSheet, Dimensions, TouchableHighlight } from "react-native";
import { Container,Title, Left, Icon, Right, Button, Body, Content,Text, Tabs,Tab, Card, CardItem, View, Subtitle, Form, Item, Input } from "native-base";
import HomeScreen from '../../HomeScreen/index'
import {createAppContainer, createStackNavigator} from 'react-navigation'
class Login extends React.Component {
  constructor(){
    super()
    this.state={
      estatus: false
    }
  }
  static navigationOptions = {
    header:null
}
  render() {
    return (
      <Container>
        <Content>
            <View>
                <Form>
                    <Item>
                        <Input placeholder='Usuario'
                            onChangeText={(text)=>{this.setState({email:text})}}
                            value={this.state.text}
                        >
                        </Input>
                    </Item>
                    <Item>
                        <Input placeholder='Contraseña'
                        onChangeText={(text)=>{this.setState({password:text})}}
                        >
                        </Input>
                    </Item>
                </Form>
                <View style={{flex:2}}>
                <Button success
                    onPress={()=>{
                        fetch('http://192.168.3.101:9000/api/usuario/login', {
                            method:'POST',
                            headers:{
                                Accept: 'application/json',
                                'Content-Type':'application/json'
                            },
                            body: JSON.stringify({
                                email:this.state.email,
                                password: this.state.password
                            })
                        })
                        .then((response)=>{
                            let data = response._bodyText
                            data = JSON.parse(data)
                            if(data.status.toString()=='denied'){
                            }
                            else{
                                this.props.navigation.navigate('Home')
                            }
                        })
                        .catch(error=>{
                            alert(error)
                        })
                    }}
                >
                    <Text>
                        Ingresar
                    </Text>
                </Button>
                <Button primary
                >
                    <Text>
                        Registrarse
                    </Text>
                </Button>
                </View>
            </View>
        </Content>
      </Container>
    );
  }
}

const appNavigator = createStackNavigator(
    {
    Login:Login,
    Home: HomeScreen
    },
    {
        headerMode:"none",
        navigationOptions:{
            headerVisible:false
        }
    } 
)

export default createAppContainer(appNavigator)

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'red'
    }
   });