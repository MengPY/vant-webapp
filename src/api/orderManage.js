import axios from "@/libs/axios"
import common from "./constants"

let server = common.interfacePath.server;
let openApi = common.interfacePath.openApi;
let member = common.interfacePath.member;
let service = {
    basic: server + "/basic",
    order: server + "/order",
    trade: server + "/trade",
    commodity: server + "/commodity",
    logistics: server + "/logistics",
    storage: server + "/storage",
    member
}

export const api = {
    getSkuList:  (params) => {
      return axios.get(service.trade + "/publish/getPublishSelectOption", {params})
    },
    // 订单列表
    getOrderList: (params) => {
        return axios.get(service.order + "/order/list", {params})
    },
    // 订单详情
    getOrderDetail: (params) => {
      return axios.get(service.order + "/order/get", {params})
    },
    // 关闭订单
    orderClose: (params) => {
      return axios.get(service.order + "/order/close", {params})
    },
    // 订单确认-内勤
    orderConfirm: (params) => {
      return axios.post(service.order + "/order/confirm", params)
    },
    // 订单确认-信息修改
    orderUpdate: (params) => {
      return axios.post(service.order + "/order/updateOrder", params)
    },

    // 订单签署确认 线上&&线下
    orderSignConfirm: (params) => {
      return axios.post(service.order + "/order/signCheck", params)
    },
    // 订单生效确认 线上&&线下
    orderValidateConfirm: (params) => {
      return axios.get(service.order + "/order/validateCheck", {params})
    },
    orderValidateConfirmEdit: (params) => {
      return axios.post(service.order + "/order/validateCheck", params)
    },
    // 订单完成
    orderComplete: (params) => {
      return axios.get(service.order + "/order/complete", {params})
    },

    // 查询会员关联组织下的业务员
    queryByMemberByIdAndOrgId: (params) => {
      return axios.post(service.member + "/m/memberSalesman/queryByMemberIdAndOrgId", params)
    },
    // 采购合同查询
    getPurchaseOrderList: (params) => {
      return axios.post(openApi + "/sap/query/zifQuryFuny001", params)
    },

    // 追加订单明细
    addOrderDetail: (params) => {
      return axios.post(service.order + "/order/addOrderDetail", params)
    },

    // 代客下单（卖家功能）
    proxyCreateOrder: (params) => {
      return axios.post(service.order + "/order/proxyCreateOrder", params)
    },

    // 已上架挂牌选择列表
    listPublishSelectOption: (params) => {
      return axios.get(service.trade + "/publish/listPublishSelectOption", {params})
    },
    
    exportListPublish: service.trade + '/publish/exportPublishTemp',

    querySkuFromPublishTemp: service.trade + '/publish/querySkuFromPublishTemp',

    // sku查询计量单位
    queryBasicunit: (params) => {
      return axios.post(service.commodity + "/m/basicunit/queryBasicunit", params)
    },
    // 客户收获地址
    queryCustomerAddress: (params) => {
      return axios.get(service.logistics + "/t/shippingAddress/platQueryMemberAddress", {params})
    },
    // 通过memberId查询车辆信息
    getVehicleByMemberId: (params) => {
      return axios.get(service.logistics + "/vehicle/getVehicleByMemberId", {params})
    },
    // 订单操作记录列表
    updateListByOrder: (params) => {
      return axios.get(service.order + "/operateRecord/listByOrder", {params})
    },
    // 主管复核
    recheckConfirm: (params) => {
      return axios.get(service.order + "/order/managerCheck", {params})
    },
    // 同步审批工作流状态
    syncApprovalWorkflowStatus: (params) => {
      return axios.get(service.order + "/order/syncApprovalWorkflowStatus", {params})
    },
    // 查询资金信息
    getFundInfo: (params) => {
      return axios.get(service.order + "/external/getFundInfo", {params})
    },

    //出库申请
    queryOutApplyListByFront: params => { return axios.post(`${service.storage}/w/outApply/queryOutApplyListByFront`, params); },

    //出库实际
    getActualList: params => { return axios.get(`${service.storage}/w/outActual/queryByOrderCode`, {params}); },


    getSupplierNameList: (params) => {
      return axios.get(service.basic + "/s/config/queryCodeSetBylike", {params})
    },

    getOADetail: (params) => {
      return axios.get(openApi + "/oa/getRequestLog", {params})
    },

    getSignFileUrl: openApi + "/oa/fileDownloadForJD",

    // 采购文件导出
    ExportPurchaseFileUrl: service.order + "/order/exportOrderExcel",
    // 合同文件导出
    ExportContractFileUrl: service.order + "/order/exportContractExcel"
  
    
}

export default api
