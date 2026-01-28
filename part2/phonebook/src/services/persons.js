import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => axios.get(baseUrl).then(r => r.data)
const create = (newPerson) => axios.post(baseUrl, newPerson).then(r => r.data)
const remove = (id) => axios.delete(`${baseUrl}/${id}`)

export default { getAll, create, remove }
