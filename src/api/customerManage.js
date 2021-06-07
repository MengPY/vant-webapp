import axios from "@/libs/axios"
import common from "./constants"

let server = common.interfacePath.server;
let openApi = common.interfacePath.openApi;
let member = common.interfacePath.member;
let service = {
    logistics: server + "/logistics",
    member
}

export const api = {
    // 查询当前部门下所有客户
    getCustomerList: (params) => {
        return axios.get(service.member + "/c/organization/queryCustomer", { params })
    },
    // 查询所有客户
    getAllCustomerList: (params) => {
        return axios.get(service.member + "/c/organization/queryAllCustomer", { params })
    },

    // 查询仓储客户
    getStorageList: (params) => {
        return axios.get(service.member + "/p/queryAllStrorageEnt", { params })
    },

    // 企业用户信息查询
    getCustomerDetail: (params) => {
        return axios.get(service.member + "/p/company/find", { params })
    },
    // 个人客户信息查询
    getCustomerDetailPersonal: (params) => {
        return axios.get(service.member + "/a/find/employee/by/memberId", { params })
    },
    // 个人信息
    getCustomerDetailQueryMyIDCard: (params) => {
        return axios.get(service.member + "/m/file/queryMyIDCard", { params })
    },
    // 查询客户关联部组
    getDepartGroupList: (params) => {
        return axios.get(service.member + "/c/organization/queryDepartGroup", { params })
    },
    // 客户管理-保存部组授权
    setCustomerGroupList: (params) => {
        return axios.post(service.member + "/m/member/saveOrg", params)
    },
    // 客户管理-查询可关联的业务员
    getSalesmanList: (params) => {
        return axios.get(service.member + "/m/member/querySalesman", { params })
    },
    // 客户管理-保存业务员授权
    setSalesmanList: (params) => {
        return axios.post(service.member + "/m/member/saveSalesman", params)
    },
    // 查询会员下的所有员工
    getCustomerStaffList: (params) => {
        return axios.get(service.member + "/a/employee/memberEmployee", { params })
    },
    //品类授权查询
    getCategoryList: (params) => {
        return axios.get(service.member + "/c/orgCategory/queryOrgCategoryWithMemberCategory", { params })
    },
    //客户管理-保存品类授权
    setCategoryList: (params) => {
        return axios.post(service.member + "/m/member/saveCategory", params)
    },
    //查询客户社会情况
    querySocialSituation: (params) => {
        return axios.get(openApi + "/mdm/querySocialSituation", { params })
    },
    //客户管理-解禁
    undisableCustomer: (params) => {
        return axios.post(service.member + "/m/member/ban", params)
    },
    //客户管理-禁用
    disableCustomer: (params) => {
        return axios.post(service.member + "/m/member/disable", params)
    },
    //平台禁用客户
    disablePlatCustomer: (params) => {
        return axios.post(service.member + "/m/member/platDisable", params)
    },
    //客户管理-禁用列表
    getDisableCustomerList: (params) => {
        return axios.get(service.member + "/m/member/disableList", { params })
    },

    //客户管理-平台禁用列表
    getPlatDisableCustomerList: (params) => {
        return axios.get(service.member + "/m/member/platDisableList", { params })
    },



    //客户分组列表
    getCustomerGroupList: (params) => {
        return axios.get(service.member + "/m/member/queryGroup", { params })
    },
    //新增或修改客户组
    saveOrUpdateGroup: (params) => {
        return axios.post(service.member + "/m/member/saveOrUpdateGroup", params)
    },
    //删除客户组
    deleteGroup: (params) => {
        return axios.post(service.member + "/m/member/deleteGroup", params)
    },
    //客户组查询已关联客户
    queryGroupMember: (params) => {
        return axios.get(service.member + "/m/member/queryGroupMember", { params })
    },
    //客户组查找未关联客户
    queryGroupMemberNotRelation: (params) => {
        return axios.get(service.member + "/m/member/queryGroupNotRelationMember", { params })
    },

    //客户组移入客户
    addGroupMember: (params) => {
        return axios.post(service.member + "/m/member/addGroupMember", params)
    },

    //客户组移除客户
    removeGroupMember: (params) => {
        return axios.post(service.member + "/m/member/removeGroupMember", params)
    },

    //游客查询
    queryTourists: (params) => {
        return axios.get(service.member + "/m/member/queryTourists", { params })
    },

    //国贸端车辆管理分页
    getDeliveryCarrierList: (params) => {
        return axios.post(service.logistics + "/t/vehicle/backStage/page", params)
    },

    //国贸端车辆管理删除
    delDeliveryCarrierList: (params) => {
        return axios.post(service.logistics + "/t/vehicle/delete", params)
    },

    //国贸端车辆管理新增
    addDeliveryCarrier: (params) => {
        return axios.post(service.logistics + "/t/vehicle/addVehicle", params)
    },

    //国贸端车辆管理编辑
    editDeliveryCarrier: (params) => {
        return axios.post(service.logistics + "/t/vehicle/update", params)
    },

    //国贸端车辆管理详情
    getDeliveryCarrierDetail: (params) => {
        return axios.post(service.logistics + "/t/vehicle/select", params)
    },

    //国贸端提货人管理分页
    getDeliveryPersonList: (params) => {
        return axios.post(service.logistics + "/t/consignee/backStage/page", params)
    },
    //国贸端提货人新增
    addDeliveryPerson: (params) => {
        return axios.post(service.logistics + "/t/consignee/addConsignee", params)
    },
    //国贸端提货人编辑
    editDeliveryPerson: (params) => {
        return axios.post(service.logistics + "/t/consignee/update", params)
    },

    //国贸端提货人详情
    getDeliveryPersonDetail: (params) => {
        return axios.post(service.logistics + "/t/consignee/select", params)
    },

    //国贸端提货人删除
    delDeliveryPerson: (params) => {
        return axios.post(service.logistics + "/t/consignee/delete", params)
    },

    //国贸端收货地址管理分页
    getReceiveAddressList: (params) => {
        return axios.post(service.logistics + "/t/shippingAddress/backStage/page", params)
    },
    //国贸端收货地址新增
    addReceiveAddress: (params) => {
        return axios.post(service.logistics + "/t/shippingAddress/backStage/add", params)
    },

    //国贸端收货地址编辑
    editReceiveAddress: (params) => {
        return axios.post(service.logistics + "/t/shippingAddress/update", params)
    },

    //国贸端收货地址删除
    delReceiveAddress: (params) => {
        return axios.post(service.logistics + "/t/shippingAddress/delete", params)
    },

    //国贸端收货地址设为默认
    setReceiveAddressDefault: (params) => {
        return axios.post(service.logistics + "/t/shippingAddress/set", params)
    },

    //设置证书类型
    saveSignCertType: (params) => {
        return axios.post(service.member + "/p/saveSignCertType", params)
    },
    // 平台客户导出
    exportAllCustomer: service.member + `/p/exportAllCustomer`








}

export default api
