import {Plugin} from '@nuxt/types';

import axios, {AxiosStatic} from 'axios'

const LOGIN_ENDPOINT = '/auth/login';
const REAUTH_ENDPOINT = '/auth/reauth';
const AUTH_SUCCESS = 201;
const LOGIN_PAGE = '/login';


const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';

const basePort = 4343;
const baseURL = `${location.protocol}//${location.hostname}:${basePort}/`;

class TokenStore {

  getAccessToken(): string {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN, token);
  }

  getRefreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN, token);
  }

  getAuthString(): string {
    let token = this.getAccessToken();
    if (token) {
      return 'Bearer ' + token;
    }
    return null;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosStatic;
  }
}

declare module '@nuxt/types' {
  interface Context {
    $axios: AxiosStatic;
  }
}

const axiosPlugin: Plugin = (context, inject) => {
    const tokenStore: TokenStore = new TokenStore();
    axios.defaults.baseURL = baseURL;

    axios.interceptors.request.use(request => {
        const auth = tokenStore.getAuthString();
        if (auth) {
          request.headers['Authorization'] = auth;
        }
        return request;
      }, error =>
        Promise.reject(error)
    );

    axios.interceptors.response.use(res => {
        let url = res.request.responseURL;
        if (res.status === AUTH_SUCCESS && (url.endsWith(LOGIN_ENDPOINT) || url.endsWith(REAUTH_ENDPOINT))) {
          tokenStore.setAccessToken(res.data[ACCESS_TOKEN]);
          tokenStore.setRefreshToken(res.data[REFRESH_TOKEN]);
        }
        return res;
      },
      error => {
        if (!error.response) {
          // network error
          return Promise.reject(error);
        } else {
          // network error
          const originalRequest = error.config;
          const url = error.config.url;
          if (url.endsWith(LOGIN_ENDPOINT) || url.endsWith(REAUTH_ENDPOINT)) {
            // login endpoint
            context.app.router.push(LOGIN_PAGE);
            return Promise.reject(error);
          } else if (error.response.status == 401 && !originalRequest._retry) {
            // unauthorized
            originalRequest._retry = true;
            return axios.post(REAUTH_ENDPOINT, {REFRESH_TOKEN: tokenStore.getRefreshToken()})
              .then(res => {
                if (res.status === AUTH_SUCCESS) {
                  const auth = tokenStore.getAuthString();
                  if (auth) {
                    originalRequest.headers['Authorization'] = auth;
                  }
                  return axios(originalRequest);
                }
              });
          } else {
            return Promise.reject(error);
          }
        }
      }
    );

    inject('axios', axios);
  }
;


export default axiosPlugin
