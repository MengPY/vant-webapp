<template>
	<div class="content">
		<van-tabs v-model="active" style="width: 100%;">
		  <van-tab title="账号登录" @keyup.enter.native="accountLogin">
				<van-field
					v-model="accountForm.account"
					name="用户名"
					label="用户名"
					placeholder="用户名"
					:rules="[{ required: true, message: '请填写用户名' }]"
				/>
				<van-field
					v-model="accountForm.password"
					type="password"
					name="密码"
					label="密码"
					placeholder="密码"
					:rules="[{ required: true, message: '请填写密码' }]"
				/>
				<van-field
					v-model="accountForm.imgCode"
					center
					clearable
					fit="contain"
						label="验证码"
						placeholder="请输入验证码"
						use-button-slot
					>
						<img @click="getCaptchaImg" style="width: 100px;height: 30px;" slot="button" :src="'data:image/png;base64,'+captchaImg" />
					</van-field>
				<div style="margin: 16px;">
					<van-button round block type="info" @click="accountLogin">登录</van-button>
				</div>  
		  </van-tab>
		</van-tabs>
	</div>
</template>

<script>
	import md5 from 'md5'
	import api from '@/api/index'
	export default {
		data() {
			return {
				account: '111',
				active: 1,
				captchaId: "",
				captchaImg: "",
				accountForm: {
					account: "",
					password: "",
					imgCode: ""
				},
				phoneForm: {
					mobilePhone: "",
					loginPwd: "",
				}
			}
		},
		created () {
			localStorage.clear();
			this.getCaptchaImg();
		},
		methods: {
			showMsg (msg) {
				this.$toast(msg)
			},
			accountFormChange (val, key) {
				this.accountForm[key] = val;
			},
			getCaptchaImg() {
			  api.initCaptcha().then(res => {
        res = res.data;
				if (res.success) {
				  this.captchaId = res.data.imgKey;
				  this.captchaImg = res.data.imgs;
				}
			  },error=>{
				this.loadingCaptcha = false;
				console.error('获取验证码超时')
			  });
			},
			async accountLogin () {
        console.log(this.accountForm)
				if (!this.accountForm.account) {
					return this.showMsg('请输入账号')
				} else if (!this.accountForm.password) {
					return this.showMsg('请输入密码')
				} else if (!this.accountForm.imgCode) {
					return this.showMsg('请输入验证码')
				}
				let params = {
					applyType: "1",
					sysCode: "BranchOrg",
					account: this.accountForm.account,
					password: md5(this.accountForm.password),
					realPassword: this.accountForm.password,
					validateCode: this.accountForm.imgCode,
					validateKey: this.captchaId,
				};
				var {
				  data: { success, message, data, code }
				} = await api.login(params);
				if (!success) {
				  if (code == 'MEXT004') {
						this.getCaptchaImg();
				  }
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

<style lang="less">
	input {
		border: 1px solid #ddd;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
