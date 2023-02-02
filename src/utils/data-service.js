import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const getDatas = endpoint => axios.get(`${API_BASE_URL}/${endpoint}`).then(res => res.data);

const createData = (endpoint, data) => axios.post(`${API_BASE_URL}/${endpoint}`, data);

const getDataById = (endpoint, dataId) => axios.get(`${API_BASE_URL}/${endpoint}/${dataId}`);

const updateData = (endpoint, data, dataId) => axios.put(`${API_BASE_URL}/${endpoint}/${dataId}`, data);

const deleteData = (endpoint, dataId) => axios.delete(`${API_BASE_URL}/${endpoint}/${dataId}`);

export { getDatas, createData, getDataById, updateData, deleteData }