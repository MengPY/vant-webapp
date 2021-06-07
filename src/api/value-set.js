
import { get } from '@/libs/axios';
import common from './constants';
import store from '../store';
let basic = common.interfacePath.basic;
import valueSetCode from './value-set-config'
// 配置
/**
 * @param {String} url 请求的路径
 * @param {Object} valueSetCodeObj 路由和valueSet的配置
 */

let OPTIONS = {
	url: null,
	valueSetCodeObj: null

}



let getParams = (routerName = '') => (
	{ setCodes: OPTIONS.valueSetCodeObj[routerName] && OPTIONS.valueSetCodeObj[routerName].join(',') }
)


let requestFn = (routerName, type = 'byRouter') => {

	let url = OPTIONS.url;
	if (url === null || OPTIONS.valueSetCodeObj === null) {
		throw new Error('value-set OPTIONS 缺少配置')
	}
	// console.log(routerName, getParams(routerName), OPTIONS.valueSetCodeObj);

	// if (!getParams(routerName).setCodeList && type == 'byRouter') {
	// 	return Promise.resolve({})
	// }
	return get(url)(getParams(routerName));
}

// 数据格式化
let dataFormat = (data) => {
	let result = {};
	if (data && typeof (data.data) == 'object') {
		for (var key in data.data) {
			result[key] = data.data[key].map(({ id, itemCode, itemName, setName, status }) => {
				return { id, itemCode, itemName, setName, status }
			});
		}
	}
	return result;
}


export let setValueSetConfig = (userConfig) => {
	OPTIONS = userConfig;
}

//直接获取
export const getValueCodeDirect = async (routerName) => {
	let { data } = await requestFn(routerName, 'direct');
	// localStorage.setItem('codeSet', JSON.stringify(dataFormat(data)));
	return dataFormat(data)
}


//router 全局路由获取
export let getValueSetByRouter = async (routerName, router) => {

	let { data } = await requestFn(routerName)
	if (!data.data) {
		localStorage.setItem('codeSet', '{}');
		return;
	}
	let currentRouter = router.currentRoute.name;
	localStorage.setItem('codeSet', JSON.stringify(dataFormat(data)));
	return dataFormat(data);

}




setValueSetConfig({
	url: basic + "/s/config/queryMostCodeSet",
	valueSetCodeObj: valueSetCode
})
let getValueSetCode = async (routerName, router) => {
	console.log(routerName)
	// 解决初始化值集报错
	let initCodeValue = () => {
		let obj = {};
		if (!valueSetCode[routerName]) {
			return 'no result';
		}
		valueSetCode[routerName].forEach(key => {
			obj[key] = [];
		})
		store.dispatch('setValueSetCode', obj)
	}
	if (initCodeValue() === 'no result') return;
	let result = await getValueSetByRouter(routerName, router);
	// console.log(result)
	store.dispatch('setValueSetCode', result)
}

//直接获取
export const getValueCode = async (routerName) => {
	return await getValueCodeDirect(routerName)
}
export default getValueSetCode

