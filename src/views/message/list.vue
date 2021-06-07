<template>
  <div class="message">
    <van-sticky>
      <van-search
        placeholder="消息标题"
        show-action
        v-model="formData.msgTitile"
        @search="onSearch"
        shape="round"
      >
        <template #action>
          <div @click="filterShow.open = true" class="filter-box">
            <i class="iconfont">&#xe7cc;</i>
            <p>筛选</p>
          </div>
        </template>
      </van-search>
    </van-sticky>
    <van-tabs
      swipeable
      @click="getTabValue"
      @scroll="getTabValue"
      title-active-color="#0072BC"
      color="#0072BC"
    >
      <van-tab title="未读消息" name="0"> </van-tab>
      <van-tab title="已读消息" name="1"> </van-tab>
      <van-tab disabled> </van-tab>
      <van-tab disabled> </van-tab>
    </van-tabs>

    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="content">
        <div
          v-noData="!messageList.length"
          style="height: 200px"
          v-if="!messageList.length"
        ></div>
        <van-list
          :immediate-check="false"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          v-else
        >
          <div
            class="messageColumn"
            v-for="(item, index) in messageList"
            :key="index"
          >
            <div class="layout-content">
              <div class="left-lay">
                <div class="roundRadio">
                  <van-checkbox
                    v-model="item.radioType"
                    icon-size="15px"
                  ></van-checkbox>
                </div>
                <div class="roundtype" v-if="item.eventCode == '1009'">
                  <i class="iconfont" style="font-size: 30px; color: #fff"
                    >&#xe7dd;</i
                  >
                </div>
                <div class="roundtype-cuikuan" v-if="item.eventCode == '1100'">
                  <i class="iconfont" style="font-size: 30px; color: #fff"
                    >&#xe7df;</i
                  >
                </div>
                <div
                  class="roundtype-renzheng-other"
                  v-if="item.eventCode == '1010'"
                >
                  <i class="iconfont" style="font-size: 30px; color: #fff"
                    >&#xe7de;</i
                  >
                </div>
                <div
                  class="roundtype-renzheng-success"
                  v-if="item.eventCode == '1036'"
                >
                  <i class="iconfont" style="font-size: 30px; color: #fff"
                    >&#xe7e1;</i
                  >
                </div>
                <div
                  class="roundtype-renzheng-error"
                  v-if="item.eventCode == '1042'"
                >
                  <i class="iconfont" style="font-size: 30px; color: #fff"
                    >&#xe7e0;</i
                  >
                </div>
              </div>
              <div class="right-lay" @click="openDetail(item)">
                <div class="top-content">
                  <div class="title">
                    <p>{{ item.msgTitile }}</p>
                  </div>
                  <div class="content">
                    <p>{{ $utils.formatDate(item.createDate) }}</p>
                  </div>
                </div>
                <div class="bottom-content">
                  <p>{{ item.msgContent }}</p>
                </div>
              </div>
            </div>
          </div>
        </van-list>
        <div class="exprotBtn" v-if="active == '0'">
          <van-checkbox
            v-model="radioType"
            icon-size="15px"
            @change="getCheckBoxValue"
            >全选</van-checkbox
          >
          <Button @click="batchRead">批量已读</Button>
        </div>
      </div>
    </van-pull-refresh>
    <message-search :filterShow="filterShow"></message-search>
    <van-dialog
      v-model="messageModal"
      title="标题"
      :show-cancel-button="false"
      :show-confirm-button="false"
      close-on-popstate
    >
      <div slot="title">
        消息详情
        <van-icon
          name="cross"
          class="iconrigth"
          @click="messageModal = false"
        />
      </div>
      <div slot="default">
        <div v-html="messageInfo.msgContent"></div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import messageApi from "@/api/messageManage";
