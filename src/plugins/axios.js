'use strict'

// import Vue from 'vue'
import axIos from 'axios';
import store from '../store'
import { Message} from "element-ui";
import router from "vue-router";

const _Message = Message;
// import QS from 'qs';

// Full config:  https://github.com/axios/axios#request-config
// axIos.defaults.baseURL = process.env.NODE_ENV ==='development'?'':'';
axIos.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axIos.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// axIos.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axIos.defaults.withCredentials = true

let pending = [];//声明一个数组用于存储每个ajax请求的取消函数盒ajax标识
let CancelToken = axIos.CancelToken;

//防止重复请求
let removePending = (ever) => {
    pending.forEach((item, index) => {
        if (item.u === ever.url + '&' + ever.method) {//当前请求在数组中存在时执行函数
            item.f(); //取消执行操作
            pending.splice(index, 1)
        }
    })
}
//取消全部请求
let removerAllPending = () => {
    if (pending.length > 0) {
        for (let p in pending) {
            pending[p].f()
        }
        pending = []
    }
}

let config = {
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
}

// let loading_axios = null

const createAxIos = axIos.create(config)

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
createAxIos.interceptors.request.use(config => {
    if (store.state.cancelStatic) {
        removerAllPending();
        store.commit('cancelStatic', false);
    }
    config.headers["Authorization"] = sessionStorage.getItem('token') || ''
    removePending(config);
    config.cancelToken = new CancelToken((c) => {
        pending.push({u: config.url + '&' + config.method, f: c})
    })
    // loading_axios = Loading.service({       // 发起请求时加载全局loading，请求失败或有响应时会关闭
    //     spinner: 'fa fa-spinner fa-spin fa-3x fa-fw',
    //     text: '拼命加载中...'
    // })
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
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error)
})

/** 添加响应拦截器  **/
createAxIos.interceptors.response.use(response => {
    // loading_axios.close()
    removePending(response.config)
    if (response.status === 200) {
        return Promise.resolve(response.data)
    } else {
        Message({
            message: response.data.message,
            type: 'error'
        })
        return Promise.reject(response.data.message)
    }
}, error => {
    // loading_axios.close()
    if (error.response) {
        // 根据请求失败的http状态码去给用户相应的提示
        let tips = error.response.status in httpCode ? httpCode[error.response.status] : error.response.data.message
        _Message({
            message: tips,
            type: 'error'
        })
        if (error.response.status === 404){
            router.push('/404')
        }
        if (error.response.status === 401) {    // token或者登陆失效情况下跳转到登录页面，根据实际情况，在这里可以根据不同的响应错误结果，做对应的事。这里我以401判断为例
            sessionStorage.clear()
            // router.push({
            //     path: `/login`
            // })
        }
        return Promise.reject(error)
    } else {
        _Message({
            message: '请求超时, 请刷新重试',
            type: 'error'
        })
        return Promise.reject(new Error('请求超时, 请刷新重试'))
    }
})

/* 统一封装get请求 */
export const getAjax = (url, params, config = {}) => {
    return new Promise((resolve, reject) => {
        createAxIos({
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
        createAxIos({
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

/* 中断请求 */
// export const cancelAxIos = () =>{
//     source.token
// }
