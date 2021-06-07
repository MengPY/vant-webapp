<template>
  <!-- 	批次库存详情-->
  <div class="price">
    <div class="content">
      <div class="show-layOut">
        <h2>{{ priceInfo.tex }}</h2>
        <van-cell-group title-class="labelWidth">
          <van-cell
            title="可见日期："
            :value="
              $utils.formatDate(priceInfo.validBegin) +
              '~' +
              $utils.formatDate(priceInfo.validEnd)
            "
          />
          <van-cell title="大类：" :value="priceInfo.categoryName" />
          <van-cell
            title="是否定向："
            :value="
              $utils.getCodeSetName(
                valueSet,
                'ORIENTATION',
                priceInfo.orientation
              )
            "
          />
          <van-cell title="定向客户：" :value="priceInfo.orientationNames" />

          <div class="two-cell">
            <div class="left-cell">
              <span>内容：</span>
            </div>
            <div class="rigth-cell">
              <p v-html="priceInfo.texHtml"></p>
            </div>
          </div>
        </van-cell-group>
      </div>
    </div>
  </div>
</template>
<script>
import priceApi from "@/api/priceManage";
export default {
  data() {
    return {
      isLoading: false,
      priceInfo: {},
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
    // onRefresh() {},
    async getDetail() {
      let params = {
        infoId: this.$route.query.infoId,
      };
      let {
        data: { data, success },
      } = await priceApi.queryDetail(params);
      if (success) {
        this.priceInfo = data;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.price {
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
        margin-top: 15px;
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
      .two-cell {
        display: flex;
        padding-left: 15px;
        margin: 10px 0px;
        .left-cell {
          flex: 1;
          font-size: 13px;
          font-weight: 400;
          color: #666666;
        }
        .rigth-cell {
          flex: 6;
          font-size: 13px;
          font-weight: 500;
          color: #333333;
        }
      }
    }
  }
}
</style>