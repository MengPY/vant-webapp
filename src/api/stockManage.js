import axios from "@/libs/axios"
import common from "./constants"

let server = common.interfacePath.server;
let openApi = common.interfacePath.openApi;
let member = common.interfacePath.member;
let service = {

	storage: server + "/storage",
	commodity: server + "/commodity"

}

export const api = {
	//  顶级类目查询（简化不带分页）
	catQueryTopNew: params => {
		return axios.get(service.commodity + `/m/catQueryTopNew`, { params })
	},
	// /m//m/catSearchQuery 类目搜索且分页 根据分类id查询子级分类列表
	catSearchQueryNew: params => {
		return axios.get(service.commodity + `/m/catSearchQueryNew`, { params })
	},
	//  汇总库存列表
	summaryStockList: params => {
		return axios.post(service.storage + `/w/stock/queryList`, params)
	},
	//  批次库存列表
	queryStockSubList: params => {
		return axios.post(service.storage + `/w/stockSub/queryStockSubList`, params)
	},
	//  锁库日志列表
	queryListByStockId: params => {
		return axios.post(service.storage + `/w/stockRecordLock/queryListByStockId`, params)
	},
	//  根据库存编号查询库存当前锁定量分组统计
	queryStockLockGroupBusinessCode: params => {
		return axios.get(service.storage + `/w/stockRecordLock/queryStockLockGroupBusinessCode`, { params })
	},
	//  库存批次日志列表
	queryListByStockSubId: params => {
		return axios.get(service.storage + `/w/stockRecord/queryListByStockSubId`, { params })
	},
	//  批次库存详情
	stockSubDetail: params => {
		return axios.get(service.storage + `/w/stockSub/detail`, { params })
	}
}

export default api
