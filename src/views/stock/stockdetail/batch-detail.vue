<template>
  <!-- 	批次库存详情-->
  <div class="stock">
    <div class="content">
      <div class="show-layOut">
        <div class="title-layout">
          <div class="titleFlag">
            <h2>{{ bathInfo.productDesc }}</h2>
          </div>
          <div class="bthFlag">
            <div>
              <p>{{ bathInfo.directionFlag == "1" ? "有去向" : "无去向" }}</p>
            </div>
          </div>
        </div>

        <van-cell-group title-class="labelWidth">
          <van-cell title="物料编码：" :value="bathInfo.mate" />
          <van-cell title="批次号：" :value="bathInfo.batchCode" />
          <van-cell title="业务部组：" :value="bathInfo.departmentName" />
          <van-cell title="SAP批次号：" :value="bathInfo.sapBatchCode" />
          <van-cell title="商品名称：" :value="bathInfo.productName" />
          <van-cell title="仓库：" :value="bathInfo.warehouseName" />
          <van-cell title="公司平台：" :value="bathInfo.ownerName" />
          <van-cell title="分类：" :value="bathInfo.categoryStr" />
          <van-cell
            title="入库时间："
            :value="$utils.formatDate(bathInfo.createTime)"
          />
          <div class="two-cell">
            <div class="left-cell">
              <span class="title">库存锁定量：</span
              ><span class="content">{{ bathInfo.lockWeight }}</span>
            </div>
            <div class="rigth-cell">
              <span class="title">单位：</span
              ><span class="content">
                {{
                  $utils.getCodeSetName(
                    valueSet,
                    "MEASURE_UNIT",
                    bathInfo.weightUnit
                  )
                }}</span
              >
            </div>
          </div>
          <div class="two-cell">
            <div class="left-cell">
              <span class="title">库存可用数量：</span
              ><span class="content">{{ bathInfo.usableWeight }}</span>
            </div>
            <div class="rigth-cell">
              <span class="title">单位：</span
              ><span class="content">{{
                $utils.getCodeSetName(
                  valueSet,
                  "MEASURE_UNIT",
                  bathInfo.weightUnit
                )
              }}</span>
            </div>
          </div>
          <div class="two-cell">
            <div class="left-cell">
              <span class="title">库存数量：</span
              ><span class="content">{{ bathInfo.currWeight }}</span>
            </div>
            <div class="rigth-cell">
              <span class="title">单位：</span
              ><span class="content">{{
                $utils.getCodeSetName(
                  valueSet,
                  "MEASURE_UNIT",
                  bathInfo.weightUnit
                )
              }}</span>
            </div>
          </div>
          <van-cell title="销售订单号：" :value="bathInfo.orderCode" />
          <van-cell title="最终用户：" :value="bathInfo.memberName" />
          <van-cell title="备注：" :value="bathInfo.remark" />
        </van-cell-group>
      </div>
    </div>
  </div>
</template>
<script>
import stockApi from "@/api/stockManage";
export default {
  data() {
    return {
      isLoading: false,
      bathInfo: {},
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
    onRefresh() {},
    getDetail() {
      let params = {
        stockSubId: this.$route.query.stockSubId,
      };
      stockApi.stockSubDetail(params).then((res) => {
        let dataInfo = res.data;
        if (dataInfo.success) {
          this.bathInfo = dataInfo.data;
        }
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
    .title-layout {
      display: flex;
      .titleFlag {
        flex: 3;
        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
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
        // line-height: 42px;
        margin-top: 10px;
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
          .title {
            font-size: 12px;
            // font-family: PingFang SC;
            font-weight: 400;
            color: #666666;
          }
          .content {
            font-size: 12px;
            font-weight: 500;
            color: #333333;
            background-color: #fff;
          }
        }
        .rigth-cell {
          flex: 1;
          padding-left: 15px;
          .title {
            font-size: 12px;
            // font-family: PingFang SC;
            font-weight: 400;
            color: #666666;
          }
          .content {
            font-size: 12px;
            font-weight: 500;
            color: #333333;
            background-color: #fff;
          }
        }
      }
    }
  }
}
</style>