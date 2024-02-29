import React from "react";
import MapViewDirections from "react-native-maps-directions";

const Directions = ({ destination, origin, onReady, strokeColor }) => (

  <MapViewDirections
    destination={destination}
    origin={origin}
    onReady={onReady}
    apikey="AIzaSyCeheP7N3nMtkIeE2P56lW1umQM1fyHCwE"
    strokeWidth={3}
    strokeColor={strokeColor}
  />
);

export default Directions;