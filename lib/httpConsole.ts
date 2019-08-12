import { httpConsole } from './httpConsole';
import axios from 'axios';
import Cookie from 'js-cookie';
import { clearConsoleToken, getConsoleToken, toConsoleLogin } from './token';

interface HttpConfig {
  resCode?: string;
  resMsg?: string;
  data?: any;
}

class HttpError extends Error {
  public msg: string;
  public name = 'HttpError';
  public data: any;
  public code = '0';
  public constructor(message: string, data?: HttpConfig) {
    super(message);

    this.msg = message;
    if (data) {
      this.data = data ? (data.data ? data.data : data) : null;
      this.code = data.resCode || '';
    }
  }
  public toString() {
    return this.message;
  }
}

/**
 * 配置axios
 */

export const httpConsole = axios.create({
  baseURL: '/',
  headers: {
    Accept: 'application/json;version=3.0;compress=false',
    'Content-Type': 'application/json;charset=utf-8',
  },
  data: {},
});

/**
 * 请求拦截器，在发起请求之前
 */
httpConsole.interceptors.request.use(config => {
  const token = getConsoleToken();
  const utmSource = Cookie.get('utm_source');
  const utmMedium = Cookie.get('utm_medium');
  const utmCampaign = Cookie.get('utm_campaign');
  const utmTerm = Cookie.get('utm_term');

  const method = (config.method as string).toLocaleLowerCase();
  if (token) {
    config.headers.Authorization = token;
  }
  if (method === 'get') {
    if (typeof config.params !== 'object') {
      config.params = {};
    }

    // 兼容appserver的接口，appserver的接口token需要带在参数中，post请求也是一样
    if (token) {
      config.params.token = token;
    }
    if (utmSource) {
      config.params.utmSource = utmSource;
    }
    if (utmMedium) {
      config.params.utmMedium = utmMedium;
    }
    if (utmCampaign) {
      config.params.utmCampaign = utmCampaign;
    }
    if (utmTerm) {
      config.params.utmTerm = utmTerm;
    }

    config.params.requestId = Number(new Date());
  }

  const methods: string[] = ['post', 'put', 'patch', 'delete'];
  if (methods.indexOf(method) > -1 && typeof config.data !== 'string') {
    if (token) {
      config.data.token = token;
    }
    if (utmSource) {
      config.data.utmSource = utmSource;
    }
    if (utmMedium) {
      config.data.utmMedium = utmMedium;
    }
    if (utmCampaign) {
      config.data.utmCampaign = utmCampaign;
    }
    if (utmTerm) {
      config.data.utmTerm = utmTerm;
    }
    config.data.requestId = Number(new Date());
  }

  return config;
});

/**
 * 接口响应拦截器，在接口响应之后
 */
httpConsole.interceptors.response.use(
  config => {
    // 响应正常
    if (config.data.resCode === '000000') {
      return config.data.data;
    }
    // 需要登录（没登录或登录过期）
    else if (config.data.resCode === '200008') {
      clearConsoleToken();
      toConsoleLogin();
      return false;
    }

    if (config.status >= 200 && config.status < 300) {
      return config.data;
    }

    // reject错误处理
    return Promise.reject(new HttpError(config.data.resMsg, config.data));
  },
  error => {
    console.error('http:reject', error);
    // reject错误处理
    return Promise.reject(new HttpError('系统错误'));
  },
);