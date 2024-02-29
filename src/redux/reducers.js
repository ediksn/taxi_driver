import { combineReducers } from 'redux'
import {token, id_user, location} from  './actions'
const initialState = {
    token: '',
    id_user:'',
    location:''
}

function actualizar(state=initialState, action ){
    switch(action.type){
        case token:
            return Object.assign({}, state, {
                token: action.text
            })
        case id_user:
            return Object.assign({}, state, {
                id_user: action.text
            })
        case location:
            return Object.assign({}, state, {
                location: action.text
            })
        default:
            return state
    }
}


export default actualizar