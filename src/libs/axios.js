import Vue from 'vue'
import Axios from 'axios'
import vm from '@/main.js'
import util from "@/libs/util.js";
import { router } from '@/router/index';
// import { Message } from 'view-design'
Vue.prototype.$http = Axios;


const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
}

Axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
// http response 拦截器
var axios = Axios.create({
    timeout: 120 * 1000,
    transformRequest: [
        function (data, xhr) {
            let token = localStorage.getItem('token')
            xhr.Authorization = token || '';
            // if (window.localStorage.getItem("currentOnlcikMenuNo")) {
            //     xhr.currentUserClickMenu = window.localStorage.getItem("currentOnlcikMenuNo")
            // }
            // if (window.localStorage.getItem("department")) {
            //     xhr.selectedOrgCode = JSON.parse(window.localStorage.getItem("department")).departmentCode
            // }
            return JSON.stringify(data)
        },
    ],
    transformResponse: [
        // 请求回来的数据做处理
        function (data, xhr) {
            if (xhr.authorization || xhr.Authorization) {
                // 存
                let userPfInfo = JSON.parse(window.localStorage.getItem("userAppInfo"))
                // userPfInfo.login = true;

                userPfInfo.token = xhr.authorization || xhr.Authorization
                //设置loacstrong
                window.localStorage.setItem("userAppInfo", JSON.stringify(userPfInfo))
            }
            let newData
            if (data) {
                // if (data.indexOf("<!DOCTYPE html>") >= 0) return

                if (data.indexOf("{") == 0) {
                    newData = JSON.parse(data)
                    // util.parseReponse(newData)
                } else {
                    newData = data
                }
            }
            return newData
        },
    ],
})
const CancelToken = Axios.CancelToken,
    noRepeatSwitch = true//防重复开关
let requestinfgList = []

function generateReq (config) {
    return config.url + config.data + "&" + config.method
}
function handleApiConfig (config, callBack) {
    for (let index = 0; index < requestinfgList.length; index++) {
        const el = requestinfgList[index]
        if (el.req === generateReq(config)) {
            callBack(el, index)
            break
        }
    }
}

let cancelFn = {
    CancelToken: Axios.CancelToken,
    cancelQueue: [],
    add (request) {
        request.cancelToken = new cancelFn.CancelToken(function executor (c) {
            // executor 函数接收一个 cancel 函数作为参数
            cancelFn.cancelQueue.push(c);
        });
    },
    delete () {
        cancelFn.cancelQueue.forEach((cancel, index) => {

            cancel();
        })
        cancelFn.cancelQueue.splice(0);
    }
};

let addParams = (data) => {
    let params = {};
    params['t'] = Date.now();
    data = Object.assign(data || {}, params);
    return data;
}


axios.interceptors.request.use(requestConfig => {
    cancelFn.add(requestConfig)
    let { params, data, method } = requestConfig;
    if (method === 'get') {
        requestConfig.params = addParams(params);
    }
    return requestConfig;
})

axios.interceptors.response.use(
    response => {

        const data = response.data;
        switch (data.code) {
            //没有认证
            case "TK01":
                router.push('/login');
                cancelFn.delete();
                break;
            case "TK02":
                router.push('/login');
                cancelFn.delete();
                break;
            case "TK05":
                router.push('/login');
                cancelFn.delete();
                break;
        }

        return response;
    },
    error => {
        console.log(error.message.includes('504'))
        if (error.message.includes('504')) {
            // Message.error('服务请求超时')
            return Promise.reject(error)
        }

    }
);

let requestMethods = ['post', 'get', 'put'], axios_ = {}
for (let i = 0; i < requestMethods.length; i++) {
    const el = requestMethods[i]
    axios_[el] = (url, params) => {
        return new Promise((resolve, reject) => {
            axios[el](url, params).then(res => {//通过axios实例发起请求
                resolve(res)
            }, error => {
                if (Axios.isCancel(error)) {
                    console.log('频繁请求：url', url)
                } else {
                    reject(error)
                }
            })
        })
    },
        //单个接口超时设置
        axios_.postConfig = (url, data = {}, config = {}) => {
            return new Promise((resolve, reject) => {
                axios
                    .post(url, data, config)
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }

}
const mainAxios = axios_
export default mainAxios

export {
    axios
}

export const post = (url, options) => (params) => mainAxios.post(url, params, options)

export const get = (url, options) => (params) => mainAxios.get(url, { params, ...options })
