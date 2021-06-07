<template>
  <div class="info-box">
    <li>
      <label> 姓名: </label>
      <span> {{ detailInfo.empName }}  </span>
    </li>
    <li>
      <label> 手机号: </label>
      <span> {{ detailInfo.mobile }}  </span>
    </li>
    <li>
      <label> 身份证号码: </label>
      <span> {{ detailInfo.identityNumber }}  </span>
    </li>
    <li>
    <li>
      <label> 实名认证状态: </label>
      <div>
        <van-tag v-if="detailInfo.modifyStatus == '60'" size="medium" type="success">已认证</van-tag>
        <van-tag v-else size="medium" color="#ffe1e1" text-color="#D71920">未认证</van-tag>
      </div>
    </li>

    <li v-for="(item, i) in IDCardData" :key="i">
      <template v-if="item.fileType == '10'">
        <label> 身份证头像页: </label>
        <a class="idCardImg" :href="$common.interfacePath.fileServerDownload + item.storePath">
          <img :src="$common.interfacePath.fileServerDownload + item.storePath" alt="">
        </a>
      </template>
      <template v-if="item.fileType == '20'">
        <label> 身份证国徽页: </label>
        <a class="idCardImg" :href="$common.interfacePath.fileServerDownload + item.storePath">
          <img :src="$common.interfacePath.fileServerDownload + item.storePath" alt="">
        </a>
      </template>
    </li>
    
  </div>
</template>

<script>
import api from "@/api/customerManage";
export default {
  data () {
    return {
      detailInfo: {},
      IDCardData: [],
    }
  },
  created () {
    this.getDetail();
    this.getMyIDCard();
	},
	methods: {
		getDetail() {
      var memberId = this.$route.query.id;
      var empId = this.$route.query.empId;
      var params = {
        memberId,
        empId,
      };
      api.getCustomerDetailPersonal(params).then((res) => {
        if (res.data.success) {
          this.detailInfo = res.data.data || {};
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    getMyIDCard() {
      var memberId = this.$route.query.id;
      var empId = this.$route.query.empId;
      var params = {
        memberId,
        // empId
      };
      api.getCustomerDetailQueryMyIDCard(params).then((res) => {
        if (res.data.success) {
          this.IDCardData = res.data.data || {};
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
	}
}
</script>

<style lang="less" scoped>
.info-box {
  background: #fff;
  width: 90%;
  margin: 10px auto;
  border-radius: 3px;
  box-shadow: 0 2px 0 #fff;
  font-size: 13px;
  padding: 10px;
  li {
    position: relative;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    label {
      color: #666;
      width: 120px;
    }
    span {
      color: #333;
    }
    .idCardImg {
      width: 100%;
      text-align: center;
      img {
        width: 90%;
      }
    }
  }
}
</style>