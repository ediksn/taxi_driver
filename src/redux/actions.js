export const token = 'token'
export const id_user = 'id_user'
export const location ='location'

export function createToken(text){
    return { type: token, text }
}

export function createId(text){
    return { type: id_user, text }
}

export function setLocation(text){
    return { type: location, text }
}