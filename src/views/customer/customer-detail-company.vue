<template>
  <div class="info-box">
    <li>
      <label> 公司名称: </label>
      <span> {{ detailInfo.companyName }}  </span>
    </li>
    <li>
      <label> 社会统一信用代码: </label>
      <span> {{ detailInfo.businessCode }}  </span>
    </li>
    <li>
      <label> 法定代表人: </label>
      <span> {{ detailInfo.judicialPerson }}  </span>
    </li>
    <li>
      <label> 注册地址: </label>
      <span> {{ detailInfo.address }}  </span>
    </li>
    
    <li>
      <label> 开票银行: </label>
      <span> {{ detailInfo.invoiceBankName }}  </span>
    </li>
    <li>
      <label> 开票银行账号: </label>
      <span> {{ detailInfo.invoiceBankAccount }}  </span>
    </li>
    <li>
      <label> 开票地址: </label>
      <span> {{ detailInfo.invoiceAddress }}  </span>
    </li>
    <li>
      <label> 开票电话: </label>
      <span> {{ detailInfo.invoiceTel }}  </span>
    </li>
    <li>
      <label> 经营范围: </label>
      <span> {{ detailInfo.businessScope }}  </span>
    </li>
    <li>
      <label> 实名认证状态: </label>
      <div>
        <van-tag v-if="detailInfo.modifyStatus == '60'" size="medium" type="success">已认证</van-tag>
        <van-tag v-else size="medium" color="#ffe1e1" text-color="#D71920">未认证</van-tag>
      </div>
    </li>
  </div>
</template>

<script>
import api from "@/api/customerManage";
export default {
  data () {
    return {
      detailInfo: {}
    }
  },
  created () {
		this.getDetail();
	},
	methods: {
		getDetail () {
			var memberId = this.$route.query.id;
			var params = {
        memberId
      };
      api.getCustomerDetail(params).then(res => {
        if (res.data.success) {
					this.detailInfo = res.data.data.company || {};
        } else {
          this.$Message.error(res.data.message);
        }
      });
		}
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
    label {
      color: #666;
      width: 120px;
    }
    span {
      flex: 1;
      color: #333;
      &.van-tag {
        color: #fff;
      }
    }
  }
}
</style>