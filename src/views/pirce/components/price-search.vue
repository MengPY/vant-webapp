<template>
  <div>
    <van-popup
      position="right"
      v-model="filterShow.open"
      :style="{ height: '100%', width: '70%' }"
    >
      <van-form @submit="getData">
        <codeSelect
          label="定向类型:"
          :valueSet="valueSet.ORIENTATION"
          v-model="QueryForm.orientation"
        ></codeSelect>
        <dateSelect
          label="可见日期起:"
          v-model="QueryForm.validBegin"
        ></dateSelect>
        <dateSelect
          label="可见日期止:"
          v-model="QueryForm.validEnd"
        ></dateSelect>

        <van-field
          label="定向客户:"
          v-model="QueryForm.orientationNames"
          placeholder="请输入定向客户"
        />

        <div class="search-btns">
          <van-button block type="info" native-type="submit">查询</van-button>
          <van-button block type="danger" native-type="button" @click="reset"
            >重置</van-button
          >
        </div>
      </van-form>
    </van-popup>
  </div>
</template>
<script>
export default {
  props: {
    filterShow: {
      open: false,
    },
  },
  data() {
    return {
      QueryForm: {
        orientation: "",
        orientationNames: "",
        validBegin: "",
        validEnd: "",
        title: "",
      },
    };
  },
  computed: {
    valueSet() {
      return this.$store.state.codeValue.valueSet;
    },
  },
  methods: {
    getData() {
      this.$parent.onchildSearch(this.QueryForm);
      this.filterShow.open = false;
    },
    reset() {
      this.QueryForm = this.$options.data().QueryForm;
      this.$parent.onchildSearch(this.QueryForm);
      this.filterShow.open = false;
    },
  },
};
</script>
<style lang="less" scoped>
.search-btns {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>