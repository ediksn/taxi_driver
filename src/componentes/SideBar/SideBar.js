import React from "react";
import { AppRegistry, Image, StatusBar, View , StyleSheet, Dimensions} from "react-native";
import { Header, Container, Left, Right, Body,Content, Text, List, ListItem, Icon, Title, Subtitle, Button} from "native-base";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";
const routes = [
  {name:"Mis Reservas",
  icon: 'ios-clock'
  },
  {name: "Opciones de Pago",
  icon:'card'
  }, 
  {name:"Billetera",
  icon:'wallet'}
  ,
  {name:"Favoritos",
  icon:'star'}
  ,
  { name:"Invitar Amigos",
  icon:'card'
  },
  {name:"Configuraciones",
  icon:'card'}, 
  {name:"Acerca de",
  icon:'card'
  },];
export default class SideBar extends React.Component {
  render() {
    return (
        <View style={estilo.vista}>
          <Header style={estilo.head}>
            <Left>
              <Icon
                name='person'
              />
            </Left>
            <Body>
              <Title>
                Nombre del cliente
              </Title>
              <Subtitle>
                +1 800 123 4567
              </Subtitle>
            </Body>
            <Right>
            <Icon 
              name='close'
              onPress={()=>this.props.navigation.toggleDrawer()}
            />
            </Right>
          </Header>
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem style={estilo.item}>
                  <Icon
                    name={data.icon}
                  /> 
                  <Button 
                    transparent
                    onPress={() => this.props.navigation.navigate(data.name)}>
                    <Text>{data.name}</Text>   
                  </Button>
                </ListItem>
              );
            }}
          />
          <View>
              <Icon
                name="home"
                onPress={()=>{
                  this.props.navigation.navigate('Home')
                }}
              />
          </View>
        </View>
    );
  }
}

const estilo = StyleSheet.create({
  vista:{
    top:25
  },
  head:{
    height: Dimensions.get('window').height*0.1,
    backgroundColor: "red"
  },
  item:{
    height: Dimensions.get('window').height*0.09
  }
})