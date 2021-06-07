// import Cookies from 'js-cookie';
import { setStore, getStore } from '@/libs/storage'
const user = {
    state: {
        userInfo: {},
        companyList: [],
        currentCompany: {}
    },
    getters: {
        userInfo (state) {
            if (JSON.stringify(state.userInfo) !== '{}') {
                return state.userInfo
            } else {
                return getStore('userAppInfo') || {};
            }
        },
        companyList (state) {
            if (JSON.stringify(state.companyList) !== '[]') {
                return state.companyList
            } else {
                return getStore('companyList') || [];
            }
        },
        currentCompany (state) {
            if (JSON.stringify(state.currentCompany) !== '{}') {
                return state.currentCompany
            } else {
                return getStore('currentCompany') || {};
            }
        },
    },
    mutations: {
        logout () {
            // Cookies.remove('userInfo')
            // 清空打开的页面等数据
            window.localStorage.removeItem("userAppInfo")
        },
        setUserInfo(state,userAppInfo) {
            state.userInfo = userAppInfo;
            setStore('userAppInfo', userAppInfo)
        },
        setCurrentCompany (state, currentCompany) {
            state.currentCompany = currentCompany || {};
        },
        setCompanyList (state, companyList) {
            state.companyList = companyList || [];
        }
    },
    actions: {
    }
};

export default user;
