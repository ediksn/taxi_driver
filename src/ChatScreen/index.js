import React, { Component } from "react";
import LucyChat from "./LucyChat.js";
import { createTabNavigator } from "react-navigation";
import { Button, Text, Icon, Footer, FooterTab } from "native-base";
export default (MainScreenNavigator = createTabNavigator(
  {

    LucyChat: { screen: LucyChat }
  },
  {
    tabBarPosition: "bottom",
    tabBarComponent: props => {
      return (
        <Footer>
          <FooterTab>
            <Button
              vertical
              active={props.navigationState.index === 0}
              onPress={() => props.navigation.navigate("LucyChat")}>
              <Icon name="bowtie" />
              <Text>Lucy</Text>
            </Button>
          </FooterTab>
        </Footer>
      );
    }
  }
));