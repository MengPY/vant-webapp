import axios from "@/libs/axios"
import common from "./constants"

let server = common.interfacePath.server;

let service = {

	storage: server + "/storage",
	member: server + "/member"

}

export const api = {
	//  库存总量列表
	stroageSumList: params => {
		return axios.post(service.storage + `/w/statistics/stroageSumList`, params)
	},
	//  库存总量导出
	stroageSumListExport: service.storage + `/w/statistics/stroageSumListExport`,
	//  超期库存总量列表
	overdueStroageSumList: params => {
		return axios.post(service.storage + `/w/statistics/overdueStroageSumList`, params)
	},
	//  超期库存总量列表导出
	overdueStroageSumListExport: service.storage + `/w/statistics/overdueStroageSumListExport`,
	//  查询当前人能操作的部门(业务组)列表
	queryManageOrgList: params => {
		return axios.get(service.member + `/p/organization/queryManageOrgList`, { params })
	},
	//  当月出仓总量列表
	outStorageSumListForMonth: params => {
		return axios.post(service.storage + `/w/statistics/outStorageSumListForMonth`, params)
	},
	//  当月出仓总量列表导出
	outStorageSumListForMonthExport: service.storage + `/w/statistics/outStorageSumListForMonthExport`,
	// 管理区域列表
	queryChildOrg: params => {
		return axios.get(service.member + `/c/organization/queryChildOrg`, { params })
	}


}

export default api
