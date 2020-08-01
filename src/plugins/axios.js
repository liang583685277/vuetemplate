'use strict'

// import Vue from 'vue'
import axIos from 'axios'
import {Loading, Message} from "element-ui";
// import QS from 'qs';

// Full config:  https://github.com/axios/axios#request-config
// axIos.defaults.baseURL = process.env.NODE_ENV ==='development'?'':'';
axIos.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axIos.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// axIos.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
    // baseURL: process.env.baseURL || process.env.apiUrl || ""
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
}

let loading_axios = null

const _axios = axIos.create(config)

let httpCode = {        //这里我简单列出一些常见的http状态码信息，可以自己去调整配置
    400: '请求参数错误',
    401: '权限不足, 请重新登录',
    403: '服务器拒绝本次访问',
    404: '请求资源未找到',
    500: '内部服务器错误',
    501: '服务器不支持该请求中使用的方法',
    502: '网关错误',
    504: '网关超时'
}

/** 添加请求拦截器 **/
_axios.interceptors.request.use(config => {
    config.headers['token'] = sessionStorage.getItem('token') || ''
    loading_axios = Loading.service({       // 发起请求时加载全局loading，请求失败或有响应时会关闭
        spinner: 'fa fa-spinner fa-spin fa-3x fa-fw',
        text: '拼命加载中...'
    })
    if (config.method === 'get') { // 添加时间戳参数，防止浏览器（IE）对get请求的缓存
        config.params = {
            ...config.params,
            // t: new Date().getTime()
        }
    }
    // 在这里：可以根据业务需求可以在发送请求之前做些什么:例如我这个是导出文件的接口，因为返回的是二进制流，所以需要设置请求响应类型为blob，就可以在此处设置。
    if (config.url.includes('pur/contract/export')) {
        config.headers['responseType'] = 'blob'
    }
    // 我这里是文件上传，发送的是二进制流，所以需要设置请求头的'Content-Type'
    if (config.url.includes('pur/contract/upload')) {
        config.headers['Content-Type'] = 'multipart/form-data'
    }
    return config
}, error=> {
    // 对请求错误做些什么
    return Promise.reject(error)
})

/** 添加响应拦截器  **/
_axios.interceptors.response.use(response => {
    loading_axios.close()
    if (response.status === 200) {
        return response.data
        // return Promise.resolve(response.data)
    } else {
        Message({
            message: response.data.message,
            type: 'error'
        })
        return Promise.reject(response.data.message)
    }
}, error => {
    loading_axios.close()
    console.log(error)
    if (error.response) {
        // 根据请求失败的http状态码去给用户相应的提示
        let tips = error.response.status in httpCode ? httpCode[error.response.status] : error.response.data.message
        Message({
            message: tips,
            type: 'error'
        })
        if (error.response.status === 401) {    // token或者登陆失效情况下跳转到登录页面，根据实际情况，在这里可以根据不同的响应错误结果，做对应的事。这里我以401判断为例
            // router.push({
            //     path: `/login`
            // })
        }
        return Promise.reject(error)
    } else {
        Message({
            message: '请求超时, 请刷新重试',
            type: 'error'
        })
        return Promise.reject(new Error('请求超时, 请刷新重试'))
    }
})

/* 统一封装get请求 */
export const getAjax = (url, params, config = {}) => {
    return new Promise((resolve, reject) => {
        _axios({
            method: 'get',
            url,
            params,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

/* 统一封装post请求  */
export const postAjax = (url, data, config = {}) => {
    return new Promise((resolve, reject) => {
        _axios({
            method: 'post',
            url,
            data,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}


// _axios.interceptors.request.use(
//     function (config) {
//         // Do something before request is sent
//         if (localStorage.getItem('token')) {
//             config.headers.Authorization = sessionStorage.getItem('token');
//         }
//         return config
//     },
//     function (error) {
//         // Do something with request error
//         return Promise.reject(error)
//     }
// )

// Add a response interceptor
// _axios.interceptors.response.use(
//     function (response) {
//         // Do something with response data
//         return response
//     },
//     function (error) {
//         // Do something with response error
//         return Promise.reject(error)
//     }
// )

// eslint-disable-next-line no-unused-vars
// Plugin.install = function (Vue, options) {
//     Vue.axios = _axios
//     window.axios = _axios
//     Object.defineProperties(Vue.prototype, {
//         axios: {
//             get() {
//                 return _axios
//             }
//         },
//         $axios: {
//             get() {
//                 return _axios
//             }
//         }
//     })
// }
//
// Vue.use(Plugin)
//
// export default Plugin
