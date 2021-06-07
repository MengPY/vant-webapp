<template>
  <div class="stock">
    <van-sticky>
      <van-search
        placeholder="标题"
        show-action
        v-model="formData.title"
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

      <van-tabs
        swipeable
        @click="getTabValue"
        @scroll="getTabValue"
        title-active-color="#0072BC"
        color="#0072BC"
      >
        <van-tab title="全部" name="All"> </van-tab>
        <van-tab title="待发布" name="10"> </van-tab>
        <van-tab title="已发布" name="20"> </van-tab>
        <van-tab title="已失效" name="99"> </van-tab>
      </van-tabs>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="content">
        <div
          v-noData="!priceList.length"
          style="height: 200px"
          v-if="!priceList.length"
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
            v-for="(item, index) in priceList"
            :key="index"
          >
            <div @click="toDetail(item.infoId)">
              <div class="title-layout">
                <div class="titleFlag">
                  <h2>{{ item.title }}</h2>
                </div>
                <div class="bthFlag">
                  <div>
                    <p>
                      {{
                        $utils.getCodeSetName(
                          valueSet,
                          "PRICE_STATUS",
                          item.status
                        )
                      }}
                    </p>
                  </div>
                </div>
              </div>

              <van-cell-group>
                <van-cell title="商品大类：" :value="item.categoryName" />
                <van-cell
                  title="定向类型："
                  :value="
                    $utils.getCodeSetName(
                      valueSet,
                      'ORIENTATION',
                      item.orientation
                    )
                  "
                />
                <van-cell title="定向客户：" :value="item.orientationNames" />
                <van-cell
                  title="可见日期："
                  :value="
                    $utils.formatDate(item.validBegin) +
                    '~' +
                    $utils.formatDate(item.validEnd)
                  "
                />
              </van-cell-group>
            </div>
          </div>
        </van-list>
      </div>
    </van-pull-refresh>
    <pirce-search :filterShow="filterShow"></pirce-search>
  </div>
</template>

<script>
import priceApi from "@/api/priceManage";
import pirceSearch from "./components/price-search";
export default {
  components: {
    "pirce-search": pirceSearch,
  },
  data() {
    return {
      active: "All",
      value: "胶板印刷纸",
      priceList: 2,
      filterShow: {
        open: false,
      },
      isLoading: false,
      loading: false,
      finished: false,
      formData: {
        productDesc: "",
        validBegin: "",
        validEnd: "",
        orientation: "",
        orientationNames: "",
        title: "",
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
    toDetail(infoId) {
      this.$router.push("/pirce/price-detail?infoId=" + infoId);
    },
    getTabValue(value) {
      if (value != this.active) {
        this.priceList = [];
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

      priceApi.memberQueryMarketPricePage(params).then((res) => {
        let dataInfo = res.data;
        if (dataInfo.success) {
          if (type == "load") {
            this.priceList = [...this.priceList, ...dataInfo.data];
          } else {
            this.priceList = dataInfo.data || [];
          }
          this.pageInfo.total = res.data.total;
          this.pageInfo.pageCount = res.data.pageCount;
        }
      });
    },
    onSearch(value) {
      this.pageInfo.pageNum = 1;

      this.getData();
    },
    onchildSearch(value) {
      this.pageInfo.pageNum = 1;
      if (value) {
        for (let key in this.formData) {
          if (key == "title" && value["title"] == "") {
          } else {
            this.formData[key] = value[key];
          }
        }
      }
      this.getData();
    },
    async onLoad() {
      if (!this.priceList.length) {
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