<template>
  <div class="stock">
    <van-sticky>
      <van-search
        :placeholder="active == '0' ? '客户名称筛选' : '供应商名称筛选'"
        show-action
        v-model="cuttentValue"
        @search="onSearch"
        shape="round"
      >
        <template #action>
          <div @click="filterShow.open = true" class="filter-box">
            <i class="iconfont">&#xe7cc;</i>
            <p>筛选</p>
          </div>
        </template>
      </van-search>
    </van-sticky>
    <van-tabs
      swipeable
      @click="getTabValue"
      @scroll="getTabValue"
      title-active-color="#0072BC"
      color="#0072BC"
    >
      <van-tab title="按客户维度" name="0"> </van-tab>
      <van-tab title="按供应商及商品维度" name="1"> </van-tab>
    </van-tabs>

    <div
      class="two-content"
      style="margin-top: 5px"
      v-if="outPutList.subList.length > 0"
    >
      <div class="title" v-if="active == '0'">
        客户总数：{{ outPutList.memberCount }}
      </div>
      <div class="title" v-if="active == '1'">
        出仓数量:{{ outPutList.weightCount }}吨
      </div>
      <div class="content">出仓总金额：{{ outPutList.amountCount }}元</div>
    </div>
    <div
      class="two-content"
      v-if="outPutList.subList.length > 0 && active == '0'"
    >
      <div class="title">出仓数量：</div>
      <div class="content">{{ outPutList.weightCount }}吨</div>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="content">
        <div v-noData="!outPutList.subList.length" style="height: 200px"></div>
        <van-list
          :immediate-check="false"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          style="width: 100%; margin: 0px auto"
          @load="onLoad"
        >
          <div
            class="show-layOut"
            v-for="(item, index) in outPutList.subList"
            :key="index"
          >
            <div>
              <div class="title-layout">
                <div class="titleFlag">
                  <h2>{{ item.departmentRegionName }}</h2>
                </div>
                <div class="bthFlag">
                  <div>
                    <p>商品小类：{{ item.categoryStr }}</p>
                  </div>
                </div>
              </div>

              <van-cell-group>
                <van-cell title="供应商：" :value="item.supplierName" />
                <van-cell
                  title="客户名称："
                  :value="item.memberName"
                  v-if="active == '0'"
                />
                <van-cell title="业务部组：" :value="item.departmentName" />
                <van-cell title="出仓数量：" :value="item.weight + '吨'" />
                <van-cell title="出仓金额：" :value="item.amount + '元'" />
              </van-cell-group>
            </div>
          </div>
        </van-list>
      </div>
    </van-pull-refresh>
    <!-- <div class="exprotBtn">
      <Button @click="exportBtn">导出Excel</Button>
    </div> -->
    <outTotal-search :filterShow="filterShow" :type="active"></outTotal-search>
  </div>
</template>