import messageSearch from "./components/messageSearch";
import { Toast } from "vant";
export default {
  components: {
    "message-search": messageSearch,
  },
  data() {
    return {
      active: "0",
      value: "胶板印刷纸",
      messageList: 2,
      messageModal: false,
      messageInfo: {},
      filterShow: {
        open: false,
      },
      isLoading: false,
      loading: false,
      finished: false,
      formData: {
        msgType: "",
        createDateBegin: "",
        createDateEnd: "",
        msgTitile: "",
        recipientFlag: "0",
        eventCode: "",
      },
      radioType: false,
      selectedList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
      },
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    valueSet() {
      return this.$store.state.codeValue.valueSet;
    },
  },
  methods: {
    getCheckBoxValue(value) {
      this.messageList.forEach((item) => {
        item.radioType = value;
      });
      this.$forceUpdate();
    },
    toDetail(infoId) {
      this.$router.push("/pirce/price-detail?infoId=" + infoId);
    },
    getTabValue(value) {
      if (value != this.active) {
        this.messageList = [];
        this.pageInfo.pageNum = 1;
        this.active = value;
        // this.finished = false;
        this.formData.recipientFlag = this.active;

        this.getData();
      }
    },
    openDetail(item) {
      this.messageInfo = item;
      this.messageModal = true;
    },
    getData(type) {
      let params = {
        ...this.formData,
        ...this.pageInfo,
      };

      messageApi.messageList(params).then((res) => {
        let dataInfo = res.data;
        if (dataInfo.success) {
          if (type == "load") {
            this.messageList = [...this.messageList, ...dataInfo.data];
          } else {
            this.messageList = dataInfo.data || [];
          }
          this.pageInfo.total = res.data.total;
          this.pageInfo.pageCount = res.data.pageCount;
        }
      });
    },
    async batchRead() {
      this.selectedList = this.messageList.map((item) => {
        if (item.radioType == true) {
          return {
            ...item,
          };
        }
      });
      if (this.selectedList.length < 1) {
        return Toast("请至少选择一条数据");
      }
      for (let i = 0; i <= this.selectedList.length - 1; i++) {
        let {
          data: { success, message },
        } = await messageApi.msgresclceStaus({
          id: this.selectedList[i].recipientId,
        });
        if (this.selectedList.length - 1 == i) {
          if (success) {
            this.radioType = false;
            this.getData();
            Toast("操作成功");
            this.selectAll = false;
          } else {
            this.$Message.error(message);
          }
        }
      }
    },
    onSearch(value) {
      this.pageInfo.pageNum = 1;
      if (value) {
        for (let key in this.formData) {
          if (key == "msgTitile" && value["msgTitile"] == undefined) {
          } else {
            this.formData[key] = value[key];
          }
        }
      }
      this.getData();
    },
    async onLoad() {
      if (!this.messageList.length) {
        this.loading = false;
        return;
      }
      // 异步更新数据

      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.pageInfo.pageNum < this.pageInfo.pageCount) {
        this.pageInfo.pageNum += 1;
        await this.getData("load");
        // 加载状态结束
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      } else {
        // 数据全部加载完成
        this.finished = true;
      }
    },
    getmessageLog(messageId) {
      if (this.active == "1") {
        this.$router.push("/message/batch-log?messageId=" + messageId);
      } else {
        this.$router.push("/message/summary-log?messageId=" + messageId);
      }
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.getData();
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
.message {
  width: 100%;
  height: 100%;
  background-color: #f6f7f9;
  .exprotBtn {
    width: 100%;
    display: flex;
    background: #fff;
    padding: 10px 5px;
    text-align: center;
    position: fixed;
    bottom: 0px;
    left: 0px;
    .van-checkbox {
      margin-left: 10px;
      font-size: 13px;
      color: #999;
    }
    button {
      width: 75%;
      height: 35px;
      background: rgb(0, 114, 188);
      border-radius: 20px;
      font-size: 13px;
      margin-left: 15px;
      color: #fff;
      border: 0px;
    }
  }
  .content {
    width: 100%;
    height: 100%;
    background-color: #f6f7f9;
    .messageColumn {
      width: 100%;
      background: #fff;
      .layout-content {
        display: flex;
        width: 98%;
        height: 60px;

        margin: 0px auto;
        border-top: 1px solid rgba(240, 240, 240, 1);
        border-bottom: 1px solid rgba(240, 240, 240, 1);
        .left-lay {
          flex: 1;
          display: flex;
          .roundRadio {
            width: 30px;
            position: relative;
            top: 25px;
            left: 10px;
          }

          .roundtype {
            height: 50px;
            width: 50px;
            text-align: center;
            line-height: 50px;
            margin-left: 5px;
            background: linear-gradient(90deg, #53e3aa 0%, #05ba72 100%);
            border-radius: 50%;
            margin-top: 5px;
            opacity: 1;
          }
          .roundtype-cuikuan {
            height: 50px;
            width: 50px;
            text-align: center;
            line-height: 50px;
            margin-left: 5px;
            background: linear-gradient(90deg, #a9b3ff 0%, #7988f9 100%);
            border-radius: 50%;
            margin-top: 5px;
            opacity: 1;
          }
          .roundtype-renzheng-success {
            height: 50px;
            width: 50px;
            text-align: center;
            line-height: 50px;
            margin-left: 5px;
            background: linear-gradient(90deg, #46a9ec 0%, #2193e1 100%);
            border-radius: 50%;
            margin-top: 5px;
            opacity: 1;
          }
          .roundtype-renzheng-error {
            height: 50px;
            width: 50px;
            text-align: center;
            line-height: 50px;
            margin-left: 5px;
            background: linear-gradient(90deg, #db585c 0%, #d71920 100%);
            border-radius: 50%;
            margin-top: 5px;
            opacity: 1;
          }
          .roundtype-renzheng-other {
            height: 50px;
            width: 50px;
            text-align: center;
            line-height: 50px;
            margin-left: 5px;
            background: linear-gradient(90deg, #fda861 0%, #f98c31 100%);
            border-radius: 50%;
            margin-top: 5px;
            opacity: 1;
          }
        }
        .right-lay {
          flex: 4;
          padding: 0px 5px;
          .top-content {
            height: 25px;
            display: flex;
            line-height: 25px;
            .title {
              flex: 2;

              p {
                font-weight: 400;
                color: #333333;
                font-size: 14px;
                line-height: 33px;
              }
            }
            .content {
              flex: 2;
              background-color: #fff;
              text-align: right;
              p {
                font-weight: 400;
                line-height: 33px;
                color: #999999;
                font-size: 13px;
              }
            }
          }
          .bottom-content {
            height: 30px;
            width: 100%;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            p {
              font-weight: 400;
              line-height: 35px;
              color: #999999;
              opacity: 1;
              font-size: 13px;
              // overflow: hidden; /*超出部分隐藏*/
              // text-overflow: ellipsis; /* 超出部分显示省略号 */
              // white-space: nowrap; /*规定段落中的文本不进行换行 */
            }
          }
        }
      }
    }
  }
}
/deep/.van-dialog__header--isolated {
  padding: 15px !important;
}
/deep/ .van-dialog__header {
  padding-top: 15px;
  padding-bottom: 10px;
  text-indent: 1em;
  text-align: left;
  width: 98%;
  margin: 0px auto;
  font-size: 15px;
  color: #333333;
  font-weight: 400;
  border-bottom: 1px solid rgba(240, 240, 240, 1);
}
/deep/ .van-dialog__content {
  width: 90%;
  margin: 0px auto;
  padding: 15px;
  text-indent: 0.3em;
}
/deep/ .van-dialog {
  border-radius: 5px !important;
}
.iconrigth {
  position: relative;
  left: 175px;
  top: 3px;
}
.filter-box {
  text-align: center;
  font-size: 12px;
  color: #333;
}
.van-search__action {
  line-height: normal;
}
</style>