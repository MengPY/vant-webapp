// 统一请求路径前缀在libs/axios.js中修改
import axios from '@/libs/axios';
import common from './constants';

let server = common.interfacePath.server;
let service = {
  member: server + '/member',
  basic: server + '/basic'
}
//接口
export const api = {
  axios,
  // 初始化验证码
  initCaptcha: (params) => {
    return axios.get(service.member + "/n/captcha", {params})
  },
  //登录
  login: (params) => {
      params = {
          platform: "web",
          ...params,
      }
      return axios.post(service.member + "/n/login/admin", params)
  },
  //获取公司
  getCompanyList: (params) => {
    return axios.get(service.member + "/c/organization/getEmployeePostOrganization", {params})
  },
  //获取用户信息
  getUserInfoByTicket: (params) => {
    return axios.get(service.member + "/n/login/admin/app", {params})
  },
  // 左侧菜单
  getMenuList: (params) => {
    return axios.get(service.basic + "/t/rms/platQueryPrivilegeMenuButton", {params})
  },
  //用户切换组织
  switchOrg: (params) => {
      return axios.post(service.member + "/p/org/switchOrg", params)
  },
}
//上传地址
export const upload = {
    server
}

export default api;
