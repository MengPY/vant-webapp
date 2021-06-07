export default [
  { 
    path: 'order-detail', 
    meta: {
        title: '订单详情',
    }, 
    name: 'order-detail', component: () => import('@/views/order/order-detail.vue') 
  },
]