import React, { Component } from "react";
import HomeScreen from "./HomeScreen.js";
import SideBar from "../componentes/SideBar/SideBar";
import MisReservas from '../MisReservas/MisReservas'
import { createDrawerNavigator, createAppContainer } from "react-navigation";
const HomeScreenRouter = createDrawerNavigator(
  {
    Home: { screen: HomeScreen },
    MisReservas : { screen: MisReservas}
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);
const AppContainer = createAppContainer(HomeScreenRouter);
export default AppContainer;