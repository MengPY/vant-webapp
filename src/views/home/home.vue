<template>
  <div class="home-wrap">
    <div
      class="head-info-wrap"
      :class="{ noMargin: currentComponent !== 'businessCharts' }"
    >
      <div class="head-info">
        <img class="userImg" src="static/images/defaultUserImg.png" alt="" />
        <div class="userBox">
          <li class="userName">{{ userInfo.empName }}</li>
          <li class="userOrg" @click="orgPopShow = true">
            {{ currentCompany.orgName }}
            <i class="iconfont">&#xe613;</i>
          </li>
        </div>
        <i class="logout iconfont" @click="logout"> &#xe645; </i>
      </div>
      <ul class="nav-list" v-if="currentComponent == 'businessCharts'">
        <li @click="$router.push('/customer-list')">
          <img src="~@/assets/home/customer.png" alt="" />
          <p>部门客户</p>
        </li>
        <li @click="toPricePage">
          <img src="~@/assets/home/market-price.png" alt="" />
          <p>行情价格</p>
        </li>
        <li @click="$router.push('/message/list')">
          <img src="~@/assets/home/message.png" alt="" />
          <p>我的消息</p>
        </li>
      </ul>
    </div>

    <AsyncComponent :current="currentComponent"></AsyncComponent>

    <van-popup
      closeable
      v-model="orgPopShow"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <ul class="org-list">
        <li
          class="org-tag"
          @click="switchOrg(org)"
          :class="{ active: org.orgId == currentCompany.orgId }"
          v-for="org in companyList"
          :key="org.orgId"
        >
          {{ org.orgName }}
        </li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
import api from "@/api/index";
import { mapGetters } from "vuex";
import AsyncComponent from "@/components/AsyncComponent";
export default {
  components: {
    AsyncComponent,
    businessCharts: () => import("@/views/home/components/businessCharts.vue"),
    managerCharts: () => import("@/views/home/components/managerCharts.vue"),
  },
  data() {
    return {
      currentComponent: "",
      orgPopShow: false,
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
      companyList: "companyList",
      currentCompany: "currentCompany",
    }),
  },
  created() {
    this.getMenu();
  },

  methods: {
    toPricePage() {
      this.$router.push("pirce/Industry-price");
    },
    async getMenu() {
      let params = {
        sysCode: "02",
        sysType: "03",
      };
      let {
        data: { data, success },
      } = await api.getMenuList(params);
      if (success) {
        let menuList = data.menuButtonTreeDTOS || [];
        let btnList = [];
        this.currentComponent = menuList.find(
          (item) => item.elementName == "管理员主页"
        )
          ? "managerCharts"
          : "businessCharts";
        let loop = (arr) => {
          arr.forEach((item) => {
            if (item.elementType == "button") {
              btnList.push(item);
            }
            item.menuButtonTreeDTOS &&
              item.menuButtonTreeDTOS.length &&
              loop(item.menuButtonTreeDTOS);
          });
        };
        loop(menuList);
        this.setStore("btnList", btnList);
      }
    },
    logout() {
      this.$router.push("/login");
    },
    async switchOrg(org) {
      if (org.orgId === this.currentCompany.orgId) return;
      console.log(org);
      let {
        data: { success, message },
      } = await api.switchOrg({ orgId: org.orgId, orgName: org.orgName });
      if (success) {
        this.setStore("currentCompany", org);
        this.$store.commit("setCurrentCompany", org);
        this.getMenu();
      } else {
        this.$toast(message);
      }
    },
  },
};
</script>

<style scoped lang="less">
@import "./home.less";
</style>