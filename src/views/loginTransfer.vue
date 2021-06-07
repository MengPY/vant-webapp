<template>
  <div>
    Logining...
  </div>
</template>

<script>
import api from '@/api/index'
export default {
  data () {
    return {

    }
  },
  mounted () {
    let ticket = this.$route.query.ticket;
    this.getUserInfo(ticket);
  },
  methods: {
    showMsg (msg) {
      this.$toast(msg)
    },
    async getUserInfo (ticket) {
      if (!ticket) return;
      var {
        data: { success, message, data, code }
      } = await api.getUserInfoByTicket({ ticket });
      if (!success) {
        return this.showMsg(message);
      }
      this.loginCallback(data);
    },
    loginCallback (result) {
      console.log(result)
      let token = result.token;
      let userInfo = { ...result.user };
      userInfo.isLogin = true;
      userInfo.sysCode = "BranchOrg";
      userInfo.appType = "1";
      this.$store.commit("setUserInfo", userInfo);
      this.$store.commit("setToken", token);
      this.getCompanyList(userInfo);
      // this.$router.push('/')
    },
    getCompanyList(userInfo) {
      api
      .getCompanyList({
        empId: userInfo.empId,
        sysCode: userInfo.sysCode,
      })
      .then(async (res) => {
        res = res.data;
        if (res.success && this.$utils.getRealType(res.data) == "Array") {
          if (res.data && res.data.length) {
            this.setStore("companyList", res.data);
            this.$store.commit("setCompanyList", res.data);
            this.setStore("currentCompany", res.data[0]);
            this.$store.commit("setCurrentCompany", res.data[0]);
            // 加载菜单
            let currentOrg = res.data[0];
            let {
              data: { success, message },
            } = await api.switchOrg({
              orgId: currentOrg.orgId,
              orgName: currentOrg.orgName,
            });
            if (success) {
              // this.setStore("refreshLeftMenuFlag", true);
              // util.initRouter(this);
              this.$router.push('/')
            } else {
              this.$toast(message);
            }
          }
        } else {
          this.accountForm.imgCode = "";
          this.getCaptchaImg();
          this.$toast(res.message);
        }
      });
    },
  }
}
</script>

<style>

</style>