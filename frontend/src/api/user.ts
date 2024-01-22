import axios from 'axios';
import { LoginInfo, User } from '../types/type';
import localAxios from '../util/http-commons';

const local = localAxios();

const VITE_REACT_API_URL = import.meta.env.VITE_REACT_API_URL;
const instance = axios.create({
    baseURL: VITE_REACT_API_URL,
});

axios.defaults.withCredentials = true;

// POST auth/login
export async function login(user: User) {
    return await axios.post(`/auth/login`, user, {});
}
