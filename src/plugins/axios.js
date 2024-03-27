import axios from "axios";
import {useAppStore} from "../stores/app";


const requestPipe = (request) => {
  if (request.url.includes('auth')) {
    request.headers['Authorization'] = `Bearer ${useAppStore().authToken}`
  }
  return request;
}

const responsePipe = (response) => {
  if (response.status === 200) {
    if (Object.hasOwn(response.data, 'message')) {
      useAppStore().setAlert({show: true, message: response.data.message, type: 'success'})
    }
    return response.data
  }
  return response
}

export default {
  install: (app) => {
    const _axios = axios.create({
      baseURL: import.meta.env.VITE_API_MODULE_URL
    })
    _axios.interceptors.request.use((request) => {
      return requestPipe(request);
    }, () => {})
    _axios.interceptors.response.use((response) => {
      return responsePipe(response)
    }, (error) => {
      useAppStore().setAlert({show: true, message: error.response.data.message, type: 'error'})
    })
    app.provide("axios", _axios);
  },
};
