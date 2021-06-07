<template>
  <!-- 	批次库存日志-->
  <div class="stock">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="content">
          <div v-noData="!bathSubList.length" style="height: 200px"></div>
          <div
            class="show-layOut"
            v-for="(item, index) in bathSubList"
            :key="index"
          >
            <h2>{{ item.businessCode }}</h2>
            <van-cell-group title-class="labelWidth">
              <van-cell
                title="类型："
                :value="
                  $utils.getCodeSetName(
                    valueSet,
                    'STORAGE_RECORD_TYPE',
                    item.businessType
                  )
                "
              />
              <van-cell title="重量：" :value="item.weight" />
              <van-cell title="重量变化后：" :value="item.weightAfter" />
              <van-cell
                title="创建时间："
                :value="$utils.formatDateTime(item.createTime)"
              />
            </van-cell-group>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import stockAPI from "@/api/stockManage";
export default {
  data() {
    return {
      isLoading: false,
      bathSubList: [],
      finished: false,
      loading: false,
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
      },
    };
  },
  mounted() {
    this.getDetail();
  },
  computed: {
    valueSet() {
      return this.$store.state.codeValue.valueSet;
    },
  },
  methods: {
    onRefresh() {
      this.getDetail();
    },
    getDetail(type) {
      let params = {
        stockSubId: this.$route.query.stockSubId,
        ...this.pageInfo,
      };
      stockAPI.queryListByStockSubId(params).then((res) => {
        let dataInfo = res.data;
        if (dataInfo.success) {
          if (type == "load") {
            this.bathSubList = [...this.bathSubList, ...dataInfo.data];
          } else {
            this.bathSubList = dataInfo.data;
          }
          this.pageInfo.pageCount = res.data.pageCount;
        }
      });
    },
    async onLoad() {
      if (!this.bathSubList.length) {
        this.loading = false;
        return;
      }
      // 异步更新数据

      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.pageInfo.pageNum < this.pageInfo.pageCount) {
        this.pageInfo.pageNum += 1;
        await this.getDetail("load");
        // 加载状态结束
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      } else {
        // 数据全部加载完成
        this.finished = true;
      }
    },
    toDetail() {
      this.$router.push(
        "/stock/batch-detail?stockSubId=" + this.$route.query.stockSubId
      );
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
        font-size: 12px;
        // font-family: PingFang SC;
        font-weight: 400;
        color: #666666;
      }
      .van-cell__value {
        font-size: 12px;
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
</style>