<script>
import api from "@/api/statisticsManage";
import outTotalSearch from "./components/outTotalSearch";
// import { delete } from "vue/types/umd";
export default {
  components: {
    "outTotal-search": outTotalSearch,
  },
  data() {
    return {
      active: "0",
      value: "胶板印刷纸",
      outPutList: 2,
      filterShow: {
        open: false,
      },
      cuttentValue: "",
      isLoading: false,
      loading: false,
      finished: false,
      formData: {
        departmentRegionId: "",
        categoryId: "",
        departmentId: "",
        memberName: "",
        supplierName: "",
        searchType: "0",
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    valueSet() {
      return this.$store.state.codeValue.valueSet;
    },
  },
  methods: {
    toDetail(infoId) {
      this.$router.push("/pirce/price-detail?infoId=" + infoId);
    },
    exportBtn() {
      let params = {
        ...this.formData,
      };
      this.$utils.downloadFile(
        api.outStorageSumListForMonthExport,
        "post",
        params
      );
    },
    getTabValue(value) {
      if (value != this.active) {
        // this.formData = this.$options.data().formData;
        this.cuttentValue = "";
        this.formData.memberName = "";
        this.formData.supplierName = "";
        this.outPutList = [];
        this.pageInfo.pageNum = 1;
        this.active = value;
        // this.finished = false;
        this.formData.searchType = this.active;
        this.getData();
      }
    },
    getData(type) {
      let params = {
        ...this.formData,
        ...this.pageInfo,
      };

      api.outStorageSumListForMonth(params).then((res) => {
        let dataInfo = res.data;
        if (dataInfo.success) {
          if (type == "load") {
            this.outPutList.subList = [
              ...this.outPutList.subList,
              ...dataInfo.data.subList,
            ];
          } else {
            this.outPutList = dataInfo.data || [];
          }
          this.pageInfo.total = res.data.total;
          this.pageInfo.pageCount = res.data.pageCount;
        }
      });
    },
    onSearch(value) {
      if (this.active == "0") {
        this.formData.memberName = this.cuttentValue;
      } else {
        this.formData.supplierName = this.cuttentValue;
      }
      this.pageInfo.pageNum = 1;
      if (value) {
        if (value["supplierName"] == undefined) {
        } else if (value["memberName"] == undefined) {
        } else {
          for (let key in this.formData) {
            this.formData[key] = value[key];
          }
        }
      }
      if (this.active == "0" && this.formData.memberName != undefined) {
        this.cuttentValue = this.formData.memberName;
      }
      if (this.active == "1" && this.formData.supplierName != undefined) {
        this.cuttentValue = this.formData.supplierName;
      }
      this.getData();
    },
    async onLoad() {
      if (!this.outPutList.subList.length) {
        this.loading = false;
        return;
      }
      // 异步更新数据

      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.pageInfo.pageNum < this.pageInfo.pageCount) {
        this.pageInfo.pageNum += 1;
        await this.getData("load");
        // 加载状态结束
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      } else {
        // 数据全部加载完成
        this.finished = true;
      }
    },
    getStockLog(stockId) {
      if (this.active == "1") {
        this.$router.push("/stock/batch-log?stockId=" + stockId);
      } else {
        this.$router.push("/stock/summary-log?stockId=" + stockId);
      }
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.pageInfo.pageNum = 1;
        this.getData();
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
.stock {
  width: 100%;
  height: 100%;

  .exprotBtn {
    width: 100%;
    background: #fff;
    padding: 10px 5px;
    text-align: center;
    position: fixed;
    bottom: 0px;
    left: 0px;
    button {
      width: 85%;
      height: 35px;
      background: rgb(0, 114, 188);
      border-radius: 20px;
      font-size: 13px;
      color: #fff;
      border: 0px;
    }
  }
  background-color: #f6f7f9;
  .two-content {
    width: 93%;
    height: 100%;
    display: flex;
    font-size: 13px;
    margin: 0px auto;
    padding: 0px 3px;
    title {
      flex: 1;
      text-align: left;
    }
    .content {
      flex: 1;
      text-align: right;
    }
  }
  .content {
    width: 100%;
    height: 100%;
    background-color: #f6f7f9;
    .title-layout {
      display: flex;
      .titleFlag {
        flex: 2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .bthFlag {
        flex: 1;
        margin-top: 12px;
        div {
          line-height: 20px;
          padding: 1px 3px;

          border-radius: 4px;
          p {
            font-size: 13px;
            font-weight: 400;
            text-align: center;
            color: #666666;
          }
        }
      }
    }
    .show-layOut {
      width: 94%;
      height: 100%;
      padding: 1px;
      margin: 0px auto;
      margin-top: 10px;
      margin-bottom: 5px;
      border-radius: 5px;
      background: #ffffff;
      h2 {
        font-size: 15px;
        padding: 0px 15px;
        font-weight: 400;
        line-height: 42px;
        color: #111111;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      /deep/ .van-cell::after {
        border: none !important;
      }
      .van-cell__title {
        font-size: 13px;
        font-weight: 400;
        color: #666666;
      }
      .van-cell__value {
        font-size: 13px;
        font-weight: 500;
        color: #333333;
      }
      .van-hairline--top-bottom::after,
      .van-hairline-unset--top-bottom::after {
        border-width: 0px 0;
      }
      .labelWidth {
        width: 100px;
      }
      .van-cell {
        padding: 5px 15px;
      }
      .getLog {
        width: 100%;
        text-align: right;
        padding-bottom: 10px;
        .logbtn {
          width: 70px;
          height: 25px;
          border: 1px solid #0072bc;
          opacity: 1;
          border-radius: 28px;
          font-size: 12px;
          font-weight: 400;
          color: #0072bc;
          background-color: #ffffff;
          margin-right: 15px;
        }
      }
    }
  }
}
.filter-box {
  text-align: center;
  font-size: 12px;
  color: #333;
}
.van-search__action {
  line-height: normal;
}
</style>