<template>
  <div class="stock">
    <van-sticky>
      <van-search
        placeholder="商品描述"
        show-action
        v-model="formData.productDesc"
        @search="onSearch"
        shape="round"
      >
        <template #action>
          <div @click="filterOpen" class="filter-box">
            <i class="iconfont">&#xe7cc;</i>
            <p>筛选</p>
          </div>
        </template>
      </van-search>

      <van-tabs
        swipeable
        @click="getTabValue"
        @scroll="getTabValue"
        title-active-color="#0072BC"
        color="#0072BC"
      >
        <van-tab title="汇总库存"> </van-tab>
        <van-tab title="批次库存"> </van-tab>
        <van-tab title="" disabled> </van-tab>
        <van-tab title="" disabled> </van-tab>
      </van-tabs>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="content">
        <div v-noData="!stockList.length" style="height: 200px"></div>
        <van-list
          :immediate-check="false"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          style="width: 100%; margin: 0px auto"
        >
          <div
            class="show-layOut"
            v-for="(item, index) in stockList"
            :key="index"
          >
            <div v-if="active == '0'">
              <h2>{{ item.ownerName }}</h2>
              <van-cell-group title-class="labelWidth">
                <van-cell title="商品名称" :value="item.productName" />
                <van-cell title="仓库" :value="item.warehouseName" />
                <van-cell title="分类" :value="item.categoryStr" />
                <van-cell title="商品描述" :value="item.productDesc" />
                <van-cell title="业务部组" :value="item.departmentName" />
                <van-cell title="库存数量" :value="item.totalWeight" />
                <van-cell title="库存锁定量" :value="item.lockWeight" />
                <van-cell title="库存可用量" :value="item.usableWeight" />
                <div class="getLog">
                  <button
                    class="logbtn"
                    @click="getStockBill(item)"
                    v-if="item.lockWeight > 0"
                  >
                    查看锁单据
                  </button>
                  <button class="logbtn" @click="getStockLog(item)">
                    查看锁日志
                  </button>
                </div>
              </van-cell-group>
            </div>
            <div v-else>
              <div class="title-layout" @click.prevent="toDetail(item, 'go')">
                <div class="titleFlag">
                  <h2>{{ item.productDesc }}</h2>
                </div>
                <div class="bthFlag">
                  <div>
                    <p>{{ item.directionFlag == "0" ? "无去向" : "有去向" }}</p>
                  </div>
                </div>
              </div>

              <van-cell-group
                title-class="labelWidth"
                @click.prevent="toDetail(item, 'go')"
              >
                <van-cell title="sap批次号" :value="item.sapBatchCode" />
                <van-cell title="业务部组" :value="item.departmentName" />
                <van-cell title="仓库" :value="item.warehouseName" />
                <van-cell title="公司平台" :value="item.ownerName" />
                <van-cell title="库存可用数量" :value="item.usableWeight" />
                <van-cell title="库存数量" :value="item.currWeight" />
                <van-cell
                  title="入库时间"
                  :value="$utils.formatDate(item.createTime)"
                />
              </van-cell-group>
              <div class="getLog">
                <button class="logbtn" @click.prevent="getStockLog(item)">
                  查看日志
                </button>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </van-pull-refresh>
    <summary-search :filterShow="filterShow"></summary-search>
    <bath-search :bathModal="bathModal"></bath-search>
  </div>
</template>

<script>
import stockApi from "@/api/stockManage";
import summarySearch from "./components/summary-search";
import bathSearch from "./components/bath-search";
export default {
  components: {
    "summary-search": summarySearch,
    "bath-search": bathSearch,
  },
  data() {
    return {
      active: "0",
      filterShow: {
        open: false,
      },
      value: "胶板印刷纸",
      stockList: 2,
      isLoading: false,
      loading: false,
      finished: false,
      bathModal: {
        open: false,
      },
      formData: {
        productDesc: "",
        categoryId: "",
        departmentName: "",
        mate: "",
        ownerName: "",
        productName: "",
        warehouseName: "",
        directionFlag: "",
        sapBatchCode: "",
        memberName: "",
        orderCode: "",
        remark: "",
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    filterOpen() {
      if (this.active == "0") {
        this.filterShow.open = true;
      } else {
        this.bathModal.open = true;
      }
    },

    getTabValue(value) {
      if (value != this.active) {
        this.stockList = [];
        this.active = value;
        this.getData();
      }
    },
    getData(type) {
      let params = {
        ...this.formData,
        ...this.pageInfo,
      };
      if (this.active == "0") {
        stockApi.summaryStockList(params).then((res) => {
          let dataInfo = res.data;
          if (dataInfo.success) {
            if (type == "load") {
              this.stockList = [...this.stockList, ...dataInfo.data];
            } else {
              this.stockList = dataInfo.data || [];
            }
            this.pageInfo.total = res.data.total;
            this.pageInfo.pageCount = res.data.pageCount;
          }
        });
      } else {
        stockApi.queryStockSubList(params).then((res) => {
          let dataInfo = res.data;
          if (dataInfo.success) {
            if (type == "load") {
              this.stockList = [...this.stockList, ...dataInfo.data];
            } else {
              this.stockList = dataInfo.data || [];
            }
            this.pageInfo.total = res.data.total;
            this.pageInfo.pageCount = res.data.pageCount;
          }
        });
      }
    },
    onSearch(value) {
      this.pageInfo.pageNum = 1;
      if (value) {
        for (let key in this.formData) {
          if (key == "productDesc" && value["productDesc"] == undefined) {
          } else {
            this.formData[key] = value[key];
          }
        }
      }
      this.getData();
    },
    async onLoad() {
      if (!this.stockList.length) {
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
    getStockBill(item) {
      this.$router.push("price/lock-bill?stockId=" + item.stockId);
    },
    toDetail(item, type) {
      if (type == "go") {
        this.$router.push("/stock/batch-detail?stockSubId=" + item.stockSubId);
      }
    },
    getStockLog(item) {
      if (this.active == "1") {
        this.$router.push(
          "/stock/batch-log?stockSubId=" +
            item.stockSubId +
            "&stockId=" +
            item.stockId
        );
      } else {
        this.$router.push("/stock/summary-log?stockId=" + item.stockId);
      }
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.pageInfo.pageNum = 1;
        this.isLoading = false;
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
  background-color: #f6f7f9;
  .content {
    width: 100%;
    height: 100%;
    background-color: #f6f7f9;
    .title-layout {
      display: flex;
      .titleFlag {
        flex: 3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .bthFlag {
        flex: 1;
        margin-top: 12px;
        div {
          width: 40px;
          height: 20px;
          line-height: 20px;
          padding: 1px 3px;
          position: relative;
          left: 25px;
          background: rgba(215, 25, 32, 0.2);

          border-radius: 4px;
          p {
            font-size: 12px;
            font-weight: 400;
            color: rgba(215, 25, 32, 1);
            text-align: center;
            // -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;
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
          // width: 75px;
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