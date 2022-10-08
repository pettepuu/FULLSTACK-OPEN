
import axios from 'axios'
const baseURL = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}


const add = newObject => {
    const request = axios.post(baseURL, newObject)
    return request.then(response => response.data)
}
const remove = id => {
    const deleteUrl = baseURL +"/"+ id
    const request = axios.delete(deleteUrl)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const updateUrl = baseURL +"/"+ id
    const request = axios.put(updateUrl, newObject)
    return request.then(response => response.data)
}

export default { getAll, add, remove , update}
