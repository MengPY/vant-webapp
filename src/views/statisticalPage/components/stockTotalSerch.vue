<template>
  <div>
    <van-popup
      position="right"
      v-model="filterShow.open"
      :style="{ height: '100%', width: '70%' }"
    >
      <van-form @submit="getData">
        <van-field label="业务部组:" v-model="QueryForm.departmentId" />
        <van-field label="供应商名称:" v-model="QueryForm.supplierName" />
        <van-field label="仓库名称:" v-model="QueryForm.warehouseName" />
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
        supplierName: "",
        warehouseName: "",
        departmentId: "",
      },
    };
  },
  computed: {
    valueSet() {
      return this.$store.state.codeValue.valueSet;
    },
  },
  methods: {
    getValue(value) {
      this.QueryForm.categoryId = value;
    },
    getData() {
      this.$parent.onSearch(this.QueryForm);
      this.filterShow.open = false;
    },
    reset() {
      this.QueryForm = this.$options.data().QueryForm;
      this.$parent.onSearch(this.QueryForm);
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