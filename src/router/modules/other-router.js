export default [

  {
    path: 'stock/batch-log',
    meta: {
      title: '批次库存日志',
    },
    name: 'batch-log', component: () => import('@/views/stock/stocklog/batch-log.vue')
  },
  {
    path: 'stock/summary-log',
    meta: {
      title: '汇总库存日志',

    },
    name: 'summary-log', component: () => import('@/views/stock/stocklog/summary-log.vue')
  },
  {
    path: 'stock/batch-detail',
    meta: {
      title: '批次库存详情'
    },
    name: 'batch-detail', component: () => import('@/views/stock/stockdetail/batch-detail.vue')
  },
  {
    path: 'stock/summary-detail',
    meta: {
      title: '汇总库存详情'
    },
    name: 'summary-detail', component: () => import('@/views/stock/stockdetail/summary-detail.vue')
  },
  {
    path: 'pirce/Industry-price',
    meta: {
      title: '行情价格'
    },
    name: 'Industry-price', component: () => import('@/views/pirce/Industry-price')
  }, {
    path: 'pirce/price-detail',
    meta: {
      title: '行情价格详情'
    },
    name: 'price-detail', component: () => import('@/views/pirce/price-detail')
  },
  {
    path: 'price/lock-bill',
    meta: {
      title: '汇总库存锁单据'
    },
    name: 'lock-bill', component: () => import('@/views/stock/stocklog/lock-bill')
  },
  {
    path: 'statisticalPage/stock-total',
    meta: {
      title: '库存总数量'
    },
    name: 'stock-total', component: () => import('@/views/statisticalPage/stock-total')
  },
  {
    path: 'statisticalPage/stock-outdate',
    meta: {
      title: '超期库存总数量'
    },
    name: 'stock-outdate', component: () => import('@/views/statisticalPage/stock-outdate')
  },
  {
    path: 'statisticalPage/output-total',
    meta: {
      title: '当月出仓总量'
    },
    name: 'output-total', component: () => import('@/views/statisticalPage/output-total')
  },
  {
    path: 'message/list',
    meta: {
      title: '我的消息'
    },
    name: 'messageList', component: () => import('@/views/message/list')
  }
]