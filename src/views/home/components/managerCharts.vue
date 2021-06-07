<template>
  <div>
    <div class="info-box">
      <div class="info-header">
        <h3>当月出仓总量</h3>
        <van-dropdown-menu class="outSelectMenu">
          <van-dropdown-item
            @change="outStorageSumForMonth"
            v-model="outSearchType"
            :options="outOptions"
          />
        </van-dropdown-menu>
        <a
          href="javascript:;"
          @click="$router.push('/statisticalPage/output-total')"
          >查看更多 <i class="iconfont">&#xe71b;</i>
        </a>
      </div>
      <div class="chart-title">
        累计
        <span>
          {{ currMonthOutQty ? $utils.amount(currMonthOutQty, 4) : 0 }} 吨
        </span>
      </div>
      <div id="outStorageChart"></div>
    </div>

    <div class="info-box">
      <div class="info-header">
        <h3>库存总数量</h3>
        <a
          href="javascript:;"
          @click="$router.push('/statisticalPage/stock-total')"
          >查看更多 <i class="iconfont">&#xe71b;</i>
        </a>
      </div>
      <div class="chart-title">
        累计 <span> {{ stockQty ? $utils.amount(stockQty, 4) : 0 }} 吨 </span>
      </div>
      <div id="stockQuantityChart"></div>
    </div>

    <div class="info-box">
      <div class="info-header">
        <h3>超期库存总数量</h3>
        <a
          href="javascript:;"
          @click="$router.push('/statisticalPage/stock-outdate')"
          >查看更多 <i class="iconfont">&#xe71b;</i>
        </a>
      </div>
      <div class="chart-title">
        累计
        <span>
          {{ overdueStroageSum ? $utils.amount(overdueStroageSum, 4) : 0 }} 吨
        </span>
      </div>
      <div id="overDateStroageChart"></div>
    </div>
  </div>
</template>

<script>
import api from "@/api/workbench";
import { Chart } from "@antv/g2";
import DataSet from "@antv/data-set";

export default {
  data() {
    return {
      outOptions: [
        { text: "按业务组", value: "0" },
        { text: "按业务员", value: "1" },
        { text: "按管理区", value: "3" },
      ],
      saleOrderType: "1",
      outSearchType: "0",
      currMonthOrderQty: 0,
      currMonthOutQty: 0,
      stockQty: 0,
      overdueStroageSum: 0,
      customerData: {},
    };
  },
  created() {
    this.outStorageSumForMonth();
    this.getStroageSum();
    this.getOverdueStroageSum();
  },
  methods: {
    async getOverdueStroageSum() {
      let {
        data: { success, data, message },
      } = await api.getOverdueStroageSum();
      if (success) {
        let res = data || [];
        this.overdueStroageSum = res.reduce((prev, curr) => {
          return this.$Calculator.arithmeticAdd(prev, curr.weight);
        }, 0);
        let chartData = res.map((item) => {
          return {
            Area: item.name,
            逾期库存量: item.weight,
            库存总量: item.weightSum,
          };
        });
        if (this.overDateStroageChart) {
          this.overDateStroageChart.changeData(chartData);
        } else {
          this.initOverDateStorageChart("overDateStroageChart", chartData);
        }
      } else {
        // this.$Message.error(message);
      }
    },
    async outStorageSumForMonth(searchType) {
      let {
        data: { success, data, message },
      } = await api.outStorageSumForMonth({
        searchType: searchType || this.outSearchType,
      });
      if (success) {
        let outStorageData = data || [];
        this.currMonthOutQty = outStorageData.reduce((prev, curr) => {
          return this.$Calculator.arithmeticAdd(prev, curr.weight);
        }, 0);
        let outStorageChartData = outStorageData.map((item) => {
          return {
            name: item.name,
            数量: item.weight,
          };
        });
        // console.log(outStorageChartData)
        if (this.outStorageChart) {
          this.outStorageChart.changeData(outStorageChartData);
        } else {
          this.initColumnarChart("outStorageChart", outStorageChartData);
        }
      } else {
        this.$toast(message);
      }
    },
    async getStroageSum() {
      let {
        data: { success, data, message },
      } = await api.getStroageSum();
      if (success) {
        let res = data || [];
        this.stockQty = res.reduce((prev, curr) => {
          return this.$Calculator.arithmeticAdd(prev, curr.weight);
        }, 0);
        let storageSumData = res.map((item) => {
          return {
            name: item.name,
            数量: item.weight,
          };
        });
        if (this.stockQuantityChart) {
          this.stockQuantityChart.changeData(storageSumData);
        } else {
          this.initColumnarChart("stockQuantityChart", storageSumData);
        }
      } else {
        // this.$Message.error(message);
      }
    },
    initColumnarChart(id, data, color = "#3d8ff4") {
      if (!data) return;
      // const data = [
      //   { name: "华北", 数量: 210 },
      //   { name: "华南", 数量: 275 },
      //   { name: "华东", 数量: 100 },
      //   { name: "华西", 数量: 50 },
      // ];

      // Step 1: 创建 Chart 对象
      this[id] = new Chart({
        container: id, // 指定图表容器 ID
        autoFit: true, // 指定图表宽度
        height: 400, // 指定图表高度
        padding: [40, 40, 100, 40],
      });

      // 将 'name' 字段对应的坐标轴的标题隐藏
      this[id].axis("name", {
        label: {
          offset: 50,
          rotate: 100,
        },
      });
      // Step 2: 载入数据源
      this[id].data(data);

      // Step 3: 创建图形语法，绘制柱状图
      this[id].interval().position("name*数量").color(color);

      // Step 4: 渲染图表
      this[id].render();
    },
    initOverDateStorageChart(id, data) {
      if (!data) return;
      // const data = [
      //   { Area: 'WY', '库存总量': 25635, '逾期库存量': 1890 },
      // ];

      const ds = new DataSet();
      const dv = ds.createView().source(data);
      dv.transform({
        type: "fold",
        fields: ["库存总量", "逾期库存量"], // 展开字段集
        key: "类型", // key字段
        value: "数量", // value字段
        retains: ["Area"], // 保留字段集，默认为除fields以外的所有字段
      });
      // 数据被加工成 {Area: 'WY', 类型: '小于5岁', 数量: 25635}

      const chart = new Chart({
        container: id,
        autoFit: true,
        height: 300,
        padding: [40, 40, 40, 140],
      });

      chart.coordinate().transpose();

      chart.data(dv.rows);
      chart.scale("数量", { nice: true });

      chart.axis("Area", {
        label: {
          offset: 12,
          rotate: 100,
        },
      });

      chart.tooltip({
        shared: true,
        showMarkers: false,
      });

      chart.interval().adjust("stack").position("Area*数量").color("类型");

      chart.interaction("active-region");

      chart.render();
    },
  },
};
</script>

<style lang="less" scoped>
@import "./../home.less";
.outSelectMenu {
  width: 100px;
  height: 30px;
  /deep/.van-dropdown-menu__bar {
    border-radius: 3px;
    height: 100%;
  }
}
</style>