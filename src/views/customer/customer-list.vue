<template>
  <div class="order-wrap">
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
      <van-sticky>
        <van-search
          v-model="QueryForm.memberNameLk"
          show-action
          placeholder="客户名称"
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
          <van-tab title="已授权" name="1"></van-tab>
          <van-tab title="未授权" name="0"></van-tab>
        </van-tabs>
      </van-sticky>
      
      <div v-noData="!customerList.length" style="height:200px;"></div>
      <van-list
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="info-box" @click="detail(item)" v-for="item in customerList" :key="item.id">
          <li class="info-head">
            <span class="type-tag">
              {{ item.isPersonal == '1' ? '个人' : '企业' }}
            </span>
            <!-- <span class="status-tag">
              {{ item.modifyStatus == '60' ? '已认证' : '未认证' }}
            </span> -->
            <van-tag v-if="item.modifyStatus == '60'" size="medium" :type="item.modifyStatus == '60' ? 'success' : 'danger'"> {{ item.modifyStatus == '60' ? '已认证' : '未认证' }} </van-tag>
            <van-tag v-else size="medium" color="#ffe1e1" text-color="#D71920">未认证</van-tag>
          </li>
          <li>
            <label for=""> 客户名称:</label>
            <span> {{ item.memberName }} </span>
          </li>
          <li>
            <label for="">
              认证完成日期:
            </label>
            <span> {{ item.authDate && $utils.formatDateTime(item.authDate) }} </span>
          </li>
          <li>
            <label for="">
              MDM编码:
            </label>
            <span> {{ item.erpCode }} </span>
          </li>
          <li>
            <label for="">
              SAP编码:
            </label>
            <span> {{ item.sapCode }} </span>
          </li>
        </div>
      </van-list>
      
    </van-pull-refresh>

    <van-popup position="right" v-model="filterShow" :style="{ height: '100%', width: '70%' }">
      <van-form @submit="getData">
        
        <codeSelect label="客户类型" :valueSet="customerType" v-model="QueryForm.isPersonal"></codeSelect>

        <van-field
          label="客户名称"
          v-model="QueryForm.memberNameLk"
          placeholder="请输入"
        />

        <codeSelect label="客户状态" :valueSet="statusList" v-model="QueryForm.modifyStatus"></codeSelect>
        <div class="search-btns">
          <van-button  block type="info" native-type="submit">查询</van-button>
          <van-button  block type="danger" native-type="button" @click="reset">重置</van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
import api from "@/api/customerManage";
export default {
  data () {
    return {
      filterShow: false,
      tabName: '1',
      isLoading: false,
      QueryForm: {
        isPersonal: "",
        memberNameLk: "",
        erpCode: "",
        modifyStatus:''
      },
      pageInfo: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      customerList: [],
      loading: false,
      finished: false,
      customerType: [
        {
          itemCode: '1',
          itemName: '个人'
        },
        {
          itemCode: '0',
          itemName: '企业'
        },
      ],
      statusList: [
        {
          itemCode: '60',
          itemName: '已认证'
        },
        {
          itemCode: '99',
          itemName: '未认证'
        },
      ]
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
      this.tabName = val;
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
        isDisable: '0',
        isAuth: this.tabName,
        ...this.QueryForm,
        ...this.pageInfo
      };
      delete params.total;
      delete params.pageCount;
      api.getCustomerList(params).then(res => {
        if (res.data.success) {
          if (type == 'load') {
            this.customerList = [ ...this.customerList, ...res.data.data ];
          } else {
            this.customerList = res.data.data || [];
          }
          this.pageInfo.total = res.data.total;
          this.pageInfo.pageCount = res.data.pageCount;
        } else {
          this.customerList = [];
          this.pageInfo.total = 0;
          this.$toast(res.data.message);
        }
      });
    },
    async onLoad() {
      if (!this.customerList.length) {
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
    detail (row) {
      if (row.isPersonal == '1') {
        this.$router.push('/customer-detail-personal?id='+ row.memberId + '&empId=' + row.empId)
      } else {
        this.$router.push('/customer-detail-company?id=' + row.memberId)
      }
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
.info-box {
  background: #fff;
  width: 90%;
  margin: 10px auto;
  border-radius: 3px;
  box-shadow: 0 2px 0 #fff;
  font-size: 13px;
  padding: 10px;
  .info-head {
    display: flex;
    align-items: center;
    .type-tag {
      font-size: 15px;
      font-weight: 400;
      color: #111;
    }
    .status-tag {
      display: inline-block;
      color: #D71920;
      text-align: center;
      line-height: 16px;
      padding: 2px 4px;
      background: rgba(215, 25, 32, .2);
      border-radius: 2px;
    }
  }
  li {
    position: relative;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
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
      &.van-tag {
        color: #fff;
      }
    }
    &>div{
      width: 50%;
    }
  }
}
</style>