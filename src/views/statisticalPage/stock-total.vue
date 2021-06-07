<template>
  <div class="stock">
    <van-sticky>
      <van-search
        placeholder="供应商名称筛选"
        show-action
        v-model="formData.supplierName"
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
    <div class="sumLayout" v-if="stockNumData.subList.length > 0">
      <p>库存数量：{{ stockNumData.weightCount }}吨</p>
      <p>库存金额：{{ stockNumData.amountCount }}元</p>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="content">
        <div
          v-noData="!stockNumData.subList.length"
          style="height: 200px"
          v-if="!stockNumData.subList.length"
        ></div>
        <van-list
          :immediate-check="false"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          style="width: 100%; margin: 0px auto"
          v-else
        >
          <div
            class="show-layOut"
            v-for="(item, index) in stockNumData.subList"
            :key="index"
          >
            <div>
              <div class="title-layout">
                <div class="titleFlag">
                  <h2>{{ item.departmentName }}</h2>
                </div>
                <div class="bthFlag">
                  <div>
                    <p>小类:{{ item.categoryStr }}</p>
                  </div>
                </div>
              </div>

              <van-cell-group>
                <van-cell title="供应商" :value="item.supplierName" />
                <van-cell title="仓库" :value="item.warehouseName" />
                <van-cell title="商品描述" :value="item.productDesc" />
                <van-cell title="数量（吨）" :value="item.weight" />
                <van-cell title="金额（元）" :value="item.amount" />
              </van-cell-group>
            </div>
          </div>
        </van-list>
      </div>
    </van-pull-refresh>
    <!-- <div class="exprotBtn">
      <Button @click="exportBtn">导出Excel</Button>
    </div> -->
    <stocktotal-search :filterShow="filterShow"></stocktotal-search>
  </div>
</template>

<script>
import stockAPI from "@/api/statisticsManage";
import stockTotalSearch from "./components/stockTotalSerch";
export default {
  components: {
    "stocktotal-search": stockTotalSearch,
  },
  data() {
    return {
      active: "All",
      value: "胶板印刷纸",
      stockNumData: 2,
      filterShow: {
        open: false,
      },
      isLoading: false,
      loading: false,
      finished: false,
      formData: {
        supplierName: "",
        warehouseName: "",
        departmentId: "",
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
  computed: {
    valueSet() {
      return this.$store.state.codeValue.valueSet;
    },
  },
  methods: {
    exportBtn() {
      let params = {
        ...this.formData,
      };
      this.$utils.downloadFile(stockAPI.stroageSumListExport, "post", params);
    },
    getTabValue(value) {
      if (value != this.active) {
        this.stockNumData = [];
        this.pageInfo.pageNum = 1;
        this.active = value;
        // this.finished = false;
        if (this.active == "All") {
          this.formData.status = "";
        } else {
          this.formData.status = this.active;
        }

        this.getData();
      }
    },
    getData(type) {
      let params = {
        ...this.formData,
        ...this.pageInfo,
      };
      stockAPI.stroageSumList(params).then((res) => {
        let dataInfo = res.data;
        if (dataInfo.success) {
          if (type == "load") {
            this.stockNumData.subList = [
              ...this.stockNumData.subList,
              ...dataInfo.data.subList,
            ];
          } else {
            this.stockNumData = dataInfo.data || [];
          }

          this.pageInfo.pageCount = res.data.pageCount;
        }
      });
    },
    onSearch(value) {
      this.pageInfo.pageNum = 1;
      if (value) {
        for (let key in this.formData) {
          if (value["supplierName"] == undefined) {
          } else {
            this.formData[key] = value[key];
          }
        }
      }
      this.getData();
    },
    async onLoad() {
      if (!this.stockNumData.subList.length) {
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

    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
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
  .sumLayout {
    width: 93%;
    height: 100%;
    margin: 0px auto;
    margin-top: 10px;
    p {
      font-size: 13px;
      padding: 3px 0px;
      font-weight: 400;
      color: #000;
    }
  }
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