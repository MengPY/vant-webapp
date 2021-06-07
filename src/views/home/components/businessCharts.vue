<template>
  <div>
    <div class="order-box">
      <div class="info-header">
        <h3>订单管理</h3>
        <a href="javascript:;" @click="$router.push('/order')"
          >查看更多 <i class="iconfont">&#xe71b;</i>
        </a>
      </div>
      <ul class="order-info-list">
        <li>
          <h4>{{ orderStatusData["00"] || 0 }}</h4>
          <p>待确认订单</p>
        </li>
        <li>
          <h4>{{ orderStatusData["10"] || 0 }}</h4>
          <p>待签署订单</p>
        </li>
        <li>
          <h4>{{ orderStatusData["20"] || 0 }}</h4>
          <p>待生效订单</p>
        </li>
        <li>
          <h4>{{ orderStatusData["40"] || 0 }}</h4>
          <p>发货中订单</p>
        </li>
      </ul>
    </div>

    <div class="info-box">
      <div class="info-header">
        <h3>当月销售订单总量</h3>
        <a href="javascript:;" @click="$router.push('/order')"
          >查看更多 <i class="iconfont">&#xe71b;</i>
        </a>
      </div>
      <div class="chart-title">
        累计
        <span>
          {{ currMonthOrderQty ? $utils.amount(currMonthOrderQty, 4) : 0 }} 吨
        </span>
      </div>
      <div id="saleOrderChart"></div>
    </div>

    <div class="info-box">
      <div class="info-header">
        <h3>当月出仓总量</h3>
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
        <h3>当月库存总量 TOP5</h3>
        <a href="javascript:;" @click="$router.push('/stock')"
          >查看更多 <i class="iconfont">&#xe71b;</i>
        </a>
      </div>
      <div id="currentMonthStockChart"></div>
    </div>

    <div class="info-box">
      <div class="info-header">
        <h3>客户数据</h3>
        <a href="javascript:;" @click="$router.push('/order')"
          >查看更多 <i class="iconfont">&#xe71b;</i>
        </a>
      </div>
      <div class="chart-title">
        近三个月已认证客户数
        <span>
          {{ customerData.memberClassStatisticalCount }}
        </span>
      </div>
      <div class="chart-title">
        当月新增客户数
        <span>
          {{ customerData.deptMemberCount }}
        </span>
      </div>
      <div class="right-chart" id="customerLine"></div>
      <div class="right-chart" id="customerCircle"></div>
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
      orderStatusData: {},
      saleOrderType: "1",
      outSearchType: "0",
      currMonthOrderQty: 0,
      currMonthOutQty: 0,
      customerData: {},
    };
  },
  created() {
    this.countOrderSalesByStatus();
    this.countOrderSalesByCurrentMonth();
    this.outStorageSumForMonth();
    this.stroageSumForMonthTopFive();
    this.queryCustomerCount();
  },
  methods: {
    async countOrderSalesByCurrentMonth(groupType) {
      let {
        data: { success, data, message },
      } = await api.countOrderSalesByCurrentMonth({
        groupType: groupType || this.saleOrderType,
      });
      if (success) {
        let res = data || [];
        this.currMonthOrderQty = res.reduce((prev, curr) => {
          return this.$Calculator.arithmeticAdd(prev, curr.qty);
        }, 0);
        let chartData = res.map((item) => {
          return {
            name:
              item.sellerDepartmentName ||
              item.salesName ||
              item.manageAreaName,
            数量: item.qty,
          };
        });
        // console.log(outStorageChartData)
        if (this.saleOrderChart) {
          this.saleOrderChart.changeData(chartData);
        } else {
          this.initColumnarChart("saleOrderChart", chartData);
        }
      } else {
        this.$toast(message);
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
    async stroageSumForMonthTopFive() {
      let {
        data: { success, data, message },
      } = await api.stroageSumForMonthTopFive({});
      if (success) {
        let res = data || [];
        let chartData = res.map((item) => {
          return {
            仓库: item.warehouseName,
            分类: item.categoryStr,
            数量: item.weight,
          };
        });
        this.initCurrentMonthStockChart("currentMonthStockChart", chartData);
      } else {
        // this.$Message.error(message);
      }
    },
    async queryCustomerCount() {
      let {
        data: { success, data, message },
      } = await api.queryCustomerCount();
      if (success) {
        let res = data || {};
        this.customerData = res;
        var currentMonthDate = this.$utils.formatMonth(Date.now());
        var lastMonthDate = this.$utils.formatMonth(
          Date.now() - 30 * 24 * 3600000
        );
        var lastTwoMonthDate = this.$utils.formatMonth(
          Date.now() - 60 * 24 * 3600000
        );
        let trader = res.memberClassStatisticalList.find(
          (item) => item.memberClass == "01"
        )
          ? res.memberClassStatisticalList.find(
              (item) => item.memberClass == "01"
            ).statisticalCount
          : {};
        let endCustomer = res.memberClassStatisticalList.find(
          (item) => item.memberClass == "02"
        )
          ? res.memberClassStatisticalList.find(
              (item) => item.memberClass == "02"
            ).statisticalCount
          : {};
        let other = res.memberClassStatisticalList.find(
          (item) => item.memberClass == "03"
        )
          ? res.memberClassStatisticalList.find(
              (item) => item.memberClass == "03"
            ).statisticalCount
          : {};
        const customerLineData = [
          {
            date: lastTwoMonthDate,
            贸易商: trader.beforeLastMonthCount,
            终端客户: endCustomer.beforeLastMonthCount,
            其他: other.beforeLastMonthCount,
          },
          {
            date: lastMonthDate,
            贸易商: trader.lastMonthCount,
            终端客户: endCustomer.lastMonthCount,
            其他: other.lastMonthCount,
          },
          {
            date: currentMonthDate,
            贸易商: trader.duringMonthCount,
            终端客户: endCustomer.duringMonthCount,
            其他: other.duringMonthCount,
          },
        ];
        this.initCustomerLineChart("customerLine", customerLineData);

        // const customerCircleData = [
        //   { item: '华东区域', count: 40, percent: 0.4 },
        //   { item: '华南区域', count: 21, percent: 0.21 },
        //   { item: '华北区域', count: 17, percent: 0.17 },
        //   { item: '华中区域', count: 13, percent: 0.13 },
        // ];
        var customMemberCount =
          res.deptGroupMemberList &&
          res.deptGroupMemberList.reduce((prev, curr) => {
            return prev + curr.memberCount;
          }, 0);
        var customerCircleData =
          res.deptGroupMemberList &&
          res.deptGroupMemberList.map((item) => {
            return {
              item: item.orgName,
              count: item.memberCount,
              percent: this.$Calculator.arithmeticDiv(
                item.memberCount,
                customMemberCount
              ),
            };
          });
        // console.log(customMemberCount)
        this.initCustomerCircleChart("customerCircle", customerCircleData);
      } else {
        this.$toast(message);
      }
    },
    async countOrderSalesByStatus() {
      let {
        data: { success, data, message },
      } = await api.countOrderSalesByStatus();
      if (success) {
        this.orderStatusData = data || {};
      } else {
        this.$toast(message);
      }
    },
    initCurrentMonthStockChart(id, data) {
      if (!data) return;
      // const data = [
      //   { 仓库: '仓库A', 分类: '分类A', 数量: 32000 },
      //   { 仓库: '仓库A', 分类: '分类B', 数量: 30000 },
      //   { 仓库: '仓库A', 分类: '分类C', 数量: 27000 },
      //   { 仓库: '仓库A', 分类: '分类D', 数量: 24000 },

      //   { 仓库: '仓库B', 分类: '分类A', 数量: 10000 },
      //   { 仓库: '仓库B', 分类: '分类B', 数量: 30000 },
      //   { 仓库: '仓库B', 分类: '分类C', 数量: 27000 },
      //   { 仓库: '仓库B', 分类: '分类D', 数量: 5000 },

      //   { 仓库: '仓库C', 分类: '分类A', 数量: 10000 },
      //   { 仓库: '仓库C', 分类: '分类B', 数量: 30000 },
      //   { 仓库: '仓库C', 分类: '分类C', 数量: 27000 },
      //   { 仓库: '仓库C', 分类: '分类D', 数量: 5000 },
      // ];

      const chart = new Chart({
        container: id,
        autoFit: true,
        height: 500,
      });
      chart.data(data);
      chart.scale("数量", {
        alias: "数量(吨)",
      });
      chart.axis("仓库", {
        tickLine: null,
      });

      chart.axis("数量", {
        label: {
          formatter: (text) => {
            return text.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
          },
        },
        title: {
          offset: 80,
          style: {
            fill: "#aaaaaa",
          },
        },
      });
      chart.legend({
        position: "right",
      });

      chart.tooltip({
        shared: true,
        showMarkers: false,
      });
      chart.interaction("active-region");

      chart
        .interval()
        .adjust("stack")
        .position("仓库*数量")
        .color("分类", [
          "#7AA6F7",
          "#8FDFB5",
          "#7887A1",
          "#F0C149",
          "#DD7767",
          "#94D4EE",
          "#9C88CF",
          "#F3A56D",
        ]);

      chart.render();
    },
    initCustomerLineChart(id, data) {
      if (!data) return;
      const chart = new Chart({
        container: id,
        autoFit: true,
        height: 300,
        padding: 70,
      });

      chart.data(data);
      chart.scale({
        // date: {
        //   alias: '日期',
        //   type: 'time',
        // },
      });
      chart.axis("终端客户", false);
      chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });
      chart.line().position("date*贸易商").color("#4FAAEB");
      chart.line().position("date*终端客户").color("#9AD681").shape("dash");
      chart.line().position("date*其他").color("#f66").shape("dash");
      chart.render();
    },
    initCustomerCircleChart(id, data) {
      if (!data) return;
      const chart = new Chart({
        container: id,
        autoFit: true,
        height: 300,
        padding: [0, 200, 0, 0],
        appendPadding: 20,
      });

      chart.coordinate("theta", {
        radius: 0.75,
        innerRadius: 0.5,
      });

      chart.data(data);

      chart.scale("percent", {
        formatter: (val) => {
          val = val * 100 + "%";
          return val;
        },
      });

      chart.tooltip(false);

      // 声明需要进行自定义图例字段： 'item'
      chart.legend("item", {
        offsetX: -100,
        // itemWidth: 100,
        position: "right", // 配置图例显示位置
        custom: true, // 关键字段，告诉 G2，要使用自定义的图例
        items: data.map((obj, index) => {
          return {
            name: obj.item, // 对应 itemName
            value: obj.percent, // 对应 itemValue
            marker: {
              symbol: "square", // marker 的形状
              style: {
                r: 5, // marker 图形半径
                fill: chart.getTheme().colors10[index], // marker 颜色，使用默认颜色，同图形对应
              },
            }, // marker 配置
          };
        }),
        itemValue: {
          style: {
            fill: "#999",
          }, // 配置 itemValue 样式
          formatter: (val) => `${parseInt(val * 100)}%`, // 格式化 itemValue 内容
        },
      });

      chart
        .interval()
        .adjust("stack")
        .position("percent")
        .color("item")
        .style({
          fillOpacity: 1,
        })
        .state({
          active: {
            style: (element) => {
              const shape = element.shape;
              return {
                lineWidth: 10,
                stroke: shape.attr("fill"),
                strokeOpacity: shape.attr("fillOpacity"),
              };
            },
          },
        });

      // 移除图例点击过滤交互
      chart.removeInteraction("legend-filter");
      chart.interaction("element-active");

      chart.render();

      // 监听 element 上状态的变化来动态更新 Annotation 信息
      chart.on("element:statechange", (ev) => {
        const { state, stateStatus, element } = ev.gEvent.originalEvent;

        // 本示例只需要监听 active 的状态变化
        if (state === "active") {
          const data = element.getData();
          if (stateStatus) {
            // 更新 Annotation
            updateAnnotation(data);
          } else {
            // 隐藏 Annotation
            clearAnnotation();
          }
        }
      });

      // 绘制 annotation
      let lastItem;
      function updateAnnotation(data) {
        if (data.item !== lastItem) {
          chart.annotation().clear(true);
          chart
            .annotation()
            .text({
              position: ["50%", "50%"],
              content: data.item,
              style: {
                fontSize: 16,
                fill: "#8c8c8c",
                textAlign: "center",
              },
              offsetY: -20,
            })
            .text({
              position: ["50%", "50%"],
              content: data.count,
              style: {
                fontSize: 16,
                fill: "#8c8c8c",
                textAlign: "center",
              },
              offsetX: -10,
              offsetY: 20,
            })
            .text({
              position: ["50%", "50%"],
              content: "个",
              style: {
                fontSize: 16,
                fill: "#8c8c8c",
                textAlign: "center",
              },
              offsetY: 20,
              offsetX: 20,
            });
          chart.render(true);
          lastItem = data.item;
        }
      }

      // 清空 annotation
      function clearAnnotation() {
        chart.annotation().clear(true);
        chart.render(true);
        lastItem = null;
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
  },
};
</script>

<style lang="less" scoped>
@import "./../home.less";
</style>