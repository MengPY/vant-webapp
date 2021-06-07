<template>
  <div class="order-wrap">
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
      <van-sticky>
        <van-search
          v-model="QueryForm.orderNo"
          show-action
          placeholder="订单编号筛选"
          @search="getDataList"
        >
          <template #action>
            <div @click="showFilter" class="filter-box">
              <i class="iconfont">&#xe7cc;</i>
              <p>筛选</p>
            </div>
          </template>
        </van-search>
        <van-tabs color="#0072BC" title-active-color="0072BC" @change="tabChange" v-model="tabName">
          <van-tab title="全部" name="00"></van-tab>
          <van-tab title="待生效" name="20"></van-tab>
          <van-tab title="已生效" name="30"></van-tab>
          <van-tab title="已完成" name="50"></van-tab>
        </van-tabs>
      </van-sticky>
      
      <div v-noData="!orderList.length" style="height:200px;"></div>
      <van-list
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="order-box" @click="detail(item.id)" v-for="item in orderList" :key="item.id">
          <li class="order-head">
            <span class="order-status">
              {{ (item.subStatus == '21') ? '待复核' : $utils.getCodeNameByCode(valueSet.ORDER_STATUS, item.status) }}
            </span>
            <span class="order-no">
              {{ item.orderNo }}
            </span>
            <div class="operation-btn">
              <van-button v-if="item.status == '00'" round size="small" type="info" v-has="'order_confirm'" @click.stop="detail(item.id, 'orderConfirm')">订单确认</van-button> 
              <van-button v-if="item.status == '00'" round size="small" type="info" v-has="'order_change'" @click.stop="detail(item.id, 'orderEdit')">订单修改</van-button> 
              <van-button v-if="item.status == '20'" round size="small" type="info" v-has="'validate_confirm'" @click.stop="detail(item.id, 'validateConfirm')">生效确认</van-button> 
            </div>
          </li>
          <li>
            <label for="">客户名称:</label>
            <span> {{ item.buyerCompanyName }} </span>
          </li>
          <li>
            <label for="">
              供应商:
            </label>
            <span> {{ item.supplierName }} </span>
          </li>
          <li>
            <label for="">
              客户订单号:
            </label>
            <span> {{ item.customerOrderNo }} </span>
          </li>
          <li>
            <label for="">
              订单时间:
            </label>
            <span> {{ $utils.formatDateTime(item.createTime) }} </span>
          </li>
          <li>
            <label for="">
              下单人:
            </label>
            <span> {{ item.creatorName }} </span>
          </li>
          <li>
            <label for="">
              订单数量:
            </label>
            <span> {{ item.quantity }} </span>
          </li>
          <li>
            <label for="">
              订单金额:
            </label>
            <span> {{ item.amount }} </span>
          </li>
        </div>
      </van-list>
      
    </van-pull-refresh>

    <van-popup position="right" v-model="filterShow" :style="{ height: '100%', width: '70%' }">
      <van-form @submit="getData">
        <codeSelect label="订单类型" :valueSet="valueSet.ORDER_TYPE" v-model="QueryForm.orderType"></codeSelect>
        <codeSelect label="订单状态" :valueSet="valueSet.ORDER_STATUS" v-model="QueryForm.status"></codeSelect>
        <van-field
          label="订单编号"
          v-model="QueryForm.orderNo"
          placeholder="请输入订单编号"
        />
        <dateSelect label="订单时间起" v-model="QueryForm.orderDateGt"></dateSelect>
        <dateSelect label="订单时间止" v-model="QueryForm.orderDateLt"></dateSelect>
        <codeSelect label="公司平台名称" :valueSet="valueSet.BUSINESS_ORG" v-model="QueryForm.platNameLk"></codeSelect>

        <van-field
          label="供应商"
          v-model="QueryForm.supplierName"
          placeholder="请输入供应商"
        />
        <van-field
          label="客户名称"
          v-model="QueryForm.customerNameLk"
          placeholder="请输入客户名称"
        />
        <van-field
          label="送货地址"
          v-model="QueryForm.deliveryAddress"
          placeholder="请输入送货地址"
        />

        <codeSelect label="交货方式" :valueSet="valueSet.DELIVERY_TYPE" v-model="QueryForm.shipMode"></codeSelect>
        <codeSelect label="付款方式" :valueSet="valueSet.PAYMENT_TERMS" v-model="QueryForm.paymentMethod"></codeSelect>
       
        <van-field
          label="业务部组"
          v-model="QueryForm.sellerDepartmentName"
          placeholder="请输入业务部组"
        />
        <van-field
          label="客户订单号"
          v-model="QueryForm.customerOrderNo"
          placeholder="请输入客户订单号"
        />
        <div class="search-btns">
          <van-button block type="info" native-type="submit">查询</van-button>
          <van-button block type="danger" native-type="button" @click="reset">重置</van-button>
        </div>
      </van-form>
    </van-popup>



    
   


  </div>
