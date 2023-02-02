import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

class DataService {

   getDatas() {
      return axios.get(API_BASE_URL);
   }

   createData(data) {
      return axios.post(API_BASE_URL, data);
   }

   getDataById(dataId) {
      return axios.get(API_BASE_URL + '/' + dataId);
   }

   updateData(data, dataId) {
      return axios.put(API_BASE_URL + '/' + dataId, data);
   }

   deleteData(dataId) {
      return axios.delete(API_BASE_URL + '/' + dataId);
   }
}

const dataService = new DataService();

export default dataService;