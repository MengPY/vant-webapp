export default [
  { 
    path: 'customer-list', 
    meta: {
        title: '部门客户',
    }, 
    name: 'customer-list', component: () => import('@/views/customer/customer-list.vue') 
  },
  { 
    path: 'customer-detail-company', 
    meta: {
        title: '企业客户详情',
    }, 
    name: 'customer-detail-company', component: () => import('@/views/customer/customer-detail-company.vue') 
  },
  { 
    path: 'customer-detail-personal', 
    meta: {
        title: '个人客户详情',
    }, 
    name: 'customer-detail-personal', component: () => import('@/views/customer/customer-detail-personal.vue') 
  },
]