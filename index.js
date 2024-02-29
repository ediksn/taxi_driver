/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react'
import ReactDOM from 'react-dom' 
import { Provider } from 'react-redux'
import store from './src/redux/store'

const reactApp = ()=>(
    <Provider store={store}>
        <App/>
    </Provider>
)

AppRegistry.registerComponent(appName, () => reactApp);
