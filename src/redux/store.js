import { createStore, combineReducers } from 'redux'
import actualizar from './reducers'
import {createToken, createId} from './actions'

const store = createStore(actualizar)

export default store