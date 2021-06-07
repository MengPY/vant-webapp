<template>
  <!-- 	批次库存详情-->
  <div class="stock">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="content">
        <div class="show-layOut">
          <h2>胶版印刷纸/岳阳/天玺/60/A/810</h2>
          <van-cell-group title-class="labelWidth">
            <van-cell title="物料编码：" value="上订单锁" />
            <van-cell title="批次号：" value="1" />
            <van-cell title="业务部组：" value="1" />
            <van-cell title="SAP批次号：" value="2021-02-13 19:20" />
            <van-cell title="商品名称：" value="2021-02-13 19:20" />
            <van-cell title="仓库：" value="2021-02-13 19:20" />
            <van-cell title="公司平台：" value="2021-02-13 19:20" />
            <van-cell title="分类：" value="2021-02-13 19:20" />
            <van-cell title="入库时间：" value="2021-02-13 19:20" />
            <div class="two-cell">
              <div class="left-cell">
                <span class="title">库存锁定量：</span
                ><span class="content">0.01</span>
              </div>
              <div class="rigth-cell">
                <span class="title">单位：</span><span class="content">吨</span>
              </div>
            </div>
            <div class="two-cell">
              <div class="left-cell">
                <span class="title">库存可用数量：</span
                ><span class="content">0.01</span>
              </div>
              <div class="rigth-cell">
                <span class="title">单位：</span><span class="content">吨</span>
              </div>
            </div>
            <div class="two-cell">
              <div class="left-cell">
                <span class="title">库存数量：</span
                ><span class="content">0.01</span>
              </div>
              <div class="rigth-cell">
                <span class="title">单位：</span><span class="content">吨</span>
              </div>
            </div>
            <van-cell title="销售订单号：" value="2021-02-13 19:20" />
            <van-cell title="最终用户：" value="2021-02-13 19:20" />
            <van-cell title="备注：" value="2021-02-13 19:20" />
          </van-cell-group>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    onRefresh() {},
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