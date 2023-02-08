import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;
const AUTH_TOKEN = window.localStorage.getItem('__auth_provider_OAuthToken__');
axios.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;

const getDatas = (endpoint) => axios.get(`${API_BASE_URL}/${endpoint}`).then(res => res.data);

const createData = (endpoint, data) => axios.post(`${API_BASE_URL}/${endpoint}`, data);

// const getDataById = (endpoint, dataId) => axios.get(`${API_BASE_URL}/${endpoint}/${dataId}`);

const updateData = (endpoint, data, dataId) => axios.put(`${API_BASE_URL}/${endpoint}/${dataId}`, data);

const deleteData = (endpoint, dataId) => axios.delete(`${API_BASE_URL}/${endpoint}/${dataId}`);

export { getDatas, createData, updateData, deleteData }