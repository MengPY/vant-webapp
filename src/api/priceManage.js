import axios from "@/libs/axios"
import common from "./constants"

let server = common.interfacePath.server;

let service = {

	basic: server + "/basic",

}

export const api = {
	//  会员行情价格分页查询
	memberQueryMarketPricePage: params => {
		return axios.post(service.basic + `/p/comInfo/queryMarketPricePage`, params)
	},
	//  公告/行情价格详情
	queryDetail: params => {
		return axios.get(service.basic + `/p/comInfo/queryDetail`, { params })
	}

}

export default api
