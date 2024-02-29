import React, { Component } from "react";
import HomeScreen from "./HomeScreen.js";
import SideBar from "../componentes/SideBar/SideBar";
import MisReservas from '../MisReservas/MisReservas'
import { createDrawerNavigator, createAppContainer } from "react-navigation";
import  Ganancias  from "../GananciasScreen"
import Perfil from '../Perfil'
import Historial from '../Historial'
import Vehiculos from '../Vehiculos'
import Retiros from '../Retiros/index'
import Retiro from '../Retiros/Retiros'
import Cuentas from '../Cuentas'
import Documentos from '../Documentos'
import Notificaciones from '../Notificaciones'
const HomeScreenRouter = createDrawerNavigator(
  {
    Home: { screen: HomeScreen,
      disableOpenGesture:true
    },
    'Mis Reservas' : { screen: MisReservas},
    'Ganancias' : { screen : Ganancias},
    'Perfil': {screen: Perfil},
    'Historial': {screen: Historial},
    'Vehiculos' : {screen: Vehiculos},
    'Retiros':{screen:Retiros},
    'Retiro': {screen:Retiro},
    'Cuentas':{screen:Cuentas},
    'Documentos':{screen: Documentos},
    'Notificaciones':{screen:Notificaciones}
  },
  {
    defaultNavigationOptions:{
      gesturesEnabled:false,
      drawerLockMode:'locked-closed'
    },
  }
);

const AppContainer = createAppContainer(HomeScreenRouter);
export default AppContainer;