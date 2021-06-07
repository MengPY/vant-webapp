import axios from "@/libs/axios"
import common from "./constants"

let server = common.interfacePath.server;
let openApi = common.interfacePath.openApi;
let member = common.interfacePath.member;
let service = {
    order: server + "/order",
    basic: server + "/basic",
    storage: server + "/storage",
    operation: server + "/operation",
    member: server + '/member',
    fund: server + '/fund'
}

export const api = {

    // 工作台客户数量统计
    queryCustomerCount: (params) => {
        return axios.get(service.member + "/p/member/queryStatisticalCount", { params })
    },
    //  部组客户总量
    queryRelationGroupMember: params => {
        return axios.get(service.member + `/p/member/queryRelationGroupMember`, { params })
    },
    //  部组客户总量导出
    queryRelationGroupMemberExport: service.member + `/p/member/queryRelationGroupMemberExport`,
    // 常用菜单列表
    queryCommonlyUsedList: (params) => {
        return axios.get(service.basic + "/p/rms/queryCommonlyUsedList", { params })
    },
    // 常用菜单新增
    saveCommonlyUsed: (params) => {
        return axios.post(service.basic + "/p/rms/saveCommonlyUsed", params)
    },
    // 当月出仓总量,(searchType: 0按小区；1按业务员)
    outStorageSumForMonth: (params) => {
        return axios.get(service.storage + "/w/statistics/outStorageSumForMonth", { params })
    },

    // 库存总量
    getStroageSum: (params) => {
        return axios.get(service.storage + "/w/statistics/stroageSum", { params })
    },
    // 当月累计入库量
    inStroageSumForMonth: (params) => {
        return axios.get(service.storage + "/w/statistics/inStroageSumForMonth", { params })
    },
    // 超期库存总量
    getOverdueStroageSum: (params) => {
        return axios.get(service.storage + "/w/statistics/overdueStroageSum", { params })
    },
    //  当月出仓总量列表
    outStorageSumListForMonth: params => {
        return axios.post(service.storage + `/w/statistics/outStorageSumListForMonth`, params)
    },
    //  当月出仓总量列表导出
    outStorageSumListForMonthExport: service.storage + `/w/statistics/outStorageSumListForMonthExport`,

    // 待办事项
    getToDoList: (params) => {
        return axios.get(service.operation + "/p/todo", { params })
    },
    // 待办事项
    getToDoListSaleMan: (params) => {
        return axios.get(service.operation + "/p/salesman/todo", { params })
    },
    //  查询当前人能操作的部门(业务组)列表
    queryManageOrgList: params => {
        return axios.get(service.member + `/p/organization/queryManageOrgList`, { params })
    },
    //  库存总量列表
    stroageSumList: params => {
        return axios.post(service.storage + `/w/statistics/stroageSumList`, params)
    },
    //库存导出
    stroageSumListExport: service.storage + `/w/statistics/stroageSumListExport`,
    //  超期库存总量列表
    overdueStroageSumList: params => {
        return axios.post(service.storage + `/w/statistics/overdueStroageSumList`, params)
    },
    //  超期库存总量列表导出
    overdueStroageSumListExport: service.storage + `/w/statistics/overdueStroageSumListExport`,
    //  当月销售订单（内勤已确认）——明细
    countOrderSalesByCurrentMonth: params => {
        return axios.get(service.order + `/dashboard/seller/countOrderSalesByCurrentMonth`, { params })
    },
    // 按订单状态统计
    countOrderSalesByStatus: params => {
        return axios.get(service.order + `/dashboard/seller/countOrderSalesByStatus`, { params })
    },

    // 待入库发货明细 报表
    waitPutStorageStatistical: params => {
        return axios.get(service.order + `/shipment/waitPutStorageStatistical`, { params })
    },

    // 到货确认数量最多前十家客户
    getWaitCustomerConfirmData: params => {
        return axios.get(service.operation + `/p/confirmOrder/weightTop`, { params })
    },

    // 结算单出具及未确认信息TOP10
    getStatementNotConfirmList: params => {
        return axios.post(service.fund + `/statement/searchByManager`, params)
    },

    // 当月库存总量TOP5
    stroageSumForMonthTopFive: params => {
        return axios.get(service.storage + `/w/statistics/stroageSumForMonthTopFive`, { params })
    },
    // 已收货未出仓库存 TOP5
    stroageSumNotOutTopFive: params => {
        return axios.get(service.storage + `/w/statistics/stroageSumNotOutTopFive`, { params })
    },




    //  当月销售订单（内勤已确认）——明细 GET

    countOrderSalesForManager: params => {
        return axios.get(service.order + `/dashboard/seller/countOrderSalesForManager`, { params })
    },
    //  当月销售订单——管理者——导出EXCEL
    exportOrderSalesForManager: service.order + `/dashboard/seller/exportOrderSalesForManager`,
    queryChildOrg: params => {
        return axios.get(service.member + `/c/organization/queryChildOrg`, { params })
    }




}

export default api
