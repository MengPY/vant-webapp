<template>
  <div class="main-wrap">
    <van-nav-bar
      v-show="!$route.meta.noHeader"
      :title="$route.meta.title"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="content-view">
      <!-- :include="cachePage" -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
    </div>
    <div class="tab-bar" v-show="$route.meta.needFooter">
      <van-tabbar route>
        <van-tabbar-item replace to="/home">
          <span>首页</span>
          <template #icon="props">
            <i class="iconfont" v-html="props.active ? '&#xe7ca;' : '&#xe7d0;'" ></i>
          </template>
        </van-tabbar-item>
        <van-tabbar-item replace to="/order">
          <span>订单</span>
          <template #icon="props">
            <i class="iconfont" v-html="props.active ? '&#xe7c4;' : '&#xe7c1;'" ></i>
          </template>
        </van-tabbar-item>
        <van-tabbar-item replace to="/stock">
          <span>库存</span>
          <template #icon="props">
            <i class="iconfont" v-html="props.active ? '&#xe7c5;' : '&#xe7c9;'" ></i>
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    onClickLeft () {
      this.$router.back();
    }
  }
}
</script>

<style lang="less" scoped>
.main-wrap {
  display: flex;
  flex-direction: column;
  .content-view {
    flex: 1;
  }
  .tab-bar {
    height: 50px;
    .iconfont {
      font-size: 20px;
    }
  }
}
</style>
