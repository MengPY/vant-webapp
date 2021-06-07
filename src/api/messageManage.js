import axios from "@/libs/axios"
import common from "./constants"

let server = common.interfacePath.server;

let service = {

	basic: server + "/basic",

}

export const api = {
	//   消息通知列表查询
	messageList: params => {
		return axios.post(service.basic + `/m/query/msg/list`, params)
	},
	msgresclceStaus: params => {
		return axios.post(service.basic + `/p/update/recipients`, params)
	},


}

export default api
