<template>
  <!-- 	汇总库存日志-->
  <div class="stock">
    <van-sticky>
      <van-search
        placeholder="订单号"
        show-action
        v-model="formData.orderNo"
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
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="content">
        <div
          v-noData="!lockList.length"
          style="height: 200px"
          v-if="!lockList.length"
        ></div>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          style="width: 100%; margin: 0px auto"
          v-else
        >
          <div
            class="show-layOut"
            v-for="(item, index) in lockList"
            :key="index"
          >
            <h2>{{ item.codeNo }}</h2>
            <van-cell-group title-class="labelWidth">
              <van-cell
                title="类型："
                :value="
                  $utils.getCodeSetName(
                    valueSet,
                    'STORAGE_LOCK',
                    item.businessType
                  )
                "
              />
              <van-cell title="重量：" :value="item.weight" />
              <!-- <van-cell title="重量变化后：" :value="item.version" /> -->
              <van-cell
                title="创建时间："
                :value="$utils.formatDate(item.createTime)"
              />
            </van-cell-group>
          </div>
        </van-list>
      </div>
    </van-pull-refresh>
    <summartLock-search :filterShow="filterShow"></summartLock-search>
  </div>
</template>
<script>
import stockApi from "@/api/stockManage";
import summartLockSearch from "./components/summartLock-search";
export default {
  components: {
    "summartLock-search": summartLockSearch,
  },
  data() {
    return {
      isLoading: false,
      loading: false,
      finished: false,

      formData: {
        stockId: this.$route.query.stockId,
        codeNo: "",
        orderNo: "",
        createTimeStart: "",
        createTimeEnd: "",
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      lockList: [],
      filterShow: {
        open: false,
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
    onRefresh() {
      setTimeout(() => {
        this.finished = false;
        this.pageInfo.pageNum = 0;
        this.isLoading = false;
        this.onLoad("refData");
      }, 1000);
    },
    getDetail() {
      this.$router.push("/stock/batch-detail");
    },
    async onLoad(value) {
      if (!this.lockList.length) {
        this.loading = false;
        this.refreshing = false;
        return;
      }
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.pageInfo.pageNum < this.pageInfo.pageCount) {
        this.pageInfo.pageNum += 1;
        if (value == "refData") {
          this.lockList = [];
        }
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
    onSearch(value) {
      this.pageInfo.pageNum = 1;
      for (let key in this.formData) {
        if (key == "orderNo" && value["orderNo"] == undefined) {
        } else if (key == "stockId" && value["stockId"] == undefined) {
        } else {
          this.formData[key] = value[key];
        }
      }
      this.formData.stockId = this.$route.query.stockId;
      this.getData();
    },
    getData(type) {
      let params = {
        ...this.formData,
        ...this.pageInfo,
      };
      stockApi
        .queryListByStockId(params)
        .then((res) => {
          let dataInfo = res.data;
          if (dataInfo.success) {
            if (type == "load") {
              this.lockList = [...this.lockList, ...dataInfo.data];
            } else {
              this.lockList = dataInfo.data || [];
            }
            this.pageInfo.pageCount = res.data.pageCount;
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
      }
      /deep/ .van-cell::after {
        border: none !important;
      }
      .van-cell__title {
        font-size: 13px;
        // font-family: PingFang SC;
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
        padding-bottom: 5px;
        .logbtn {
          width: 68px;
          height: 25px;
          border: 1px solid #0072bc;
          opacity: 1;
          border-radius: 28px;
          font-size: 11px;
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