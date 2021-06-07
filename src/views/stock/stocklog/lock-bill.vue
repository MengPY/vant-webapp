<template>
  <div class="stock">
    <van-sticky>
      <van-search
        placeholder="单据号"
        show-action
        v-model="formData.businessCode"
        @search="onSearch"
        shape="round"
      >
        <template #action>
          <div @click="onSearch" class="filter-box">
            <i class="iconfont">&#xe7cc;</i>
            <p>筛选</p>
          </div>
        </template>
      </van-search>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="content">
        <div
          v-noData="!stockBillList.length"
          style="height: 200px"
          v-if="!stockBillList.length"
        ></div>
        <van-list
          :immediate-check="false"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          v-else
        >
          <div class="show-layOut">
            <div>
              <van-cell-group>
                <van-cell title="单据号" value="锁定量" />

                <van-cell
                  v-for="(item, index) in stockBillList"
                  :key="index"
                  :title="item.businessCode"
                  :value="item.lockTotal"
                />
              </van-cell-group>
            </div>
          </div>
        </van-list>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import stockApi from "@/api/stockManage";
export default {
  data() {
    return {
      stockBillList: 2,
      filterShow: {
        open: false,
      },
      isLoading: false,
      loading: false,
      finished: false,
      formData: {
        businessCode: "",
        stockId: this.$route.query.stockId,
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
    getData(type) {
      let params = {
        ...this.formData,
        ...this.pageInfo,
      };

      stockApi.queryStockLockGroupBusinessCode(params).then((res) => {
        let dataInfo = res.data;
        if (dataInfo.success) {
          if (type == "load") {
            this.stockBillList = [...this.stockBillList, ...dataInfo.data];
          } else {
            this.stockBillList = dataInfo.data || [];
          }
          this.pageInfo.total = res.data.total;
          this.pageInfo.pageCount = res.data.pageCount;
        }
      });
    },
    onSearch() {
      this.pageInfo.pageNum = 1;
      this.getData();
    },
    async onLoad() {
      if (!this.stockBillList.length) {
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