</template>

<script>
import api from '@/api/orderManage'
export default {
  data () {
    return {
      filterShow: false,
      tabName: '00',
      isLoading: false,
      QueryForm: {
        orderNo: '',  
        status: '',
        orderType: ''
      },
      pageInfo: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      orderList: [],
      loading: false,
      finished: false,
    }
  },
  created () {
    this.getData();
  },
  computed: {
    valueSet () {
      return this.$store.state.codeValue.valueSet;
    },
      
  },
  methods : {
    tabChange (val) {
      this.QueryForm = this.$options.data().QueryForm;
      let status = val == '00' ? '' : val;
      this.QueryForm.status = status;
      this.getDataList();
    },
    async getDataList() {
      this.pageInfo.pageNum = 1;
      await this.getData();
    },
    reset () {
      this.QueryForm = this.$options.data().QueryForm;
      this.getDataList();
    },
    searchPickerConfirm (val, code, key, pickerShow, dontTransfer) {
      if (dontTransfer) {
        this.QueryForm[key] = val;
      } else {
        this.QueryForm[`${key}Name`] = val;
        this.QueryForm[key] = this.valueSet[code].find(item => item.itemName == val).itemCode;
      }
      this[pickerShow] = false;
    },
    searchDatePickerConfirm (val, key, modalShow) {
      let dateStr = this.$utils.formatDate(val)
      this.QueryForm[key] = dateStr;
      this[modalShow] = false;
    },
    getData(type) {
      var params = {
        scope: '2',
        ...this.pageInfo,
        ...this.QueryForm
      };
      delete params.total;
      delete params.pageCount;
      params.orderDateGt && (params.orderDateGt = new Date(params.orderDateGt).getTime());
      params.orderDateLt && (params.orderDateLt = new Date(params.orderDateLt).getTime()) + 86400000;
      api.getOrderList(params).then(res => {
        if (res.data.success) {
          if (type == 'load') {
            this.orderList = [ ...this.orderList, ...res.data.data ];
          } else {
            this.orderList = res.data.data || [];
          }
          this.pageInfo.total = res.data.total;
          this.pageInfo.pageCount = res.data.pageCount;
        } else {
          this.orderList = [];
          this.pageInfo.total = 0;
          this.$toast(res.data.message);
        }
      });
    },
    async onLoad() {
      if (!this.orderList.length) {
        this.loading = false;
        return;
      }
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.pageInfo.pageNum <= this.pageInfo.pageCount) {
        this.pageInfo.pageNum += 1;
        await this.getData('load');
        // 加载状态结束
        setTimeout(() => {
          this.loading = false;
        }, 1000)
      } else {
         // 数据全部加载完成
        this.finished = true;
      }
    },
    async onRefresh() {
      await this.getDataList();
      setTimeout(() => {
        this.isLoading = false;
      }, 500)
    },
    showFilter () {
      this.filterShow = true;
    },
    onSearch () {
      console.log(1)
    },
    detail (id, type) {
      let actionType = type || 'detail';
      this.$router.push({
        path: '/order-detail',
        query: {
          id,
          type: actionType
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.van-button__text {
  color: #fff!important;
}
/deep/.van-tab--active {
  span {
    color: #0072BC;
  }
}
.van-search__action {
  line-height: normal;
}
.filter-box {
  text-align: center;
  font-size: 12px;
  color: #333;
}
.search-btns {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0  ;
}
.order-box {
  background: #fff;
  width: 90%;
  margin: 10px auto;
  border-radius: 3px;
  box-shadow: 0 2px 0 #fff;
  font-size: 13px;
  padding: 10px;
  .order-head {
    display: flex;
    align-items: center;
    .order-status {
      margin-right: 10px;
      display: inline-block;
      color: #D71920;
      text-align: center;
      line-height: 16px;
      padding: 2px 4px;
      background: rgba(215, 25, 32, .2);
      border-radius: 2px;
      font-weight: bold;
    }
  }
  li {
    position: relative;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    &.order-head {
      justify-content: flex-start;
    }
    .operation-btn {
      width: auto;
      position: absolute;
      right: -5px;
      top: -5px;
      button {
        background: #fff;
        height: 24px;
        span {
          color: #0072BC!important;
        }
      }
    }
    label {
      color: #666;
    }
    span {
      color: #333;
    }
    &>div{
      width: 50%;
    }
  }
}
</style>