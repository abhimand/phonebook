import axios from 'axios'
const baseURL = '/api/persons'

const getAll = () => { 
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const create = (personObject) => { 
    const request = axios.post(baseURL, personObject)
    return request.then(response => response.data)
}

const update = (personObject, id) => { 
    const request = axios.put(`${baseURL}/${id}`, personObject)
    return request.then(response => response.data)
}

const deletePerson = (id) => axios.delete(`${baseURL}/${id}`)

const services = { 
    getAll: getAll, 
    create: create, 
    deletePerson: deletePerson, 
    update: update
}

export default services